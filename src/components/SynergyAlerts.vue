<template>
  <div class="synergy-alerts-section animate-fade-in">
    <!-- Header -->
    <div class="synergy-header">
      <div class="header-left">
        <h2 class="synergy-title">{{ isGerman ? 'Schritt 3: Synergien & Regel-Harmonisierer' : 'Step 3: Card Synergies & Rule Harmonizer' }}</h2>
        <p class="synergy-desc">
          {{ isGerman
            ? 'Exploding Kittens hat komplexe Kartenmechaniken. Der Harmonisierer prüft Karten, die bestimmte Gegenstücke, Paare oder Regelanpassungen erfordern (wie Barking Kittens, Armageddon & Gottkatze, Streaking Kittens und Zombie-Wiederbelebung).'
            : 'Exploding Kittens has intricate card mechanics. The harmonizer detects cards that require specific pairs, counterparts, or rule adjustments (such as Barking Kittens, Armageddon & Godcat, Streaking Kittens, and Zombie revival).' }}
        </p>
      </div>

      <!-- Auto-Resolve Button -->
      <div v-if="actionableSuggestions.length > 0" class="header-right">
        <button class="m3-btn m3-btn-primary" @click="$emit('resolve-all')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ isGerman ? 'Alle automatisch beheben' : 'Auto-Harmonize All' }} ({{ actionableSuggestions.length }})</span>
        </button>
      </div>
    </div>

    <!-- Status Overview Banner -->
    <div 
      class="m3-card status-banner"
      :class="{
        'has-errors': hasErrors,
        'has-warnings': hasWarnings && !hasErrors,
        'is-clean': suggestions.length === 0
      }"
    >
      <div class="banner-icon-col">
        <span v-if="hasErrors" class="banner-emoji">🚨</span>
        <span v-else-if="hasWarnings" class="banner-emoji">💡</span>
        <span v-else class="banner-emoji">✨</span>
      </div>

      <div class="banner-text-col">
        <h3 class="banner-headline">
          <span v-if="hasErrors">{{ isGerman ? 'Regel-Konflikte erkannt' : 'Rule Conflicts Detected' }}</span>
          <span v-else-if="hasWarnings">{{ suggestions.length }} {{ isGerman ? 'Synergien & Empfehlungen' : 'Synergies & Recommendations' }}</span>
          <span v-else>{{ isGerman ? 'Deck-Harmonie perfekt!' : 'Deck Harmony Complete!' }}</span>
        </h3>
        <p class="banner-subtext">
          <span v-if="hasErrors">
            {{ isGerman ? 'Einigen Karten in deinem aktiven Pool fehlen erforderliche Partnerkarten und sie können nicht wie vorgesehen gespielt werden.' : 'Some cards in your active pool are missing required partner cards and cannot be played as intended.' }}
          </span>
          <span v-else-if="hasWarnings">
            {{ isGerman ? 'Überprüfe die folgenden Vorschläge, um Kartenverhältnisse, Varianten und Erweiterungsmechaniken auszugleichen.' : 'Review the suggestions below to balance your card ratios, variants, and expansion mechanics.' }}
          </span>
          <span v-else>
            {{ isGerman ? 'Alle aktiven Karten haben gültige Paare, Voraussetzungen und korrekte Gefahrenverhältnisse für' : 'All active cards have valid pairs, prerequisites, and correct hazard ratios for' }} {{ playerCount }} {{ isGerman ? 'Spieler.' : 'players.' }}
          </span>
        </p>
      </div>
    </div>

    <!-- Suggestions List -->
    <div v-if="suggestions.length > 0" class="suggestions-list">
      <div 
        v-for="s in suggestions" 
        :key="s.id"
        class="m3-card suggestion-card"
        :class="`type-${s.type}`"
      >
        <div class="sugg-top-bar">
          <div class="sugg-title-group">
            <span class="sugg-indicator"></span>
            <span class="m3-badge" :class="getBadgeClass(s.type)">
              {{ s.type === 'error' ? (isGerman ? 'Kritischer Konflikt' : 'Critical Conflict') : (s.type === 'warning' ? (isGerman ? 'Abhängigkeits-Warnung' : 'Dependency Warning') : (isGerman ? 'Synergie-Tipp' : 'Synergy Tip')) }}
            </span>
            <h4 class="sugg-title">{{ s.title }}</h4>
          </div>

          <div v-if="s.cardSlug && catalog[s.cardSlug]" class="sugg-card-badge" @click="$emit('inspect-card', s.cardSlug)">
            <img 
              v-if="catalog[s.cardSlug].icons && catalog[s.cardSlug].icons[0]" 
              :src="catalog[s.cardSlug].icons[0]" 
              :alt="s.cardSlug" 
              class="sugg-card-icon"
            />
            <span>{{ formatCardTitle(s.cardSlug, catalog[s.cardSlug].name) }}</span>
          </div>
        </div>

        <p class="sugg-message">
          {{ s.message }}
        </p>

        <!-- Action Button -->
        <div class="sugg-footer" v-if="s.actionLabel">
          <button 
            class="m3-btn btn-sm"
            :class="s.type === 'error' ? 'm3-btn-primary' : 'm3-btn-secondary'"
            @click="$emit('apply-action', s)"
          >
            <span>{{ s.actionLabel }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Additional Exploding Kittens Mechanics Knowledge Pills -->
    <div class="mechanics-reference-panel m3-card">
      <h3 class="ref-title">{{ isGerman ? '📖 Grundlegende Exploding Kittens Mechaniken' : '📖 Core Exploding Kittens Rule Mechanics' }}</h3>
      <div class="rules-grid">
        <div class="rule-box">
          <span class="rule-icon">💥</span>
          <div class="rule-content">
            <span class="rule-name">{{ isGerman ? 'Anzahl Explodierender Kätzchen' : 'Exploding Kittens Count' }}</span>
            <p class="rule-detail">
              {{ isGerman
                ? 'Immer gleich Anzahl der Spieler minus 1, damit genau 1 Spieler überlebt. Wenn Streaking Kitten im Spiel ist, kommt 1 zusätzliche Bombe hinein (Gesamt = Spieler).'
                : 'Always equal to Number of Players - 1, ensuring exactly one player survives. If Streaking Kitten is in play, add 1 extra Exploding Kitten (Total = Players).' }}
            </p>
          </div>
        </div>

        <div class="rule-box">
          <span class="rule-icon">🛡️</span>
          <div class="rule-content">
            <span class="rule-name">{{ isGerman ? 'Entschärfungen & Start-Hände' : 'Defuses & Starting Hands' }}</span>
            <p class="rule-detail">
              {{ isGerman
                ? 'Teile 1 Entschärfung (oder Zombie Kätzchen) und 7 Karten an jeden Spieler aus. Die restlichen Entschärfungen kommen in den Nachziehstapel.'
                : 'Deal 1 Defuse (or Zombie Kitten) and 7 cards to each player. Place remaining Defuses into the draw pile.' }}
            </p>
          </div>
        </div>

        <div class="rule-box">
          <span class="rule-icon">🐶</span>
          <div class="rule-content">
            <span class="rule-name">{{ isGerman ? 'Barking Kittens Zwillings-Regel' : 'Barking Kittens Twin Rule' }}</span>
            <p class="rule-detail">
              {{ isGerman
                ? 'Barking Kittens müssen als Paar von 2 im Spiel sein. Wird eines gespielt, muss der Besitzer des anderen entschärfen oder explodieren.'
                : 'Barking Kittens must be in the game as a pair of 2. Playing one forces the holder of the other to explode (or defuse).' }}
            </p>
          </div>
        </div>

        <div class="rule-box">
          <span class="rule-icon">👑</span>
          <div class="rule-content">
            <span class="rule-name">{{ isGerman ? 'Good vs Evil Armageddon' : 'Good vs Evil Armageddon' }}</span>
            <p class="rule-detail">
              {{ isGerman
                ? 'Armageddon startet das Duell, bei dem Gottkatze und Teufelskatze verdeckt gezogen werden. Gottkatze muss im Spiel sein, um Armageddon zu aktivieren.'
                : 'Armageddon initiates the showdown where two face-down cards (including Godcat or Devilcat) are drawn. Godcat must be in play to activate Armageddon.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="synergy-bottom-nav">
      <button class="m3-btn m3-btn-tonal" @click="$emit('back')">
        <span class="btn-text-desktop">{{ isGerman ? '← Zurück zur Kartenauswahl' : '← Back to Card Selection' }}</span>
        <span class="btn-text-mobile">{{ isGerman ? '← Zurück' : '← Back' }}</span>
      </button>

      <button class="m3-btn m3-btn-primary" @click="$emit('continue')">
        <span class="btn-text-desktop">{{ isGerman ? 'Bauanleitung erstellen →' : 'Generate Assembly Recipe Guide →' }}</span>
        <span class="btn-text-mobile">{{ isGerman ? 'Rezept erstellen →' : 'Generate Recipe Guide →' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getCardDisplayName } from '../data/translations.js';

const props = defineProps({
  suggestions: { type: Array, required: true },
  catalog: { type: Object, required: true },
  playerCount: { type: Number, required: true },
  currentLang: { type: String, default: 'en' }
});

defineEmits(['apply-action', 'resolve-all', 'inspect-card', 'back', 'continue']);

const isGerman = computed(() => props.currentLang === 'de');

const formatCardTitle = (slug, defaultName) => {
  return getCardDisplayName(slug, defaultName, props.currentLang);
};

const hasErrors = computed(() => {
  return props.suggestions.some(s => s.type === 'error');
});

const hasWarnings = computed(() => {
  return props.suggestions.some(s => s.type === 'warning');
});

const actionableSuggestions = computed(() => {
  return props.suggestions.filter(s => s.actionType && s.actionType !== 'INFO');
});

const getBadgeClass = (type) => {
  if (type === 'error') return 'm3-badge-danger';
  if (type === 'warning') return 'm3-badge-warning';
  return 'm3-badge-primary';
};
</script>

<style scoped>
.synergy-alerts-section {
  max-width: 1380px;
  margin: 0 auto;
  padding: 32px 24px 100px 24px;
}

.synergy-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.synergy-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #ffffff 0%, #b6bccd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.synergy-desc {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  max-width: 820px;
  line-height: 1.6;
}

/* Status Banner */
.status-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border-radius: var(--md-shape-xl);
  margin-bottom: 28px;
  transition: all 0.25s ease;
}

.status-banner.has-errors {
  background: linear-gradient(135deg, rgba(147, 0, 10, 0.4) 0%, rgba(27, 32, 44, 0.95) 100%);
  border: 1.5px solid var(--md-sys-color-error);
}

.status-banner.has-warnings {
  background: linear-gradient(135deg, rgba(104, 61, 0, 0.4) 0%, rgba(27, 32, 44, 0.95) 100%);
  border: 1.5px solid var(--md-sys-color-warning);
}

.status-banner.is-clean {
  background: linear-gradient(135deg, rgba(0, 83, 36, 0.35) 0%, rgba(27, 32, 44, 0.95) 100%);
  border: 1.5px solid var(--md-sys-color-tertiary);
}

.banner-emoji {
  font-size: 2.5rem;
}

.banner-headline {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
}

.banner-subtext {
  font-size: 0.9375rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

/* Suggestions List */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.suggestion-card {
  padding: 20px 24px;
  border-radius: var(--md-shape-lg);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease;
}

.suggestion-card:hover {
  transform: translateY(-2px);
}

.suggestion-card.type-error {
  border-left: 5px solid var(--md-sys-color-error);
  background: rgba(45, 18, 20, 0.6);
}

.suggestion-card.type-warning {
  border-left: 5px solid var(--md-sys-color-warning);
  background: rgba(45, 34, 18, 0.6);
}

.suggestion-card.type-info,
.suggestion-card.type-success {
  border-left: 5px solid var(--md-sys-color-primary);
  background: rgba(22, 28, 42, 0.6);
}

.sugg-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.sugg-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sugg-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.sugg-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #ffffff;
}

.sugg-card-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--md-sys-color-surface-container-high);
  padding: 4px 10px;
  border-radius: var(--md-shape-full);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.sugg-card-badge:hover {
  border-color: var(--md-sys-color-primary);
}

.sugg-card-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.sugg-message {
  font-size: 0.9375rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.sugg-footer {
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
}

/* Mechanics Reference Panel */
.mechanics-reference-panel {
  padding: 24px;
  border-radius: var(--md-shape-xl);
  margin-top: 28px;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.ref-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.rule-box {
  display: flex;
  gap: 12px;
  padding: 14px;
  background-color: var(--md-sys-color-surface-container);
  border-radius: var(--md-shape-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.rule-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.rule-name {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--md-sys-color-primary);
  margin-bottom: 4px;
}

.rule-detail {
  font-size: 0.8125rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.4;
}

/* Bottom Nav */
.synergy-bottom-nav {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

@media (max-width: 768px) {
  .synergy-alerts-section {
    padding: 16px 12px calc(80px + env(safe-area-inset-bottom, 16px)) 12px;
  }

  .synergy-title {
    font-size: 1.4rem;
  }

  .synergy-desc {
    font-size: 0.875rem;
  }

  .header-right {
    width: 100%;
  }

  .header-right .m3-btn {
    width: 100%;
    justify-content: center;
  }

  .status-banner {
    padding: 16px;
    gap: 14px;
    margin-bottom: 20px;
  }

  .banner-emoji {
    font-size: 2rem;
  }

  .banner-headline {
    font-size: 1.1rem;
  }

  .banner-subtext {
    font-size: 0.8125rem;
  }

  .sugg-top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .sugg-card-badge {
    align-self: flex-start;
  }

  .sugg-footer {
    width: 100%;
  }

  .sugg-footer .m3-btn {
    width: 100%;
    justify-content: center;
  }

  .rules-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media (max-width: 640px) {
  .synergy-bottom-nav {
    flex-direction: column-reverse;
    gap: 10px;
    width: 100%;
  }

  .synergy-bottom-nav .m3-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
