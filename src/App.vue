<template>
  <div class="app-root">
    <!-- Header Navigation -->
    <HeaderNav 
      :current-step="currentStep"
      :owned-count="ownedDeckIds.length"
      :total-owned-cards="totalOwnedCards"
      :excluded-count="excludedCards.size"
      :suggestions-count="deckRecipe.suggestions.length"
      :has-errors="hasErrors"
      :recipe-complete="isRecipeComplete"
      @update:step="setStep"
      @open-instructions="showInstructionsModal = true"
      @open-presets="showPresetModal = true"
      @open-companion="showCompanionModal = true"
      @open-codex="showCodexModal = true"
      @open-custom-studio="showCustomRecipeModal = true"
      @reset-all="resetAll"
    />

    <!-- Main Dynamic Step Views -->
    <main class="main-content">
      <!-- Step 1: Owned Decks -->
      <DeckSelector 
        v-if="currentStep === 'decks'"
        :decks="DECKS"
        :owned-deck-ids="ownedDeckIds"
        @update:owned-decks="handleUpdateOwnedDecks"
        @continue="setStep('cards')"
        @inspect-card="inspectCard"
      />

      <!-- Step 2: Card Exclusions & Player Count -->
      <CardConfigurator 
        v-else-if="currentStep === 'cards'"
        :decks="DECKS"
        :owned-deck-ids="ownedDeckIds"
        :available-pool="deckRecipe.availablePool"
        :custom-quantities="customQuantities"
        :excluded-cards="excludedCards"
        :categories="CATEGORIES"
        :player-count="playerCount"
        :starting-hand-non-defuse="startingHandNonDefuse"
        :can-deal-full-hands="deckRecipe.canDealFullHands"
        :cards-shortage="deckRecipe.cardsShortage"
        :starter-hand-total-cards="deckRecipe.starterHandTotalCards"
        :starter-defuses-needed="deckRecipe.starterDefusesNeeded"
        :total-draw-pile-size="deckRecipe.totalDrawPileSize"
        :exploding-kittens-needed="deckRecipe.explodingKittensNeeded"
        :suggestions-count="deckRecipe.suggestions.length"
        @update:player-count="p => playerCount = p"
        @update:hand-size="h => startingHandNonDefuse = h"
        @update:custom-quantities="q => customQuantities = q"
        @update:excluded-cards="s => excludedCards = s"
        @inspect-card="inspectCard"
        @include-all="includeAllCards"
        @toggle-cat-cards="toggleCatCards"
        @back="setStep('decks')"
        @continue="setStep('synergies')"
      />

      <!-- Step 3: Synergy Harmonizer & Dependency Rules -->
      <SynergyAlerts 
        v-else-if="currentStep === 'synergies'"
        :suggestions="deckRecipe.suggestions"
        :catalog="ALL_CARDS_CATALOG"
        :player-count="playerCount"
        @apply-action="handleApplySuggestionAction"
        @resolve-all="resolveAllSuggestions"
        @inspect-card="inspectCard"
        @back="setStep('cards')"
        @continue="setStep('recipe')"
      />

      <!-- Step 4: Deck Recipe & Assembly Guide -->
      <DeckRecipeOutput 
        v-else-if="currentStep === 'recipe'"
        :recipe="deckRecipe"
        :catalog="ALL_CARDS_CATALOG"
        :categories="CATEGORIES"
        :danger-settings="dangerSettings"
        :danger-previews="dangerPreviews"
        @update:danger="handleUpdateDanger"
        @inspect-card="inspectCard"
        @back="setStep('synergies')"
        @restart="setStep('decks')"
      />
    </main>

    <!-- Card Detail Modal -->
    <CardDetailModal 
      v-if="inspectedCard"
      :card="inspectedCard"
      @close="inspectedCardSlug = null"
    />

    <!-- Presets & Official Recipes Modal -->
    <PresetModal 
      v-if="showPresetModal"
      :official-recipes="OFFICIAL_RECIPES"
      :current-config="{
        playerCount,
        ownedDeckIds,
        customQuantities,
        excludedCards
      }"
      @close="showPresetModal = false"
      @load-preset="handleLoadPreset"
    />

    <!-- Instructions & Embedded Rulebooks Modal -->
    <InstructionsModal 
      v-if="showInstructionsModal"
      @close="showInstructionsModal = false"
    />

    <!-- Live Game Night Companion & Timer Modal (Features 5, 7, 8) -->
    <GameCompanionModal 
      :is-open="showCompanionModal"
      :player-count="playerCount"
      :has-dead-player-cards="deckRecipe.isZombieDeckMode || deckRecipe.drawPileCards?.some(c => ['attack-of-the-dead', 'feed-the-dead', 'grave-robber'].includes(c.slug))"
      @close="showCompanionModal = false"
    />

    <!-- Card Lore & Rules Codex Modal (Feature 6) -->
    <CardLoreCodexModal 
      :is-open="showCodexModal"
      :initial-card-slug="inspectedCardSlug"
      @close="showCodexModal = false"
    />

    <!-- Custom Recipe Studio & Bookmarks Modal (Features 2, 10) -->
    <CustomRecipeModal 
      :is-open="showCustomRecipeModal"
      :current-config="{
        playerCount,
        ownedDeckIds,
        customQuantities,
        excludedCards
      }"
      @close="showCustomRecipeModal = false"
      @load-custom-recipe="handleLoadCustomRecipe"
    />

    <!-- Interactive Kitten Rules Referee Chatbot -->
    <RulesBotDrawer 
      :lift-above-bar="currentStep === 'decks'"
      @open-instructions="showInstructionsModal = true"
      @inspect-card="inspectCard"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { DECKS, ALL_CARDS_CATALOG, CATEGORIES, OFFICIAL_RECIPES } from './data/decksData.js';
