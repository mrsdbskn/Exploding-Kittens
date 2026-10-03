<template>
  <div v-if="isOpen" class="codex-backdrop animate-fade-in" @click.self="$emit('close')">
    <div class="m3-card codex-modal animate-pop-in">
      <!-- Modal Header -->
      <div class="codex-header">
        <div class="header-left">
          <span class="codex-badge-icon">📖</span>
          <div>
            <h2 class="codex-title">Exploding Kittens Card Lore Codex</h2>
            <p class="codex-subtitle">
              Comprehensive encyclopedia of all 45 cards: illustrations, mechanics, strategic tips, and Oatmeal lore.
            </p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')" title="Close Codex">✕</button>
      </div>

      <!-- Controls Toolbar -->
      <div class="codex-toolbar">
        <div class="toolbar-left-group">
          <!-- Search Input -->
          <div class="codex-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search card name or keyword..." 
              class="codex-search-input"
            />
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
          </div>

          <!-- Sort Button (A-Z by default) -->
          <button 
            class="codex-sort-btn"
            :title="sortAsc ? 'Sorted A to Z. Click to reverse (Z to A).' : 'Sorted Z to A. Click to sort A to Z.'"
            @click="sortAsc = !sortAsc"
          >
            <span class="sort-icon">🔤</span>
            <span class="sort-label">{{ sortAsc ? 'A → Z' : 'Z → A' }}</span>
          </button>
        </div>

        <!-- Category Filter Chips -->
        <div class="category-chips-scroll">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="cat-chip-btn"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Split Layout: Selected Card Details + Card Grid -->
      <div class="codex-content-split">
        <!-- Left: Selected Card Detail Panel -->
        <div class="codex-detail-panel" v-if="selectedCard">
          <div class="card-hero-thumb-box">
            <img 
              :src="selectedCard.icons?.[0] || './favicon.png'" 
              :alt="selectedCard.name" 
              class="codex-hero-icon"
            />
          </div>

          <div class="codex-detail-meta">
            <span class="m3-badge m3-badge-primary">
              {{ formatCategory(selectedCard.category) }}
            </span>
            <h3 class="codex-card-title">{{ selectedCard.name }}</h3>
            <p class="codex-tagline">{{ selectedCard.shortDesc }}</p>

            <!-- Official Mechanics -->
            <div class="codex-section-block">
              <span class="block-title">📜 Official Rules & Mechanics</span>
              <p class="mechanics-text">{{ selectedCard.mechanics || 'Follow instructions printed on the face of the card.' }}</p>
            </div>

            <!-- Strategy & Combos -->
            <div class="codex-section-block" v-if="getSynergyTip(selectedCard.slug)">
              <span class="block-title">💡 Strategic Synergy Tip</span>
              <p class="synergy-text">{{ getSynergyTip(selectedCard.slug) }}</p>
            </div>

            <!-- Included In Decks -->
            <div class="codex-section-block">
              <span class="block-title">📦 Featured In Decks</span>
              <div class="decks-chips-list">
                <span 
                  v-for="dSlug in (selectedCard.decks || [])" 
                  :key="dSlug"
                  class="deck-chip"
                >
                  {{ formatDeckName(dSlug) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Cards Grid -->
        <div class="codex-grid-panel">
          <div class="codex-grid">
            <div 
              v-for="c in filteredCards" 
              :key="c.slug"
              class="codex-grid-item"
              :class="{ selected: selectedCard?.slug === c.slug }"
              @click="selectedCard = c"
            >
              <img :src="c.icons?.[0] || './favicon.png'" :alt="c.name" class="grid-card-icon" />
              <div class="grid-card-info">
                <span class="grid-card-name">{{ c.name }}</span>
                <span class="grid-card-cat">{{ formatCategory(c.category) }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredCards.length === 0" class="empty-codex">
            No cards found matching "{{ searchQuery }}".
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="codex-footer">
        <span class="footer-count">Showing {{ filteredCards.length }} of {{ allCards.length }} official cards</span>
        <button class="m3-btn m3-btn-primary" @click="$emit('close')">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ALL_CARDS_CATALOG, CATEGORIES, DECKS } from '../data/decksData.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  initialCardSlug: { type: String, default: null }
});

