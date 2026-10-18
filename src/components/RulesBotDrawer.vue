<template>
  <div class="rules-bot-wrapper" :class="{ 'is-lifted': liftAboveBar && !isOpen }">
    <!-- Floating Action Button Trigger: Matches circular button in reference image -->
    <button 
      class="bot-fab-btn"
      :class="{ 'is-open': isOpen }"
      @click="toggleDrawer"
      :title="isGerman ? 'Kätzchen Schiedsrichter fragen (Regel-Bot)' : 'Ask Kitten Rules Referee (Rules Bot)'"
      :aria-label="isGerman ? 'Regel-Bot' : 'Rules Bot'"
    >
      <span class="bot-fab-icon">
        <!-- Close icon when drawer is open -->
        <svg v-if="isOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <!-- Distinct Exploding Kittens Cat Referee AI icon when closed -->
        <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 5L7 8C8.5 7.3 10.2 7 12 7C13.8 7 15.5 7.3 17 8L21 5V13C21 17.5 17 21 12 21C7 21 3 17.5 3 13V5Z" fill="rgba(255, 117, 89, 0.25)"/>
          <circle cx="8.5" cy="13" r="1.5" fill="currentColor"/>
          <circle cx="15.5" cy="13" r="1.5" fill="currentColor"/>
          <path d="M10.5 16.5C11.2 17.2 12.8 17.2 13.5 16.5"/>
          <line x1="1" y1="13" x2="5" y2="13.5"/>
          <line x1="1" y1="15.5" x2="5" y2="15.5"/>
          <line x1="19" y1="13.5" x2="23" y2="13"/>
          <line x1="19" y1="15.5" x2="23" y2="15.5"/>
          <path d="M19 1L19.7 2.6L21.3 3.3L19.7 4L19 5.6L18.3 4L16.7 3.3L18.3 2.6Z" fill="#ff7559" stroke="none"/>
        </svg>
      </span>
      <span v-if="!isOpen" class="bot-pulse-ring"></span>
    </button>

    <!-- Slide-in Chat Drawer / Modal -->
    <Teleport to="body">
      <div v-if="isOpen" class="bot-drawer-backdrop" @click.self="isOpen = false">
      <div class="m3-card bot-drawer-card animate-pop-in">
        <!-- Drawer Header -->
        <div class="drawer-header">
          <div class="header-bot-info">
            <div class="bot-avatar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 5L7 8C8.5 7.3 10.2 7 12 7C13.8 7 15.5 7.3 17 8L21 5V13C21 17.5 17 21 12 21C7 21 3 17.5 3 13V5Z" fill="rgba(255, 117, 89, 0.25)"/>
                <circle cx="8.5" cy="13" r="1.5" fill="currentColor"/>
                <circle cx="15.5" cy="13" r="1.5" fill="currentColor"/>
                <path d="M10.5 16.5C11.2 17.2 12.8 17.2 13.5 16.5"/>
                <line x1="1" y1="13" x2="5" y2="13.5"/>
                <line x1="1" y1="15.5" x2="5" y2="15.5"/>
                <line x1="19" y1="13.5" x2="23" y2="13"/>
                <line x1="19" y1="15.5" x2="23" y2="15.5"/>
                <path d="M19 1L19.7 2.6L21.3 3.3L19.7 4L19 5.6L18.3 4L16.7 3.3L18.3 2.6Z" fill="#ff7559" stroke="none"/>
              </svg>
            </div>
            <div>
              <div class="bot-title-row">
                <h3 class="bot-title">{{ isGerman ? 'Kätzchen Schiedsrichter' : 'Kitten Rules Referee' }}</h3>
                <span 
                  class="gemini-status-pill" 
                  :class="isGeminiActive ? 'is-gemini' : 'is-offline'"
                  :title="isGeminiActive ? (isGerman ? 'Verbunden mit Google Gemini AI' : 'Connected to Google Gemini AI') : (isGerman ? 'Lokale Offline-Regeldatenbank aktiv • Klicken zum Einrichten' : 'Local offline rules database active • Click to setup Gemini')"
                  @click="toggleSettings"
                >
                  <span class="status-dot"></span>
                  {{ isGeminiActive ? 'Gemini AI' : (isGerman ? 'Offline (Einrichten ⚙️)' : 'Offline (Setup ⚙️)') }}
                </span>
              </div>
              <span class="bot-subtitle">{{ isGerman ? 'Offizieller Regel- & Mechanik-Assistent' : 'Official Rulebooks & Card Mechanics Assistant' }}</span>
            </div>
          </div>

          <div class="header-actions">
            <!-- Settings button for Gemini API -->
            <button 
              class="icon-action-btn" 
              :class="{ 'is-active-tab': showSettings }"
              @click="toggleSettings" 
              :title="isGerman ? 'Google Gemini API-Einstellungen' : 'Google Gemini API Settings'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
            <button class="icon-action-btn" @click="$emit('open-instructions')" :title="isGerman ? 'Regelbücher anzeigen' : 'View Embedded Rulebooks'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </button>
            <button class="icon-action-btn" @click="clearMessages" :title="isGerman ? 'Verlauf leeren' : 'Clear Conversation'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="icon-action-btn close-x" @click="isOpen = false">
              ✕
            </button>
          </div>
        </div>

        <!-- Settings Panel -->
        <div v-if="showSettings" class="settings-panel animate-fade-in">
          <div class="settings-header">
            <h4>{{ isGerman ? 'Google Gemini AI Integration' : 'Google Gemini AI Integration' }}</h4>
            <p class="settings-desc">
              {{ isGerman
                ? 'Verbinde deinen Google Gemini API-Schlüssel, um dynamische KI-Schiedsrichter-Antworten zu erhalten, die strikt auf den offiziellen Exploding Kittens Regelbüchern basieren.'
                : 'Connect your Google Gemini API key to enable dynamic, conversational referee rulings strictly grounded in official Exploding Kittens rulebooks.' }}
            </p>
          </div>

          <div class="settings-form">
            <!-- API Key Input -->
            <div class="setting-field">
              <label class="setting-label">{{ isGerman ? 'Google Gemini API-Schlüssel' : 'Google Gemini API Key' }}</label>
              <div class="api-key-input-wrapper">
                <input 
                  :type="showApiKeyText ? 'text' : 'password'" 
                  v-model="apiKeyInput" 
                  placeholder="AIzaSy..."
                  class="bot-input api-key-input"
                  autocomplete="off"
                  spellcheck="false"
                />
                <button 
                  type="button" 
                  class="toggle-show-btn" 
                  @click="showApiKeyText = !showApiKeyText"
                  :title="showApiKeyText ? 'Hide' : 'Show'"
                >
                  <svg v-if="showApiKeyText" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </button>
              </div>
              <span class="setting-hint">
                {{ isGerman 
                  ? 'Wird sicher lokal in deinem Browser gespeichert (localStorage). Kostenlosen Schlüssel bei ' 
                  : 'Saved securely in your browser (localStorage). Get a free key from ' }}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio ↗</a>
              </span>
            </div>

            <!-- Model Selection -->
            <div class="setting-field">
              <label class="setting-label">{{ isGerman ? 'Gemini Modell' : 'Gemini Model' }}</label>
              <select v-model="selectedModel" class="bot-select">
                <option value="gemini-3.8-flash">{{ isGerman ? 'Gemini 3.8 Flash (High Intelligence • mit 3.5 Backup ⚡)' : 'Gemini 3.8 Flash (High Intelligence • with 3.5 Backup ⚡)' }}</option>
                <option value="gemini-3.5-flash-lite">{{ isGerman ? 'Gemini 3.5 Flash Lite (Hohe Quote • 1.500 RPD ⚡)' : 'Gemini 3.5 Flash Lite (High Quota • 1,500 RPD ⚡)' }}</option>
                <option value="gemini-flash-lite-latest">{{ isGerman ? 'Gemini Flash Lite (Latest)' : 'Gemini Flash Lite (Latest)' }}</option>
                <option value="gemini-flash-latest">{{ isGerman ? 'Gemini Flash (Ausgewogen)' : 'Gemini Flash (Balanced)' }}</option>
                <option value="gemini-pro-latest">{{ isGerman ? 'Gemini Pro (Deep Reasoning)' : 'Gemini Pro (Deep Reasoning)' }}</option>
              </select>
              <span class="setting-hint" style="margin-top: 6px; display: block; font-size: 0.78rem; opacity: 0.9; line-height: 1.35;">
                {{ isGerman 
                  ? '⚡ Intelligenter Quota-Schutz: Sollte das 20-Anfragen-Limit von Gemini 3.8 Flash aufgebraucht sein (429 Quota), schaltet der Schiedsrichter automatisch und ohne Unterbrechung auf Gemini 3.5 Flash Lite (1.500 RPD) um.' 
                  : '⚡ Smart Quota Protection: If the 20 RPD free tier quota of Gemini 3.8 Flash is reached (429 Quota), the referee automatically falls back to Gemini 3.5 Flash Lite (1,500 RPD) with zero disruption.' }}
              </span>
            </div>

            <!-- Test Connection Feedback Banner -->
            <div v-if="testResult" class="test-result-banner" :class="testResult.ok ? 'is-success' : 'is-error'">
              <span>{{ testResult.ok ? '✓' : '✗' }}</span>
              <span>{{ testResult.message || testResult.error }}</span>
            </div>

            <!-- Settings Action Buttons -->
            <div class="settings-actions">
              <button 
                class="m3-btn m3-btn-tonal btn-sm" 
                :disabled="isTesting || !apiKeyInput.trim()"
                @click="handleTestConnection"
              >
                <span v-if="isTesting" class="spinner-sm"></span>
                <span>{{ isTesting ? (isGerman ? 'Verbindung testen...' : 'Testing...') : (isGerman ? 'Verbindung testen' : 'Test Key') }}</span>
              </button>

              <button 
                class="m3-btn m3-btn-primary btn-sm" 
                @click="handleSaveSettings"
              >
                {{ isGerman ? 'Speichern & Aktivieren' : 'Save & Enable' }}
              </button>

              <button 
                v-if="hasSavedKey" 
                class="m3-btn btn-sm btn-danger-ghost" 
                @click="handleRemoveKey"
                :title="isGerman ? 'Schlüssel löschen & Offline-Modus nutzen' : 'Remove key & use offline mode'"
              >
                {{ isGerman ? 'Löschen (Offline)' : 'Remove Key' }}
              </button>
            </div>

            <!-- Hybrid Info Banner -->
            <div class="hybrid-info-note">
              <span>💡</span>
              <p>
                {{ isGerman
                  ? 'Automatischer Hybrid-Modus: Ist der API-Schlüssel hinterlegt, antwortet Gemini. Bei Netzwerkproblemen oder fehlendem Schlüssel springt automatisch das Offline-Regelwerk ein.'
                  : 'Smart Hybrid Mode: When configured, Gemini generates dynamic answers. If offline or if the API limit is hit, the referee seamlessly falls back to the local rulebook engine.' }}
              </p>
            </div>
          </div>

          <div class="settings-footer">
            <button class="m3-btn m3-btn-tonal btn-sm" @click="showSettings = false">
              â† {{ isGerman ? 'Zurück zum Chat' : 'Back to Chat' }}
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div v-show="!showSettings" class="messages-container" ref="messagesContainer">
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            class="chat-bubble-row"
            :class="msg.sender === 'user' ? 'is-user' : 'is-bot'"
          >
            <div class="chat-bubble">
              <!-- Bot Avatar in bubble -->
              <span v-if="msg.sender === 'bot'" class="bubble-mini-avatar">
                {{ msg.isGemini ? '🤖' : '🐱' }}
              </span>

              <div class="bubble-content">
                <!-- Message Text with formatting -->
                <div class="bubble-text" v-html="formatMessageText(msg.text)"></div>

                <!-- Reference Badge -->
                <div v-if="msg.reference" class="reference-badge">
                  <span>{{ msg.isGemini ? '✨ ' : '📖 ' }}{{ msg.reference }}</span>
                </div>

                <!-- Related Cards Chips -->
                <div v-if="msg.relatedCards && msg.relatedCards.length > 0" class="bubble-card-chips">
                  <button 
                    v-for="cardSlug in msg.relatedCards" 
                    :key="cardSlug"
                    class="m3-chip chip-xs"
                    @click="$emit('inspect-card', cardSlug)"
                  >
                    🃏 {{ isGerman ? 'Ansehen: ' : 'Inspect ' }}{{ formatCardName(cardSlug) }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isGenerating" class="chat-bubble-row is-bot animate-fade-in">
            <div class="chat-bubble typing-bubble">
              <span class="bubble-mini-avatar">🤖</span>
              <div class="typing-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <span class="typing-text">{{ isGerman ? 'Kätzchen-Schiedsrichter konsultiert Regeln...' : 'Kitten Referee consulting rules...' }}</span>
            </div>
          </div>

          <!-- Suggested Followup Questions -->
          <div v-if="latestFollowups.length > 0 && !isGenerating" class="suggested-questions-row">
            <span class="suggestions-label">{{ isGerman ? 'Vorgeschlagene Fragen:' : 'Suggested Questions:' }}</span>
            <div class="suggested-chips">
              <button 
                v-for="(q, qIdx) in latestFollowups" 
                :key="qIdx"
                class="m3-chip sugg-chip"
                @click="sendPresetQuestion(q)"
              >
                {{ q }}
              </button>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div v-show="!showSettings" class="drawer-input-row">
          <input 
            v-model="inputQuery" 
            type="text" 
            :placeholder="isGerman ? 'Stelle eine Regelfrage (z.B. Kann man ein Nö! auf eine Entschärfung spielen?)...' : 'Ask a rule question (e.g. Can you Nope a Defuse?)...'"
            class="bot-input"
            :disabled="isGenerating"
            @keyup.enter="handleSend"
          />
          <button 
            class="m3-btn m3-btn-primary send-btn"
            :disabled="!inputQuery.trim() || isGenerating"
            @click="handleSend"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { queryRulesEngine } from '../utils/rulesBotEngine.js';
import { getCardDisplayName } from '../data/translations.js';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  getGeminiModel,
  setGeminiModel,
  isGeminiConfigured,
  testGeminiApiKey,
  queryGeminiRules
} from '../utils/geminiRulesService.js';

