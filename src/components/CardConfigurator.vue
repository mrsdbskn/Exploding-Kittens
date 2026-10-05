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
              <span class="title">{{ isGerman ? 'Spieleranzahl' : 'Player Count' }}</span>
              <span class="subtitle">{{ playerCount }} {{ isGerman ? 'Spieler (benötigt' : 'Players (needs' }} {{ explodingKittensNeeded }} {{ isGerman ? 'Bomben)' : 'Exploding Kittens)' }}</span>
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
              <span class="title">{{ isGerman ? 'Start-Handgröße' : 'Starting Hand Size' }}</span>
              <span class="subtitle">1 {{ isGerman ? 'Entschärfung' : 'Defuse' }} + {{ startingHandNonDefuse }} {{ isGerman ? 'Karten' : 'cards' }}</span>
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
              {{ isGerman ? 'Kurzes Spiel (4+1)' : 'Quick Game (4+1)' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Live Hand Deal & Pool Validation Notice -->
      <div class="pool-validation-banner" :class="canDealFullHands ? 'is-valid' : 'is-short'">
        <div class="validation-status">
          <span class="status-icon">{{ canDealFullHands ? '✅' : '⚠️' }}</span>
          <span v-if="canDealFullHands">
            {{ isGerman ? 'Aktive Karten:' : 'Total active cards:' }} <strong>{{ totalActiveCardsCount }}</strong> • 
            {{ isGerman ? 'Start-Hände benötigen' : 'Starting hands require' }} <strong>{{ starterHandTotalCards + starterDefusesNeeded }}</strong> {{ isGerman ? 'Karten' : 'cards' }} • 
            {{ isGerman ? 'Nachziehstapel hat' : 'Draw pile will have' }} <strong>{{ totalDrawPileSize }}</strong> {{ isGerman ? 'Karten.' : 'cards.' }}
          </span>
          <span v-else>
            {{ isGerman ? 'Kartenmangel! Du benötigst mindestens' : 'Card shortage! You need at least' }} <strong>{{ cardsShortage }}</strong> {{ isGerman ? 'weitere Karten, um' : 'more cards to deal' }} {{ startingHandNonDefuse }}+1 {{ isGerman ? 'Karten an' : 'cards to' }} {{ playerCount }} {{ isGerman ? 'Spieler auszuteilen.' : 'players.' }}
          </span>
        </div>

        <div class="quick-bulk-actions">
          <button class="m3-btn m3-btn-tonal btn-xs" @click="$emit('include-all')">
            {{ isGerman ? 'Alle einbeziehen' : 'Include All' }}
          </button>
          <button class="m3-btn m3-btn-tonal btn-xs" @click="$emit('toggle-cat-cards')">
            {{ isCatExcluded ? (isGerman ? 'Katzenkarten einbeziehen' : 'Include Cat Cards') : (isGerman ? 'Katzenkarten ausschließen' : 'Exclude Cat Cards') }}
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
          :placeholder="isGerman ? 'Karten nach Name, Kategorie oder Mechanik suchen...' : 'Search card name, mechanic, or effect...'"
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
      </div>

      <!-- Sort Selector (Default A-Z) -->
      <div class="sort-control-block">
        <button 
          class="sort-chip-btn" 
          @click="cycleSortMode"
          :title="`Current sort: ${currentSortOption.label}. Click to cycle sorting.`"
        >
          <span class="sort-icon">{{ currentSortOption.icon }}</span>
          <span class="sort-label">{{ isGerman ? 'Sortierung:' : 'Sort:' }} {{ currentSortOption.label }}</span>
          <span class="sort-cycle-hint">🔄</span>
        </button>
      </div>

      <!-- View Mode Toggle -->
      <div class="view-mode-toggle">
        <button 
          class="mode-btn" 
          :class="{ active: viewMode === 'unified' }"
          @click="viewMode = 'unified'"
          :title="isGerman ? 'Gesamter Kartenkatalog aller Decks' : 'Unified catalog across all owned decks'"
        >
          {{ isGerman ? 'Gesamter Pool' : 'Unified Pool' }} ({{ unifiedCardList.length }})
        </button>
        <button 
          class="mode-btn" 
          :class="{ active: viewMode === 'by-deck' }"
          @click="viewMode = 'by-deck'"
          :title="isGerman ? 'Karten nach Herkunfts-Deck gruppiert' : 'Group cards by each owned deck'"
        >
          {{ isGerman ? 'Nach Deck' : 'By Deck' }} ({{ ownedDecks.length }})
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
        <span>{{ formatCategoryName(cat.id, cat.name) }}</span>
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
              :alt="formatCardName(card.slug, card.name)" 
              class="card-img" 
              loading="lazy"
            />
            <span v-else class="card-placeholder-icon">🃏</span>
          </div>

          <div class="card-header-info">
            <div class="card-name-row">
              <h4 class="card-name" @click="$emit('inspect-card', card.slug)">
                {{ formatCardName(card.slug, card.name) }}
              </h4>
              <button 
                class="info-icon-btn" 
                @click="$emit('inspect-card', card.slug)"
                :title="isGerman ? 'Vollständige offizielle Regeln & Mechaniken ansehen' : 'View full official rules & mechanics'"
              >
                ℹ️
              </button>
            </div>
            
            <div class="card-tags">
              <span class="m3-badge m3-badge-primary cat-badge">
                {{ formatCategoryName(card.category, formatCategory(card.category)) }}
              </span>
              <span v-if="card.slug === 'cat-card'" class="m3-badge m3-badge-warning">
                {{ isGerman ? '18 Illustrations-Stile' : '18 Artwork Styles Catalog' }}
              </span>
              <span v-else-if="card.icons && card.icons.length > 1" class="m3-badge m3-badge-warning">
                {{ card.icons.length }} {{ isGerman ? 'Illustrations-Stile' : 'artwork styles' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Description Tagline -->
        <p class="card-short-desc">
          {{ formatCardDesc(card.slug, card.shortDesc) }}
        </p>

        <!-- Cat Card Variants Quick Strip -->
        <div v-if="card.slug === 'cat-card'" class="cat-variants-strip">
          <div class="cat-variants-strip-left">
            <span class="strip-label">{{ isGerman ? 'Illustrationen in deinen Decks:' : 'Artworks in your decks:' }}</span>
            <div class="strip-icons">
              <img 
                v-for="(icon, idx) in card.icons.slice(0, 8)" 
                :key="idx" 
                :src="icon" 
                class="strip-icon-thumb"
                :title="`Artwork #${idx + 1}`"
              />
              <span v-if="card.icons.length > 8" class="strip-more-badge">+{{ card.icons.length - 8 }}</span>
            </div>
          </div>
          <button class="m3-btn m3-btn-tonal btn-xs browse-art-btn" @click.stop="openCatGallery">
            🎨 {{ isGerman ? '18 Artworks ansehen' : 'View 18 Artworks' }}
          </button>
        </div>

        <!-- Deck Sources Badges -->
        <div class="deck-sources-bar">
          <span class="sources-label">{{ isGerman ? 'Aus:' : 'From:' }}</span>
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
              v-for="c in getSortedDeckCards(deck.cards)" 
              :key="c.slug" 
              class="deck-card-row"
              :class="{ 'is-excluded': isCardExcluded(c.slug) }"
            >
              <div class="row-left" @click="$emit('inspect-card', c.slug)">
                <img v-if="c.icons && c.icons[0]" :src="c.icons[0]" :alt="formatCardName(c.slug, c.name)" class="row-icon" />
                <div class="row-info">
                  <span class="row-name">{{ formatCardName(c.slug, c.name) }}</span>
                  <span class="row-desc">{{ formatCardDesc(c.slug, c.shortDesc) }}</span>
                </div>
              </div>

              <div class="row-right">
                <span class="row-pool">{{ isGerman ? 'Im Deck:' : 'Deck has:' }} {{ c.quantity }}</span>
                <button 
                  class="m3-chip"
                  :class="{ active: !isCardExcluded(c.slug) }"
                  @click="toggleCardExclude(c.slug, availablePool[c.slug]?.totalAvailable || c.quantity)"
                >
                  {{ isCardExcluded(c.slug) ? (isGerman ? 'Ausgeschlossen' : 'Excluded') : (isGerman ? 'Aktiv' : 'Active') }}
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
        {{ isGerman ? '← Zurück zu Decks' : '← Back to Decks' }}
      </button>

      <button class="m3-btn m3-btn-primary" @click="$emit('continue')">
        <span class="btn-text-desktop">{{ isGerman ? 'Synergien & Regeln prüfen' : 'Review Synergies & Rules' }} ({{ suggestionsCount }}) →</span>
        <span class="btn-text-mobile">{{ isGerman ? 'Synergien prüfen' : 'Review Synergies' }} ({{ suggestionsCount }}) →</span>
      </button>
    </div>

    <!-- Cat Artworks Archive Modal -->
    <CatArtworkModal
      :is-open="isCatModalOpen"
      :owned-deck-ids="ownedDeckIds"
      @close="isCatModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CatArtworkModal from './CatArtworkModal.vue';
import { getCardDisplayName, getCardDisplayDesc, getCategoryDisplayName } from '../data/translations.js';

const isCatModalOpen = ref(false);
const openCatGallery = () => {
  isCatModalOpen.value = true;
};

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
  suggestionsCount: { type: Number, default: 0 },
  currentLang: { type: String, default: 'en' }
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

const isGerman = computed(() => props.currentLang === 'de');

const formatCardName = (slug, defaultName) => getCardDisplayName(slug, defaultName, props.currentLang);
const formatCardDesc = (slug, defaultDesc) => getCardDisplayDesc(slug, defaultDesc, props.currentLang);
const formatCategoryName = (catId, defaultName) => getCategoryDisplayName(catId, defaultName, props.currentLang);

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

const sortMode = ref('name-asc'); // ALWAYS default to 'name-asc' (A-Z)

const sortOptions = computed(() => [
  { id: 'name-asc', label: isGerman.value ? 'Name (A → Z)' : 'Name (A → Z)', icon: '🔤' },
  { id: 'name-desc', label: isGerman.value ? 'Name (Z → A)' : 'Name (Z → A)', icon: '🔤' },
  { id: 'category', label: isGerman.value ? 'Kategorie' : 'Category', icon: '🏷️' },
  { id: 'qty-desc', label: isGerman.value ? 'Menge (Viel-Wenig)' : 'Qty (High-Low)', icon: '🔢' }
]);

const currentSortOption = computed(() => {
  return sortOptions.value.find(o => o.id === sortMode.value) || sortOptions.value[0];
});

const cycleSortMode = () => {
  const currentIndex = sortOptions.value.findIndex(o => o.id === sortMode.value);
  const nextIndex = (currentIndex + 1) % sortOptions.value.length;
  sortMode.value = sortOptions.value[nextIndex].id;
};

const sortCardList = (list) => {
  return [...list].sort((a, b) => {
    const nameA = formatCardName(a.slug, a.name);
    const nameB = formatCardName(b.slug, b.name);
    if (sortMode.value === 'name-asc') {
      return nameA.localeCompare(nameB);
    }
    if (sortMode.value === 'name-desc') {
      return nameB.localeCompare(nameA);
    }
    if (sortMode.value === 'qty-desc') {
      const qtyA = a.totalAvailable !== undefined ? a.totalAvailable : (a.quantity || 0);
      const qtyB = b.totalAvailable !== undefined ? b.totalAvailable : (b.quantity || 0);
      if (qtyA !== qtyB) return qtyB - qtyA;
      return nameA.localeCompare(nameB);
    }
    if (sortMode.value === 'category') {
      if (a.category !== b.category) {
        return (a.category || '').localeCompare(b.category || '');
      }
      return nameA.localeCompare(nameB);
    }
    return 0;
  });
};

const unifiedCardList = computed(() => {
  return Object.values(props.availablePool).sort((a, b) => a.name.localeCompare(b.name));
});

const getSortedDeckCards = (cards) => {
  return sortCardList(cards || []);
};

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

  return sortCardList(list);
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

.sort-control-block {
  display: flex;
  align-items: center;
}

.sort-chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-full);
  padding: 8px 16px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.sort-chip-btn:hover {
  background-color: var(--md-sys-color-surface-container-high);
  border-color: var(--md-sys-color-primary);
  transform: translateY(-1px);
}

.sort-chip-btn .sort-cycle-hint {
  font-size: 0.75rem;
  opacity: 0.7;
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

.cat-variants-strip {
  background: rgba(255, 180, 160, 0.08);
  border: 1px solid rgba(255, 180, 160, 0.2);
  border-radius: var(--md-shape-sm);
  padding: 8px 10px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.cat-variants-strip-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strip-label {
  font-size: 0.72rem;
  color: #ffb4a0;
  font-weight: 600;
}

.strip-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.strip-icon-thumb {
  width: 24px;
  height: 24px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 2px;
}

.strip-more-badge {
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 9999px;
  padding: 2px 5px;
}

.browse-art-btn {
  font-size: 0.72rem;
  padding: 4px 8px;
  background: rgba(255, 180, 160, 0.15);
  color: #ffb4a0;
  border: 1px solid rgba(255, 180, 160, 0.3);
}

.browse-art-btn:hover {
  background: rgba(255, 180, 160, 0.3);
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
  min-width: 0;
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
  min-width: 0;
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
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 10px;
  margin-top: 16px;
}

.deck-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
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
  flex: 1;
  min-width: 0;
}

.row-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

.row-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
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
  flex-shrink: 0;
}

.row-pool {
  font-size: 0.75rem;
  color: var(--md-sys-color-outline);
  white-space: nowrap;
}

/* Bottom Navigation */
.config-bottom-nav {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.btn-text-desktop {
  display: inline;
}

.btn-text-mobile {
  display: none;
}

@media (max-width: 768px) {
  .controls-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  .sort-control-block {
    width: 100%;
  }
  .sort-chip-btn {
    width: 100%;
    justify-content: space-between;
  }
  .view-mode-toggle {
    width: 100%;
    display: flex;
  }
  .mode-btn {
    flex: 1;
    text-align: center;
  }
  .category-pills-row {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
}

@media (max-width: 640px) {
  .card-configurator-section {
    padding: 16px 12px calc(60px + env(safe-area-inset-bottom, 20px)) 12px;
  }
  .panel-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .player-chips {
    overflow-x: auto;
    width: 100%;
    padding-bottom: 6px;
    -webkit-overflow-scrolling: touch;
  }
  .pool-validation-banner {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .quick-bulk-actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .quick-bulk-actions .btn-xs {
    flex: 1;
    text-align: center;
  }
  .cards-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .card-item {
    padding: 14px;
  }
  .cat-variants-strip {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .cat-variants-strip-left {
    width: 100%;
    overflow-x: auto;
  }
  .browse-art-btn {
    width: 100%;
    justify-content: center;
  }
  .card-item-footer {
    flex-wrap: wrap;
    gap: 10px;
  }
  .qty-stepper {
    flex: 1;
    justify-content: space-between;
  }
  .toggle-exclude-btn {
    flex: 1;
    text-align: center;
  }
  .deck-cards-list {
    grid-template-columns: minmax(0, 1fr);
  }
  .deck-accordion-header {
    padding: 14px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .deck-acc-left {
    flex: 1 1 100%;
    gap: 12px;
  }
  .deck-acc-logo {
    height: 40px;
    max-width: 64px;
    flex-shrink: 0;
  }
  .deck-acc-name {
    font-size: 1rem;
  }
  .deck-acc-right {
    flex: 1 1 100%;
    justify-content: space-between;
  }
  .deck-accordion-body {
    padding: 0 10px 14px 10px;
  }
  .deck-card-row {
    padding: 8px 10px;
  }
  .row-pool {
    display: none;
  }
  .config-bottom-nav {
    flex-direction: column-reverse;
    gap: 12px;
    align-items: stretch;
  }
  .config-bottom-nav .m3-btn {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
  }
  .btn-text-desktop {
    display: none;
  }
  .btn-text-mobile {
    display: inline;
  }
}
</style>
