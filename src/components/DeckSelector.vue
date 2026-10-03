<template>
  <div class="deck-selector-section animate-fade-in">
    <!-- Section Header -->
    <div class="section-hero">
      <div class="hero-content">
        <h2 class="hero-title">Step 1: Which Decks Do You Own?</h2>
        <p class="hero-desc">
          Select all the Exploding Kittens core games and expansions you physically have in your collection.
          The deck builder will automatically pool all their available cards and mechanics.
        </p>
      </div>

      <!-- Quick Action Presets -->
      <div class="quick-presets">
        <span class="preset-label">Quick Presets:</span>
        <div class="preset-chips">
          <button class="m3-chip" @click="selectPreset('all')">
            <span>Select All (11)</span>
          </button>
          <button class="m3-chip" @click="selectPreset('classic-expansions')">
            <span>Classic + 3 Expansions</span>
          </button>
          <button class="m3-chip" @click="selectPreset('recipes')">
            <span>Recipes for Disaster</span>
          </button>
          <button class="m3-chip" @click="selectPreset('party')">
            <span>Party Pack</span>
          </button>
          <button class="m3-chip" @click="selectPreset('zombie')">
            <span>Zombie Kittens</span>
          </button>
          <button class="m3-chip" @click="selectPreset('clear')">
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="filter-bar">
      <div class="filter-pills">
        <button 
          v-for="f in filterOptions" 
          :key="f.id"
          class="m3-chip"
          :class="{ active: activeFilter === f.id }"
          @click="activeFilter = f.id"
        >
          <span>{{ f.label }}</span>
          <span class="chip-count">({{ getFilterCount(f.id) }})</span>
        </button>
      </div>

      <div class="collection-summary-pill">
        <span class="summary-highlight">{{ ownedDeckIds.length }}</span> of {{ decks.length }} decks selected
        <span class="separator">•</span>
        <span class="summary-highlight">{{ totalCardsPool }}</span> total cards pool
      </div>
    </div>

    <!-- Decks Grid -->
    <div class="decks-grid">
      <div 
        v-for="deck in filteredDecks" 
        :key="deck.id"
        class="m3-card deck-card"
        :class="{ 'is-selected': isOwned(deck.id) }"
        :style="{ '--deck-theme': deck.themeColor }"
        @click="toggleDeck(deck.id)"
      >
        <!-- Deck Color Glow Accent -->
        <div class="deck-accent-line"></div>

        <!-- Top Row: Badge & Checkbox -->
        <div class="deck-top-row">
          <span class="m3-badge" :class="deck.type === 'Standalone' ? 'm3-badge-primary' : 'm3-badge-warning'">
            {{ deck.type }}
          </span>

          <div class="deck-checkbox" :class="{ checked: isOwned(deck.id) }">
            <svg v-if="isOwned(deck.id)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <!-- Deck Logo & Artwork -->
        <div class="deck-logo-container">
          <img 
            :src="deck.logo" 
            :alt="deck.name" 
            class="deck-logo-img" 
            loading="lazy"
            @error="handleImgError"
          />
        </div>

        <!-- Deck Info -->
        <div class="deck-info">
          <h3 class="deck-name">{{ deck.name }}</h3>
          
          <div class="deck-meta">
            <span class="deck-card-count">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="16" height="20" x="4" y="2" rx="2"/>
                <line x1="8" x2="16" y1="6" y2="6"/>
                <line x1="8" x2="16" y1="10" y2="10"/>
              </svg>
              {{ deck.totalCards }} cards
            </span>
            <span class="deck-unique-types">
              {{ deck.cards.length }} card types
            </span>
          </div>

          <p class="deck-description">
            {{ deck.description || 'Includes complete standalone or expansion card set with unique mechanics.' }}
          </p>
        </div>

        <!-- Card Peek Drawer Button -->
        <div class="deck-footer" @click.stop>
          <button class="peek-cards-btn" @click="toggleCardPeek(deck.id)">
            <span>{{ expandedDeckId === deck.id ? 'Hide Cards' : 'View Included Cards' }}</span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
              :class="{ rotated: expandedDeckId === deck.id }"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        <!-- Expandable Card Peek Content -->
        <div v-if="expandedDeckId === deck.id" class="card-peek-panel" @click.stop>
          <div class="peek-grid">
            <div 
              v-for="c in deck.cards" 
              :key="c.slug" 
              class="peek-item"
              @click="$emit('inspect-card', c.slug)"
              title="Click for full card rules"
            >
              <img v-if="c.icons && c.icons[0]" :src="c.icons[0]" :alt="c.name" class="peek-icon" />
              <div class="peek-info">
                <span class="peek-name">{{ c.name }}</span>
                <span class="peek-count">{{ c.quantity }}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Floating Action Bar -->
    <div class="floating-next-bar">
      <div class="floating-container">
        <div class="floating-stat">
          <span class="stat-count">{{ ownedDeckIds.length }}</span>
          <span class="stat-label">Decks Chosen ({{ totalCardsPool }} cards)</span>
        </div>

        <button 
          class="m3-btn m3-btn-primary floating-btn"
          :disabled="ownedDeckIds.length === 0"
          @click="$emit('continue')"
        >
          <span>Configure Cards & Players</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  decks: {
    type: Array,
    required: true
  },
  ownedDeckIds: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:owned-decks', 'continue', 'inspect-card']);

const activeFilter = ref('all');
const expandedDeckId = ref(null);

const filterOptions = [
  { id: 'all', label: 'All Decks' },
  { id: 'standalone', label: 'Standalone Games' },
  { id: 'expansion', label: 'Expansions' }
];

const isOwned = (id) => props.ownedDeckIds.includes(id);