import { calculateDeckRecipe } from './utils/deckEngine.js';
import { calculateDeckProbabilities } from './utils/probabilityEngine.js';
import { DANGER_PRESETS, settingsFromPreset } from './utils/dangerPresets.js';

import HeaderNav from './components/HeaderNav.vue';
import DeckSelector from './components/DeckSelector.vue';
import CardConfigurator from './components/CardConfigurator.vue';
import SynergyAlerts from './components/SynergyAlerts.vue';
import DeckRecipeOutput from './components/DeckRecipeOutput.vue';
import CardDetailModal from './components/CardDetailModal.vue';
import PresetModal from './components/PresetModal.vue';
import InstructionsModal from './components/InstructionsModal.vue';
import RulesBotDrawer from './components/RulesBotDrawer.vue';
import GameCompanionModal from './components/GameCompanionModal.vue';
import CardLoreCodexModal from './components/CardLoreCodexModal.vue';
import CustomRecipeModal from './components/CustomRecipeModal.vue';

// Navigation state
const currentStep = ref('decks');

// Configuration state
const ownedDeckIds = ref(['exploding-kittens-original-edition']);
const playerCount = ref(4);
const startingHandNonDefuse = ref(7);
const customQuantities = ref({});
const excludedCards = ref(new Set());
const streakingAddsEK = ref(true);
const implodingReplacesEK = ref(true);
const extraDefusesInDeck = ref(2);

// Danger Adjuster (Hazard Volatility) levers
const bonusExplodingKittens = ref(0);
const drawPileSafeRatio = ref(1);
const dangerPreset = ref('balanced');

// Modals
const inspectedCardSlug = ref(null);
const showPresetModal = ref(false);
const showInstructionsModal = ref(false);
const showCompanionModal = ref(false);
const showCodexModal = ref(false);
const showCustomRecipeModal = ref(false);

const handleLoadCustomRecipe = (recipe) => {
  if (recipe.config) {
    if (Array.isArray(recipe.config.ownedDeckIds) && recipe.config.ownedDeckIds.length > 0) {
      ownedDeckIds.value = recipe.config.ownedDeckIds;
    }
    if (recipe.config.playerCount) playerCount.value = recipe.config.playerCount;
    if (recipe.config.customQuantities) customQuantities.value = recipe.config.customQuantities;
    if (Array.isArray(recipe.config.excludedCards)) {
      excludedCards.value = new Set(recipe.config.excludedCards);
    }
    currentStep.value = 'cards';
  }
};

