<template>
  <div v-if="isOpen" class="sleeve-backdrop animate-fade-in" @click.self="$emit('close')">
    <div class="m3-card sleeve-modal animate-pop-in">
      <!-- Modal Header -->
      <div class="sleeve-header">
        <div class="header-left">
          <span class="sleeve-badge-icon">🎴</span>
          <div>
            <h2 class="sleeve-title">Card Sleeving & Box Storage Calculator</h2>
            <p class="sleeve-subtitle">
              Physical logistics for board game collectors: sleeve counts, stack thickness, and box fitting.
            </p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')" title="Close">✕</button>
      </div>

      <!-- Main Content -->
      <div class="sleeve-body">
        <!-- Deck Stats Overview Cards -->
        <div class="stats-grid">
          <div class="stat-box">
            <span class="stat-number">{{ totalCards }}</span>
            <span class="stat-label">Total Game Cards</span>
          </div>

          <div class="stat-box">
            <span class="stat-number">63.5 × 88 mm</span>
            <span class="stat-label">Standard Sleeve Size</span>
          </div>

          <div class="stat-box">
            <span class="stat-number">{{ packsOf100 }}</span>
            <span class="stat-label">100-Pack Sleeves ({{ leftover100 }} extra)</span>
          </div>

          <div class="stat-box">
            <span class="stat-number">{{ packsOf50 }}</span>
            <span class="stat-label">50-Pack Sleeves ({{ leftover50 }} extra)</span>
          </div>
        </div>

        <!-- Stack Thickness & Comparison Table -->
        <div class="spec-section">
          <h4 class="section-heading">📏 Deck Stack Height & Thickness</h4>
          <div class="thickness-comparison">
            <div class="thickness-card">
              <span class="thick-icon">📄</span>
              <span class="thick-type">Raw (Unsleeved)</span>
              <span class="thick-val">{{ unsleevedHeightMm }} mm</span>
              <span class="thick-sub">~0.30mm per card</span>
            </div>

            <div class="thickness-card highlight-card">
              <span class="thick-icon">🛡️</span>
              <span class="thick-type">Standard (50μm)</span>
              <span class="thick-val">{{ standardSleevedHeightMm }} mm</span>
              <span class="thick-sub">Mayday / UltraPro Standard</span>
            </div>

            <div class="thickness-card">
              <span class="thick-icon">💎</span>
              <span class="thick-type">Premium (100μm)</span>
              <span class="thick-val">{{ premiumSleevedHeightMm }} mm</span>
              <span class="thick-sub">Dragon Shield / GameGenic</span>
            </div>
          </div>
        </div>

        <!-- Physical Box Storage Compatibility Check -->
        <div class="spec-section">
          <h4 class="section-heading">📦 Physical Game Box Fit Guide</h4>
          <div class="boxes-fit-list">
            <div 
              v-for="b in boxFitAnalysis" 
              :key="b.name"
              class="box-fit-row"
              :class="{ 'fits': b.fits, 'tight': b.tight, 'too-small': !b.fits && !b.tight }"
            >
              <div class="box-info">
                <span class="box-status-icon">{{ b.fits ? '✅' : (b.tight ? '⚠️' : '❌') }}</span>
                <div>
                  <strong class="box-name">{{ b.name }}</strong>
                  <span class="box-capacity">Capacity: ~{{ b.capacity }} sleeved cards</span>
                </div>
              </div>
              <span class="box-verdict-badge">{{ b.verdict }}</span>
            </div>
          </div>
        </div>

        <!-- Recommended Sleeve Brands -->
        <div class="brands-tip-box">
          <strong>💡 Recommended Sleeve Brands:</strong>
          <span>Dragon Shield Clear Matte (63.5×88), GameGenic Matte Standard, or Mayday Games Chimera Standard.</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="sleeve-footer">
        <button class="m3-btn m3-btn-primary" @click="$emit('close')">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  totalCards: { type: Number, default: 56 },
  ownedDeckIds: { type: Array, default: () => [] }
});

defineEmits(['close']);

const packsOf50 = computed(() => Math.ceil(props.totalCards / 50));
const leftover50 = computed(() => (packsOf50.value * 50) - props.totalCards);

const packsOf100 = computed(() => Math.ceil(props.totalCards / 100));
const leftover100 = computed(() => (packsOf100.value * 100) - props.totalCards);

