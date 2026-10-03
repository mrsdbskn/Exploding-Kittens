<template>
  <div class="card-configurator-section animate-fade-in">
    <!-- Top Configuration Header: Player Count & Quick Controls -->
    <div class="config-top-panel m3-card">
      <div class="panel-row">
        <!-- Player Count Selector -->
        <div class="player-selector-block">
          <div class="block-label">
            <span class="icon-label">👥</span>
            <div>
              <span class="title">Player Count</span>
              <span class="subtitle">{{ playerCount }} Players (needs {{ explodingKittensNeeded }} Exploding Kittens)</span>
            </div>
          </div>

          <div class="player-chips">
            <button 
              v-for="p in [2, 3, 4, 5, 6, 7, 8, 9, 10]" 
              :key="p"
              class="player-btn"
              :class="{ active: playerCount === p }"
              @click="$emit('update:player-count', p)"
            >
              {{ p }}
            </button>
          </div>
        </div>

        <!-- Hand Size & Rules Quick Option -->
        <div class="hand-size-block">
          <div class="block-label">
            <span class="icon-label">🃏</span>
            <div>
              <span class="title">Starting Hand Size</span>
              <span class="subtitle">1 Defuse + {{ startingHandNonDefuse }} cards</span>
            </div>
          </div>

          <div class="hand-chips">
            <button 
              class="m3-chip" 
              :class="{ active: startingHandNonDefuse === 7 }"
              @click="$emit('update:hand-size', 7)"
            >
              Standard (7+1)
            </button>
            <button 
              class="m3-chip" 
              :class="{ active: startingHandNonDefuse === 4 }"
              @click="$emit('update:hand-size', 4)"
            >
              Quick Game (4+1)
            </button>
          </div>
        </div>
      </div>

      <!-- Live Hand Deal & Pool Validation Notice -->
      <div class="pool-validation-banner" :class="canDealFullHands ? 'is-valid' : 'is-short'">
        <div class="validation-status">
          <span class="status-icon">{{ canDealFullHands ? '✅' : '⚠️' }}</span>
          <span v-if="canDealFullHands">
            Total active cards: <strong>{{ totalActiveCardsCount }}</strong> • 
            Starting hands require <strong>{{ starterHandTotalCards + starterDefusesNeeded }}</strong> cards • 
            Draw pile will have <strong>{{ totalDrawPileSize }}</strong> cards.
          </span>
          <span v-else>
            Card shortage! You need at least <strong>{{ cardsShortage }}</strong> more cards to deal {{ startingHandNonDefuse }}+1 cards to {{ playerCount }} players. Enable more decks or lower hand size.
          </span>
        </div>

        <div class="quick-bulk-actions">
          <button class="m3-btn m3-btn-tonal btn-xs" @click="$emit('include-all')">
            Include All
          </button>
          <button class="m3-btn m3-btn-tonal btn-xs" @click="$emit('toggle-cat-cards')">
            {{ isCatExcluded ? 'Include Cat Cards' : 'Exclude Cat Cards' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filter and Search Controls -->
    <div class="controls-toolbar">
      <!-- Search Input -->
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search card name, mechanic, or effect..."
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
      </div>

      <!-- View Mode Toggle -->
      <div class="view-mode-toggle">
        <button 
          class="mode-btn" 
          :class="{ active: viewMode === 'unified' }"
          @click="viewMode = 'unified'"
          title="Unified catalog across all owned decks"
        >
          Unified Pool ({{ unifiedCardList.length }})
        </button>
        <button 
          class="mode-btn" 
          :class="{ active: viewMode === 'by-deck' }"
          @click="viewMode = 'by-deck'"
          title="Group cards by each owned deck"
        >
          By Deck ({{ ownedDecks.length }})
        </button>
      </div>
    </div>

    <!-- Category Filter Pills (when in unified view) -->
    <div v-if="viewMode === 'unified'" class="category-pills-row">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="m3-chip cat-chip"
        :class="{ active: selectedCategory === cat.id }"
        :style="{ '--cat-accent': cat.color }"
        @click="selectedCategory = cat.id"
      >
        <span>{{ cat.name }}</span>
        <span class="chip-count">({{ getCategoryCount(cat.id) }})</span>
      </button>
    </div>

    <!-- UNIFIED VIEW: Card Grid -->
    <div v-if="viewMode === 'unified'" class="cards-grid">
      <div 
        v-for="card in filteredUnifiedCards" 
        :key="card.slug"
        class="m3-card card-item"
        :class="{ 
          'is-excluded': isCardExcluded(card.slug),
          'has-reduced-qty': hasCustomQty(card.slug) && !isCardExcluded(card.slug)
        }"
      >
        <!-- Card Top Bar: Icon, Name, Category -->
        <div class="card-item-header">
          <div class="card-icon-container" @click="$emit('inspect-card', card.slug)">
            <img 
              v-if="card.icons && card.icons[0]" 
              :src="card.icons[0]" 
              :alt="card.name" 
              class="card-img" 
              loading="lazy"
            />
            <span v-else class="card-placeholder-icon">🃏</span>
          </div>

          <div class="card-header-info">
            <div class="card-name-row">
              <h4 class="card-name" @click="$emit('inspect-card', card.slug)">
                {{ card.name }}
              </h4>
              <button 
                class="info-icon-btn" 
                @click="$emit('inspect-card', card.slug)"
                title="View full official rules & mechanics"
              >
                ℹ️
              </button>
            </div>
            
            <div class="card-tags">
              <span class="m3-badge m3-badge-primary cat-badge">
                {{ formatCategory(card.category) }}
              </span>
              <span v-if="card.icons && card.icons.length > 1" class="m3-badge m3-badge-warning">
                {{ card.icons.length }} artwork styles
              </span>
            </div>
          </div>
        </div>

        <!-- Description Tagline -->
        <p class="card-short-desc">
          {{ card.shortDesc || 'Special card mechanics and strategic options.' }}
        </p>

        <!-- Deck Sources Badges -->
        <div class="deck-sources-bar">
          <span class="sources-label">From:</span>
          <div class="sources-chips">
            <span 
              v-for="src in card.deckSources" 
              :key="src.deckId" 
              class="source-badge"
              :title="`${src.deckName}: ${src.quantity} cards`"
            >
              {{ src.deckName.replace('Exploding Kittens: ', '').replace('Exploding Kittens ', '') }} ({{ src.quantity }})
            </span>
          </div>
        </div>

        <!-- Controls: Quantity Adjuster & Exclude Button -->
        <div class="card-item-footer">
          <!-- Quantity Stepper -->
          <div class="qty-stepper" :class="{ disabled: isCardExcluded(card.slug) }">
            <button 
              class="step-btn" 
              :disabled="isCardExcluded(card.slug) || getActiveQty(card.slug) <= 0"
              @click="decrementQty(card.slug)"
            >
              -
            </button>
            <span class="qty-display">
              <strong>{{ getActiveQty(card.slug) }}</strong> / {{ card.totalAvailable }}
            </span>
            <button 
              class="step-btn" 
              :disabled="isCardExcluded(card.slug) || getActiveQty(card.slug) >= card.totalAvailable"
              @click="incrementQty(card.slug, card.totalAvailable)"
            >
              +
            </button>
          </div>

          <!-- Exclude / Include Toggle -->
          <button 
            class="m3-btn btn-sm toggle-exclude-btn"
            :class="isCardExcluded(card.slug) ? 'm3-btn-primary' : 'm3-btn-tonal is-active-include'"
            @click="toggleCardExclude(card.slug, card.totalAvailable)"
          >
            {{ isCardExcluded(card.slug) ? 'Include Card' : 'Exclude' }}
          </button>
        </div>
      </div>
    </div>

    <!-- BY DECK VIEW: Accordions for each owned deck -->
    <div v-else class="decks-accordion-list">
      <div 
        v-for="deck in ownedDecks" 
        :key="deck.id" 
        class="m3-card deck-accordion-card"
        :style="{ '--deck-color': deck.themeColor }"
      >
        <div class="deck-accordion-header" @click="toggleDeckAccordion(deck.id)">
          <div class="deck-acc-left">
            <img :src="deck.logo" :alt="deck.name" class="deck-acc-logo" />
            <div>
              <h3 class="deck-acc-name">{{ deck.name }}</h3>
              <span class="deck-acc-meta">
                {{ deck.cards.length }} card types • {{ deck.totalCards }} total cards
              </span>
            </div>
          </div>

          <div class="deck-acc-right">
            <button 
              class="m3-btn m3-btn-tonal btn-xs"
              @click.stop="excludeAllInDeck(deck)"
            >
              Toggle Deck Cards
            </button>
            <span class="chevron" :class="{ open: openAccordionId === deck.id }">▼</span>
          </div>
        </div>

        <!-- Accordion Body -->
        <div v-if="openAccordionId === deck.id" class="deck-accordion-body">
          <div class="deck-cards-list">
            <div 
              v-for="c in deck.cards" 
              :key="c.slug" 
              class="deck-card-row"
              :class="{ 'is-excluded': isCardExcluded(c.slug) }"
            >
              <div class="row-left" @click="$emit('inspect-card', c.slug)">
                <img v-if="c.icons && c.icons[0]" :src="c.icons[0]" :alt="c.name" class="row-icon" />
                <div class="row-info">
                  <span class="row-name">{{ c.name }}</span>
                  <span class="row-desc">{{ c.shortDesc }}</span>
                </div>
              </div>

              <div class="row-right">
                <span class="row-pool">Deck has: {{ c.quantity }}</span>
                <button 
                  class="m3-chip"
                  :class="{ active: !isCardExcluded(c.slug) }"
                  @click="toggleCardExclude(c.slug, availablePool[c.slug]?.totalAvailable || c.quantity)"
                >
                  {{ isCardExcluded(c.slug) ? 'Excluded' : 'Active' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation Bar -->
    <div class="config-bottom-nav">
      <button class="m3-btn m3-btn-tonal" @click="$emit('back')">
        ← Back to Decks
      </button>

      <button class="m3-btn m3-btn-primary" @click="$emit('continue')">
        Review Synergies & Rules ({{ suggestionsCount }}) →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  decks: { type: Array, required: true },
  ownedDeckIds: { type: Array, required: true },
  availablePool: { type: Object, required: true },
  customQuantities: { type: Object, required: true },
  excludedCards: { type: Object, required: true }, // Set
  categories: { type: Array, required: true },
  playerCount: { type: Number, required: true },
  startingHandNonDefuse: { type: Number, required: true },
  canDealFullHands: { type: Boolean, required: true },
  cardsShortage: { type: Number, required: true },
  starterHandTotalCards: { type: Number, required: true },
  starterDefusesNeeded: { type: Number, required: true },
  totalDrawPileSize: { type: Number, required: true },
  explodingKittensNeeded: { type: Number, required: true },
  suggestionsCount: { type: Number, default: 0 }
});

const emit = defineEmits([
  'update:player-count',
  'update:hand-size',
  'update:custom-quantities',
  'update:excluded-cards',
  'inspect-card',
  'include-all',
  'toggle-cat-cards',
  'back',
  'continue'
]);

const searchQuery = ref('');
const selectedCategory = ref('all');
const viewMode = ref('unified');
const openAccordionId = ref(props.ownedDeckIds[0] || null);

const ownedDecks = computed(() => {
  return props.decks.filter(d => props.ownedDeckIds.includes(d.id));
});

const isCardExcluded = (slug) => props.excludedCards.has(slug);
const hasCustomQty = (slug) => props.customQuantities[slug] !== undefined;

const getActiveQty = (slug) => {
  if (props.excludedCards.has(slug)) return 0;
  if (props.customQuantities[slug] !== undefined) {
    return props.customQuantities[slug];
  }
  return props.availablePool[slug]?.totalAvailable || 0;
};

const totalActiveCardsCount = computed(() => {
  let count = 0;
  for (const slug in props.availablePool) {
    count += getActiveQty(slug);
  }
  return count;
});

const isCatExcluded = computed(() => {
  return props.excludedCards.has('cat-card');
});

const unifiedCardList = computed(() => {
  return Object.values(props.availablePool);
});

const getCategoryCount = (catId) => {
  if (catId === 'all') return unifiedCardList.value.length;
  return unifiedCardList.value.filter(c => c.category === catId).length;
};

const filteredUnifiedCards = computed(() => {
  let list = unifiedCardList.value;

  if (selectedCategory.value !== 'all') {
    list = list.filter(c => c.category === selectedCategory.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(c => 
      c.name.toLowerCase().includes(q) ||
      (c.shortDesc && c.shortDesc.toLowerCase().includes(q)) ||
      (c.mechanics && c.mechanics.toLowerCase().includes(q))
    );
  }

  // Sort by category order then name
  return [...list].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });
});