// LocalStorage persistence
onMounted(() => {
  try {
    const saved = localStorage.getItem('ek_saved_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.ownedDeckIds) && parsed.ownedDeckIds.length > 0) {
        ownedDeckIds.value = parsed.ownedDeckIds;
      }
      if (parsed.playerCount) playerCount.value = parsed.playerCount;
      if (parsed.startingHandNonDefuse) startingHandNonDefuse.value = parsed.startingHandNonDefuse;
      if (parsed.customQuantities) customQuantities.value = parsed.customQuantities;
      if (Array.isArray(parsed.excludedCards)) {
        excludedCards.value = new Set(parsed.excludedCards);
      }
      if (parsed.danger) {
        const d = parsed.danger;
        if (typeof d.extraDefuses === 'number') extraDefusesInDeck.value = d.extraDefuses;
        if (typeof d.bonusEK === 'number') bonusExplodingKittens.value = d.bonusEK;
        if (typeof d.safeRatio === 'number') drawPileSafeRatio.value = d.safeRatio;
        if (typeof d.implodingReplacesEK === 'boolean') implodingReplacesEK.value = d.implodingReplacesEK;
        if (d.preset) dangerPreset.value = d.preset;
      }
    }
  } catch (e) {
    console.warn('Could not restore from localStorage', e);
  }
});

// Auto-save state
watch([
  ownedDeckIds, playerCount, startingHandNonDefuse, customQuantities, excludedCards,
  extraDefusesInDeck, bonusExplodingKittens, drawPileSafeRatio, implodingReplacesEK, dangerPreset
], () => {
  try {
    const payload = {
      ownedDeckIds: ownedDeckIds.value,
      playerCount: playerCount.value,
      startingHandNonDefuse: startingHandNonDefuse.value,
      customQuantities: customQuantities.value,
      excludedCards: Array.from(excludedCards.value),
      danger: dangerSettings.value
    };
    localStorage.setItem('ek_saved_config', JSON.stringify(payload));
  } catch (e) {
    // LocalStorage error ignore
  }
}, { deep: true });

// Total owned cards pool
const totalOwnedCards = computed(() => {
  let count = 0;
  for (const d of DECKS) {
    if (ownedDeckIds.value.includes(d.id)) {
      count += d.totalCards;
    }
  }
  return count;
});

// Current Danger Adjuster settings (single object passed to Step 4)
const dangerSettings = computed(() => ({
  preset: dangerPreset.value,
  extraDefuses: extraDefusesInDeck.value,
  bonusEK: bonusExplodingKittens.value,
  safeRatio: drawPileSafeRatio.value,
  implodingReplacesEK: implodingReplacesEK.value
}));

const buildRecipe = (overrides = {}) => calculateDeckRecipe({
  ownedDeckIds: ownedDeckIds.value,
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  customQuantities: customQuantities.value,
  excludedCards: excludedCards.value,
  playerCount: playerCount.value,
  startingHandNonDefuse: startingHandNonDefuse.value,
  implodingReplacesEK: implodingReplacesEK.value,
  streakingAddsEK: streakingAddsEK.value,
  extraDefusesInDeck: extraDefusesInDeck.value,
  bonusExplodingKittens: bonusExplodingKittens.value,
  drawPileSafeRatio: drawPileSafeRatio.value,
  ...overrides
});

// Main Deck Recipe calculation
const deckRecipe = computed(() => buildRecipe());

// Live predicted volatility for each Danger Adjuster preset
const dangerPreviews = computed(() => {
  if (currentStep.value !== 'recipe') return {};
  const out = {};
  for (const p of DANGER_PRESETS) {
    const r = buildRecipe({
      extraDefusesInDeck: p.extraDefuses,
      bonusExplodingKittens: p.bonusEK,
      drawPileSafeRatio: p.safeRatio,
      implodingReplacesEK: p.implodingReplacesEK
    });
    const prob = calculateDeckProbabilities(r);
    out[p.id] = {
      score: prob.volatilityScore,
      color: prob.dangerColor,
      drawPileSize: r.totalDrawPileSize,
      turn1: prob.turn1HazardChance
    };
  }
  return out;
});

const handleUpdateDanger = (settings) => {
  if (settings.preset && settings.preset !== 'custom' && !('extraDefuses' in settings)) {
    settings = settingsFromPreset(settings.preset);
  }
  if (typeof settings.extraDefuses === 'number') extraDefusesInDeck.value = Math.max(0, settings.extraDefuses);
  if (typeof settings.bonusEK === 'number') bonusExplodingKittens.value = Math.max(0, settings.bonusEK);
  if (typeof settings.safeRatio === 'number') drawPileSafeRatio.value = Math.max(0.3, Math.min(1, settings.safeRatio));
  if (typeof settings.implodingReplacesEK === 'boolean') implodingReplacesEK.value = settings.implodingReplacesEK;
  dangerPreset.value = settings.preset || 'custom';
};

const hasErrors = computed(() => {
  return deckRecipe.value.suggestions.some(s => s.type === 'error');
});

