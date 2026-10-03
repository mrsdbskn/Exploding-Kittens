<template>
  <header class="header-nav">
    <div class="header-container">
      <!-- Brand / Logo -->
      <div class="brand">
        <div class="brand-icon-wrapper">
          <span class="brand-emoji">💣😼</span>
        </div>
        <div class="brand-text">
          <h1 class="brand-title">Exploding Kittens</h1>
          <span class="brand-subtitle">Deck Builder & Recipe Engine</span>
        </div>
      </div>

      <!-- Navigation Tabs (Material 3 Segmented Pills) -->
      <nav class="nav-steps">
        <button 
          v-for="step in steps" 
          :key="step.id"
          class="step-tab"
          :class="{ active: currentStep === step.id }"
          @click="$emit('update:step', step.id)"
        >
          <span class="step-num">{{ step.number }}</span>
          <span class="step-title">{{ step.title }}</span>
          <span v-if="step.badge !== null" class="step-badge" :class="step.badgeClass">
            {{ step.badge }}
          </span>
        </button>
      </nav>

      <!-- Quick Actions -->
      <div class="header-actions">
        <button class="m3-btn m3-btn-tonal btn-sm" @click="$emit('open-instructions')" title="View Embedded Rulebooks">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span class="hide-mobile">Rules</span>
        </button>

        <button class="m3-btn m3-btn-tonal btn-sm" @click="$emit('open-presets')" title="Load Official Recipes">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="M6 6h10"/>
            <path d="M6 10h10"/>
          </svg>
          <span>Recipes</span>
        </button>

        <button class="m3-btn m3-btn-tonal btn-sm" @click="$emit('reset-all')" title="Reset to defaults">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          <span class="hide-mobile">Reset</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentStep: {
    type: String,
    required: true
  },
  ownedCount: {
    type: Number,
    default: 0
  },
  totalOwnedCards: {
    type: Number,
    default: 0
  },
  excludedCount: {
    type: Number,
    default: 0
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
  }
});

defineEmits(['update:step', 'open-presets', 'reset-all']);

const steps = computed(() => [
  {
    id: 'decks',
    number: '1',
    title: 'My Decks',
    badge: props.ownedCount > 0 ? `${props.ownedCount}` : null,
    badgeClass: 'm3-badge-primary'
  },
  {
    id: 'cards',
    number: '2',
    title: 'Cards & Players',
    badge: props.excludedCount > 0 ? `-${props.excludedCount}` : null,
    badgeClass: 'm3-badge-warning'
  },
  {
    id: 'synergies',
    number: '3',
    title: 'Synergies & Rules',
    badge: props.suggestionsCount > 0 ? `${props.suggestionsCount}` : null,
    badgeClass: props.hasErrors ? 'm3-badge-danger' : 'm3-badge-primary'
  },
  {
    id: 'recipe',
    number: '4',
    title: 'Assembly Guide',
    badge: props.recipeComplete ? '✓' : null,
    badgeClass: 'm3-badge-success'
  }
]);
</script>

<style scoped>
.header-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(17, 20, 28, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.header-container {
  max-width: 1380px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--md-shape-md);
  background: linear-gradient(135deg, rgba(255, 117, 89, 0.25), rgba(128, 180, 255, 0.15));
  border: 1px solid rgba(255, 117, 89, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(255, 117, 89, 0.2);
}

.brand-emoji {
  font-size: 22px;
  line-height: 1;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  background: linear-gradient(90deg, #ff7559 0%, #ffb4a9 50%, #80b4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 500;
}

/* Nav steps */
.nav-steps {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--md-sys-color-surface-container-low);
  padding: 4px;
  border-radius: var(--md-shape-full);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.step-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--md-shape-full);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  white-space: nowrap;
}

.step-tab:hover:not(.active) {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
}

.step-tab.active {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.step-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.step-tab.active .step-num {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.step-badge {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 9999px;
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.8125rem;
}

@media (max-width: 900px) {
  .step-title {
    display: none;
  }
  .step-tab {
    padding: 8px 12px;
  }
  .brand-subtitle {
    display: none;
  }
  .hide-mobile {
    display: none;
  }
}

@media (max-width: 600px) {
  .header-container {
    padding: 10px 14px;
  }
  .brand-title {
    font-size: 1rem;
  }
}
</style>
