<template>
  <div v-if="isOpen" class="companion-backdrop animate-fade-in" @click.self="close">
    <div class="m3-card companion-modal animate-pop-in">
      <!-- Modal Header -->
      <div class="companion-header">
        <div class="header-left">
          <span class="header-icon-badge">🎮</span>
          <div>
            <h2 class="companion-title">Table Companion & Turn Tracker</h2>
            <p class="companion-subtitle">
              Live game night helper for tracking dead players, turn timers, and special card powers.
            </p>
          </div>
        </div>

        <div class="header-actions">
          <!-- Soundboard Mute Toggle -->
          <button 
            class="m3-btn m3-btn-tonal btn-sm mute-btn"
            :class="{ 'is-muted': isMuted }"
            @click="toggleMute"
            :title="isMuted ? 'Unmute Soundboard' : 'Mute Soundboard'"
          >
            {{ isMuted ? '🔇 Muted' : '🔊 SFX On' }}
          </button>
          <button class="close-btn" @click="close" title="Close Companion">✕</button>
        </div>
      </div>

      <!-- Quick SFX Tactical Bar (Feature 8) -->
      <div class="tactical-sfx-bar">
        <span class="sfx-bar-label">⚡ Tactical SFX:</span>
        <div class="sfx-buttons-row">
          <button class="sfx-btn sfx-nope" @click="playSfx('nope')">
            🛑 "NOPE!"
          </button>
          <button class="sfx-btn sfx-boom" @click="playSfx('boom')">
            💥 "EXPLODE!"
          </button>
          <button class="sfx-btn sfx-defuse" @click="playSfx('defuse')">
            🛡️ "DEFUSED!"
          </button>
          <button class="sfx-btn sfx-purr" @click="playSfx('purr')">
            🐱 Purr
          </button>
        </div>
      </div>

      <!-- Turn Timer Section ("Speed Kittens", Feature 7) -->
      <div class="timer-section m3-card">
        <div class="timer-left">
          <div class="timer-display-box" :class="{ 'is-warning': timerSeconds <= 5 && timerActive }">
            <span class="timer-digits">{{ formattedTime }}</span>
            <span class="timer-status">{{ timerActive ? 'TURN IN PROGRESS' : 'TIMER PAUSED' }}</span>
          </div>

          <div class="timer-controls">
            <button 
              class="m3-btn" 
              :class="timerActive ? 'm3-btn-tonal' : 'm3-btn-primary'"
              @click="toggleTimer"
            >
              {{ timerActive ? '⏸️ Pause' : '▶️ Start Turn' }}
            </button>
            <button class="m3-btn m3-btn-tonal" @click="resetTimer">
              ↺ Reset
            </button>
            <button class="m3-btn m3-btn-primary" @click="nextPlayerTurn">
              Next Player ⏭️
            </button>
          </div>
        </div>

        <div class="timer-presets">
          <span class="presets-label">Speed Mode:</span>
          <div class="presets-chips">
            <button 
              v-for="s in [30, 45, 60, 90]" 
              :key="s" 
              class="preset-chip"
              :class="{ active: selectedPreset === s }"
              @click="setTimerPreset(s)"
            >
              {{ s }}s
            </button>
          </div>
        </div>
      </div>

      <!-- Undead & Special Rules Helper Banner (Feature 5) -->
      <div class="special-rules-banner" v-if="hasDeadPlayerCards">
        <div class="undead-calc">
          <span class="undead-icon">🧟</span>
          <div class="undead-info">
            <strong>Zombie Rules Active:</strong>
            <span>
              {{ deadCount }} dead player(s). 
              <em>Attack of the Dead</em> forces: 
              <strong class="attack-dead-calc">{{ deadCount * 3 }} turns!</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- Player Management Grid -->
      <div class="players-container">
        <div class="players-header-row">
          <h3 class="players-title">Players at Table ({{ players.length }})</h3>
          <div class="players-count-buttons">
            <button class="m3-btn m3-btn-tonal btn-xs" @click="addPlayer" :disabled="players.length >= 10">
              + Add Player
            </button>
            <button class="m3-btn m3-btn-tonal btn-xs" @click="removePlayer" :disabled="players.length <= 2">
              - Remove
            </button>
          </div>
        </div>

        <div class="players-grid">
          <div 
            v-for="(p, idx) in players" 
            :key="p.id" 
            class="player-card"
            :class="{ 
              'is-dead': !p.alive, 
              'is-active-turn': activePlayerIndex === idx,
              'has-barking': p.hasBarking,
              'has-crown': p.hasCrown
            }"
            @click="activePlayerIndex = idx"
          >
            <!-- Player Top Row -->
            <div class="player-top">
              <span class="player-avatar">{{ !p.alive ? '💀' : (activePlayerIndex === idx ? '👑' : '😼') }}</span>
              <input 
                v-model="p.name" 
                class="player-name-input"
                placeholder="Player Name"
                @click.stop
              />
              <span v-if="activePlayerIndex === idx" class="turn-badge">ACTIVE</span>
            </div>

            <!-- Alive / Dead Toggle Button -->
            <button 
              class="status-toggle-btn"
              :class="p.alive ? 'is-alive' : 'is-eliminated'"
              @click.stop="togglePlayerAlive(idx)"
            >
              {{ p.alive ? '✅ Alive & Armed' : '💀 Dead (Undead)' }}
            </button>

            <!-- Player Quick Badges / Roles -->
            <div class="player-perks-row" @click.stop>
              <button 
                class="perk-chip"
                :class="{ active: p.hasBarking }"
                @click="p.hasBarking = !p.hasBarking"
                title="Toggle Barking Kitten target"
              >
                🐶 Barking
              </button>

              <button 
                class="perk-chip"
                :class="{ active: p.hasCrown }"
                @click="toggleCrown(idx)"
                title="Toggle Tower of Power crown"
              >
                👑 Crown
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="companion-footer">
        <span class="companion-hint">
          💡 Clicking "Next Player" automatically advances the turn and resets the timer with tactical audio feedback.
        </span>
        <button class="m3-btn m3-btn-primary" @click="close">
          Back to Recipe
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { soundEffects } from '../utils/soundEffects.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  playerCount: { type: Number, default: 4 },
  hasDeadPlayerCards: { type: Boolean, default: true }
});

