<template>
  <div v-if="card" class="modal-backdrop animate-fade-in" @click.self="$emit('close')">
    <div class="m3-card modal-container animate-pop-in">
      <!-- Modal Close Button -->
      <button class="close-btn" @click="$emit('close')">✕</button>

      <!-- Modal Header -->
      <div class="modal-header">
        <div class="icons-showcase">
          <div 
            v-for="(icon, idx) in card.icons" 
            :key="idx" 
            class="artwork-thumb"
            :class="{ active: activeIconIndex === idx }"
            @click="activeIconIndex = idx"
          >
            <img :src="icon" :alt="card.name" class="modal-thumb-img" />
          </div>
        </div>

        <div class="modal-hero-info">
          <span class="m3-badge m3-badge-primary cat-badge">
            {{ formatCategory(card.category) }}
          </span>
          <h2 class="modal-card-name">{{ card.name }}</h2>
          <p class="modal-short-desc">{{ card.shortDesc }}</p>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Decks Providing this Card -->
        <div class="detail-section">
          <h4 class="section-title">📦 Featured in Decks</h4>
          <div class="decks-list-chips">
            <span 
              v-for="deckSlug in (card.decks || [])" 
              :key="deckSlug" 
              class="m3-chip"
            >
              {{ formatDeckName(deckSlug) }}
            </span>
          </div>
        </div>

        <!-- Official Mechanics & Rules -->
        <div class="detail-section">
          <h4 class="section-title">📜 Official Rules & Mechanics</h4>
          <div class="mechanics-content">
            <p v-if="card.mechanics" class="mechanics-text">
              {{ card.mechanics }}
            </p>
            <p v-else class="mechanics-text">
              Follow instructions printed on the face of the card during your turn before drawing.
            </p>
          </div>
        </div>

        <!-- Strategic Tips & Combinations -->
        <div class="detail-section" v-if="getSynergyTip(card.slug)">
          <h4 class="section-title">💡 Strategic Synergy Tip</h4>
          <div class="synergy-tip-box">
            {{ getSynergyTip(card.slug) }}
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="m3-btn m3-btn-primary" @click="$emit('close')">
          Close Rules
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  card: { type: Object, default: null }
});

defineEmits(['close']);

const activeIconIndex = ref(0);

watch(() => props.card, () => {
  activeIconIndex.value = 0;
});

const formatCategory = (cat) => {
  const map = {
    hazards: '💥 Hazard & Elimination',
    lifesavers: '🛡️ Defuse & Resurrection',
    attacks: '⚔️ Attack & Turn Action',
    vision: '🔮 Intel & Future Manipulation',
    stealing: '😼 Card Stealing & Combos',
    chaos: '🌪️ Deck Chaos & Special',
    defense: '🚫 Nope & Interrupts'
  };
  return map[cat] || cat;
};

const formatDeckName = (slug) => {
  return slug
    .replace('exploding-kittens-', '')
    .replace('-edition', '')
    .replace('-expansion', '')
    .replace(/-/g, ' ')
    .toUpperCase();
};

const getSynergyTip = (slug) => {
  const tips = {
    'barking-kitten': 'Always play with the 2nd Barking Kitten in the deck! If someone else holds the second one, they must defuse or explode immediately.',
    'streaking-kitten': 'Allows you to secretly hold an Exploding Kitten in your hand! If another player tries to steal a card from you blindly and picks your Exploding Kitten, they explode.',
    'armageddon': 'Armageddon initiates the face-off with Godcat and Devilcat. Make sure Godcat is on the playmat before playing.',
    'cat-card': 'Cat cards are powerless alone. Play two matching cats to steal a random card from any player, three matching to name and steal a specific card, or five different cats to pick any card from the discard pile!',
    'feral-cat': 'Acts as a wildcard for ANY cat card, making 2-pair and 3-pair steals significantly easier to achieve.',
    'catomic-bomb': 'Extracts all Exploding Kittens, shuffles the deck, and places them all right on top. Pair with a Skip, Reverse, or Alter the Future to survive!',
    'alter-the-future-3x': 'Strict upgrade over See the Future: allows you to secretly view AND re-order the top 3 cards to set traps for the next player.',
    'bury': 'Allows you to draw a card, peek at it, and secretly bury it back into the draw pile. Great for dodging known hazards or placing defused cards.',
    'tower-of-power': 'You wear the Tower of Power crown filled with stashed cards. Anyone who attempts to steal from your hand must blindly take from the crown instead!'
  };
  return tips[slug] || null;
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
  max-width: 640px;
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
  transform: scale(1.08);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.icons-showcase {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.artwork-thumb {
  width: 76px;
  height: 76px;
  border-radius: var(--md-shape-lg);
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid var(--md-sys-color-outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.artwork-thumb.active {
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 16px rgba(128, 180, 255, 0.35);
}

.modal-thumb-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.modal-hero-info {
  flex: 1;
}

.modal-card-name {
  font-size: 1.625rem;
  font-weight: 800;
  color: #ffffff;
  margin: 6px 0;
  line-height: 1.2;
}

.modal-short-desc {
  font-size: 0.9375rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.4;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--md-sys-color-primary);
}

.decks-list-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mechanics-content {
  background-color: var(--md-sys-color-surface-container-low);
  padding: 16px;
  border-radius: var(--md-shape-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.mechanics-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface);
  white-space: pre-line;
}

.synergy-tip-box {
  background: linear-gradient(135deg, rgba(128, 180, 255, 0.15) 0%, rgba(27, 32, 44, 0.6) 100%);
  border: 1px solid rgba(128, 180, 255, 0.3);
  padding: 14px 18px;
  border-radius: var(--md-shape-md);
  font-size: 0.875rem;
  line-height: 1.5;
  color: #d1e4ff;
}

.modal-footer {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .modal-container {
    padding: 20px;
  }
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
