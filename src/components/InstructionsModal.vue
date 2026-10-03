<template>
  <div class="modal-backdrop animate-fade-in" @click.self="$emit('close')">
    <div class="m3-card modal-container instructions-modal animate-pop-in">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-text">
          <span class="m3-badge m3-badge-primary">Embedded Rulebooks</span>
          <h2 class="modal-title">📖 Exploding Kittens Official Instructions</h2>
          <p class="modal-subtitle">
            Browse complete official rulebooks and turn mechanics for all 11 editions and expansions.
          </p>
        </div>

        <!-- Search Bar across rulebooks -->
        <div class="instructions-search">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search rules (e.g. combo, paw, attack, defuse)..." 
            class="rules-search-input"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>
      </div>

      <!-- Layout: Deck Tabs Sidebar + Content Body -->
      <div class="instructions-layout">
        <!-- Deck Selector Tabs -->
        <div class="deck-tabs-sidebar">
          <button 
            v-for="deck in rulebooks" 
            :key="deck.deckId"
            class="deck-tab-item"
            :class="{ active: selectedDeckId === deck.deckId }"
            @click="selectedDeckId = deck.deckId"
          >
            <span class="deck-tab-name">{{ deck.title }}</span>
            <span class="deck-tab-sub">{{ deck.subtitle }}</span>
          </button>
        </div>

        <!-- Selected Rulebook Content -->
        <div class="rulebook-content-panel">
          <div v-if="currentRulebook" class="rulebook-scroll">
            <!-- Rulebook Header -->
            <div class="panel-header-row">
              <div>
                <h3 class="active-rulebook-title">{{ currentRulebook.title }}</h3>
                <span class="active-rulebook-subtitle">{{ currentRulebook.subtitle }}</span>
              </div>

              <!-- Official PDF Link -->
              <a 
                v-if="currentRulebook.pdfUrl" 
                :href="currentRulebook.pdfUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="m3-btn m3-btn-tonal btn-sm pdf-link-btn"
              >
                <span>Official PDF</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>

            <!-- Sections Accordion / Cards -->
            <div class="rule-sections-list">
              <div 
                v-for="(sec, sIdx) in filteredSections" 
                :key="sIdx"
                class="rule-section-card"
              >
                <h4 class="section-card-title">{{ sec.title }}</h4>
                <div class="section-card-body" v-html="formatSectionText(sec.content)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="m3-btn m3-btn-primary" @click="$emit('close')">
          Close Instructions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RULEBOOKS } from '../data/rulesKnowledge.js';

defineEmits(['close']);

const rulebooks = RULEBOOKS;
const selectedDeckId = ref(RULEBOOKS[0].deckId);
const searchQuery = ref('');

const currentRulebook = computed(() => {
  return rulebooks.find(r => r.deckId === selectedDeckId.value) || rulebooks[0];
});

const filteredSections = computed(() => {
  if (!currentRulebook.value) return [];
  if (!searchQuery.value.trim()) return currentRulebook.value.sections;

  const q = searchQuery.value.toLowerCase().trim();
  return currentRulebook.value.sections.filter(s => 
    s.title.toLowerCase().includes(q) ||
    s.content.toLowerCase().includes(q)
  );
});

const formatSectionText = (text) => {
  if (!text) return '';
  return text
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/• (.*?)(<br\/>|$)/g, '<div class="bullet-line">• $1</div>');
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

.instructions-modal {
  width: 100%;
  max-width: 1040px;
  height: 88vh;
  display: flex;
  flex-direction: column;
  padding: 28px;
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
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 4px 0 2px 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
}

.instructions-search {
  display: flex;
  align-items: center;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-full);
  padding: 6px 16px;
  width: 320px;
  position: relative;
}

.rules-search-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: #ffffff;
  width: 100%;
}

.clear-btn {
  font-size: 0.75rem;
  color: var(--md-sys-color-outline);
}

/* Layout */
.instructions-layout {
  flex: 1;
  display: flex;
  gap: 20px;
  overflow: hidden;
}

/* Sidebar */
.deck-tabs-sidebar {
  width: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 8px;
  border-right: 1px solid var(--md-sys-color-outline-variant);
}

.deck-tab-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 10px 14px;
  border-radius: var(--md-shape-md);
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.deck-tab-item:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

.deck-tab-item.active {
  background-color: var(--md-sys-color-primary-container);
  border-color: var(--md-sys-color-primary);
}

.deck-tab-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.deck-tab-sub {
  font-size: 0.725rem;
  color: var(--md-sys-color-on-surface-variant);
  margin-top: 2px;
}

/* Content Panel */
.rulebook-content-panel {
  flex: 1;
  overflow-y: auto;
  padding-right: 12px;
}

.panel-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.active-rulebook-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
}

.active-rulebook-subtitle {
  font-size: 0.8125rem;
  color: var(--md-sys-color-primary);
}

.pdf-link-btn {
  font-size: 0.8125rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rule-sections-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rule-section-card {
  padding: 18px 20px;
  border-radius: var(--md-shape-lg);
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.section-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin-bottom: 10px;
}

.section-card-body {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface);
}

.bullet-line {
  margin: 4px 0;
  padding-left: 10px;
}

.modal-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .instructions-layout {
    flex-direction: column;
  }
  .deck-tabs-sidebar {
    width: 100%;
    max-height: 140px;
    border-right: none;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }
}
</style>