const emit = defineEmits(['close']);

const isMuted = ref(soundEffects.isMuted());
const activePlayerIndex = ref(0);
const selectedPreset = ref(45);
const timerSeconds = ref(45);
const timerActive = ref(false);
let timerInterval = null;

// Initialize players
const players = ref([]);

const initPlayers = () => {
  const count = props.playerCount || 4;
  players.value = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    alive: true,
    hasBarking: false,
    hasCrown: false
  }));
};

watch(() => props.playerCount, () => {
  initPlayers();
}, { immediate: true });

// Dead count
const deadCount = computed(() => {
  return players.value.filter(p => !p.alive).length;
});

// Formatted timer
const formattedTime = computed(() => {
  const mins = Math.floor(timerSeconds.value / 60);
  const secs = timerSeconds.value % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
});

// Timer logic
const toggleTimer = () => {
  if (timerActive.value) {
    pauseTimer();
  } else {
    startTimer();
  }
};

const startTimer = () => {
  timerActive.value = true;
  soundEffects.init();
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--;
      if (timerSeconds.value <= 5 && timerSeconds.value > 0) {
        soundEffects.playTick();
      }
      if (timerSeconds.value === 0) {
        soundEffects.playWarningBuzzer();
        pauseTimer();
      }
    }
  }, 1000);
};