const props = defineProps({
  // When a fixed bottom action bar is visible (Step 1), lift the FAB above it on phones
  liftAboveBar: { type: Boolean, default: false },
  currentLang: { type: String, default: 'en' }
});

const emit = defineEmits(['open-instructions', 'inspect-card']);

const isGerman = computed(() => props.currentLang === 'de');

const isOpen = ref(false);
const inputQuery = ref('');
const messagesContainer = ref(null);

// Settings state
const showSettings = ref(false);
const apiKeyInput = ref('');
const selectedModel = ref('gemini-3.8-flash');
const showApiKeyText = ref(false);
const isTesting = ref(false);
const testResult = ref(null);
const isGenerating = ref(false);
const isGeminiActive = ref(false);
const hasSavedKey = computed(() => Boolean(getGeminiApiKey()));

onMounted(() => {
  apiKeyInput.value = getGeminiApiKey();
  selectedModel.value = getGeminiModel();
  isGeminiActive.value = isGeminiConfigured();
});

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
  testResult.value = null;
  if (showSettings.value) {
    apiKeyInput.value = getGeminiApiKey();
    selectedModel.value = getGeminiModel();
  }
};

const handleTestConnection = async () => {
  if (!apiKeyInput.value.trim()) return;
  isTesting.value = true;
  testResult.value = null;
  try {
    const res = await testGeminiApiKey(apiKeyInput.value.trim(), selectedModel.value);
    testResult.value = res;
  } catch (err) {
    testResult.value = { ok: false, error: err.message || 'Connection failed' };
  } finally {
    isTesting.value = false;
  }
};

