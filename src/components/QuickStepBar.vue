<template>
  <nav class="quick-step-pill" aria-label="Fast Step Navigation">
    <button 
      v-for="s in steps" 
      :key="s.id"
      class="step-pill-btn"
      :class="{ 'is-active': currentStep === s.id }"
      :title="s.fullName"
      @click="onSelectStep(s.id)"
    >
      <!-- Active Icon: Only rendered for the active step, matching the reference design -->
      <span v-if="currentStep === s.id" class="step-active-icon">
        <svg v-if="s.id === 'decks'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2 2 7l10 5 10-5-10-5Z"/>
          <path d="m2 17 10 5 10-5"/>
          <path d="m2 12 10 5 10-5"/>
        </svg>

        <svg v-else-if="s.id === 'cards'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="12" height="16" x="6" y="4" rx="2"/>
          <path d="M4 8v10a2 2 0 0 0 2 2h10"/>
        </svg>

        <svg v-else-if="s.id === 'synergies'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>

        <svg v-else-if="s.id === 'recipe'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </span>

      <!-- Step Label: Clean typography on both active and inactive -->
      <span class="step-label">{{ s.label }}</span>

      <!-- Step 3 Synergy Warning / Error Badge -->
      <span 
        v-if="s.id === 'synergies' && suggestionsCount > 0" 
        class="step-badge"
        :class="hasErrors ? 'badge-error' : 'badge-warning'"
      >
        {{ hasErrors ? '!' : suggestionsCount }}
      </span>

      <!-- Step 4 Ready Checkmark Badge -->
      <span 
        v-else-if="s.id === 'recipe' && recipeComplete" 
        class="step-badge badge-success"
      >
        ✓
      </span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentStep: {
    type: String,
    required: true
  },
  suggestionsCount: {
    type: Number,
    default: 0
  },
  hasErrors: {
    type: Boolean,
    default: false
  },
  recipeComplete: {
    type: Boolean,
    default: false
  },
  currentLang: {
    type: String,
    default: 'en'
  }
});

const emit = defineEmits(['update:step']);

const steps = computed(() => {
  const isDe = props.currentLang === 'de';
  return [
    {
      id: 'decks',
      label: isDe ? 'Decks' : 'Decks',
      fullName: isDe ? 'Schritt 1: Decks auswählen' : 'Step 1: Choose Decks'
    },
    {
      id: 'cards',
      label: isDe ? 'Karten' : 'Cards',
      fullName: isDe ? 'Schritt 2: Kartenpool & Spieler' : 'Step 2: Cards & Players'
    },
    {
      id: 'synergies',
      label: isDe ? 'Synergien' : 'Synergies',
      fullName: isDe ? 'Schritt 3: Synergien prüfen' : 'Step 3: Review Synergies'
    },
    {
      id: 'recipe',
      label: isDe ? 'Rezept' : 'Recipe',
      fullName: isDe ? 'Schritt 4: Deck-Rezept & Anleitung' : 'Step 4: Deck Recipe'
    }
  ];
});

const onSelectStep = (stepId) => {
  emit('update:step', stepId);
};
</script>

<style scoped>
/* Outer dark pill matching Google Photos Material 3 Expressive pill */
.quick-step-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  background: #17161a;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.35);
  user-select: none;
  height: 54px;
  box-sizing: border-box;
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.step-pill-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 100%;
  padding: 0 16px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: #c9c5cf;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.2, 0, 0, 1);
  position: relative;
  white-space: nowrap;
  outline: none;
}

/* Inactive button hover */
.step-pill-btn:hover:not(.is-active) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

/* ACTIVE ITEM: Lighter charcoal capsule inside pill (Collections style) */
.step-pill-btn.is-active {
  background: #39383e;
  color: #ffffff;
  font-weight: 600;
  padding: 0 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.step-active-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  animation: fadeInIcon 0.2s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes fadeInIcon {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

.step-label {
  display: inline-block;
  line-height: 1.2;
}

/* Badges */
.step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 800;
  line-height: 1;
  margin-left: 2px;
}

.badge-warning {
  background: #ffd978;
  color: #3f2e00;
}

.badge-error {
  background: #ffb4ab;
  color: #690005;
  animation: pulseBadge 1.8s infinite;
}

.badge-success {
  background: #bbf2c8;
  color: #05461c;
  font-weight: 900;
}

@keyframes pulseBadge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.18); }
}

/* Responsive Mobile Layout */
@media (max-width: 640px) {
  .quick-step-pill {
    height: 48px;
    padding: 3px;
    gap: 1px;
  }

  .step-pill-btn {
    padding: 0 10px;
    font-size: 0.82rem;
    gap: 5px;
  }

  .step-pill-btn.is-active {
    padding: 0 13px;
  }

  .step-active-icon svg {
    width: 15px;
    height: 15px;
  }

  .step-badge {
    min-width: 14px;
    height: 14px;
    font-size: 0.58rem;
    padding: 0 3px;
  }
}

@media (max-width: 380px) {
  .step-pill-btn {
    padding: 0 7px;
    font-size: 0.77rem;
  }
  .step-pill-btn.is-active {
    padding: 0 10px;
  }
}
</style>
