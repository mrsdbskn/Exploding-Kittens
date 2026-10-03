<template>
  <div v-if="isOpen" class="recipe-modal-backdrop animate-fade-in" @click.self="$emit('close')">
    <div class="m3-card custom-recipe-modal animate-pop-in">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-left">
          <span class="header-icon-badge">🧪</span>
          <div>
            <h2 class="modal-title">Custom Recipe Studio & Saved Bookmarks</h2>
            <p class="modal-subtitle">
              Design custom "Recipes for Disaster" recipes, bookmark favorite deck mixes, and load them anytime.
            </p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')" title="Close">✕</button>
      </div>

      <!-- Navigation Tabs: Saved Recipes vs Create New -->
      <div class="modal-tabs-bar">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'saved' }"
          @click="activeTab = 'saved'"
        >
          🔖 Saved Recipes ({{ savedRecipes.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'create' }"
          @click="initCreateForm"
        >
          ➕ Save Current Deck as New Recipe
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- TAB 1: SAVED RECIPES LIST -->
        <div v-if="activeTab === 'saved'" class="saved-recipes-tab">
          <div v-if="savedRecipes.length === 0" class="empty-recipes-state">
            <span class="empty-icon">📭</span>
            <h4>No Saved Custom Recipes Yet</h4>
            <p>Save your current deck configuration to bookmark it for your next game night!</p>
            <button class="m3-btn m3-btn-primary" @click="initCreateForm">
              Save Current Deck Mix
            </button>
          </div>

          <div v-else class="saved-recipes-grid">
            <div 
              v-for="rec in savedRecipes" 
              :key="rec.id" 
              class="saved-recipe-card"
            >
              <div class="recipe-card-header">
                <div>
                  <span class="recipe-badge">{{ rec.badge || 'Custom Recipe' }}</span>
                  <h3 class="recipe-name">{{ rec.name }}</h3>
                </div>
                <button class="delete-recipe-btn" @click="deleteRecipe(rec.id)" title="Delete Recipe">
                  🗑️
                </button>
              </div>

              <p class="recipe-desc">{{ rec.description || 'Custom deck mix configuration.' }}</p>

              <div class="recipe-meta-row">
                <span>👥 {{ rec.players || '2-5 Players' }}</span>
                <span>⏱️ {{ rec.time || '15 min' }}</span>
                <span>🔥 {{ rec.complexity || 'Standard' }}</span>
              </div>

              <div class="recipe-actions-row">
                <button class="m3-btn m3-btn-primary btn-sm" @click="loadRecipe(rec)">
                  Load this Recipe ⚡
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: CREATE / BOOKMARK CURRENT FORM -->
        <div v-else-if="activeTab === 'create'" class="create-recipe-tab">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Recipe Title *</label>
              <input 
                v-model="form.name" 
                type="text" 
                class="form-input" 
                placeholder="e.g. The Feline Apocalypse, Sunday House Mix"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Category Badge</label>
              <input 
                v-model="form.badge" 
                type="text" 
                class="form-input" 
                placeholder="e.g. Cutthroat, High Hazard, Cat Mayhem"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Recommended Players</label>
              <input 
                v-model="form.players" 
                type="text" 
                class="form-input" 
                placeholder="e.g. 3-6 Players"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Estimated Play Time</label>
              <input 
                v-model="form.time" 
                type="text" 
                class="form-input" 
                placeholder="e.g. 15-20 min"
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label">Complexity / Flavor</label>
              <input 
                v-model="form.complexity" 
                type="text" 
                class="form-input" 
                placeholder="e.g. Fast & Furious, Divine Duel, Brain Melt"
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label">Recipe Description / House Rules</label>
              <textarea 
                v-model="form.description" 
                class="form-textarea" 
                rows="3"
                placeholder="Describe the playstyle, special twists, and why this recipe is fun..."
              ></textarea>
            </div>
          </div>

          <div class="current-config-summary">
            <strong>Current Deck Snapshot:</strong>
            <span>{{ currentConfig.playerCount }} Players • {{ Object.keys(currentConfig.customQuantities || {}).length }} Card Overrides • {{ currentConfig.ownedDeckIds?.length || 1 }} Owned Decks Active</span>
          </div>

          <div class="form-actions">
            <button class="m3-btn m3-btn-tonal" @click="activeTab = 'saved'">
              Cancel
            </button>
            <button class="m3-btn m3-btn-primary" @click="saveNewRecipe" :disabled="!form.name.trim()">
              Save to My Recipes 💾
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="m3-btn m3-btn-tonal btn-sm" @click="exportRecipesJson" :disabled="savedRecipes.length === 0">
          Export Recipes Backup (JSON)
        </button>
        <button class="m3-btn m3-btn-primary" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  currentConfig: { type: Object, required: true }
});