const handleSaveSettings = () => {
  setGeminiApiKey(apiKeyInput.value.trim());
  setGeminiModel(selectedModel.value);
  isGeminiActive.value = isGeminiConfigured();
  testResult.value = {
    ok: true,
    message: isGerman.value 
      ? 'Einstellungen erfolgreich gespeichert! Gemini AI ist nun aktiv.' 
      : 'Settings saved! Gemini AI is now active.'
  };
};

const handleRemoveKey = () => {
  setGeminiApiKey('');
  apiKeyInput.value = '';
  isGeminiActive.value = false;
  testResult.value = {
    ok: true,
    message: isGerman.value 
      ? 'Schlüssel entfernt. Der Bot nutzt nun das lokale Offline-Regelwerk.' 
      : 'Key removed. The bot is now in local offline mode.'
  };
};

const getInitialGreeting = (lang) => {
  if (lang === 'de') {
    return {
      sender: 'bot',
      text: "Miau! Ich bin dein **Exploding Kittens Schiedsrichter**.\nFrag mich alles über Regeln, Kartentiming, Nö!-Karten, Entschärfungen, Kombos oder Erweiterungsregeln während deines Spiels!",
      reference: "Offizielle Exploding Kittens Regelbücher",
      relatedCards: ['nope', 'defuse', 'exploding-kitten'],
      suggestedQuestions: [
        "Kann man eine Entschärfung mit Nö! abwehren?",
        "Kann man ein Nö! auf ein Nö! spielen?",
        "Was passiert, wenn jemand mein Explodierendes Kätzchen stiehlt?",
        "Addieren sich Angriffskarten?",
        "Wie funktionieren Katzenkarten-Kombos?"
      ]
    };
  }
  return {
    sender: 'bot',
    text: "Meow! I am your **Exploding Kittens Rules Referee**.\nAsk me any question about card timing, Nopes, Defuses, combos, or expansion rules during your game!",
    reference: "Official Exploding Kittens Rulebooks",
    relatedCards: ['nope', 'defuse', 'exploding-kitten'],
    suggestedQuestions: [
      "Can you play a Nope on a Defuse?",
      "Can you Nope a Nope?",
      "How does Streaking Kitten work with Exploding Kittens?",
      "Do Attack cards stack turns?",
      "How do Cat Card combos work?"
    ]
  };
};

