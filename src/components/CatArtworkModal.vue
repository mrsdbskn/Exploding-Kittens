<template>
  <div v-if="isOpen" class="cat-modal-backdrop animate-fade-in" @click.self="close">
    <div class="m3-card cat-gallery-modal animate-pop-in">
      <!-- Modal Header -->
      <div class="gallery-header">
        <div class="header-left">
          <span class="gallery-badge-icon">😼</span>
          <div>
            <h2 class="gallery-title">Exploding Kittens: 18 Cat Artworks Archive</h2>
            <p class="gallery-subtitle">
              All 18 official artwork styles across editions. Select any card to view in full detail.
            </p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="Close">✕</button>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="gallery-toolbar">
        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            class="filter-tab-btn" 
            :class="{ active: currentFilter === 'all' }"
            @click="currentFilter = 'all'"
          >
            All 18 Artworks (18)
          </button>
          <button 
            class="filter-tab-btn" 
            :class="{ active: currentFilter === 'owned' }"
            @click="currentFilter = 'owned'"
          >
            In Owned Decks ({{ ownedVariants.length }})
          </button>
          <button 
            class="filter-tab-btn" 
            :class="{ active: currentFilter === 'core' }"
            @click="currentFilter = 'core'"
          >
            Core 5 Original (5)
          </button>
          <button 
            class="filter-tab-btn" 
            :class="{ active: currentFilter === 'special' }"
            @click="currentFilter = 'special'"
          >
            Special & Expansions (13)
          </button>
        </div>

        <!-- Search Input -->
        <div class="gallery-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search cat art name..." 
            class="gallery-search-input"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>
      </div>

      <!-- Modal Content: Main Split View (Selected Card Preview + Gallery Grid) -->
      <div class="gallery-content-split">
        <!-- Left: Selected Large Artwork Preview -->
        <div class="preview-panel" v-if="selectedVariant">
          <div class="card-art-frame">
            <img 
              :src="selectedVariant.art" 
              :alt="selectedVariant.name" 
              class="full-card-img" 
              loading="lazy"
            />
          </div>

          <div class="preview-details">
            <div class="preview-title-row">
              <img :src="selectedVariant.icon" :alt="selectedVariant.name" class="preview-icon-sm" />
              <div>
                <h3 class="preview-cat-name">{{ selectedVariant.name }}</h3>
                <span class="preview-tagline">{{ getCatTagline(selectedVariant.slug) }}</span>
              </div>
            </div>

            <!-- Owned Status -->
            <div class="ownership-status-badge" :class="isVariantOwned(selectedVariant.slug) ? 'is-owned' : 'is-unowned'">
              <span v-if="isVariantOwned(selectedVariant.slug)">
                ✅ In your deck: <strong>{{ getOwnedQuantity(selectedVariant.slug) }}x cards</strong>
              </span>
              <span v-else>
                📦 Not in current owned decks
              </span>
            </div>

            <!-- Decks Featuring this Artwork -->
            <div class="preview-decks-section">
              <span class="preview-label">Featured In Editions:</span>
              <div class="preview-decks-chips">
                <span 
                  v-for="dSlug in getDecksForVariant(selectedVariant.slug)" 
                  :key="dSlug"
                  class="edition-chip"
                >
                  {{ formatDeckName(dSlug) }}
                </span>
                <span v-if="getDecksForVariant(selectedVariant.slug).length === 0" class="edition-chip uk-exclusive">
                  🇬🇧 UK / Amazon UK Special Edition
                </span>
              </div>
            </div>

            <!-- Combo Reminder -->
            <div class="combo-rule-box">
              <span class="combo-title">🐱 Special Combo Mechanics</span>
              <p class="combo-text">
                Play <strong>2 matching {{ selectedVariant.name }}</strong> cards to steal a random card from another player.
                Or play 3 matching cards to name a specific card to steal!
              </p>
            </div>
          </div>
        </div>

        <!-- Right: 23 Artworks Scrollable Grid -->
        <div class="grid-panel">
          <div class="artworks-grid">
            <div 
              v-for="v in filteredVariants" 
              :key="v.slug"
              class="gallery-card-item"
              :class="{ 
                selected: selectedVariant?.slug === v.slug,
                'is-owned-item': isVariantOwned(v.slug)
              }"
              @click="selectedVariant = v"
            >
              <div class="card-thumb-container">
                <img :src="v.icon" :alt="v.name" class="thumb-icon" />
                <span v-if="isVariantOwned(v.slug)" class="owned-qty-pill">
                  {{ getOwnedQuantity(v.slug) }}x
                </span>
              </div>
              <span class="card-item-name">{{ v.name }}</span>
            </div>
          </div>

          <div v-if="filteredVariants.length === 0" class="empty-results">
            No cat artwork styles match "{{ searchQuery }}".
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="gallery-footer">
        <span class="footer-hint">
          💡 Tip: Exploding Kittens standard rules allow combining cat cards across decks into identical matching pairs.
        </span>
        <button class="m3-btn m3-btn-primary" @click="close">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { CAT_VARIANTS_CATALOG, DECKS } from '../data/decksData.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  initialVariantSlug: { type: String, default: null },
  ownedDeckIds: { type: Array, default: () => [] }
});