const emit = defineEmits(['close', 'load-custom-recipe']);

const activeTab = ref('saved');
const savedRecipes = ref([]);

const form = ref({
  name: '',
  badge: 'House Mix',
  players: '2-5 Players',
  time: '15 min',
  complexity: 'High Tension',
  description: ''
});

const loadSavedFromStorage = () => {
  try {
    const raw = localStorage.getItem('ek_custom_recipes');
    if (raw) {
      savedRecipes.value = JSON.parse(raw);
    }
  } catch (e) {
    savedRecipes.value = [];
  }
};

onMounted(() => {
  loadSavedFromStorage();
});

const initCreateForm = () => {
  form.value = {
    name: `Custom Recipe #${savedRecipes.value.length + 1}`,
    badge: 'House Mix',
    players: `${props.currentConfig.playerCount} Players`,
    time: '15 min',
    complexity: 'Tactical Russian Roulette',
    description: 'Custom card ratios and rules mix curated for game night.'
  };
  activeTab.value = 'create';
};

const saveNewRecipe = () => {
  if (!form.value.name.trim()) return;

  const newRecipe = {
    id: `custom-${Date.now()}`,
    name: form.value.name.trim(),
    badge: form.value.badge.trim() || 'Custom',
    players: form.value.players.trim() || `${props.currentConfig.playerCount} Players`,
    time: form.value.time.trim() || '15 min',
    complexity: form.value.complexity.trim() || 'Standard',
    description: form.value.description.trim(),
    createdAt: new Date().toISOString(),
    config: {
      playerCount: props.currentConfig.playerCount,
      ownedDeckIds: [...(props.currentConfig.ownedDeckIds || [])],
      customQuantities: { ...(props.currentConfig.customQuantities || {}) },
      excludedCards: Array.from(props.currentConfig.excludedCards || [])
    }
  };

  savedRecipes.value.unshift(newRecipe);
  try {
    localStorage.setItem('ek_custom_recipes', JSON.stringify(savedRecipes.value));
  } catch (e) {}

  activeTab.value = 'saved';
};

const deleteRecipe = (id) => {
  savedRecipes.value = savedRecipes.value.filter(r => r.id !== id);
  try {
    localStorage.setItem('ek_custom_recipes', JSON.stringify(savedRecipes.value));
  } catch (e) {}
};

const loadRecipe = (recipe) => {
  emit('load-custom-recipe', recipe);
  emit('close');
};

const exportRecipesJson = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedRecipes.value, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `my-exploding-kittens-recipes.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
</script>

<style scoped>
.recipe-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.custom-recipe-modal {
  background-color: #1a1714;
  border: 1px solid rgba(255, 180, 160, 0.25);
  border-radius: 28px;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(235, 115, 80, 0.15), transparent);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon-badge {
  font-size: 2rem;
  background: rgba(255, 180, 160, 0.2);
  padding: 8px 10px;
  border-radius: 16px;
}

.modal-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #c7c5c0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 80, 80, 0.3);
  transform: rotate(90deg);
}

.modal-tabs-bar {
  display: flex;
  background-color: #221e1a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 24px;
  gap: 8px;
}

.tab-btn {
  background: none;
  border: none;
  color: #aaa;
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  background-color: #ffb4a0;
  color: #4a180d;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.empty-recipes-state {
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 3rem;
}

.saved-recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.saved-recipe-card {
  background-color: #24201b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recipe-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.recipe-badge {
  font-size: 0.7rem;
  background: rgba(255, 180, 160, 0.15);
  color: #ffb4a0;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
}

.recipe-name {
  margin: 6px 0 0 0;
  font-size: 1.05rem;
  color: #fff;
  font-weight: 700;
}

.delete-recipe-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.delete-recipe-btn:hover {
  opacity: 1;
}

.recipe-desc {
  font-size: 0.8rem;
  color: #bbb;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.recipe-meta-row {
  display: flex;
  gap: 10px;
  font-size: 0.75rem;
  color: #888;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffb4a0;
}

.form-input, .form-textarea {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 10px 14px;
  color: #fff;
  font-size: 0.88rem;
  outline: none;
}

.form-input:focus, .form-textarea:focus {
  border-color: #ffb4a0;
}

.current-config-summary {
  margin-top: 14px;
  background: rgba(255, 255, 255, 0.04);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  color: #ccc;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-footer {
  padding: 16px 24px;
  background-color: #161310;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