const messages = ref([getInitialGreeting(props.currentLang)]);

// If language changes and conversation is at initial greeting, update it
watch(() => props.currentLang, (newLang) => {
  if (messages.value.length === 1 && messages.value[0].sender === 'bot') {
    messages.value = [getInitialGreeting(newLang)];
  }
});

const toggleDrawer = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    isGeminiActive.value = isGeminiConfigured();
    scrollToBottom();
  }
};

const latestFollowups = computed(() => {
  const lastBotMsg = [...messages.value].reverse().find(m => m.sender === 'bot');
  return lastBotMsg?.suggestedQuestions || [];
});

const handleSend = async () => {
  const q = inputQuery.value.trim();
  if (!q || isGenerating.value) return;

  // Add user message
  messages.value.push({
    sender: 'user',
    text: q
  });

  inputQuery.value = '';
  scrollToBottom();
  isGenerating.value = true;

  try {
    if (isGeminiConfigured()) {
      try {
        const geminiRes = await queryGeminiRules(q, messages.value, props.currentLang);
        messages.value.push({
          sender: 'bot',
          text: geminiRes.answer,
          reference: geminiRes.reference,
          relatedCards: geminiRes.relatedCards,
          isGemini: true,
          modelUsed: geminiRes.modelUsed,
          suggestedQuestions: []
        });
        scrollToBottom();
        return;
      } catch (geminiErr) {
        console.warn('Gemini query failed, falling back to offline rules engine:', geminiErr);
        // Fall back to offline engine
        const fallbackRes = queryRulesEngine(q, props.currentLang);
        const notice = isGerman.value
          ? `\n\n*(Hinweis: Gemini-Anfrage fehlgeschlagen: ${geminiErr.message}. Antwort stammt aus dem Offline-Regelbuch.)*`
          : `\n\n*(Note: Gemini request failed: ${geminiErr.message}. Answer provided by offline rules database.)*`;
        messages.value.push({
          sender: 'bot',
          text: fallbackRes.answer + notice,
          reference: fallbackRes.reference,
          relatedCards: fallbackRes.relatedCards,
          suggestedQuestions: fallbackRes.suggestedQuestions,
          isFallback: true
        });
        scrollToBottom();
        return;
      }
    }

    // Offline built-in engine
    const offlineRes = queryRulesEngine(q, props.currentLang);
    messages.value.push({
      sender: 'bot',
      text: offlineRes.answer,
      reference: offlineRes.reference,
      relatedCards: offlineRes.relatedCards,
      suggestedQuestions: offlineRes.suggestedQuestions,
      isGemini: false
    });
    scrollToBottom();
  } finally {
    isGenerating.value = false;
  }
};

