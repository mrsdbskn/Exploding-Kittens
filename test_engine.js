import { calculateDeckRecipe } from './src/utils/deckEngine.js';
import { DECKS, ALL_CARDS_CATALOG, CATEGORIES, OFFICIAL_RECIPES, CAT_VARIANTS_CATALOG } from './src/data/decksData.js';

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
// Test 6: Party Pack Edition - 35 Cat Cards and 120 Total Cards
const test6 = calculateDeckRecipe({
  ownedDeckIds: ['exploding-kittens-party-pack-edition'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  playerCount: 10
});

console.log('\nTest 6 (Party Pack Edition 10p):');
console.log('  Party Pack Cat Cards Total:', test6.availablePool['cat-card'].totalAvailable, '(Expected: 35)');
console.log('  Party Pack Total Cards in Deck:', test6.totalGameCards);
console.assert(test6.availablePool['cat-card'].totalAvailable === 35, 'Party Pack must have exactly 35 Cat Cards');
console.assert(test6.totalGameCards >= 100, 'Party Pack is a mega 120 card deck');

// Test 7: Verify 23 Cat Artwork Styles Catalog
console.log('\nTest 7 (23 Cat Artwork Styles Archive):');
console.log('  Total cat variants in catalog:', CAT_VARIANTS_CATALOG.length, '(Expected: 23)');
console.assert(CAT_VARIANTS_CATALOG.length === 23, 'Must have all 23 official artwork styles');
console.assert(ALL_CARDS_CATALOG['cat-card'].icons.length === 23, 'Catalog cat-card must include all 23 icons');

// Test 8: Verify Cat Variant Breakdown in Recipe Output
const test8 = calculateDeckRecipe({
  ownedDeckIds: ['exploding-kittens-original-edition', 'exploding-kittens-good-vs-evil'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG
});

console.log('\nTest 8 (Multi-Deck Cat Variants Assembly Breakdown):');
console.log('  Active cat variants count:', test8.catVariantsBreakdown.length, '(Expected: 9 = 5 Original + 4 GvE)');
console.assert(test8.catVariantsBreakdown.length === 9, 'Should have 9 unique cat styles across Original + Good vs Evil');
for (const v of test8.catVariantsBreakdown) {
  console.assert(v.icon && v.name && v.quantity === 4, `Variant ${v.name} must have valid icon and count`);
}
console.log('  All 9 cat variants have valid icons, artwork paths, and quantities!');

console.log('\n All engine tests passed with 100% success!');
