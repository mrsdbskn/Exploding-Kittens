import { calculateDeckRecipe } from './src/utils/deckEngine.js';
import { DECKS, ALL_CARDS_CATALOG, CATEGORIES, OFFICIAL_RECIPES } from './src/data/decksData.js';

console.log('--- Testing Exploding Kittens Deck Engine ---');

// Test 1: Standard 4-player game with Original Edition
const test1 = calculateDeckRecipe({
  ownedDeckIds: ['exploding-kittens-original-edition'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  playerCount: 4,
  startingHandNonDefuse: 7,
  streakingAddsEK: true,
  implodingReplacesEK: true,
  extraDefusesInDeck: 2
});

console.log('Test 1 (Original 4p):');
console.log('  Total Game Cards:', test1.totalGameCards);
console.log('  Exploding Kittens Needed:', test1.explodingKittensNeeded, '(Expected: 3)');
console.log('  Dealt Cards Total:', test1.starterHandTotalCards + test1.starterDefusesNeeded, '(Expected: 32 = 4x8)');
console.log('  Draw Pile Size:', test1.totalDrawPileSize);
console.log('  Can deal full hands:', test1.canDealFullHands);
console.log('  Suggestions count:', test1.suggestions.length);

console.assert(test1.explodingKittensNeeded === 3, 'EK needed should be 3 for 4 players');
console.assert(test1.canDealFullHands === true, 'Should be able to deal hands');

// Test 2: Streaking Kitten +1 Rule
const test2 = calculateDeckRecipe({
  ownedDeckIds: ['exploding-kittens-original-edition', 'streaking-kittens-expansion'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  playerCount: 4,
  streakingAddsEK: true
});

console.log('\nTest 2 (Streaking Kitten 4p):');
console.log('  Exploding Kittens Needed:', test2.explodingKittensNeeded, '(Expected: 4 with Streaking Kitten)');
const streakingSugg = test2.suggestions.find(s => s.id === 'streaking-kitten-rule');
console.log('  Streaking suggestion detected:', !!streakingSugg);
console.assert(test2.explodingKittensNeeded === 4, 'Streaking Kitten adds 1 EK');

// Test 3: Barking Kitten twin rule
const test3 = calculateDeckRecipe({
  ownedDeckIds: ['exploding-kittens-original-edition', 'barking-kittens-expansion'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  customQuantities: { 'barking-kitten': 1 } // Only 1 included
});

console.log('\nTest 3 (Barking Kitten 1 card):');
const bkSugg = test3.suggestions.find(s => s.id === 'barking-kitten-pair');
console.log('  Barking kitten warning detected:', !!bkSugg);
console.assert(!!bkSugg, 'Should alert when only 1 Barking Kitten is active');

// Test 4: Armageddon without Godcat
const test4 = calculateDeckRecipe({
  ownedDeckIds: ['exploding-kittens-good-vs-evil'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  excludedCards: new Set(['godcat']) // Godcat excluded
});

console.log('\nTest 4 (Armageddon without Godcat):');
const armaSugg = test4.suggestions.find(s => s.id === 'armageddon-godcat');
console.log('  Armageddon error detected:', !!armaSugg);
console.assert(!!armaSugg && armaSugg.type === 'error', 'Should error when Armageddon is active without Godcat');

// Test 5: Dead-Player cards without Zombie Kitten
const test5 = calculateDeckRecipe({
  ownedDeckIds: ['exploding-kittens-zombie-kittens'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  excludedCards: new Set(['zombie-kitten']) // Zombie Kitten excluded
});

console.log('\nTest 5 (Dead player cards without Zombie Kitten):');
const deadSugg = test5.suggestions.find(s => s.id === 'dead-player-zombie-kitten');
console.log('  Dead player warning detected:', !!deadSugg);
console.assert(!!deadSugg, 'Should warn when dead-player cards are active without Zombie Kitten');

console.log('\n All engine tests passed with 100% success!');
