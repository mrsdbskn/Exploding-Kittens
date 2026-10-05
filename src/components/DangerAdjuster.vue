<template>
  <section class="danger-adjuster" :style="{ '--adj-color': dangerColor }" aria-labelledby="danger-adjuster-title">
    <div class="adj-header">
      <div class="adj-title-block">
        <h4 id="danger-adjuster-title" class="adj-title">🎚️ Volatility Adjuster</h4>
        <p class="adj-sub">Pick a level. Bombs, Defuses and safe cards get re-allocated right away, and your assembly steps and checklist update with them.</p>
      </div>
      <button
        v-if="settings.preset !== 'balanced'"
        id="danger-reset-official-btn"
        class="adj-reset-btn"
        @click="applyPreset('balanced')"
      >
        ↺ Official
      </button>
    </div>

    <!-- Preset level track -->
    <div class="preset-track" role="radiogroup" aria-label="Danger level presets">
      <button
        v-for="p in presets"
        :id="`danger-preset-${p.id}`"
        :key="p.id"
        class="preset-btn"
        :class="{ active: settings.preset === p.id }"
        role="radio"
        :aria-checked="settings.preset === p.id"
        :style="previews[p.id] ? { '--preset-color': previews[p.id].color } : {}"
        @click="applyPreset(p.id)"
      >
        <span class="preset-emoji">{{ p.emoji }}</span>
        <span class="preset-label">{{ p.label }}</span>
        <span v-if="previews[p.id]" class="preset-score">{{ previews[p.id].score }}</span>
      </button>
    </div>

    <p class="preset-desc">
      <strong>{{ activePresetLabel }}:</strong> {{ activePresetDesc }}
    </p>

    <!-- Fine-tune levers -->
    <button
      id="danger-finetune-toggle"
      class="finetune-toggle"
      :aria-expanded="showFineTune"
      @click="showFineTune = !showFineTune"
    >
      <span>⚙️ Fine-tune manually</span>
      <span class="ft-chevron" :class="{ open: showFineTune }">▾</span>
    </button>

    <div v-if="showFineTune" class="finetune-panel">
      <!-- Spare Defuses -->
      <div class="lever-row">
        <div class="lever-info">
          <span class="lever-name">🛡️ Spare Defuses in pile</span>
          <span class="lever-hint">You own {{ recipe.extraDefusesMax }} spare</span>
        </div>
        <div class="lever-stepper">
          <button
            id="lever-defuse-minus"
            class="step-btn"
            :disabled="recipe.extraDefusesToInsert <= 0"
            aria-label="Fewer spare Defuses"
            @click="emitCustom({ extraDefuses: recipe.extraDefusesToInsert - 1 })"
          >−</button>
          <span class="step-val">{{ recipe.extraDefusesToInsert }}</span>
          <button
            id="lever-defuse-plus"
            class="step-btn"
            :disabled="recipe.extraDefusesToInsert >= recipe.extraDefusesMax"
            aria-label="More spare Defuses"
            @click="emitCustom({ extraDefuses: recipe.extraDefusesToInsert + 1 })"
          >+</button>
        </div>
      </div>

      <!-- Bonus Exploding Kittens -->
      <div class="lever-row">
        <div class="lever-info">
          <span class="lever-name">💣 Bonus Exploding Kittens</span>
          <span class="lever-hint">
            {{ recipe.bonusEKMax > 0 ? `Up to ${recipe.bonusEKMax} more from your boxes` : 'All your Exploding Kittens are already in use' }}
          </span>
        </div>
        <div class="lever-stepper">
          <button
            id="lever-bomb-minus"
            class="step-btn"
            :disabled="recipe.bonusEKApplied <= 0"
            aria-label="Fewer bonus Exploding Kittens"
            @click="emitCustom({ bonusEK: recipe.bonusEKApplied - 1 })"
          >−</button>
          <span class="step-val">+{{ recipe.bonusEKApplied }}</span>
          <button
            id="lever-bomb-plus"
            class="step-btn"
            :disabled="recipe.bonusEKApplied >= recipe.bonusEKMax"
            aria-label="More bonus Exploding Kittens"
            @click="emitCustom({ bonusEK: recipe.bonusEKApplied + 1 })"
          >+</button>
        </div>
      </div>

      <!-- Safe card ratio -->
      <div class="lever-row lever-row-stack">
        <div class="lever-info">
          <span class="lever-name">🃏 Safe cards kept in pile</span>
          <span class="lever-hint">
            {{ recipe.safeCardsInDrawPile }} of {{ recipe.untrimmedSafeDrawPile }} cards: fewer safe cards means bombs come up sooner
          </span>
        </div>
        <div class="slider-wrap">
          <input
            id="lever-safe-ratio"
            type="range"
            min="30"
            max="100"
            step="5"
            class="adj-slider"
            :value="Math.round(settings.safeRatio * 100)"
            :style="{ '--fill': `${((settings.safeRatio * 100 - 30) / 70) * 100}%` }"
            aria-label="Percentage of safe cards kept in the draw pile"
            @input="onSafeRatioInput"
          />
          <span class="slider-val">{{ Math.round(settings.safeRatio * 100) }}%</span>
        </div>
      </div>

      <!-- Imploding mode -->
      <div v-if="hasImploding" class="lever-row">
        <div class="lever-info">
          <span class="lever-name">🌀 Imploding Kitten</span>
          <span class="lever-hint">{{ settings.implodingReplacesEK ? 'Replaces one Exploding Kitten' : 'Added as an extra hazard' }}</span>
        </div>
        <button
          id="lever-imploding-toggle"
          class="m3-chip"
          :class="{ active: !settings.implodingReplacesEK }"
          @click="emitCustom({ implodingReplacesEK: !settings.implodingReplacesEK })"
        >
          {{ settings.implodingReplacesEK ? 'Replace' : 'Extra' }}
        </button>
      </div>
    </div>

    <!-- Allocation diff vs official -->
    <div v-if="hasChanges" class="allocation-diff">
      <span class="diff-title">Changes vs. the official setup</span>
      <div class="diff-chips">
        <span v-if="recipe.extraDefusesToInsert !== officialDefuses" class="diff-chip" :class="recipe.extraDefusesToInsert > officialDefuses ? 'is-safer' : 'is-riskier'">
          🛡️ Spare Defuses {{ officialDefuses }} → {{ recipe.extraDefusesToInsert }}
        </span>
        <span v-if="recipe.bonusEKApplied > 0" class="diff-chip is-riskier">
          💣 +{{ recipe.bonusEKApplied }} Exploding Kitten{{ recipe.bonusEKApplied > 1 ? 's' : '' }}
        </span>
        <span v-if="recipe.trimmedCardsTotal > 0" class="diff-chip is-riskier">
          ✂️ {{ recipe.trimmedCardsTotal }} safe cards left out
        </span>
        <span v-if="hasImploding && !settings.implodingReplacesEK" class="diff-chip is-riskier">
          🌀 Imploding as extra hazard
        </span>
      </div>

      <div v-if="recipe.trimmedCards.length > 0" class="trimmed-list">
        <span class="trimmed-label">Keep these in the box:</span>
        <div class="trimmed-chips">
          <span v-for="t in recipe.trimmedCards" :key="t.slug" class="trimmed-chip">
            <img v-if="t.icons && t.icons[0]" :src="t.icons[0]" :alt="t.name" class="trimmed-icon" />
            {{ t.removed }}× {{ t.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DANGER_PRESETS } from '../utils/dangerPresets.js';

const props = defineProps({
  recipe: { type: Object, required: true },
  settings: { type: Object, required: true },
  previews: { type: Object, default: () => ({}) },
  dangerColor: { type: String, default: '#ffb4a0' }
});

const emit = defineEmits(['update']);

const presets = DANGER_PRESETS;
const showFineTune = ref(props.settings.preset === 'custom');

const activePreset = computed(() => presets.find(p => p.id === props.settings.preset));
const activePresetLabel = computed(() => activePreset.value ? `${activePreset.value.emoji} ${activePreset.value.label}` : '🛠️ Custom');
const activePresetDesc = computed(() => activePreset.value
  ? activePreset.value.desc
  : 'Your own mix of bombs, Defuses and safe cards.');

const hasImploding = computed(() => (props.recipe.hazardsList || []).some(h => h.slug === 'imploding-kitten'));
const officialDefuses = computed(() => Math.min(2, props.recipe.extraDefusesMax || 0));

const hasChanges = computed(() =>
  props.recipe.extraDefusesToInsert !== officialDefuses.value ||
  props.recipe.bonusEKApplied > 0 ||
  props.recipe.trimmedCardsTotal > 0 ||
  (hasImploding.value && !props.settings.implodingReplacesEK)
);

const applyPreset = (id) => {
  emit('update', { preset: id });
};

const emitCustom = (patch) => {
  emit('update', {
    preset: 'custom',
    extraDefuses: props.recipe.extraDefusesToInsert,
    bonusEK: props.recipe.bonusEKApplied,
    safeRatio: props.settings.safeRatio,
    implodingReplacesEK: props.settings.implodingReplacesEK,
    ...patch
  });
};

const onSafeRatioInput = (e) => {
  emitCustom({ safeRatio: Number(e.target.value) / 100 });
};
</script>

<style scoped>
.danger-adjuster {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 180, 160, 0.18);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.adj-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.adj-title-block {
  min-width: 0;
}

.adj-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
}

