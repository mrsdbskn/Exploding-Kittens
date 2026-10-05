<template>
  <nav class="quick-step-pill" aria-label="Fast Step Navigation">
    <button 
      v-for="s in steps" 
      :key="s.id"
      class="step-pill-btn"
      :class="{ 'is-active': currentStep === s.id }"
      :title="s.fullName"
      @click="onSelectStep(s.id)"
    >
      <!-- Step Icon -->
      <span class="step-icon">{{ s.icon }}</span>

      <!-- Step Number (on compact/mobile inactive states) -->
      <span class="step-num">{{ s.number }}</span>

      <!-- Step Label (visible on desktop or active on mobile) -->
      <span class="step-label">{{ s.label }}</span>

      <!-- Step 3 Synergy Warning / Error Badge -->
      <span 
        v-if="s.id === 'synergies' && suggestionsCount > 0" 
        class="step-badge"
        :class="hasErrors ? 'badge-error' : 'badge-warning'"
      >
        {{ hasErrors ? '!' : suggestionsCount }}
      </span>

      <!-- Step 4 Ready Checkmark Badge -->
      <span 
        v-else-if="s.id === 'recipe' && recipeComplete" 
        class="step-badge badge-success"
      >
        ✓
      </span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentStep: {
    type: String,
    required: true
  },
  suggestionsCount: {
    type: Number,
    default: 0
  },
  hasErrors: {
    type: Boolean,
    default: false
  },
  recipeComplete: {
    type: Boolean,
    default: false
  },
  currentLang: {
    type: String,
    default: 'en'
  }
});

const emit = defineEmits(['update:step']);

const steps = computed(() => {
  const isDe = props.currentLang === 'de';
  return [
    {
      id: 'decks',
      number: '1',
      icon: '📦',
      label: isDe ? 'Decks' : 'Decks',
      fullName: isDe ? 'Schritt 1: Decks auswählen' : 'Step 1: Choose Decks'
    },
    {
      id: 'cards',
      number: '2',
      icon: '🃏',
      label: isDe ? 'Karten' : 'Cards',
      fullName: isDe ? 'Schritt 2: Kartenpool & Spieler' : 'Step 2: Cards & Players'
    },
    {
      id: 'synergies',
      number: '3',
      icon: '⚡',
      label: isDe ? 'Synergien' : 'Synergies',
      fullName: isDe ? 'Schritt 3: Synergien prüfen' : 'Step 3: Review Synergies'
    },
    {
      id: 'recipe',
      number: '4',
      icon: '📜',
      label: isDe ? 'Rezept' : 'Recipe',
      fullName: isDe ? 'Schritt 4: Deck-Rezept & Anleitung' : 'Step 4: Deck Recipe'
    }
  ];
});

const onSelectStep = (stepId) => {
  emit('update:step', stepId);
};
</script>

<style scoped>
.quick-step-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 6px;
  background: rgba(22, 27, 39, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--md-shape-full, 9999px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  user-select: none;
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.step-pill-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--md-shape-full, 9999px);
  border: none;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant, #cac4d0);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  position: relative;
  white-space: nowrap;
  outline: none;
}

.step-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.step-num {
  display: none;
  font-size: 0.78rem;
  font-weight: 700;
  opacity: 0.75;
}

.step-label {
  display: inline-block;
  line-height: 1.2;
}

.step-pill-btn:hover:not(.is-active) {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transform: translateY(-1px);
}

.step-pill-btn.is-active {
  background: linear-gradient(135deg, #ff7559 0%, #ff5449 100%);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(255, 84, 73, 0.4);
  font-weight: 700;
}

/* Badges */
.step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 800;
  line-height: 1;
  margin-left: 2px;
}

.badge-warning {
  background: #ffd978;
  color: #3f2e00;
}

.badge-error {
  background: #ffb4ab;
  color: #690005;
  animation: pulseBadge 1.8s infinite;
}

.badge-success {
  background: #bbf2c8;
  color: #05461c;
  font-weight: 900;
}

@keyframes pulseBadge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.18); }
}

/* Responsive Mobile Layout: keeps pill super compact next to the chatbot */
@media (max-width: 640px) {
  .quick-step-pill {
    padding: 3px 4px;
    gap: 3px;
  }

  .step-pill-btn {
    padding: 6px 9px;
    gap: 4px;
    font-size: 0.75rem;
  }

  /* On mobile inactive steps: show icon + number */
  .step-pill-btn:not(.is-active) .step-label {
    display: none;
  }

  .step-pill-btn:not(.is-active) .step-num {
    display: inline-block;
  }

  /* On mobile active step: show icon + label */
  .step-pill-btn.is-active .step-num {
    display: none;
  }

  .step-pill-btn.is-active .step-label {
    display: inline-block;
  }

  .step-icon {
    font-size: 0.85rem;
  }

  .step-badge {
    min-width: 15px;
    height: 15px;
    font-size: 0.6rem;
    padding: 0 3px;
  }
}
</style>