const emit = defineEmits(['close']);

const currentFilter = ref('all');
const searchQuery = ref('');
const selectedVariant = ref(CAT_VARIANTS_CATALOG[0]);

// Initialize selected variant on open
watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.initialVariantSlug) {
      const match = CAT_VARIANTS_CATALOG.find(v => v.slug === props.initialVariantSlug);
      if (match) selectedVariant.value = match;
    } else {
      selectedVariant.value = CAT_VARIANTS_CATALOG[0];
    }
  }
});

// Map owned variants and quantities based on ownedDeckIds
const ownedVariantsMap = computed(() => {
  const map = {}; // slug -> qty
  for (const deckId of props.ownedDeckIds) {
    const deck = DECKS.find(d => d.id === deckId);
    if (!deck) continue;
    const catCard = deck.cards?.find(c => c.slug === 'cat-card');
    if (catCard && catCard.variants) {
      for (const v of catCard.variants) {
        map[v.slug] = (map[v.slug] || 0) + v.quantity;
      }
    }
  }
  return map;
});

const isVariantOwned = (slug) => {
  return (ownedVariantsMap.value[slug] || 0) > 0;
};

const getOwnedQuantity = (slug) => {
  return ownedVariantsMap.value[slug] || 0;
};

const ownedVariants = computed(() => {
  return CAT_VARIANTS_CATALOG.filter(v => isVariantOwned(v.slug));
});

const filteredVariants = computed(() => {
  return CAT_VARIANTS_CATALOG.filter(v => {
    // Filter tabs
    if (currentFilter.value === 'owned' && !isVariantOwned(v.slug)) return false;
    if (currentFilter.value === 'core' && !['beard-cat', 'cattermelon', 'hairy-potato-cat', 'rainbow-ralphing-cat', 'tacocat'].includes(v.slug)) return false;
    if (currentFilter.value === 'special' && ['beard-cat', 'cattermelon', 'hairy-potato-cat', 'rainbow-ralphing-cat', 'tacocat'].includes(v.slug)) return false;

    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      if (!v.name.toLowerCase().includes(q) && !v.slug.includes(q)) return false;
    }
    return true;
  });
});

const getDecksForVariant = (slug) => {
  const v = CAT_VARIANTS_CATALOG.find(item => item.slug === slug);
  return v ? (v.decks || []) : [];
};

const formatDeckName = (deckSlug) => {
  const deck = DECKS.find(d => d.id === deckSlug || d.slug === deckSlug);
  return deck ? deck.name.replace('Exploding Kittens: ', '').replace('Exploding Kittens ', '') : deckSlug;
};

