/**
 * Deck Calculation and Synergy / Dependency Engine for Exploding Kittens
 */

/**
 * Calculates the exact deck recipe based on:
 * - Owned decks
 * - User card inclusions / quantity overrides
 * - Player count
 * - Special rule options (Streaking Kitten extra EK, Imploding replaces EK, starting hand size)
 */
export function calculateDeckRecipe({
  ownedDeckIds = [],
  decks = [],
  catalog = {},
  customQuantities = {}, // { [slug]: number }
  excludedCards = new Set(), // Set of slugs
  playerCount = 4,
  startingHandNonDefuse = 7,
  implodingReplacesEK = true,
  streakingAddsEK = true,
  extraDefusesInDeck = 2
}) {
  // 1. Calculate the maximum available pool of cards from owned decks
  const availablePool = {}; // slug -> { count, cardInfo, deckSources: [] }
  
  for (const deck of decks) {
    if (!ownedDeckIds.includes(deck.id)) continue;
    
    for (const card of deck.cards) {
      if (!availablePool[card.slug]) {
        availablePool[card.slug] = {
          slug: card.slug,
          name: card.name,
          category: card.category,
          icons: card.icons,
          shortDesc: card.shortDesc,
          mechanics: card.mechanics,
          totalAvailable: 0,
          deckSources: []
        };
      }
      availablePool[card.slug].totalAvailable += card.quantity;
      availablePool[card.slug].deckSources.push({
        deckId: deck.id,
        deckName: deck.name,
        quantity: card.quantity
      });
    }
  }

  // 2. Determine active desired quantities for each card
  const activeCards = {};
  for (const slug in availablePool) {
    if (excludedCards.has(slug)) {
      activeCards[slug] = 0;
      continue;
    }
    
    // Check if custom override exists
    if (customQuantities[slug] !== undefined) {
      activeCards[slug] = Math.max(0, Math.min(customQuantities[slug], availablePool[slug].totalAvailable));
    } else {
      // Default to total available in owned decks
      activeCards[slug] = availablePool[slug].totalAvailable;
    }
  }

  // 3. Detect Synergies, Dependencies, and Warnings
  const suggestions = [];

  const hasCard = (slug) => (activeCards[slug] || 0) > 0;
  const getQty = (slug) => activeCards[slug] || 0;
  const getAvail = (slug) => (availablePool[slug] ? availablePool[slug].totalAvailable : 0);

  // --- Barking Kitten Dependency ---
  if (hasCard('barking-kitten')) {
    const bkCount = getQty('barking-kitten');
    if (bkCount < 2) {
      suggestions.push({
        id: 'barking-kitten-pair',
        type: 'warning',
        cardSlug: 'barking-kitten',
        title: 'Barking Kitten needs its twin!',
        message: 'Barking Kitten requires at least 2 cards to form a functional pair. When one is played, the other player explodes unless defused.',
        actionType: getAvail('barking-kitten') >= 2 ? 'SET_QUANTITY' : 'EXCLUDE',
        actionPayload: { slug: 'barking-kitten', qty: getAvail('barking-kitten') >= 2 ? 2 : 0 },
        actionLabel: getAvail('barking-kitten') >= 2 ? 'Include Pair (2)' : 'Exclude Barking Kitten'
      });
    }
  }

  // --- Armageddon & Godcat / Devilcat Dependency ---
  if (hasCard('armageddon')) {
    if (!hasCard('godcat')) {
      suggestions.push({
        id: 'armageddon-godcat',
        type: 'error',
        cardSlug: 'armageddon',
        title: 'Armageddon requires Godcat!',
        message: 'Armageddon can ONLY be played if Godcat is on the playmat. Playing it without Godcat breaks the official rule.',
        actionType: getAvail('godcat') > 0 ? 'SET_QUANTITY' : 'EXCLUDE',
        actionPayload: getAvail('godcat') > 0 ? { slug: 'godcat', qty: 1 } : { slug: 'armageddon', qty: 0 },
        actionLabel: getAvail('godcat') > 0 ? 'Add Godcat' : 'Exclude Armageddon'
      });
    }
    if (!hasCard('devilcat') && getAvail('devilcat') > 0) {
      suggestions.push({
        id: 'armageddon-devilcat',
        type: 'info',
        cardSlug: 'devilcat',
        title: 'Armageddon plays best with Devilcat',
        message: 'In Good vs Evil, Armageddon pits Godcat against Devilcat. Adding Devilcat creates the official face-off experience.',
        actionType: 'SET_QUANTITY',
        actionPayload: { slug: 'devilcat', qty: 1 },
        actionLabel: 'Add Devilcat'
      });
    }
  }

  // --- Streaking Kitten Synergy ---
  if (hasCard('streaking-kitten')) {
    suggestions.push({
      id: 'streaking-kitten-rule',
      type: 'success',
      cardSlug: 'streaking-kitten',
      title: 'Streaking Kitten Active: +1 Exploding Kitten',
      message: `Streaking Kitten allows 1 player to safely hold an Exploding Kitten in secret. Therefore, ${playerCount} Exploding Kittens (instead of ${playerCount - 1}) are recommended so everyone can explode.`,
      actionType: 'TOGGLE_STREAKING_RULE',
      actionPayload: { enabled: !streakingAddsEK },
      actionLabel: streakingAddsEK ? 'Using +1 Rule (Active)' : 'Enable +1 EK Rule'
    });
  }

  // --- Zombie Kittens & Dead Player Mechanics ---
  const deadPlayerCards = ['attack-of-the-dead', 'feed-the-dead', 'grave-robber', 'clairvoyance'];
  const activeDeadCards = deadPlayerCards.filter(slug => hasCard(slug));
  if (activeDeadCards.length > 0 && !hasCard('zombie-kitten')) {
    suggestions.push({
      id: 'dead-player-zombie-kitten',
      type: 'warning',
      cardSlug: 'zombie-kitten',
      title: 'Dead-Player cards active without Zombie Kitten',
      message: `${activeDeadCards.map(s => catalog[s]?.name || s).join(', ')} require dead players to stay in the game. Without Zombie Kitten cards to revive them, dead-player interactions will be non-functional.`,
      actionType: getAvail('zombie-kitten') > 0 ? 'SET_QUANTITY' : 'EXCLUDE_DEAD_CARDS',
      actionPayload: getAvail('zombie-kitten') > 0 ? { slug: 'zombie-kitten', qty: Math.min(playerCount, getAvail('zombie-kitten')) } : { slugs: activeDeadCards },
      actionLabel: getAvail('zombie-kitten') > 0 ? 'Include Zombie Kittens' : 'Remove Dead-Player Cards'
    });
  }

  // --- Cat Cards Pair Synergies ---
  if (hasCard('cat-card')) {
    const catQty = getQty('cat-card');
    const hasFeral = hasCard('feral-cat');
    if (catQty < 4 && !hasFeral) {
      suggestions.push({
        id: 'cat-cards-pair-warning',
        type: 'warning',
        cardSlug: 'cat-card',
        title: 'Cat Cards need Pairs or Feral Cats',
        message: `You currently have only ${catQty} Cat Cards. Standard Cat Cards have no instructions on their own and require at least 2 of the same type to steal cards.`,
        actionType: getAvail('feral-cat') > 0 ? 'ADD_FERAL_CATS' : 'INFO',
        actionPayload: { slug: 'feral-cat', qty: 2 },
        actionLabel: getAvail('feral-cat') > 0 ? 'Add Feral Cats (Wildcard)' : 'Acknowledge'
      });
    }
  }

  // --- Alter the Future vs See the Future ---
  if (hasCard('see-the-future-3x') && hasCard('alter-the-future-3x')) {
    suggestions.push({
      id: 'see-alter-future-synergy',
      type: 'info',
      cardSlug: 'alter-the-future-3x',
      title: 'See the Future vs Alter the Future',
      message: 'Alter the Future is a strictly stronger upgrade (allows viewing AND rearranging). You can keep both or replace See the Future for higher strategic depth.',
      actionType: 'INFO',
      actionPayload: {},
      actionLabel: 'Got it'
    });
  }

  // --- Imploding Kitten Rule ---
  if (hasCard('imploding-kitten')) {
    suggestions.push({
      id: 'imploding-kitten-info',
      type: 'info',
      cardSlug: 'imploding-kitten',
      title: 'Imploding Kitten Hazard',
      message: implodingReplacesEK 
        ? 'Imploding Kitten replaces 1 Exploding Kitten (maintains standard hazard count).'
        : 'Imploding Kitten added as an EXTRA hazard (faster, more cutthroat elimination).',
      actionType: 'TOGGLE_IMPLODING_MODE',
      actionPayload: { replaces: !implodingReplacesEK },
      actionLabel: implodingReplacesEK ? 'Switch to Extra Hazard' : 'Switch to Replace EK'
    });
  }

  // --- Tower of Power Stash ---
  if (hasCard('tower-of-power')) {
    suggestions.push({
      id: 'tower-of-power-stash',
      type: 'info',
      cardSlug: 'tower-of-power',
      title: 'Tower of Power Crown Stash',
      message: 'When Tower of Power is drawn, 6 cards from the draw pile are stashed inside the crown. Players steal from the crown instead of your hand.',
      actionType: 'INFO',
      actionPayload: {},
      actionLabel: 'Understood'
    });
  }

  // 4. Exact Recipe & Card Assembly Counts Calculation
  // Exploding Kittens Count:
  let explodingKittensNeeded = playerCount - 1;
  if (hasCard('streaking-kitten') && streakingAddsEK) {
    explodingKittensNeeded = playerCount; // 1 extra
  }
  if (hasCard('imploding-kitten') && implodingReplacesEK) {
    explodingKittensNeeded = Math.max(1, explodingKittensNeeded - 1);
  }

  // Defuses:
  // Each player starts with 1 Defuse (or 1 Zombie Kitten if Zombie mode)
  const isZombieDeckMode = hasCard('zombie-kitten') && !hasCard('defuse');
  const starterDefusesNeeded = playerCount;
  const totalDefusesAvailable = getQty(isZombieDeckMode ? 'zombie-kitten' : 'defuse');
  const starterCardsDefuseSlug = isZombieDeckMode ? 'zombie-kitten' : 'defuse';

  // Extra Defuses to insert into draw pile:
  const extraDefusesMax = Math.max(0, totalDefusesAvailable - starterDefusesNeeded);
  const extraDefusesToInsert = Math.min(extraDefusesInDeck, extraDefusesMax);

  // Starter Hand Cards (Non-defuses):
  // 7 cards per player (or startingHandNonDefuse)
  const starterHandTotalCards = playerCount * startingHandNonDefuse;

  // Draw pile non-hazard cards:
  // All active cards excluding hazards and defuses:
  const drawPileCards = [];
  const starterHandPool = [];
  const hazardsList = [];
  const lifesaversList = [];
  const tableStashList = [];

  let totalSafeCards = 0;

  for (const slug in activeCards) {
    const qty = activeCards[slug];
    if (qty <= 0) continue;

    const cardInfo = availablePool[slug];

    if (slug === 'exploding-kitten') {
      hazardsList.push({
        ...cardInfo,
        quantity: Math.min(qty, explodingKittensNeeded),
        ruleNote: `Insert ${Math.min(qty, explodingKittensNeeded)} Exploding Kittens into the draw pile after dealing.`
      });
    } else if (slug === 'imploding-kitten') {
      hazardsList.push({
        ...cardInfo,
        quantity: 1,
        ruleNote: 'Insert face down into the draw pile. Cannot be defused!'
      });
    } else if (slug === 'devilcat') {
      tableStashList.push({
        ...cardInfo,
        quantity: 1,
        ruleNote: 'Place face up on the playmat next to Godcat for the Armageddon duel.'
      });
    } else if (slug === 'godcat') {
      tableStashList.push({
        ...cardInfo,
        quantity: 1,
        ruleNote: 'Place face up on the playmat next to Devilcat. Usable as any non-Nope card.'
      });
    } else if (slug === 'defuse' || slug === 'zombie-kitten') {
      lifesaversList.push({
        ...cardInfo,
        starterQuantity: Math.min(qty, starterDefusesNeeded),
        extraQuantity: extraDefusesToInsert,
        totalQuantity: Math.min(qty, starterDefusesNeeded + extraDefusesToInsert)
      });
    } else {
      // Safe card (action, cat card, etc.)
      totalSafeCards += qty;
      drawPileCards.push({
        ...cardInfo,
        quantity: qty
      });
    }
  }

  // Check if we have enough safe cards to deal starting hands
  const canDealFullHands = totalSafeCards >= starterHandTotalCards;
  const cardsShortage = Math.max(0, starterHandTotalCards - totalSafeCards);

  // Total cards in draw pile after deal:
  const safeCardsInDrawPile = Math.max(0, totalSafeCards - starterHandTotalCards);
  const totalDrawPileSize = safeCardsInDrawPile 
    + (hazardsList.reduce((sum, c) => sum + c.quantity, 0)) 
    + extraDefusesToInsert;

  const totalGameCards = starterHandTotalCards 
    + starterDefusesNeeded 
    + totalDrawPileSize 
    + (tableStashList.reduce((sum, c) => sum + c.quantity, 0));

  return {
    playerCount,
    availablePool,
    activeCards,
    suggestions,
    isZombieDeckMode,
    starterCardsDefuseSlug,
    starterDefusesNeeded,
    extraDefusesToInsert,
    startingHandNonDefuse,
    starterHandNonDefuse: startingHandNonDefuse,
    starterHandTotalCards,
    canDealFullHands,
    cardsShortage,
    hazardsList,
    lifesaversList,
    tableStashList,
    drawPileCards,
    safeCardsInDrawPile,
    totalDrawPileSize,
    totalGameCards,
    explodingKittensNeeded
  };
}