defineEmits(['close']);

const searchQuery = ref('');
const selectedCategory = ref('all');
const sortAsc = ref(true); // Always sorted A-Z by default
const categories = [{ id: 'all', name: 'All Cards' }, ...CATEGORIES];

// Cards are strictly sorted alphabetically A-Z by default
const allCards = Object.values(ALL_CARDS_CATALOG).slice().sort((a, b) => a.name.localeCompare(b.name));
const selectedCard = ref(allCards[0]);

watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.initialCardSlug && ALL_CARDS_CATALOG[props.initialCardSlug]) {
      selectedCard.value = ALL_CARDS_CATALOG[props.initialCardSlug];
    } else {
      selectedCard.value = allCards[0];
    }
  }
});

const filteredCards = computed(() => {
  const list = allCards.filter(c => {
    if (selectedCategory.value !== 'all' && c.category !== selectedCategory.value) {
      return false;
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      if (!c.name.toLowerCase().includes(q) && !c.shortDesc.toLowerCase().includes(q) && !(c.mechanics || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return [...list].sort((a, b) => {
    return sortAsc.value 
      ? a.name.localeCompare(b.name) 
      : b.name.localeCompare(a.name);
  });
});

const formatCategory = (cat) => {
  const map = {
    hazards: '💥 Hazard',
    lifesavers: '🛡️ Defuse',
    attacks: '⚔️ Attack',
    vision: '🔮 Intel',
    stealing: '😼 Combo',
    chaos: '🌪️ Special',
    defense: '🚫 Nope'
  };
  return map[cat] || cat;
};

const formatDeckName = (deckSlug) => {
  const deck = DECKS.find(d => d.id === deckSlug || d.slug === deckSlug);
  return deck ? deck.name.replace('Exploding Kittens: ', '').replace('Exploding Kittens ', '') : deckSlug;
};

const getSynergyTip = (slug) => {
  const tips = {
    'streaking-kitten': 'Hold an Exploding Kitten in secret. If an opponent plays Favor or Cat pairs on you, give them the Exploding Kitten to eliminate them!',
    'barking-kitten': 'Always keep a Defuse or Nope handy. The moment your twin is played by another player, you will explode unless defused!',
    'armageddon': 'Forces an instant duel between Godcat and Devilcat. If you possess Godcat, play Armageddon to force opponents to gamble with Devilcat.',
    'catomic-bomb': 'Takes all Exploding Kittens and piles them on top. Follow up with Alter the Future or Bury to manipulate which poor soul draws them first.',
    'alter-the-future-3x': 'Strictly superior to See the Future because you can reorder the cards to bury hazards or feed them to the next player.',
    'attack-of-the-dead': 'Multiplier scales with the number of dead players! When 3 players are dead, this forces a massive 9 turns in a row.',
    'tower-of-power': 'Forces players stealing from you to blindly draw from inside the crown stash instead of your actual hand.',
    'clone': 'Takes the identity of whichever card is directly beneath it in the discard pile. Great for copying Attacks or Skips.',
    'curse-of-the-cat-butt': 'Blinds the target player until their next draw. They cannot view their cards and must play blindly!'
  };
  return tips[slug] || null;
};
</script>

<style scoped>
.codex-backdrop {
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

.codex-modal {
  background-color: #1a1714;
  border: 1px solid rgba(255, 180, 160, 0.25);
  border-radius: 28px;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.codex-header {
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

.codex-badge-icon {
  font-size: 2rem;
  background: rgba(255, 180, 160, 0.2);
  padding: 8px 10px;
  border-radius: 16px;
}

.codex-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
}

.codex-subtitle {
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

.codex-toolbar {
  padding: 12px 24px;
  background-color: #221e1a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.codex-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  padding: 6px 14px;
  color: #fff;
}

.codex-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.85rem;
  width: 200px;
}

.toolbar-left-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.codex-sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 180, 160, 0.12);
  border: 1px solid rgba(255, 180, 160, 0.28);
  border-radius: 9999px;
  color: #ffb4a0;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.codex-sort-btn:hover {
  background: rgba(255, 180, 160, 0.24);
  border-color: #ffb4a0;
  transform: translateY(-1px);
}

.clear-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0 4px;
}

.category-chips-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
}

.cat-chip-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #bbb;
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.cat-chip-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.cat-chip-btn.active {
  background: #ffb4a0;
  color: #4a180d;
  border-color: #ffb4a0;
}

.codex-content-split {
  flex: 1;
  display: grid;
  grid-template-columns: 380px 1fr;
  overflow: hidden;
  min-height: 480px;
}

@media (max-width: 850px) {
  .codex-content-split {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
}

.codex-detail-panel {
  padding: 24px;
  background-color: #161310;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-hero-thumb-box {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 180, 160, 0.3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.codex-hero-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.codex-card-title {
  margin: 6px 0 2px 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
}

.codex-tagline {
  margin: 0;
  font-size: 0.85rem;
  color: #ffb4a0;
  font-style: italic;
}

.codex-section-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.block-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffb4a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mechanics-text, .synergy-text {
  margin: 0;
  font-size: 0.8rem;
  color: #ccc;
  line-height: 1.45;
}

.decks-chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.deck-chip {
  background: rgba(255, 180, 160, 0.12);
  color: #ffb4a0;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
}

.codex-grid-panel {
  padding: 20px;
  overflow-y: auto;
  background-color: #1e1b18;
}

.codex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.codex-grid-item {
  background-color: #24201b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.codex-grid-item:hover {
  border-color: rgba(255, 180, 160, 0.35);
  transform: translateY(-2px);
  background-color: #2d2822;
}

.codex-grid-item.selected {
  border-color: #ffb4a0;
  background-color: rgba(255, 180, 160, 0.15);
  box-shadow: 0 0 0 2px #ffb4a0;
}

.grid-card-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 4px;
}

.grid-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.grid-card-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.grid-card-cat {
  font-size: 0.7rem;
  color: #aaa;
}

.empty-codex {
  padding: 40px;
  text-align: center;
  color: #888;
}

.codex-footer {
  padding: 16px 24px;
  background-color: #161310;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-count {
  font-size: 0.8rem;
  color: #aaa;
}

@media (max-width: 850px) {
  .codex-backdrop {
    padding: 0;
  }
  .codex-modal {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
  }
  .codex-header {
    padding: 12px 14px;
  }
  .codex-title {
    font-size: 1.05rem;
  }
  .codex-subtitle {
    font-size: 0.72rem;
  }
  .codex-toolbar {
    padding: 8px 12px;
    gap: 8px;
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar-left-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .codex-search {
    flex: 1;
    max-width: 70%;
  }
  .codex-search-input {
    width: 100%;
  }
  .category-chips-scroll {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
  }
  .codex-detail-panel {
    padding: 16px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .card-hero-thumb-box {
    width: 80px;
    height: 80px;
  }
  .codex-hero-icon {
    width: 60px;
    height: 60px;
  }
  .codex-card-title {
    font-size: 1.25rem;
  }
  .codex-grid-panel {
    padding: 12px;
  }
  .codex-grid {
    grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
    gap: 8px;
  }
  .codex-grid-item {
    padding: 8px 10px;
    gap: 8px;
  }
  .grid-card-icon {
    width: 36px;
    height: 36px;
  }
  .grid-card-name {
    font-size: 0.8rem;
  }
  .codex-footer {
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 12px)) 16px;
  }
}
</style>
