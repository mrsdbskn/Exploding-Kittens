/**
 * Danger Adjuster presets for the Hazard Volatility meter.
 *
 * Each preset maps to concrete deck-engine levers:
 *  - extraDefuses:  Defuses shuffled into the draw pile (engine clamps to what you own)
 *  - bonusEK:       Exploding Kittens added beyond the official "players - 1" (engine clamps)
 *  - safeRatio:     Fraction of safe draw-pile cards kept (lower = denser bombs, shorter game)
 *  - implodingReplacesEK: false turns the Imploding Kitten into an EXTRA hazard
 */
export const DANGER_PRESETS = [
  {
    id: 'chill',
    label: 'Chill',
    emoji: '😌',
    desc: 'Every spare Defuse goes into the deck. Long, strategic games.',
    extraDefuses: 99,
    bonusEK: 0,
    safeRatio: 1,
    implodingReplacesEK: true
  },
  {
    id: 'casual',
    label: 'Casual',
    emoji: '🙂',
    desc: 'One extra safety net over the official setup.',
    extraDefuses: 3,
    bonusEK: 0,
    safeRatio: 1,
    implodingReplacesEK: true
  },
  {
    id: 'balanced',
    label: 'Official',
    emoji: '⚖️',
    desc: 'Standard rulebook setup: players − 1 bombs, 2 spare Defuses.',
    extraDefuses: 2,
    bonusEK: 0,
    safeRatio: 1,
    implodingReplacesEK: true
  },
  {
    id: 'spicy',
    label: 'Spicy',
    emoji: '🌶️',
    desc: '+1 bomb, 1 spare Defuse, 20% fewer safe cards in the pile.',
    extraDefuses: 1,
    bonusEK: 1,
    safeRatio: 0.8,
    implodingReplacesEK: true
  },
  {
    id: 'apocalyptic',
    label: 'Mayhem',
    emoji: '☢️',
    desc: '+2 bombs, no spare Defuses, 40% fewer safe cards. Imploding is extra.',
    extraDefuses: 0,
    bonusEK: 2,
    safeRatio: 0.6,
    implodingReplacesEK: false
  }
];

export const DEFAULT_DANGER_SETTINGS = {
  preset: 'balanced',
  extraDefuses: 2,
  bonusEK: 0,
  safeRatio: 1,
  implodingReplacesEK: true
};

export function settingsFromPreset(presetId) {
  const p = DANGER_PRESETS.find(x => x.id === presetId) || DANGER_PRESETS[2];
  return {
    preset: p.id,
    extraDefuses: p.extraDefuses,
    bonusEK: p.bonusEK,
    safeRatio: p.safeRatio,
    implodingReplacesEK: p.implodingReplacesEK
  };
}