const toggleCardExclude = (slug, maxQty) => {
  const nextSet = new Set(props.excludedCards);
  const nextCustom = { ...props.customQuantities };
  if (nextSet.has(slug)) {
    nextSet.delete(slug);
    nextCustom[slug] = maxQty;
  } else {
    nextSet.add(slug);
    nextCustom[slug] = 0;
  }
  emit('update:excluded-cards', nextSet);
  emit('update:custom-quantities', nextCustom);
};

const incrementQty = (slug, max) => {
  const current = getActiveQty(slug);
  if (current < max) {
    const nextCustom = { ...props.customQuantities, [slug]: current + 1 };
    emit('update:custom-quantities', nextCustom);
    if (props.excludedCards.has(slug)) {
      const nextSet = new Set(props.excludedCards);
      nextSet.delete(slug);
      emit('update:excluded-cards', nextSet);
    }
  }
};

const decrementQty = (slug) => {
  const current = getActiveQty(slug);
  if (current > 0) {
    const nextCustom = { ...props.customQuantities, [slug]: current - 1 };
    emit('update:custom-quantities', nextCustom);
    if (current - 1 === 0) {
      const nextSet = new Set(props.excludedCards);
      nextSet.add(slug);
      emit('update:excluded-cards', nextSet);
    }
  }
};