const getCatTagline = (slug) => {
  const map = {
    'beard-cat': 'You can stroke his luscious facial hair.',
    'cattermelon': 'A juicy, delicious melon with ears and paws.',
    'hairy-potato-cat': 'A tiny tater-tot packed with whiskers and fluff.',
    'rainbow-ralphing-cat': 'Vomits bright rainbows of chaotic cuteness.',
    'tacocat': 'A crunchy feline palindrome. Tacocat spelled backwards is Tacocat!',
    'bikini-cat': 'Ready for the beach with sunscreen on all 9 lives.',
    'cats-schrodinger': 'Both alive and exploded until someone draws a card.',
    'momma-cat': 'Fierce protector of all chaotic kittens.',
    'shy-bladder-cat': 'Please look away when he visits the litter box.',
    'zombie-cat': 'Risen from the dead with an unquenchable hunger for tuna.',
    'horse-cat': 'Galloping majestically into divine feline warfare.',
    'knight-cat': 'Armored in shining steel, defending kitten kingdoms.',
    'mercat': 'Half cat, half fish, 100% chaotic aquatic menace.',
    'troll-cat': 'Guard of the bridge, demanding fish toll.',
    'cat-o-lantern': 'Spooky glowing feline carved for mischief.',
    'de-cat-ipated': 'Mind lost, paws sharp and relentless.',
    'electrocat': 'Charged with 10,000 volts of static fur shock.',
    'vampire-cat': 'I vant to suck your warm catnip milk.'
  };
  return map[slug] || 'Powerless on its own. Play matching pairs to steal!';
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.cat-modal-backdrop {
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

.cat-gallery-modal {
  background-color: #1e1b18;
  border: 1px solid rgba(255, 180, 160, 0.2);
  border-radius: 28px;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.gallery-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(235, 115, 80, 0.12), transparent);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.gallery-badge-icon {
  font-size: 2rem;
  background-color: rgba(235, 115, 80, 0.2);
  padding: 10px;
  border-radius: 16px;
}

.gallery-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
}

.gallery-subtitle {
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

.gallery-toolbar {
  padding: 14px 24px;
  background-color: #26221e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #c7c5c0;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.filter-tab-btn.active {
  background-color: #ffb4a0;
  color: #561e12;
  border-color: #ffb4a0;
  font-weight: 600;
}

.gallery-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  padding: 6px 14px;
  color: #fff;
}

.gallery-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.85rem;
  width: 170px;
}

.clear-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0 4px;
}

.gallery-content-split {
  flex: 1;
  display: grid;
  grid-template-columns: 360px 1fr;
  overflow: hidden;
  min-height: 480px;
}

@media (max-width: 850px) {
  .gallery-content-split {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
}

.preview-panel {
  padding: 24px;
  background-color: #181512;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  gap: 16px;
}

.card-art-frame {
  width: 220px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 180, 160, 0.3);
  background-color: #000;
}

.full-card-img {
  width: 100%;
  height: auto;
  display: block;
}

.preview-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-icon-sm {
  width: 44px;
  height: 44px;
  object-fit: contain;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
}

.preview-cat-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.preview-tagline {
  font-size: 0.8rem;
  color: #ffb4a0;
  font-style: italic;
  display: block;
  margin-top: 2px;
}

.ownership-status-badge {
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
}

.ownership-status-badge.is-owned {
  background-color: rgba(100, 220, 120, 0.15);
  color: #8be5a0;
  border: 1px solid rgba(100, 220, 120, 0.3);
}

.ownership-status-badge.is-unowned {
  background-color: rgba(255, 255, 255, 0.05);
  color: #999;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-decks-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
  font-weight: 600;
}

.preview-decks-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.edition-chip {
  background-color: rgba(255, 180, 160, 0.12);
  color: #ffb4a0;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  border: 1px solid rgba(255, 180, 160, 0.25);
}

.edition-chip.uk-exclusive {
  background-color: rgba(80, 160, 255, 0.15);
  color: #90c5ff;
  border-color: rgba(80, 160, 255, 0.3);
}

.combo-rule-box {
  background-color: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #ffb4a0;
  padding: 10px 12px;
  border-radius: 0 10px 10px 0;
}

.combo-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffb4a0;
  display: block;
  margin-bottom: 4px;
}

.combo-text {
  margin: 0;
  font-size: 0.78rem;
  color: #ccc;
  line-height: 1.4;
}

.grid-panel {
  padding: 20px;
  overflow-y: auto;
  background-color: #1e1b18;
}

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.gallery-card-item {
  background-color: #27231f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-align: center;
}

.gallery-card-item:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 180, 160, 0.4);
  background-color: #312b26;
}

.gallery-card-item.selected {
  border-color: #ffb4a0;
  background-color: rgba(255, 180, 160, 0.15);
  box-shadow: 0 0 0 2px #ffb4a0;
}

.card-thumb-container {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.thumb-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  transition: transform 0.2s;
}

.gallery-card-item:hover .thumb-icon {
  transform: scale(1.1);
}

.owned-qty-pill {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #4cd964;
  color: #0b3414;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.card-item-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.25;
}

.empty-results {
  padding: 40px;
  text-align: center;
  color: #888;
  font-size: 0.95rem;
}

.gallery-footer {
  padding: 16px 24px;
  background-color: #181512;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-hint {
  font-size: 0.8rem;
  color: #aaa;
}
</style>
