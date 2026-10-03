<template>
  <div class="modal-backdrop animate-fade-in" @click.self="$emit('close')">
    <div class="m3-card modal-container animate-pop-in">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <div class="modal-header">
        <h2 class="modal-title">📖 Recipe Booklets & Custom Presets</h2>
        <p class="modal-desc">
          Choose an official recipe from <em>Recipes for Disaster</em> or your own custom saved builds.
          Applying a recipe automatically sets player recommendations, active cards, and hazard counts.
        </p>
      </div>

      <!-- Presets Tabs -->
      <div class="preset-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'official' }"
          @click="activeTab = 'official'"
        >
          Official Recipes ({{ officialRecipes.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'custom' }"
          @click="activeTab = 'custom'"
        >
          My Custom Presets ({{ customPresets.length }})
        </button>
      </div>

      <!-- OFFICIAL RECIPES TAB -->
      <div v-if="activeTab === 'official'" class="presets-list">
        <div 
          v-for="rec in officialRecipes" 
          :key="rec.id"
          class="m3-card preset-card"
        >
          <div class="preset-header">
            <div>
              <span class="m3-badge m3-badge-primary badge-rec">{{ rec.badge }}</span>
              <h3 class="preset-name">{{ rec.name }}</h3>
            </div>
            <button class="m3-btn m3-btn-primary btn-sm" @click="applyRecipe(rec)">
              Load Recipe
            </button>
          </div>

          <p class="preset-desc">{{ rec.description }}</p>

          <div class="preset-meta-row">
            <span class="meta-tag">👥 {{ rec.players }}</span>
            <span class="meta-tag">⏱️ {{ rec.time }}</span>
            <span class="meta-tag">⚡ {{ rec.complexity }}</span>
          </div>

          <div class="preset-cards-summary">
            <span class="summary-title">Key cards:</span>
            <span class="cards-preview-text">
              {{ Object.entries(rec.cardCounts).map(([k, v]) => `${v}x ${formatCardSlug(k)}`).join(', ') }}
            </span>
          </div>
        </div>
      </div>

      <!-- CUSTOM PRESETS TAB -->
      <div v-else class="custom-tab-content">
        <!-- Save Current Build -->
        <div class="save-custom-box">
          <input 
            v-model="newPresetName" 
            type="text" 
            placeholder="Name your custom deck setup (e.g. Friday Chaos Night)..."
            class="custom-input"
            @keyup.enter="saveCurrentBuild"
          />
          <button 
            class="m3-btn m3-btn-primary" 
            :disabled="!newPresetName.trim()"
            @click="saveCurrentBuild"
          >
            Save Current Deck
          </button>
        </div>

        <!-- Custom Presets List -->
        <div v-if="customPresets.length > 0" class="presets-list">
          <div 
            v-for="(cp, idx) in customPresets" 
            :key="idx" 
            class="m3-card preset-card"
          >
            <div class="preset-header">
              <h3 class="preset-name">{{ cp.name }}</h3>
              <div class="custom-card-actions">
                <button class="m3-btn m3-btn-primary btn-sm" @click="applyCustom(cp)">
                  Load
                </button>
                <button class="m3-btn m3-btn-tonal btn-sm delete-btn" @click="deleteCustom(idx)">
                  Delete
                </button>
              </div>
            </div>

            <span class="custom-date">Saved on {{ cp.date }}</span>
            <div class="preset-meta-row">
              <span class="meta-tag">👥 {{ cp.playerCount }} Players</span>
              <span class="meta-tag">📦 {{ cp.ownedDeckIds?.length || 0 }} Decks</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-custom">
          <p>No saved custom presets yet. Configure a deck and save it here to reload anytime!</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="m3-btn m3-btn-tonal" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  officialRecipes: { type: Array, required: true },
  currentConfig: { type: Object, required: true }
});

const emit = defineEmits(['close', 'load-preset']);

const activeTab = ref('official');
const newPresetName = ref('');
const customPresets = ref([]);