const toggleDeck = (id) => {
  const current = [...props.ownedDeckIds];
  const index = current.indexOf(id);
  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push(id);
  }
  emit('update:owned-decks', current);
};

const toggleCardPeek = (id) => {
  expandedDeckId.value = expandedDeckId.value === id ? null : id;
};

const getFilterCount = (filterId) => {
  if (filterId === 'all') return props.decks.length;
  if (filterId === 'standalone') return props.decks.filter(d => d.type === 'Standalone').length;
  if (filterId === 'expansion') return props.decks.filter(d => d.type === 'Expansion').length;
  return 0;
};

const filteredDecks = computed(() => {
  if (activeFilter.value === 'standalone') {
    return props.decks.filter(d => d.type === 'Standalone');
  }
  if (activeFilter.value === 'expansion') {
    return props.decks.filter(d => d.type === 'Expansion');
  }
  return props.decks;
});

const totalCardsPool = computed(() => {
  let count = 0;
  for (const d of props.decks) {
    if (props.ownedDeckIds.includes(d.id)) {
      count += d.totalCards;
    }
  }
  return count;
});

const selectPreset = (presetKey) => {
  let selected = [];
  if (presetKey === 'all') {
    selected = props.decks.map(d => d.id);
  } else if (presetKey === 'classic-expansions') {
    selected = [
      'exploding-kittens-original-edition',
      'imploding-kittens-expansion',
      'streaking-kittens-expansion',
      'barking-kittens-expansion'
    ];
  } else if (presetKey === 'recipes') {
    selected = ['exploding-kittens-recipes-for-disaster'];
  } else if (presetKey === 'party') {
    selected = ['exploding-kittens-party-pack-edition'];
  } else if (presetKey === 'zombie') {
    selected = ['exploding-kittens-zombie-kittens'];
  } else if (presetKey === 'clear') {
    selected = [];
  }
  emit('update:owned-decks', selected);
};

const handleImgError = (e) => {
  e.target.style.display = 'none';
};
</script>

<style scoped>
.deck-selector-section {
  max-width: 1380px;
  margin: 0 auto;
  padding: 32px 24px 120px 24px;
}

.section-hero {
  margin-bottom: 28px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #ffffff 0%, #b6bccd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  max-width: 820px;
  line-height: 1.6;
}

.quick-presets {
  margin-top: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--md-sys-color-outline);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preset-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.filter-pills {
  display: flex;
  gap: 8px;
}

.chip-count {
  opacity: 0.7;
  font-size: 0.75rem;
}

.collection-summary-pill {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
  background-color: var(--md-sys-color-surface-container-low);
  padding: 6px 16px;
  border-radius: var(--md-shape-full);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.summary-highlight {
  font-weight: 700;
  color: var(--md-sys-color-primary);
}

.separator {
  margin: 0 6px;
  opacity: 0.4;
}

/* Decks Grid */
.decks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.deck-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: var(--md-shape-xl);
  background-color: var(--md-sys-color-surface-container);
  border: 1.5px solid var(--md-sys-color-outline-variant);
  position: relative;
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.deck-card:hover {
  transform: translateY(-3px);
  border-color: var(--deck-theme, var(--md-sys-color-primary));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.deck-card.is-selected {
  background-color: rgba(30, 36, 50, 0.95);
  border-color: var(--deck-theme, var(--md-sys-color-primary));
  box-shadow: 0 0 0 1px var(--deck-theme, var(--md-sys-color-primary)),
              0 8px 30px rgba(0, 0, 0, 0.5);
}

.deck-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: var(--deck-theme, var(--md-sys-color-primary));
  opacity: 0.7;
}

.deck-card.is-selected .deck-accent-line {
  opacity: 1;
  box-shadow: 0 0 10px var(--deck-theme, var(--md-sys-color-primary));
}

.deck-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.deck-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid var(--md-sys-color-outline);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: transparent;
}

.deck-checkbox.checked {
  background-color: var(--deck-theme, var(--md-sys-color-primary));
  border-color: var(--deck-theme, var(--md-sys-color-primary));
  color: #ffffff;
}

.deck-logo-container {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--md-shape-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.deck-logo-img {
  max-height: 100%;
  max-width: 90%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.deck-name {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 8px;
  color: #ffffff;
}

.deck-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8125rem;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 10px;
}

.deck-card-count {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: var(--md-sys-color-primary);
}

.deck-description {
  font-size: 0.8125rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.4;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.deck-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.peek-cards-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--md-sys-color-outline);
  padding: 4px 0;
  transition: color 0.2s ease;
}

.peek-cards-btn:hover {
  color: var(--md-sys-color-primary);
}

.peek-cards-btn svg {
  transition: transform 0.2s ease;
}

.peek-cards-btn svg.rotated {
  transform: rotate(180deg);
}

/* Card Peek Panel */
.card-peek-panel {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  animation: fadeIn 0.2s ease;
}

.peek-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}

.peek-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: var(--md-shape-sm);
  background-color: var(--md-sys-color-surface-container-high);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.peek-item:hover {
  background-color: var(--md-sys-color-surface-container-highest);
  border-color: var(--md-sys-color-primary);
}

.peek-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.peek-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
}

.peek-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.peek-count {
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin-left: 4px;
}

/* Bottom Floating Bar */
.floating-next-bar {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.floating-container {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 18px 10px 24px;
  background-color: rgba(27, 32, 44, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: var(--md-shape-full);
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-elevation-4);
  animation: popIn 0.3s ease;
}

.floating-stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-count {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--md-sys-color-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
}

.floating-btn {
  padding: 12px 28px;
  font-size: 1rem;
}

.floating-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 600px) {
  .decks-grid {
    grid-template-columns: 1fr;
  }
  .floating-container {
    width: 90%;
    justify-content: space-between;
  }
}
</style>