const toggleDeckAccordion = (deckId) => {
  openAccordionId.value = openAccordionId.value === deckId ? null : deckId;
};

const excludeAllInDeck = (deck) => {
  const nextSet = new Set(props.excludedCards);
  const nextCustom = { ...props.customQuantities };
  const allExcluded = deck.cards.every(c => nextSet.has(c.slug));

  for (const c of deck.cards) {
    if (allExcluded) {
      nextSet.delete(c.slug);
      nextCustom[c.slug] = props.availablePool[c.slug]?.totalAvailable || c.quantity;
    } else {
      nextSet.add(c.slug);
      nextCustom[c.slug] = 0;
    }
  }
  emit('update:excluded-cards', nextSet);
  emit('update:custom-quantities', nextCustom);
};

const formatCategory = (cat) => {
  const map = {
    hazards: '💥 Hazard',
    lifesavers: '🛡️ Lifesaver',
    attacks: '⚔️ Attack',
    vision: '🔮 Vision',
    stealing: '😼 Combos',
    chaos: '🌪️ Chaos',
    defense: '🚫 Nope'
  };
  return map[cat] || cat;
};
</script>

<style scoped>
.card-configurator-section {
  max-width: 1380px;
  margin: 0 auto;
  padding: 32px 24px 100px 24px;
}

