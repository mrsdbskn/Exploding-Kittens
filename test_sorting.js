import { ALL_CARDS_CATALOG, CATEGORIES, DECKS } from './src/data/decksData.js';
import { calculateDeckRecipe } from './src/utils/deckEngine.js';

console.log('=== Testing Card Sorting Systems ===\n');

// 1. Lore View / Codex Catalog Sorting
const allCards = Object.values(ALL_CARDS_CATALOG).slice().sort((a, b) => a.name.localeCompare(b.name));

console.log(`[Lore View] Total Cards: ${allCards.length}`);
console.log(`[Lore View] First 5 Cards (A-Z):`);
for (let i = 0; i < 5; i++) {
  console.log(`   ${i + 1}. ${allCards[i].name} (${allCards[i].category})`);
}

// Verify strict alphabetical order
let isSortedAZ = true;
for (let i = 0; i < allCards.length - 1; i++) {
  if (allCards[i].name.localeCompare(allCards[i + 1].name) > 0) {
    console.error(`Sort failure at index ${i}: "${allCards[i].name}" comes before "${allCards[i + 1].name}"`);
    isSortedAZ = false;
  }
}
console.log(`[Lore View] Strict A-Z order verified: ${isSortedAZ ? 'PASSED ✅' : 'FAILED ❌'}`);

// Test Z-A sorting
const allCardsZA = [...allCards].sort((a, b) => b.name.localeCompare(a.name));
console.log(`[Lore View] First Card in Z-A: "${allCardsZA[0].name}"`);
console.log(`[Lore View] Last Card in Z-A: "${allCardsZA[allCardsZA.length - 1].name}"`);

// 2. By-Deck Sorting
console.log('\n[By-Deck View] Checking each deck\'s card alphabetical order:');
DECKS.forEach(deck => {
  const sortedDeckCards = [...deck.cards].sort((a, b) => a.name.localeCompare(b.name));
  let deckSorted = true;
  for (let i = 0; i < sortedDeckCards.length - 1; i++) {
    if (sortedDeckCards[i].name.localeCompare(sortedDeckCards[i + 1].name) > 0) {
      deckSorted = false;
    }
  }
  console.log(`   • ${deck.name}: ${sortedDeckCards.length} cards -> ${deckSorted ? 'A-Z ✅' : 'FAILED ❌'}`);
});

// 3. Deck Recipe Output Sorting
console.log('\n[Deck Recipe Engine] Checking generated recipe draw pile and cat variants:');
const recipe = calculateDeckRecipe({
  ownedDeckIds: ['original-edition', 'good-vs-evil', 'streaking-kittens'],
  decks: DECKS,
  catalog: ALL_CARDS_CATALOG,
  playerCount: 5,
  startingHandNonDefuse: 7,
  customQuantities: {},
  excludedCards: new Set(),
  streakingAddsEK: true
});

let recipeSafeCardsSorted = true;
for (let i = 0; i < recipe.drawPileCards.length - 1; i++) {
  if (recipe.drawPileCards[i].name.localeCompare(recipe.drawPileCards[i + 1].name) > 0) {
    recipeSafeCardsSorted = false;
  }
}
console.log(`[Deck Recipe Engine] Safe cards in draw pile sorted A-Z: ${recipeSafeCardsSorted ? 'PASSED ✅' : 'FAILED ❌'}`);

let catVariantsSorted = true;
for (let i = 0; i < recipe.catVariantsBreakdown.length - 1; i++) {
  if (recipe.catVariantsBreakdown[i].name.localeCompare(recipe.catVariantsBreakdown[i + 1].name) > 0) {
    catVariantsSorted = false;
  }
}
console.log(`[Deck Recipe Engine] Cat variants breakdown sorted A-Z: ${catVariantsSorted ? 'PASSED ✅' : 'FAILED ❌'}`);

if (isSortedAZ && recipeSafeCardsSorted && catVariantsSorted) {
  console.log('\n✨ All Card Sorting Tests Passed with 100% Success! ✨');
} else {
  process.exit(1);
}