const sendPresetQuestion = (questionText) => {
  inputQuery.value = questionText;
  handleSend();
};

const clearMessages = () => {
  if (isGerman.value) {
    messages.value = [
      {
        sender: 'bot',
        text: "Verlauf geleert. Stelle mir eine beliebige Regel- oder Kartenfrage!",
        reference: null,
        relatedCards: [],
        suggestedQuestions: [
          "Kann man eine Entschärfung mit Nö! abwehren?",
          "Kann ein Barking Kitten mit Nö! abgewehrt werden?",
          "Was ist die 5-Karten-Kombo?",
          "Wie funktionieren tote Spieler in Zombie Kittens?"
        ]
      }
    ];
  } else {
    messages.value = [
      {
        sender: 'bot',
        text: "Conversation cleared. Ask me any rule or card question!",
        reference: null,
        relatedCards: [],
        suggestedQuestions: [
          "Can you Nope a Defuse?",
          "Can you Nope a Barking Kitten?",
          "What is the 5-card combo?",
          "How do dead players work in Zombie Kittens?"
        ]
      }
    ];
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const formatMessageText = (text) => {
  if (!text) return '';
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bot-inline-code">$1</code>')
    .replace(/^(\s*)[•\*\-]\s+(.+)$/gm, '<li class="bot-li">$2</li>')
    .replace(/(\n|<br\/>)/g, '<br/>');
};

const formatCardName = (slug) => {
  const defaultFormatted = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  return getCardDisplayName(slug, defaultFormatted, props.currentLang);
};
</script>

<style scoped>
.rules-bot-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* Floating Action Button: Circular button matching reference design */
.bot-fab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #17161a;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.35);
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
  position: relative;
  outline: none;
  cursor: pointer;
  flex-shrink: 0;
  box-sizing: border-box;
}

.bot-fab-btn:hover {
  background: #28272d;
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.22);
}