.adj-sub {
  margin: 4px 0 0 0;
  font-size: 0.78rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.45;
}

.adj-reset-btn {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--md-sys-color-primary);
  background: rgba(128, 180, 255, 0.1);
  border: 1px solid rgba(128, 180, 255, 0.3);
  border-radius: 9999px;
  padding: 6px 12px;
  transition: background 0.2s ease;
}

.adj-reset-btn:hover {
  background: rgba(128, 180, 255, 0.2);
}

/* Preset track */
.preset-track {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 6px;
  position: relative;
}

.preset-track::before {
  content: '';
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 3px;
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, #8be5a0, #ffd248, #ff9800, #ff5252);
  opacity: 0.55;
  pointer-events: none;
}

.preset-btn {
  --preset-color: #ffb4a0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 4px 12px 4px;
  border-radius: 10px;
  border: 1.5px solid transparent;
  color: var(--md-sys-color-on-surface-variant);
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  -webkit-tap-highlight-color: transparent;
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.preset-btn.active {
  background: color-mix(in srgb, var(--preset-color) 16%, transparent);
  border-color: var(--preset-color);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.preset-emoji {
  font-size: 1.35rem;
  line-height: 1;
}

.preset-label {
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.preset-score {
  font-size: 0.68rem;
  font-weight: 800;
  color: #141210;
  background: var(--preset-color);
  border-radius: 9999px;
  padding: 1px 7px;
  line-height: 1.4;
}

.preset-desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.45;
}

.preset-desc strong {
  color: #fff;
}

/* Fine-tune */
.finetune-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--md-sys-color-on-surface);
  font-size: 0.82rem;
  font-weight: 600;
}