const isRecipeComplete = computed(() => {
  return deckRecipe.value.canDealFullHands && !hasErrors.value;
});

const inspectedCard = computed(() => {
  if (!inspectedCardSlug.value) return null;
  return ALL_CARDS_CATALOG[inspectedCardSlug.value] || null;
});

const setStep = (step) => {
  currentStep.value = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const inspectCard = (slug) => {
  inspectedCardSlug.value = slug;
};

const handleUpdateOwnedDecks = (newOwned) => {
  ownedDeckIds.value = newOwned;
};

// Suggestions 1-click apply action handler
const handleApplySuggestionAction = (suggestion) => {
  const { actionType, actionPayload } = suggestion;

  if (actionType === 'SET_QUANTITY') {
    const { slug, qty } = actionPayload;
    const nextCustom = { ...customQuantities.value, [slug]: qty };
    const nextSet = new Set(excludedCards.value);
    if (qty > 0) {
      nextSet.delete(slug);
    } else {
      nextSet.add(slug);
    }
    customQuantities.value = nextCustom;
    excludedCards.value = nextSet;
  } else if (actionType === 'EXCLUDE') {
    const { slug } = actionPayload;
    const nextSet = new Set(excludedCards.value);
    nextSet.add(slug);
    excludedCards.value = nextSet;
  } else if (actionType === 'EXCLUDE_DEAD_CARDS') {
    const { slugs } = actionPayload;
    const nextSet = new Set(excludedCards.value);
    for (const s of slugs) {
      nextSet.add(s);
    }
    excludedCards.value = nextSet;
  } else if (actionType === 'TOGGLE_STREAKING_RULE') {
    streakingAddsEK.value = actionPayload.enabled;
  } else if (actionType === 'TOGGLE_IMPLODING_MODE') {
    implodingReplacesEK.value = actionPayload.replaces;
    dangerPreset.value = 'custom';
  } else if (actionType === 'ADD_FERAL_CATS') {
    const { slug, qty } = actionPayload;
    const nextCustom = { ...customQuantities.value, [slug]: qty };
    const nextSet = new Set(excludedCards.value);
    nextSet.delete(slug);
    customQuantities.value = nextCustom;
    excludedCards.value = nextSet;
  }
};

const resolveAllSuggestions = () => {
  for (const s of deckRecipe.value.suggestions) {
    if (s.actionType && s.actionType !== 'INFO') {
      handleApplySuggestionAction(s);
    }
  }
};

const includeAllCards = () => {
  excludedCards.value = new Set();
  customQuantities.value = {};
};

const toggleCatCards = () => {
  const nextSet = new Set(excludedCards.value);
  if (nextSet.has('cat-card')) {
    nextSet.delete('cat-card');
  } else {
    nextSet.add('cat-card');
  }
  excludedCards.value = nextSet;
};

const resetAll = () => {
  if (confirm('Reset your configuration to default original deck?')) {
    ownedDeckIds.value = ['exploding-kittens-original-edition'];
    playerCount.value = 4;
    startingHandNonDefuse.value = 7;
    customQuantities.value = {};
    excludedCards.value = new Set();
    handleUpdateDanger(settingsFromPreset('balanced'));
    currentStep.value = 'decks';
  }
};

// Preset Loader
const handleLoadPreset = ({ type, recipe, custom }) => {
  if (type === 'official' && recipe) {
    // Add required target decks if not owned
    const requiredDecks = recipe.targetDecks || [];
    const merged = Array.from(new Set([...ownedDeckIds.value, ...requiredDecks]));
    ownedDeckIds.value = merged;
    playerCount.value = recipe.minPlayers || 4;

    // Apply specific card counts
    const nextCustom = {};
    const nextSet = new Set();

    // If cardCounts is specified, configure them
    if (recipe.cardCounts) {
      for (const slug in recipe.cardCounts) {
        nextCustom[slug] = recipe.cardCounts[slug];
      }
    }
    customQuantities.value = nextCustom;
    excludedCards.value = nextSet;
    showPresetModal.value = false;
    currentStep.value = 'recipe';
  } else if (type === 'custom' && custom) {
    ownedDeckIds.value = [...(custom.ownedDeckIds || ['exploding-kittens-original-edition'])];
    playerCount.value = custom.playerCount || 4;
    customQuantities.value = { ...(custom.customQuantities || {}) };
    excludedCards.value = new Set(custom.excludedCards || []);
    showPresetModal.value = false;
    currentStep.value = 'recipe';
  }
};
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}
</style>