const pauseTimer = () => {
  timerActive.value = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const resetTimer = () => {
  pauseTimer();
  timerSeconds.value = selectedPreset.value;
};

const setTimerPreset = (s) => {
  selectedPreset.value = s;
  resetTimer();
};

const nextPlayerTurn = () => {
  resetTimer();
  // Find next living player
  let nextIdx = (activePlayerIndex.value + 1) % players.value.length;
  let attempts = 0;
  while (!players.value[nextIdx].alive && attempts < players.value.length) {
    nextIdx = (nextIdx + 1) % players.value.length;
    attempts++;
  }
  activePlayerIndex.value = nextIdx;
  soundEffects.playPurr();
  startTimer();
};

const togglePlayerAlive = (idx) => {
  players.value[idx].alive = !players.value[idx].alive;
  if (!players.value[idx].alive) {
    soundEffects.playExplosion();
  } else {
    soundEffects.playDefuse();
  }
};

const toggleCrown = (idx) => {
  const current = players.value[idx].hasCrown;
  players.value.forEach(p => p.hasCrown = false);
  players.value[idx].hasCrown = !current;
};

const addPlayer = () => {
  if (players.value.length < 10) {
    const nextNum = players.value.length + 1;
    players.value.push({
      id: nextNum,
      name: `Player ${nextNum}`,
      alive: true,
      hasBarking: false,
      hasCrown: false
    });
  }
};

const removePlayer = () => {
  if (players.value.length > 2) {
    players.value.pop();
    if (activePlayerIndex.value >= players.value.length) {
      activePlayerIndex.value = 0;
    }
  }
};

const playSfx = (type) => {
  if (type === 'nope') soundEffects.playNope();
  else if (type === 'boom') soundEffects.playExplosion();
  else if (type === 'defuse') soundEffects.playDefuse();
  else if (type === 'purr') soundEffects.playPurr();
};

const toggleMute = () => {
  isMuted.value = soundEffects.toggleMute();
};

const close = () => {
  pauseTimer();
  emit('close');
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.companion-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.companion-modal {
  background-color: #1a1714;
  border: 1px solid rgba(255, 180, 160, 0.25);
  border-radius: 28px;
  width: 100%;
  max-width: 960px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.companion-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(235, 115, 80, 0.15), transparent);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon-badge {
  font-size: 2rem;
  background: rgba(255, 180, 160, 0.2);
  padding: 8px 10px;
  border-radius: 16px;
}

.companion-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
}

.companion-subtitle {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #c7c5c0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mute-btn {
  font-size: 0.8rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 80, 80, 0.3);
  transform: rotate(90deg);
}

/* Tactical SFX Bar */
.tactical-sfx-bar {
  padding: 10px 24px;
  background-color: #221e1a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.sfx-bar-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffb4a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sfx-buttons-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sfx-btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  padding: 5px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.sfx-btn:active {
  transform: scale(0.95);
}

.sfx-nope {
  background: rgba(255, 60, 60, 0.2);
  color: #ff8080;
  border-color: rgba(255, 60, 60, 0.4);
}
.sfx-nope:hover {
  background: rgba(255, 60, 60, 0.35);
}

.sfx-boom {
  background: rgba(255, 140, 0, 0.2);
  color: #ffaa55;
  border-color: rgba(255, 140, 0, 0.4);
}
.sfx-boom:hover {
  background: rgba(255, 140, 0, 0.35);
}

.sfx-defuse {
  background: rgba(80, 200, 120, 0.2);
  color: #8be5a0;
  border-color: rgba(80, 200, 120, 0.4);
}
.sfx-defuse:hover {
  background: rgba(80, 200, 120, 0.35);
}

.sfx-purr {
  background: rgba(200, 140, 255, 0.2);
  color: #d8aaff;
  border-color: rgba(200, 140, 255, 0.4);
}
.sfx-purr:hover {
  background: rgba(200, 140, 255, 0.35);
}

/* Timer Section */
.timer-section {
  margin: 16px 24px;
  padding: 16px 20px;
  background-color: #24201b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.timer-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.timer-display-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.timer-digits {
  font-size: 2.2rem;
  font-weight: 900;
  font-family: monospace;
  color: #ffb4a0;
  line-height: 1;
}

.timer-status {
  font-size: 0.68rem;
  font-weight: 700;
  color: #aaa;
  margin-top: 4px;
  letter-spacing: 0.5px;
}

.timer-display-box.is-warning .timer-digits {
  color: #ff4d4d;
  animation: pulse-warn 0.6s infinite alternate;
}