.ft-chevron {
  transition: transform 0.2s ease;
  color: var(--md-sys-color-outline);
}

.ft-chevron.open {
  transform: rotate(180deg);
}

.finetune-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeIn 0.25s ease forwards;
}

.lever-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-width: 0;
}

.lever-row-stack {
  flex-direction: column;
  align-items: stretch;
}

.lever-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.lever-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.lever-hint {
  font-size: 0.72rem;
  color: var(--md-sys-color-outline);
  line-height: 1.35;
}

.lever-stepper {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.step-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--md-sys-color-surface-container-highest);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.step-btn:hover:not(:disabled) {
  background: var(--md-sys-color-primary-container);
}

.step-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.step-val {
  min-width: 30px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--adj-color, #ffb4a0);
}

.slider-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.adj-slider {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  min-width: 0;
  height: 6px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--adj-color, #ffb4a0) 0%, var(--adj-color, #ffb4a0) var(--fill, 100%), rgba(255, 255, 255, 0.12) var(--fill, 100%));
  outline: none;
}

.adj-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--adj-color, #ffb4a0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  cursor: pointer;
}

.adj-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--adj-color, #ffb4a0);
  cursor: pointer;
}

.slider-val {
  min-width: 44px;
  text-align: right;
  font-family: var(--font-display);
  font-weight: 800;
  color: var(--adj-color, #ffb4a0);
}

/* Allocation diff */
.allocation-diff {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.diff-title,
.trimmed-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--md-sys-color-outline);
}

.diff-chips,
.trimmed-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.diff-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid;
}

.diff-chip.is-safer {
  color: #8be5a0;
  background: rgba(100, 220, 120, 0.12);
  border-color: rgba(100, 220, 120, 0.3);
}

.diff-chip.is-riskier {
  color: #ffb4a0;
  background: rgba(255, 120, 90, 0.12);
  border-color: rgba(255, 120, 90, 0.3);
}

.trimmed-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.trimmed-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  background: var(--md-sys-color-surface-container-high);
  border-radius: 8px;
  padding: 4px 8px;
}

.trimmed-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

@media (max-width: 640px) {
  .danger-adjuster {
    padding: 12px;
  }

  .adj-sub {
    font-size: 0.74rem;
  }

  .preset-track {
    gap: 4px;
    padding: 4px;
  }

  .preset-btn {
    padding: 8px 2px 11px 2px;
  }

  .preset-emoji {
    font-size: 1.15rem;
  }

  .preset-label {
    font-size: 0.66rem;
  }

  .preset-score {
    font-size: 0.62rem;
    padding: 0 5px;
  }

  .lever-row {
    padding: 10px;
  }

  .step-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