const unsleevedHeightMm = computed(() => Math.round(props.totalCards * 0.3 * 10) / 10);
const standardSleevedHeightMm = computed(() => Math.round(props.totalCards * 0.44 * 10) / 10);
const premiumSleevedHeightMm = computed(() => Math.round(props.totalCards * 0.58 * 10) / 10);

const boxFitAnalysis = computed(() => {
  const c = props.totalCards;
  return [
    {
      name: 'Original / NSFW Edition Tuck Box',
      capacity: 60,
      fits: c <= 56,
      tight: c > 56 && c <= 65,
      verdict: c <= 56 ? 'Perfect Fit' : (c <= 65 ? 'Very Tight with Sleeves' : 'Will Not Fit')
    },
    {
      name: 'Party Pack Magnetic Drawer Box',
      capacity: 160,
      fits: c <= 150,
      tight: c > 150 && c <= 170,
      verdict: c <= 150 ? 'Spacious Fit (Fits Sleeved)' : 'Tight Fit'
    },
    {
      name: 'Recipes for Disaster Organizer Box',
      capacity: 250,
      fits: c <= 240,
      tight: false,
      verdict: 'Excellent Fit (Divided Trays)'
    },
    {
      name: 'Good vs Evil / Zombie Kittens Box',
      capacity: 75,
      fits: c <= 70,
      tight: c > 70 && c <= 80,
      verdict: c <= 70 ? 'Fits Comfortably' : (c <= 80 ? 'Snug Fit' : 'Overflows')
    }
  ];
});
</script>

<style scoped>
.sleeve-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.sleeve-modal {
  background-color: #1a1714;
  border: 1px solid rgba(255, 180, 160, 0.25);
  border-radius: 28px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.sleeve-header {
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

.sleeve-badge-icon {
  font-size: 2rem;
  background: rgba(255, 180, 160, 0.2);
  padding: 8px 10px;
  border-radius: 16px;
}

.sleeve-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.sleeve-subtitle {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #c7c5c0;
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

.sleeve-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.stat-box {
  background-color: #24201b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffb4a0;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: #aaa;
}

.spec-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-heading {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.thickness-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.thickness-card {
  background-color: #24201b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.thickness-card.highlight-card {
  border-color: #ffb4a0;
  background-color: rgba(255, 180, 160, 0.08);
}

.thick-icon {
  font-size: 1.5rem;
  margin-bottom: 2px;
}

.thick-type {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.thick-val {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffb4a0;
}

.thick-sub {
  font-size: 0.72rem;
  color: #888;
}

.boxes-fit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.box-fit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 14px;
  background-color: #24201b;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.box-fit-row.fits {
  border-color: rgba(80, 200, 120, 0.3);
  background-color: rgba(80, 200, 120, 0.06);
}

.box-fit-row.tight {
  border-color: rgba(255, 180, 0, 0.3);
  background-color: rgba(255, 180, 0, 0.06);
}

.box-fit-row.too-small {
  border-color: rgba(255, 80, 80, 0.3);
  background-color: rgba(255, 80, 80, 0.06);
  opacity: 0.7;
}

.box-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.box-status-icon {
  font-size: 1.2rem;
}

.box-name {
  display: block;
  font-size: 0.88rem;
  color: #fff;
}

.box-capacity {
  font-size: 0.75rem;
  color: #aaa;
}

.box-verdict-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.08);
  color: #ddd;
}

.box-fit-row.fits .box-verdict-badge {
  background-color: rgba(80, 200, 120, 0.2);
  color: #8be5a0;
}

.box-fit-row.tight .box-verdict-badge {
  background-color: rgba(255, 180, 0, 0.2);
  color: #ffd248;
}

.brands-tip-box {
  background-color: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #ffb4a0;
  padding: 10px 14px;
  border-radius: 0 10px 10px 0;
  font-size: 0.82rem;
  color: #ccc;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sleeve-footer {
  padding: 16px 24px;
  background-color: #181512;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .sleeve-backdrop {
    padding: 0;
  }
  .sleeve-modal {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
  }
  .sleeve-header {
    padding: 12px 14px;
  }
  .sleeve-title {
    font-size: 1.1rem;
  }
  .sleeve-subtitle {
    font-size: 0.72rem;
  }
  .sleeve-body {
    padding: 14px 12px;
    gap: 14px;
  }
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .thickness-comparison {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .box-fit-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .sleeve-footer {
    padding: 12px 14px calc(12px + env(safe-area-inset-bottom, 12px)) 14px;
  }
}
</style>