/* Top Panel */
.config-top-panel {
  padding: 24px;
  margin-bottom: 28px;
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-xl);
}

.panel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
}

.block-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.icon-label {
  font-size: 1.5rem;
}

.block-label .title {
  display: block;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
}

.block-label .subtitle {
  font-size: 0.8125rem;
  color: var(--md-sys-color-on-surface-variant);
}

.player-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.player-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  border: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.player-btn:hover {
  background-color: var(--md-sys-color-surface-container-highest);
  transform: scale(1.05);
}

.player-btn.active {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 4px 14px rgba(128, 180, 255, 0.4);
  transform: scale(1.08);
}

.hand-chips {
  display: flex;
  gap: 8px;
}

.pool-validation-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 18px;
  border-radius: var(--md-shape-lg);
  font-size: 0.875rem;
}

.pool-validation-banner.is-valid {
  background-color: rgba(117, 223, 138, 0.1);
  border: 1px solid rgba(117, 223, 138, 0.3);
  color: var(--md-sys-color-on-surface);
}

.pool-validation-banner.is-short {
  background-color: rgba(255, 84, 73, 0.15);
  border: 1px solid rgba(255, 84, 73, 0.4);
  color: #ffdad6;
}

.validation-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-icon {
  font-size: 1.2rem;
}

.quick-bulk-actions {
  display: flex;
  gap: 8px;
}

.btn-xs {
  padding: 5px 12px;
  font-size: 0.75rem;
}

/* Controls Toolbar */
.controls-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-full);
  padding: 8px 16px;
  flex: 1;
  max-width: 460px;
  color: var(--md-sys-color-on-surface-variant);
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #ffffff;
  width: 100%;
}

.clear-search {
  color: var(--md-sys-color-outline);
  font-size: 0.875rem;
}