@keyframes pulse-warn {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.timer-controls {
  display: flex;
  gap: 8px;
}

.timer-presets {
  display: flex;
  align-items: center;
  gap: 8px;
}

.presets-label {
  font-size: 0.78rem;
  color: #aaa;
  font-weight: 600;
}

.presets-chips {
  display: flex;
  gap: 6px;
}

.preset-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ccc;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.preset-chip.active {
  background: #ffb4a0;
  color: #4a180d;
  border-color: #ffb4a0;
}

/* Special Rules Banner */
.special-rules-banner {
  margin: 0 24px 14px 24px;
  padding: 10px 16px;
  background: rgba(140, 80, 255, 0.12);
  border: 1px solid rgba(140, 80, 255, 0.25);
  border-radius: 14px;
}

.undead-calc {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: #ddd;
}

.undead-icon {
  font-size: 1.5rem;
}

.attack-dead-calc {
  color: #bb86fc;
  font-size: 0.95rem;
}

/* Players Grid */
.players-container {
  padding: 0 24px 16px 24px;
  overflow-y: auto;
  flex: 1;
}

.players-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.players-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.player-card {
  background-color: #24201b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.player-card:hover {
  border-color: rgba(255, 180, 160, 0.3);
  transform: translateY(-2px);
}

.player-card.is-active-turn {
  border-color: #ffb4a0;
  background-color: rgba(255, 180, 160, 0.1);
  box-shadow: 0 0 0 2px #ffb4a0;
}

.player-card.is-dead {
  opacity: 0.65;
  background-color: rgba(40, 20, 20, 0.7);
  border-color: rgba(255, 80, 80, 0.2);
}

.player-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-avatar {
  font-size: 1.3rem;
}

.player-name-input {
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  width: 100%;
  outline: none;
}

.player-name-input:focus {
  border-bottom-color: #ffb4a0;
}

.turn-badge {
  font-size: 0.62rem;
  font-weight: 800;
  background: #ffb4a0;
  color: #4a180d;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-toggle-btn {
  border: none;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.status-toggle-btn.is-alive {
  background-color: rgba(80, 200, 120, 0.18);
  color: #8be5a0;
  border: 1px solid rgba(80, 200, 120, 0.3);
}

.status-toggle-btn.is-eliminated {
  background-color: rgba(255, 60, 60, 0.18);
  color: #ff8080;
  border: 1px solid rgba(255, 60, 60, 0.3);
}

.player-perks-row {
  display: flex;
  gap: 6px;
}

.perk-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}

.perk-chip.active {
  background: rgba(255, 180, 160, 0.2);
  color: #ffb4a0;
  border-color: #ffb4a0;
}

/* Footer */
.companion-footer {
  padding: 16px 24px;
  background-color: #181512;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.companion-hint {
  font-size: 0.8rem;
  color: #aaa;
}

@media (max-width: 768px) {
  .companion-backdrop {
    padding: 0;
  }
  .companion-modal {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
  }
  .companion-header {
    padding: 12px 16px;
  }
  .companion-title {
    font-size: 1.1rem;
  }
  .companion-subtitle {
    font-size: 0.75rem;
  }
  .header-icon-badge {
    font-size: 1.5rem;
    padding: 6px 8px;
  }
  .tactical-sfx-bar {
    padding: 8px 14px;
    gap: 8px;
  }
  .sfx-buttons-row {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    padding-bottom: 4px;
  }
  .timer-section {
    margin: 10px 14px;
    padding: 12px;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .timer-left {
    width: 100%;
    justify-content: space-around;
    gap: 12px;
  }
  .timer-digits {
    font-size: 2rem;
  }
  .timer-presets {
    width: 100%;
    justify-content: center;
  }
  .special-rules-banner {
    margin: 0 14px 10px 14px;
    padding: 8px 12px;
  }
  .players-container {
    padding: 0 14px 14px 14px;
  }
  .players-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .player-card {
    padding: 12px;
  }
  .companion-footer {
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 12px)) 16px;
  }
}
</style>