onMounted(() => {
  try {
    const saved = localStorage.getItem('ek_custom_presets');
    if (saved) {
      customPresets.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading custom presets', e);
  }
});

const saveCurrentBuild = () => {
  if (!newPresetName.value.trim()) return;

  const newPreset = {
    name: newPresetName.value.trim(),
    date: new Date().toLocaleDateString(),
    playerCount: props.currentConfig.playerCount,
    ownedDeckIds: [...props.currentConfig.ownedDeckIds],
    customQuantities: { ...props.currentConfig.customQuantities },
    excludedCards: Array.from(props.currentConfig.excludedCards)
  };

  customPresets.value.push(newPreset);
  try {
    localStorage.setItem('ek_custom_presets', JSON.stringify(customPresets.value));
  } catch (e) {
    console.error(e);
  }
  newPresetName.value = '';
};

const deleteCustom = (index) => {
  customPresets.value.splice(index, 1);
  try {
    localStorage.setItem('ek_custom_presets', JSON.stringify(customPresets.value));
  } catch (e) {
    console.error(e);
  }
};

const applyRecipe = (rec) => {
  emit('load-preset', {
    type: 'official',
    recipe: rec
  });
};

const applyCustom = (cp) => {
  emit('load-preset', {
    type: 'custom',
    custom: cp
  });
};

const formatCardSlug = (slug) => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background-color: rgba(10, 13, 20, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  border-radius: var(--md-shape-xxl);
  background-color: var(--md-sys-color-surface-container);
  border: 1.5px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-elevation-5);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--md-sys-color-surface-container-highest);
  color: #ffffff;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.modal-desc {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

/* Tabs */
.preset-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  padding-bottom: 10px;
}

.tab-btn {
  padding: 8px 18px;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--md-shape-full);
  color: var(--md-sys-color-on-surface-variant);
  transition: all 0.2s ease;
}

.tab-btn.active {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

/* Presets List */
.presets-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.preset-card {
  padding: 18px 20px;
  border-radius: var(--md-shape-lg);
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.2s ease;
}

.preset-card:hover {
  border-color: rgba(128, 180, 255, 0.4);
}

.preset-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.badge-rec {
  margin-bottom: 4px;
}

.preset-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
}

.preset-desc {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 10px;
  line-height: 1.4;
}

.preset-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.meta-tag {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  padding: 3px 8px;
  border-radius: var(--md-shape-xs);
}

.preset-cards-summary {
  font-size: 0.75rem;
  color: var(--md-sys-color-outline);
}

.summary-title {
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin-right: 4px;
}

.cards-preview-text {
  line-height: 1.4;
}

/* Custom Tab */
.save-custom-box {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.custom-input {
  flex: 1;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-full);
  padding: 10px 18px;
  color: #ffffff;
  outline: none;
}

.custom-card-actions {
  display: flex;
  gap: 8px;
}

.delete-btn {
  color: var(--md-sys-color-error);
}

.custom-date {
  font-size: 0.75rem;
  color: var(--md-sys-color-outline);
  display: block;
  margin-bottom: 8px;
}

.empty-custom {
  padding: 40px 20px;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
}

.modal-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .modal-backdrop {
    padding: 0;
  }

  .modal-container {
    max-width: 100%;
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
    padding: calc(16px + env(safe-area-inset-top, 0px)) 16px calc(16px + env(safe-area-inset-bottom, 0px)) 16px;
    display: flex;
    flex-direction: column;
  }

  .close-btn {
    top: calc(14px + env(safe-area-inset-top, 0px));
    right: 14px;
    width: 32px;
    height: 32px;
  }

  .modal-header {
    margin-bottom: 14px;
    padding-right: 36px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .preset-tabs {
    margin-bottom: 14px;
  }

  .tab-btn {
    flex: 1;
    text-align: center;
    padding: 8px 10px;
    font-size: 0.8125rem;
  }

  .presets-list {
    flex: 1;
    overflow-y: auto;
  }

  .preset-card {
    padding: 14px;
  }

  .preset-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .save-custom-box {
    flex-direction: column;
    gap: 8px;
  }

  .save-custom-box .m3-btn {
    width: 100%;
  }

  .custom-card-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .modal-footer {
    margin-top: 14px;
  }

  .modal-footer .m3-btn {
    width: 100%;
  }
}
</style>