.bot-fab-btn.is-open {
  background: #39383e;
  border-color: rgba(255, 117, 89, 0.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.bot-fab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.bot-pulse-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 117, 89, 0.5);
  animation: pulseGlow 2.4s infinite;
  pointer-events: none;
}

@keyframes pulseGlow {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.12); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.8; }
}

/* Modal / Drawer Backdrop */
.bot-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 250;
  background-color: rgba(10, 13, 20, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;
}

.bot-drawer-card {
  width: 100%;
  max-width: 520px;
  height: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: var(--md-shape-xxl);
  background-color: var(--md-sys-color-surface-container);
  border: 1.5px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-elevation-5);
  overflow: hidden;
}

/* Drawer Header */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--md-sys-color-surface-container-high);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.header-bot-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 117, 89, 0.3), rgba(128, 180, 255, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: 1px solid rgba(255, 117, 89, 0.4);
  flex-shrink: 0;
}

.bot-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bot-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.gemini-status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.gemini-status-pill.is-gemini {
  background: rgba(117, 223, 138, 0.15);
  color: #75df8a;
  border: 1px solid rgba(117, 223, 138, 0.35);
}

.gemini-status-pill.is-offline {
  background: rgba(255, 210, 72, 0.12);
  color: #ffd248;
  border: 1px solid rgba(255, 210, 72, 0.3);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.gemini-status-pill.is-gemini .status-dot {
  box-shadow: 0 0 6px #75df8a;
}

.bot-subtitle {
  font-size: 0.725rem;
  color: var(--md-sys-color-on-surface-variant);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  background: transparent;
  border: 1px solid transparent;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-action-btn:hover {
  background-color: var(--md-sys-color-surface-container-highest);
  color: #ffffff;
}

.icon-action-btn.is-active-tab {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-primary);
  border-color: rgba(128, 180, 255, 0.4);
}

.close-x {
  font-size: 1rem;
}

/* Settings Panel */
.settings-panel {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--md-sys-color-surface-container);
}

.settings-header h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.settings-desc {
  font-size: 0.85rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.api-key-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.api-key-input {
  width: 100%;
  padding-right: 42px !important;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.toggle-show-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
}

.setting-hint {
  font-size: 0.75rem;
  color: var(--md-sys-color-outline);
  line-height: 1.4;
}

.setting-hint a {
  color: var(--md-sys-color-primary);
  text-decoration: underline;
}

.bot-select {
  width: 100%;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-md);
  padding: 10px 14px;
  font-size: 0.875rem;
  color: #ffffff;
  outline: none;
}

