<template>
  <div class="recipe-output-section animate-fade-in">
    <!-- Top Hero Banner -->
    <div class="recipe-hero">
      <div class="hero-left">
        <h2 class="recipe-title">Step 4: Physical Deck Assembly Guide</h2>
        <p class="recipe-desc">
          Follow these exact step-by-step instructions to assemble your physical deck from your game boxes.
          Tick off each card on the interactive checklist below as you pull it from your collection.
        </p>
      </div>

      <!-- Export & Print Actions -->
      <div class="hero-actions">
        <button class="m3-btn m3-btn-tonal" @click="copyRecipeText">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>{{ copied ? 'Copied to Clipboard!' : 'Copy Recipe' }}</span>
        </button>

        <button class="m3-btn m3-btn-tonal" @click="downloadRecipeJson">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Export JSON</span>
        </button>

        <button class="m3-btn m3-btn-tonal" @click="showSleeveModal = true" title="Card Sleeving & Box Fit Guide">
          🎴 Sleeves & Box
        </button>

        <button class="m3-btn m3-btn-primary" @click="showCompanionModal = true" title="Launch Game Night Companion & Timer">
          🎮 Game Companion
        </button>

        <button class="m3-btn m3-btn-primary" @click="printRecipe">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect width="12" height="8" x="6" y="14"/>
          </svg>
          <span>Print</span>
        </button>
      </div>
    </div>

    <!-- Stats Summary Ribbon -->
    <div class="stats-ribbon m3-card">
      <div class="stat-pill">
        <span class="stat-icon">👥</span>
        <div class="stat-meta">
          <span class="stat-val">{{ recipe.playerCount }}</span>
          <span class="stat-lbl">Players</span>
        </div>
      </div>

      <div class="stat-pill">
        <span class="stat-icon">🃏</span>
        <div class="stat-meta">
          <span class="stat-val">{{ recipe.totalGameCards }}</span>
          <span class="stat-lbl">Total Game Cards</span>
        </div>
      </div>

      <div class="stat-pill">
        <span class="stat-icon">🖐️</span>
        <div class="stat-meta">
          <span class="stat-val">{{ recipe.starterDefusesNeeded + recipe.starterHandTotalCards }}</span>
          <span class="stat-lbl">Dealt to Hands</span>
        </div>
      </div>

      <div class="stat-pill">
        <span class="stat-icon">📚</span>
        <div class="stat-meta">
          <span class="stat-val">{{ recipe.totalDrawPileSize }}</span>
          <span class="stat-lbl">Draw Pile Cards</span>
        </div>
      </div>

      <div class="stat-pill">
        <span class="stat-icon">💥</span>
        <div class="stat-meta">
          <span class="stat-val">{{ totalHazardsCount }}</span>
          <span class="stat-lbl">Hazards (Bombs)</span>
        </div>
      </div>

      <div class="stat-pill">
        <span class="stat-icon">🛡️</span>
        <div class="stat-meta">
          <span class="stat-val">{{ recipe.starterDefusesNeeded }} + {{ recipe.extraDefusesToInsert }}</span>
          <span class="stat-lbl">Defuses (Hand + Deck)</span>
        </div>
      </div>
    </div>

    <!-- Danger Meter & Hazard Probability Simulator (Feature 3) -->
    <div class="danger-meter-card m3-card animate-fade-in" :style="{ '--danger-color': probabilities.dangerColor }">
      <div class="danger-header">
        <div class="danger-left">
          <span class="danger-icon">🎯</span>
          <div>
            <div class="danger-title-row">
              <h3 class="danger-title">Danger Meter & Hazard Volatility</h3>
              <span class="danger-badge" :style="{ backgroundColor: probabilities.dangerColor }">
                {{ probabilities.dangerLevel }}
              </span>
            </div>
            <p class="danger-desc">{{ probabilities.analysisSummary }}</p>
          </div>
        </div>

        <div class="volatility-score-box">
          <span class="volatility-num">{{ probabilities.volatilityScore }}<small>/100</small></span>
          <span class="volatility-lbl">Volatility Score</span>
        </div>
      </div>

      <!-- Probability Metrics -->
      <div class="danger-metrics-row">
        <div class="metric-pill">
          <span class="metric-lbl">Turn 1 Bomb Odds</span>
          <span class="metric-val">{{ probabilities.turn1HazardChance }}%</span>
        </div>
        <div class="metric-pill">
          <span class="metric-lbl">Avg Turn to 1st Bomb</span>
          <span class="metric-val">Turn {{ probabilities.firstBombExpectedTurn }}</span>
        </div>
        <div class="metric-pill">
          <span class="metric-lbl">Draw Pile Hazard Density</span>
          <span class="metric-val">{{ probabilities.hazardCount }} in {{ probabilities.drawPileSize }} cards</span>
        </div>
      </div>

      <!-- Turn-by-Turn Hazard Cumulative Curve -->
      <div class="hazard-curve-wrapper">
        <span class="curve-title">Cumulative Explosion Probability Across Turns 1 - 10:</span>
        <div class="curve-bars-grid">
          <div 
            v-for="pt in probabilities.survivalCurve" 
            :key="pt.turn" 
            class="curve-bar-col"
          >
            <div class="bar-track">
              <div 
                class="bar-fill" 
                :style="{ height: `${Math.max(6, pt.cumulativeExplosionChance)}%` }"
              ></div>
            </div>
            <span class="bar-val">{{ pt.cumulativeExplosionChance }}%</span>
            <span class="bar-turn">T{{ pt.turn }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Assembly Steps Grid -->
    <div class="steps-grid">
      <!-- Step 1: Starting Hands -->
      <div class="m3-card step-card">
        <div class="step-badge-row">
          <span class="step-badge-number">1</span>
          <h3 class="step-card-title">Deal Starting Hands</h3>
        </div>
        <p class="step-card-desc">
          Deal cards face down to each of the <strong>{{ recipe.playerCount }}</strong> players:
        </p>

        <ul class="step-instruction-list">
          <li>
            <span class="bullet-highlight">1x {{ recipe.isZombieDeckMode ? 'Zombie Kitten' : 'Defuse' }}</span>
            to each player ({{ recipe.starterDefusesNeeded }} cards total).
          </li>
          <li>
            <span class="bullet-highlight">{{ recipe.starterHandNonDefuse }}x Action/Cat Cards</span>
            from the safe card pool to each player ({{ recipe.starterHandTotalCards }} cards total).
          </li>
          <li class="result-highlight">
            Each player now holds exactly <strong>{{ recipe.starterHandNonDefuse + 1 }} cards</strong> in hand.
          </li>
        </ul>
      </div>

      <!-- Step 2: Special Stash (If applicable) -->
      <div class="m3-card step-card" :class="{ 'is-muted': recipe.tableStashList.length === 0 }">
        <div class="step-badge-row">
          <span class="step-badge-number">2</span>
          <h3 class="step-card-title">Table Stash & Special Cards</h3>
        </div>
        <p class="step-card-desc">
          Set aside cards placed outside the main draw pile:
        </p>

        <ul class="step-instruction-list" v-if="recipe.tableStashList.length > 0">
          <li v-for="stash in recipe.tableStashList" :key="stash.slug">
            <span class="bullet-highlight">{{ stash.quantity }}x {{ stash.name }}</span>:
            {{ stash.ruleNote }}
          </li>
        </ul>
        <p v-else class="empty-stash-note">
          No special playmat stashes required for this configuration (standard play).
        </p>
      </div>

      <!-- Step 3: Draw Pile Assembly -->
      <div class="m3-card step-card">
        <div class="step-badge-row">
          <span class="step-badge-number">3</span>
          <h3 class="step-card-title">Assemble the Draw Pile</h3>
        </div>
        <p class="step-card-desc">
          Insert hazards and remaining defuses into the remaining safe cards:
        </p>

        <ul class="step-instruction-list">
          <li>
            <span class="bullet-highlight">{{ recipe.safeCardsInDrawPile }}x Safe Cards</span>:
            All remaining action and cat cards.
          </li>
          <li v-for="h in recipe.hazardsList" :key="h.slug">
            <span class="bullet-highlight">{{ h.quantity }}x {{ h.name }}</span>:
            {{ h.ruleNote }}
          </li>
          <li v-if="recipe.extraDefusesToInsert > 0">
            <span class="bullet-highlight">{{ recipe.extraDefusesToInsert }}x Extra Defuse(s)</span>
            shuffled into the draw pile.
          </li>
          <li class="result-highlight">
            Total cards in Draw Pile: <strong>{{ recipe.totalDrawPileSize }} cards</strong>.
          </li>
        </ul>
      </div>

      <!-- Step 4: Shuffle & Start -->
      <div class="m3-card step-card highlight-step">
        <div class="step-badge-row">
          <span class="step-badge-number">4</span>
          <h3 class="step-card-title">Shuffle & Play!</h3>
        </div>
        <p class="step-card-desc">
          You are ready to begin the chaos!
        </p>

        <ul class="step-instruction-list">
          <li>Shuffle the assembled Draw Pile thoroughly.</li>
          <li>Place the Draw Pile face down in the center of the table.</li>
          <li>Establish discard pile area.</li>
          <li>Choose a player to go first. Play proceeds clockwise!</li>
        </ul>
      </div>
    </div>

    <!-- Cat Cards Artwork Breakdown Spotlight Card -->
    <div v-if="recipe.catVariantsBreakdown && recipe.catVariantsBreakdown.length > 0" class="m3-card cat-variants-section animate-fade-in">
      <div class="cat-variants-header">
        <div class="cat-header-left">
          <span class="cat-badge-emoji">😼</span>
          <div>
            <h3 class="cat-spotlight-title">Cat Cards Artwork Breakdown</h3>
            <p class="cat-spotlight-sub">
              Exploding Kittens has 23 unique cat artwork styles. Based on your owned decks, add these exact artwork cards:
            </p>
          </div>
        </div>
        <div class="cat-header-actions">
          <div class="cat-total-badge">
            {{ totalCatCards }} Total Cat Cards ({{ recipe.catVariantsBreakdown.length }} Artwork Styles)
          </div>
          <button class="m3-btn m3-btn-tonal btn-sm" @click="openCatGallery(null)">
            🎨 Browse All 23 Styles
          </button>
        </div>
      </div>

      <div class="cat-variants-grid">
        <div 
          v-for="v in recipe.catVariantsBreakdown" 
          :key="v.slug" 
          class="cat-variant-card"
          @click="openCatGallery(v.slug)"
        >
          <div class="cat-art-thumb-wrapper">
            <img :src="v.icon" :alt="v.name" class="cat-variant-icon" />
            <div class="cat-variant-qty-chip">{{ v.quantity }}x</div>
          </div>
          <div class="cat-variant-meta">
            <span class="cat-variant-name">{{ v.name }}</span>
            <span class="cat-variant-deck">
              {{ v.deckSources?.map(d => d.deckName.replace('Exploding Kittens: ', '').replace('Exploding Kittens ', '')).join(', ') }}
            </span>
          </div>
          <button class="cat-preview-btn" title="View Full Card Artwork" @click.stop="openCatGallery(v.slug)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Artwork</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Card Gathering Checklist -->
    <div class="checklist-section m3-card">
      <div class="checklist-header">
        <div>
          <h3 class="checklist-title">Physical Cards Checklist</h3>
          <p class="checklist-subtitle">
            Gather these cards from your boxes. Check them off as you find them!
          </p>
        </div>

        <!-- Assembly Progress -->
        <div class="progress-container">
          <div class="progress-labels">
            <span class="progress-text">{{ checkedCount }} of {{ totalChecklistCards }} cards assembled</span>
            <span class="progress-percent">{{ progressPercentage }}%</span>
          </div>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill" 
              :style="{ width: `${progressPercentage}%` }"
              :class="{ 'is-complete': progressPercentage === 100 }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Celebration Banner when 100% gathered -->
      <div v-if="progressPercentage === 100" class="complete-celebration animate-pop-in">
        <span class="celebrate-emoji">🎉💥😼</span>
        <div class="celebrate-text">
          <h4>Deck Assembly Complete!</h4>
          <p>All {{ totalChecklistCards }} cards are gathered and ready on the table. Have an explosive game!</p>
        </div>
        <button class="m3-btn m3-btn-primary btn-sm" @click="triggerCelebration">
          Trigger Confetti Again! 🎊
        </button>
      </div>

      <!-- Checklist Grouped by Category -->
      <div class="checklist-categories">
        <div 
          v-for="group in categorizedChecklist" 
          :key="group.categoryId" 
          class="checklist-group"
        >
          <div class="group-header" :style="{ '--group-color': group.color }">
            <span class="group-title">{{ group.categoryName }}</span>
            <span class="group-count">({{ group.totalCardsInGroup }} cards)</span>
          </div>

          <div class="group-items-list">
            <div 
              v-for="item in group.items" 
              :key="item.key"
              class="checklist-item-row"
              :class="{ 'is-checked': checkedItems.has(item.key) }"
              @click="toggleCheckItem(item.key)"
            >
              <div class="check-box" :class="{ checked: checkedItems.has(item.key) }">
                <svg v-if="checkedItems.has(item.key)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <img v-if="item.icon" :src="item.icon" :alt="item.name" class="check-card-icon" />

              <div class="check-card-info">
                <div class="check-card-name-row">
                  <span class="check-card-name">{{ item.name }}</span>
                  <button 
                    v-if="item.isCatVariant" 
                    class="cat-art-tag-btn" 
                    @click.stop="openCatGallery(item.variantSlug)"
                    title="View Full Artwork"
                  >
                    🎨 View Artwork
                  </button>
                </div>
                <span class="check-card-role">{{ item.role }}</span>
              </div>

              <div class="check-card-qty-badge">
                {{ item.quantity }}x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="recipe-bottom-nav">
      <button class="m3-btn m3-btn-tonal" @click="$emit('back')">
        ← Back to Synergies
      </button>

      <button class="m3-btn m3-btn-primary" @click="$emit('restart')">
        Build Another Deck ↺
      </button>
    </div>

    <!-- Cat Artworks Archive Modal -->
    <CatArtworkModal
      :is-open="isCatModalOpen"
      :initial-variant-slug="activeCatVariantSlug"
      :owned-deck-ids="recipe.ownedDeckIds || []"
      @close="isCatModalOpen = false"
    />

    <!-- Card Sleeving & Box Storage Calculator Modal (Feature 9) -->
    <SleeveCalculatorModal
      :is-open="showSleeveModal"
      :total-cards="recipe.totalGameCards"
      :owned-deck-ids="recipe.ownedDeckIds || []"
      @close="showSleeveModal = false"
    />

    <!-- Live Game Night Companion & Timer Modal (Features 5, 7, 8) -->
    <GameCompanionModal
      :is-open="showCompanionModal"
      :player-count="recipe.playerCount"
      :has-dead-player-cards="recipe.isZombieDeckMode || recipe.drawPileCards?.some(c => ['attack-of-the-dead', 'feed-the-dead', 'grave-robber'].includes(c.slug))"
      @close="showCompanionModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import confetti from 'canvas-confetti';
import CatArtworkModal from './CatArtworkModal.vue';
import SleeveCalculatorModal from './SleeveCalculatorModal.vue';
import GameCompanionModal from './GameCompanionModal.vue';
import { calculateDeckProbabilities } from '../utils/probabilityEngine.js';

const props = defineProps({
  recipe: { type: Object, required: true },
  catalog: { type: Object, required: true },
  categories: { type: Array, required: true }
});

defineEmits(['back', 'restart', 'inspect-card']);

const checkedItems = ref(new Set());
const copied = ref(false);

const isCatModalOpen = ref(false);
const activeCatVariantSlug = ref(null);

const showSleeveModal = ref(false);
const showCompanionModal = ref(false);

const probabilities = computed(() => {
  return calculateDeckProbabilities(props.recipe);
});

const openCatGallery = (slug = null) => {
  activeCatVariantSlug.value = slug;
  isCatModalOpen.value = true;
};

const totalHazardsCount = computed(() => {
  return props.recipe.hazardsList.reduce((sum, h) => sum + h.quantity, 0);
});

const totalCatCards = computed(() => {
  return props.recipe.catVariantsBreakdown?.reduce((sum, v) => sum + v.quantity, 0) || 0;
});

// Build list of items to gather
const checklistItems = computed(() => {
  const items = [];

  // 1. Starter Defuses
  if (props.recipe.starterDefusesNeeded > 0) {
    const isZombie = props.recipe.isZombieDeckMode;
    const slug = isZombie ? 'zombie-kitten' : 'defuse';
    items.push({
      key: 'starter-defuse',
      slug,
      name: isZombie ? 'Zombie Kitten' : 'Defuse',
      quantity: props.recipe.starterDefusesNeeded,
      category: 'lifesavers',
      role: 'Hand Deal: 1x to each player',
      icon: props.catalog[slug]?.icons?.[0] || './cards/defuse/defuse.png'
    });
  }

  // 2. Extra Defuses
  if (props.recipe.extraDefusesToInsert > 0) {
    const isZombie = props.recipe.isZombieDeckMode;
    const slug = isZombie ? 'zombie-kitten' : 'defuse';
    items.push({
      key: 'extra-defuse',
      slug,
      name: isZombie ? 'Zombie Kitten (Extra)' : 'Defuse (Extra in Deck)',
      quantity: props.recipe.extraDefusesToInsert,
      category: 'lifesavers',
      role: 'Draw Pile: Insert extra defuses into deck',
      icon: props.catalog[slug]?.icons?.[0] || './cards/defuse/defuse.png'
    });
  }

  // 3. Hazards
  for (const h of props.recipe.hazardsList) {
    items.push({
      key: `hazard-${h.slug}`,
      slug: h.slug,
      name: h.name,
      quantity: h.quantity,
      category: 'hazards',
      role: `Draw Pile: ${h.quantity} inserted after deal`,
      icon: h.icons?.[0] || props.catalog[h.slug]?.icons?.[0]
    });
  }

  // 4. Table Stash
  for (const s of props.recipe.tableStashList) {
    items.push({
      key: `stash-${s.slug}`,
      slug: s.slug,
      name: s.name,
      quantity: s.quantity,
      category: s.category || 'chaos',
      role: 'Playmat Stash: Place face up on table',
      icon: s.icons?.[0] || props.catalog[s.slug]?.icons?.[0]
    });
  }

  // 5. Draw Pile & Hand Safe Cards
  for (const c of props.recipe.drawPileCards) {
    if (c.slug === 'cat-card' && c.variantsBreakdown && c.variantsBreakdown.length > 0) {
      // Expand each cat variant into its own checklist item with its icon!
      for (const v of c.variantsBreakdown) {
        const deckLabel = v.deckSources?.map(s => s.deckName.replace('Exploding Kittens: ', '').replace('Exploding Kittens ', '')).join(', ') || 'owned deck';
        items.push({
          key: `cat-variant-${v.slug}`,
          slug: 'cat-card',
          variantSlug: v.slug,
          name: `${v.name} (Cat Card)`,
          quantity: v.quantity,
          category: 'stealing',
          role: `Combo Pair: Insert ${v.quantity}x (${deckLabel})`,
          icon: v.icon,
          art: v.art,
          isCatVariant: true
        });
      }
    } else {
      items.push({
        key: `safe-${c.slug}`,
        slug: c.slug,
        name: c.name,
        quantity: c.quantity,
        category: c.category || 'chaos',
        role: 'Action Pool: Dealt to hands + Draw pile',
        pawDetailNote: c.pawDetailNote,
        icon: c.icons?.[0] || props.catalog[c.slug]?.icons?.[0]
      });
    }
  }

  return items;
});

const totalChecklistCards = computed(() => {
  return checklistItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const checkedCount = computed(() => {
  let count = 0;
  for (const item of checklistItems.value) {
    if (checkedItems.value.has(item.key)) {
      count += item.quantity;
    }
  }
  return count;
});

const progressPercentage = computed(() => {
  if (totalChecklistCards.value === 0) return 0;
  return Math.round((checkedCount.value / totalChecklistCards.value) * 100);
});

const categorizedChecklist = computed(() => {
  const groups = {};

  for (const cat of props.categories) {
    if (cat.id === 'all') continue;
    groups[cat.id] = {
      categoryId: cat.id,
      categoryName: cat.name,
      color: cat.color,
      items: [],
      totalCardsInGroup: 0
    };
  }

  for (const item of checklistItems.value) {
    const catId = item.category || 'chaos';
    if (!groups[catId]) {
      groups[catId] = {
        categoryId: catId,
        categoryName: 'Special & Twists',
        color: '#ffd248',
        items: [],
        totalCardsInGroup: 0
      };
    }
    groups[catId].items.push(item);
    groups[catId].totalCardsInGroup += item.quantity;
  }

  return Object.values(groups).filter(g => g.items.length > 0);
});

const toggleCheckItem = (key) => {
  const next = new Set(checkedItems.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  checkedItems.value = next;

  if (progressPercentage.value === 100) {
    triggerCelebration();
  }
};

const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (e) {
    // Canvas confetti optional fallback
  }
};

watch(progressPercentage, (newVal) => {
  if (newVal === 100) {
    triggerCelebration();
  }
});

// Copy recipe as text
const copyRecipeText = async () => {
  const r = props.recipe;
  let text = `💥 Exploding Kittens Deck Recipe for ${r.playerCount} Players 💥\n`;
  text += `==============================================\n`;
  text += `Total Cards in Game: ${r.totalGameCards}\n`;
  text += `Starting Hand: 1 Defuse + ${r.starterHandNonDefuse} cards (${r.starterHandNonDefuse + 1} total in hand)\n`;
  text += `Draw Pile Size: ${r.totalDrawPileSize} cards\n`;
  text += `Hazards in Deck: ${r.explodingKittensNeeded} Exploding Kittens\n`;
  text += `Extra Defuses in Draw Pile: ${r.extraDefusesToInsert}\n\n`;
  text += `📋 Card Breakdown:\n`;

  for (const item of checklistItems.value) {
    text += `- ${item.quantity}x ${item.name} (${item.role})\n`;
  }

  text += `\nGenerated with Exploding Kittens Deck Builder`;

  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 3000);
  } catch (err) {
    console.error('Failed to copy', err);
  }
};

// Export JSON
const downloadRecipeJson = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.recipe, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `exploding-kittens-${props.recipe.playerCount}p-recipe.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

const printRecipe = () => {
  window.print();
};
</script>

<style scoped>
.recipe-output-section {
  max-width: 1380px;
  margin: 0 auto;
  padding: 32px 24px 100px 24px;
}

.recipe-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.recipe-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #ffffff 0%, #b6bccd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.recipe-desc {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  max-width: 780px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Stats Ribbon */
.stats-ribbon {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  padding: 20px;
  margin-bottom: 32px;
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-xl);
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-shape-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-icon {
  font-size: 1.75rem;
}

.stat-meta {
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--md-sys-color-primary);
  font-family: var(--font-display);
  line-height: 1.2;
}

.stat-lbl {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 500;
}

/* Steps Grid */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 36px;
}

.step-card {
  padding: 24px;
  border-radius: var(--md-shape-xl);
  display: flex;
  flex-direction: column;
  border: 1.5px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container);
}

.step-card.highlight-step {
  border-color: var(--md-sys-color-primary);
  background: linear-gradient(145deg, rgba(27, 32, 44, 0.9) 0%, rgba(0, 69, 142, 0.25) 100%);
}

.step-card.is-muted {
  opacity: 0.6;
}

.step-badge-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.step-badge-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
}

.step-card-desc {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 14px;
  line-height: 1.5;
}

.step-instruction-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1.5;
}

.bullet-highlight {
  font-weight: 700;
  color: var(--md-sys-color-primary);
}

.result-highlight {
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.empty-stash-note {
  font-size: 0.8125rem;
  color: var(--md-sys-color-outline);
  font-style: italic;
}

/* Checklist Section */
.checklist-section {
  padding: 28px;
  border-radius: var(--md-shape-xl);
  margin-bottom: 36px;
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.checklist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.checklist-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
}

.checklist-subtitle {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
}

.progress-container {
  min-width: 260px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--md-sys-color-on-surface-variant);
}

.progress-percent {
  color: var(--md-sys-color-primary);
  font-weight: 700;
}

.progress-bar-bg {
  width: 100%;
  height: 10px;
  border-radius: var(--md-shape-full);
  background-color: var(--md-sys-color-surface-container-highest);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--md-sys-color-primary) 0%, #a5c8ff 100%);
  border-radius: var(--md-shape-full);
  transition: width 0.3s ease;
}

.progress-bar-fill.is-complete {
  background: linear-gradient(90deg, #75df8a 0%, #93fa9f 100%);
}

/* Complete Celebration Banner */
.complete-celebration {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(0, 83, 36, 0.4) 0%, rgba(27, 32, 44, 0.95) 100%);
  border: 1.5px solid var(--md-sys-color-tertiary);
  border-radius: var(--md-shape-lg);
  margin-bottom: 24px;
}

.celebrate-emoji {
  font-size: 2.2rem;
}

.celebrate-text h4 {
  font-size: 1.125rem;
  color: #ffffff;
  margin-bottom: 2px;
}

.celebrate-text p {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
}

.complete-celebration button {
  margin-left: auto;
}

/* Checklist Groups */
.checklist-categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.checklist-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
  border-bottom: 2px solid var(--group-color, var(--md-sys-color-primary));
}

.group-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--group-color, var(--md-sys-color-primary));
}

.group-count {
  font-size: 0.75rem;
  color: var(--md-sys-color-outline);
}

.group-items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 8px;
}

.checklist-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-shape-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.checklist-item-row:hover {
  background-color: var(--md-sys-color-surface-container-high);
  border-color: rgba(128, 180, 255, 0.2);
}

.checklist-item-row.is-checked {
  background-color: rgba(30, 45, 35, 0.5);
  border-color: rgba(117, 223, 138, 0.3);
}

.checklist-item-row.is-checked .check-card-name {
  text-decoration: line-through;
  opacity: 0.6;
}

.check-box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid var(--md-sys-color-outline);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.check-box.checked {
  background-color: var(--md-sys-color-tertiary);
  border-color: var(--md-sys-color-tertiary);
  color: #000000;
}

.check-card-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

.check-card-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.check-card-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-card-role {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-card-qty-badge {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--md-sys-color-primary);
  background-color: rgba(128, 180, 255, 0.1);
  padding: 4px 8px;
  border-radius: var(--md-shape-sm);
  flex-shrink: 0;
}

.checklist-item-row.is-checked .check-card-qty-badge {
  color: var(--md-sys-color-tertiary);
  background-color: rgba(117, 223, 138, 0.1);
}

/* Cat Variants Spotlight Section */
.cat-variants-section {
  padding: 24px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(235, 115, 80, 0.08), rgba(255, 180, 160, 0.02));
  border: 1px solid rgba(255, 180, 160, 0.25);
  border-radius: var(--md-shape-lg);
}

.cat-variants-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.cat-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cat-badge-emoji {
  font-size: 2rem;
  background-color: rgba(255, 180, 160, 0.15);
  padding: 8px 10px;
  border-radius: var(--md-shape-md);
}

.cat-spotlight-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
}

.cat-spotlight-sub {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
}

.cat-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.cat-total-badge {
  background-color: rgba(255, 180, 160, 0.15);
  color: #ffb4a0;
  border: 1px solid rgba(255, 180, 160, 0.3);
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 9999px;
}

.cat-variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.cat-variant-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--md-shape-md);
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.cat-variant-card:hover {
  transform: translateY(-4px);
  border-color: #ffb4a0;
  background: rgba(255, 180, 160, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.cat-art-thumb-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.cat-variant-icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
  transition: transform 0.2s;
}

.cat-variant-card:hover .cat-variant-icon {
  transform: scale(1.12);
}

.cat-variant-qty-chip {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ffb4a0;
  color: #4a180d;
  font-size: 0.8125rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 9999px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.cat-variant-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 10px;
  width: 100%;
}

.cat-variant-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
}

.cat-variant-deck {
  font-size: 0.72rem;
  color: var(--md-sys-color-on-surface-variant);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cat-preview-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffb4a0;
  border-radius: 9999px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.15s;
}

.cat-preview-btn:hover {
  background: rgba(255, 180, 160, 0.2);
  border-color: #ffb4a0;
}

.check-card-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-art-tag-btn {
  background: rgba(255, 180, 160, 0.12);
  border: 1px solid rgba(255, 180, 160, 0.3);
  color: #ffb4a0;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-art-tag-btn:hover {
  background: rgba(255, 180, 160, 0.25);
  transform: scale(1.05);
}

/* Danger Meter & Probability Card */
.danger-meter-card {
  padding: 22px 24px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(30, 27, 24, 0.9), rgba(24, 20, 18, 0.95));
  border: 1px solid rgba(255, 180, 160, 0.25);
  border-radius: var(--md-shape-lg);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.danger-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.danger-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.danger-icon {
  font-size: 2rem;
  background-color: rgba(255, 180, 160, 0.15);
  padding: 8px 10px;
  border-radius: var(--md-shape-md);
}

.danger-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.danger-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
}

.danger-badge {
  color: #141210;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
}

.danger-desc {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: var(--md-sys-color-on-surface-variant);
}

.volatility-score-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--md-shape-md);
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.volatility-num {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--danger-color, #ffb4a0);
  line-height: 1;
}

.volatility-num small {
  font-size: 0.8rem;
  color: #888;
}

.volatility-lbl {
  font-size: 0.7rem;
  color: #aaa;
  margin-top: 2px;
}

.danger-metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.metric-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-lbl {
  font-size: 0.75rem;
  color: #aaa;
}

.metric-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
}

.hazard-curve-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.25);
  padding: 14px;
  border-radius: 14px;
}

.curve-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffb4a0;
}

.curve-bars-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  align-items: flex-end;
  height: 90px;
}

.curve-bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 4px;
}

.bar-track {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, var(--danger-color, #ffb4a0), #ff5252);
  border-radius: 6px;
  transition: height 0.3s ease;
}

.bar-val {
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
}

.bar-turn {
  font-size: 0.65rem;
  color: #888;
}

/* Bottom Nav */
.recipe-bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
}

@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .header-nav, .hero-actions, .recipe-bottom-nav, .floating-next-bar {
    display: none !important;
  }
  .m3-card {
    background: #ffffff !important;
    border: 1px solid #cccccc !important;
    color: #000000 !important;
    box-shadow: none !important;
  }
  .recipe-title, .step-card-title, .checklist-title, .check-card-name {
    color: #000000 !important;
    -webkit-text-fill-color: initial !important;
  }
}
</style>
