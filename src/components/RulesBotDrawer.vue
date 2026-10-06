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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a2 2 0 0 1 2 2v1h2a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h2V4a2 2 0 0 1 2-2z"/>
          <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
          <path d="M9.5 15.5c1.5 1 3.5 1 5 0"/>
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
              <span>⚖️🐱</span>
            </div>
            <div>
              <h3 class="bot-title">{{ isGerman ? 'Kätzchen Schiedsrichter' : 'Kitten Rules Referee' }}</h3>
              <span class="bot-subtitle">{{ isGerman ? 'Offizieller Regel- & Mechanik-Assistent' : 'Official Rulebooks & Card Mechanics Assistant' }}</span>
            </div>
          </div>

          <div class="header-actions">
            <button class="icon-action-btn" @click="$emit('open-instructions')" :title="isGerman ? 'Regelbücher anzeigen' : 'View Embedded Rulebooks'">
              📖
            </button>
            <button class="icon-action-btn" @click="clearMessages" :title="isGerman ? 'Verlauf leeren' : 'Clear Conversation'">
              🗑️
            </button>
            <button class="icon-action-btn close-x" @click="isOpen = false">
              ✕
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div class="messages-container" ref="messagesContainer">
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            class="chat-bubble-row"
            :class="msg.sender === 'user' ? 'is-user' : 'is-bot'"
          >
            <div class="chat-bubble">
              <!-- Bot Avatar in bubble -->
              <span v-if="msg.sender === 'bot'" class="bubble-mini-avatar">🐾</span>

              <div class="bubble-content">
                <!-- Message Text with formatting -->
                <div class="bubble-text" v-html="formatMessageText(msg.text)"></div>

                <!-- Reference Badge -->
                <div v-if="msg.reference" class="reference-badge">
                  <span>📖 {{ msg.reference }}</span>
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

          <!-- Suggested Followup Questions -->
          <div v-if="latestFollowups.length > 0" class="suggested-questions-row">
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
        <div class="drawer-input-row">
          <input 
            v-model="inputQuery" 
            type="text" 
            :placeholder="isGerman ? 'Stelle eine Regelfrage (z.B. Kann man ein Nö! auf eine Entschärfung spielen?)...' : 'Ask a rule question (e.g. Can you Nope a Defuse?)...'"
            class="bot-input"
            @keyup.enter="handleSend"
          />
          <button 
            class="m3-btn m3-btn-primary send-btn"
            :disabled="!inputQuery.trim()"
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
import { ref, computed, watch, nextTick } from 'vue';
import { queryRulesEngine } from '../utils/rulesBotEngine.js';
import { getCardDisplayName } from '../data/translations.js';

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
    scrollToBottom();
  }
};

const latestFollowups = computed(() => {
  const lastBotMsg = [...messages.value].reverse().find(m => m.sender === 'bot');
  return lastBotMsg?.suggestedQuestions || [];
});

const handleSend = () => {
  const q = inputQuery.value.trim();
  if (!q) return;

  // Add user message
  messages.value.push({
    sender: 'user',
    text: q
  });

  inputQuery.value = '';
  scrollToBottom();

  // Query engine with language context
  setTimeout(() => {
    const res = queryRulesEngine(q, props.currentLang);
    messages.value.push({
      sender: 'bot',
      text: res.answer,
      reference: res.reference,
      relatedCards: res.relatedCards,
      suggestedQuestions: res.suggestedQuestions
    });
    scrollToBottom();
  }, 100);
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

const formatMessageText = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
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
  padding: 18px 20px;
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
}

.bot-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
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
  color: var(--md-sys-color-on-surface);
  transition: background-color 0.2s ease;
}

.icon-action-btn:hover {
  background-color: var(--md-sys-color-surface-container-highest);
}

.close-x {
  font-size: 1rem;
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
}

.bubble-text strong {
  color: var(--md-sys-color-primary);
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
  .drawer-input-bar {
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 10px)) 12px;
  }
  .followups-chips-row {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
}
</style>