.bot-select:focus {
  border-color: var(--md-sys-color-primary);
}

.test-result-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--md-shape-md);
  font-size: 0.8125rem;
}

.test-result-banner.is-success {
  background: rgba(117, 223, 138, 0.15);
  border: 1px solid rgba(117, 223, 138, 0.35);
  color: #75df8a;
}

.test-result-banner.is-error {
  background: rgba(255, 84, 73, 0.15);
  border: 1px solid rgba(255, 84, 73, 0.35);
  color: #ff5449;
}

.settings-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 6px;
}

.btn-danger-ghost {
  background: transparent;
  border: 1px solid rgba(255, 84, 73, 0.4);
  color: #ffb4a9;
}

.btn-danger-ghost:hover {
  background: rgba(255, 84, 73, 0.15);
  border-color: #ff5449;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hybrid-info-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--md-shape-md);
  font-size: 0.775rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.hybrid-info-note p {
  margin: 0;
}

.settings-footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-bubble-row {
  display: flex;
}

.chat-bubble-row.is-user {
  justify-content: flex-end;
}

.chat-bubble-row.is-bot {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 85%;
  display: flex;
  gap: 10px;
  padding: 14px 18px;
  border-radius: var(--md-shape-lg);
  font-size: 0.875rem;
  line-height: 1.5;
}

.chat-bubble-row.is-user .chat-bubble {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-bottom-right-radius: 4px;
}

.chat-bubble-row.is-bot .chat-bubble {
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-bottom-left-radius: 4px;
}

.bubble-mini-avatar {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.bubble-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.bubble-text strong {
  color: var(--md-sys-color-primary);
}

:deep(.bot-li) {
  margin-left: 18px;
  list-style-type: disc;
}

:deep(.bot-inline-code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.825rem;
}

.reference-badge {
  font-size: 0.725rem;
  color: var(--md-sys-color-outline);
  padding: 2px 6px;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: var(--md-shape-xs);
  display: inline-block;
  margin-top: 4px;
}

.bubble-card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.chip-xs {
  font-size: 0.725rem;
  padding: 3px 8px;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-primary);
  border-color: rgba(128, 180, 255, 0.3);
}

.chip-xs:hover {
  background-color: var(--md-sys-color-primary-container);
}

/* Typing Indicator */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--md-sys-color-primary);
  animation: typingBounce 1.4s infinite ease-in-out both;
}

.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.typing-text {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  font-style: italic;
}

/* Suggested Questions */
.suggested-questions-row {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.suggestions-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--md-sys-color-outline);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.suggested-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sugg-chip {
  text-align: left;
  font-size: 0.775rem;
  padding: 6px 12px;
  border-radius: var(--md-shape-sm);
  background-color: var(--md-sys-color-surface-container-high);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.sugg-chip:hover {
  background-color: var(--md-sys-color-surface-container-highest);
  color: #ffffff;
  border-color: var(--md-sys-color-primary);
}

/* Drawer Input Row */
.drawer-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background-color: var(--md-sys-color-surface-container-high);
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.bot-input {
  flex: 1;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-shape-full);
  padding: 10px 18px;
  font-size: 0.875rem;
  color: #ffffff;
  outline: none;
}

.bot-input:focus {
  border-color: var(--md-sys-color-primary);
}

.send-btn {
  padding: 10px 16px;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .rules-bot-wrapper {
    transition: bottom 0.25s cubic-bezier(0.2, 0, 0, 1);
  }
  .rules-bot-wrapper.is-lifted {
    bottom: calc(max(10px, env(safe-area-inset-bottom, 10px)) + 78px);
  }
}

@media (max-width: 640px) {
  .bot-fab-btn {
    width: 48px;
    height: 48px;
  }
  .bot-drawer-backdrop {
    padding: 0;
  }
  .bot-drawer-card {
    max-width: 100%;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
  }
  .drawer-header {
    padding: 12px 14px;
  }
  .bot-title {
    font-size: 0.95rem;
  }
  .bot-subtitle {
    font-size: 0.68rem;
  }
  .messages-container {
    padding: 14px 12px;
  }
  .drawer-input-row {
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 10px)) 12px;
  }
  .suggested-chips {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
}
</style>