.view-mode-toggle {
  display: flex;
  background-color: var(--md-sys-color-surface-container-low);
  padding: 4px;
  border-radius: var(--md-shape-full);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.mode-btn {
  padding: 6px 16px;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--md-shape-full);
  color: var(--md-sys-color-on-surface-variant);
  transition: all 0.2s ease;
}

.mode-btn.active {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

/* Category Pills */
.category-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.cat-chip.active {
  border-color: var(--cat-accent, var(--md-sys-color-primary));
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
}

.card-item {
  padding: 16px;
  display: flex;
  flex-direction: column;
  border-radius: var(--md-shape-xl);
  border: 1.5px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container);
  transition: all 0.2s ease;
}

.card-item:hover {
  border-color: rgba(128, 180, 255, 0.4);
  transform: translateY(-2px);
}

.card-item.is-excluded {
  opacity: 0.45;
  background-color: rgba(15, 18, 26, 0.6);
  border-color: rgba(255, 255, 255, 0.05);
}

.card-item.is-excluded:hover {
  opacity: 0.75;
}

.card-item.has-reduced-qty {
  border-color: var(--md-sys-color-warning);
}

.card-item-header {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.card-icon-container {
  width: 52px;
  height: 52px;
  border-radius: var(--md-shape-lg);
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  padding: 4px;
}

.card-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-placeholder-icon {
  font-size: 24px;
}

.card-header-info {
  flex: 1;
  overflow: hidden;
}

.card-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 4px;
}

.card-name {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-name:hover {
  color: var(--md-sys-color-primary);
}

.info-icon-btn {
  font-size: 0.8125rem;
  opacity: 0.6;
  transition: opacity 0.15s ease;
}

.info-icon-btn:hover {
  opacity: 1;
}

.card-tags {
  display: flex;
  gap: 6px;
}

.cat-badge {
  font-size: 0.6875rem;
  padding: 2px 6px;
}

.card-short-desc {
  font-size: 0.8125rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.2em;
}

.deck-sources-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 0.725rem;
}

.sources-label {
  color: var(--md-sys-color-outline);
}

.sources-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.source-badge {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  padding: 2px 6px;
  border-radius: var(--md-shape-xs);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.card-item-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.qty-stepper {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--md-sys-color-surface-container-low);
  padding: 3px 8px;
  border-radius: var(--md-shape-full);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.qty-stepper.disabled {
  opacity: 0.3;
}

.step-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: var(--md-sys-color-surface-container-high);
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
}

.step-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-display {
  font-size: 0.8125rem;
  min-width: 44px;
  text-align: center;
}

.qty-display strong {
  color: var(--md-sys-color-primary);
  font-size: 0.9375rem;
}

.toggle-exclude-btn {
  padding: 6px 14px;
  font-size: 0.75rem;
}

.is-active-include {
  background-color: rgba(255, 84, 73, 0.15);
  color: #ffb4a9;
  border: 1px solid rgba(255, 84, 73, 0.3);
}

.is-active-include:hover {
  background-color: rgba(255, 84, 73, 0.25);
}

/* Accordion By-Deck View */
.decks-accordion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deck-accordion-card {
  border-left: 4px solid var(--deck-color, var(--md-sys-color-primary));
}

.deck-accordion-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.deck-acc-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.deck-acc-logo {
  height: 48px;
  max-width: 100px;
  object-fit: contain;
}

.deck-acc-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
}

.deck-acc-meta {
  font-size: 0.8125rem;
  color: var(--md-sys-color-on-surface-variant);
}

.deck-acc-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.chevron {
  font-size: 0.8125rem;
  transition: transform 0.2s ease;
  color: var(--md-sys-color-outline);
}

.chevron.open {
  transform: rotate(180deg);
}

.deck-accordion-body {
  padding: 0 20px 20px 20px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.deck-cards-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.deck-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: var(--md-shape-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.deck-card-row.is-excluded {
  opacity: 0.45;
}

.row-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  overflow: hidden;
}

.row-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.row-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.row-name {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-desc {
  font-size: 0.725rem;
  color: var(--md-sys-color-outline);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-pool {
  font-size: 0.75rem;
  color: var(--md-sys-color-outline);
}

/* Bottom Navigation */
.config-bottom-nav {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

@media (max-width: 600px) {
  .panel-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
