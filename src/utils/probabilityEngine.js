/**
 * Danger Meter & Draw Probability Simulator for Exploding Kittens
 * Computes draw hazard odds, turn-by-turn survival curve, and deck volatility score.
 */

export function calculateDeckProbabilities(recipe) {
  if (!recipe || !recipe.totalDrawPileSize || recipe.totalDrawPileSize <= 0) {
    return {
      hazardCount: 0,
      drawPileSize: 0,
      turn1HazardChance: 0,
      survivalCurve: [],
      volatilityScore: 0,
      dangerLevel: 'Safe',
      dangerColor: '#4cd964',
      firstBombExpectedTurn: 0,
      analysisSummary: 'No draw pile assembled yet.'
    };
  }

  const drawPileSize = recipe.totalDrawPileSize;
  const hazardCount = (recipe.hazardsList || []).reduce((sum, h) => sum + h.quantity, 0);
  const extraDefuses = recipe.extraDefusesToInsert || 0;
  const playerCount = recipe.playerCount || 4;

  // Turn 1 instant draw hazard probability
  const turn1HazardChance = hazardCount > 0 
    ? Math.min(100, Math.round((hazardCount / drawPileSize) * 1000) / 10)
    : 0;

  // Turn-by-turn cumulative survival curve (turns 1 to Math.min(10, drawPileSize))
  const survivalCurve = [];
  let cumulativeNoHazardProb = 1.0;
  const maxTurns = Math.min(10, drawPileSize);

  for (let turn = 1; turn <= maxTurns; turn++) {
    const cardsLeft = Math.max(1, drawPileSize - (turn - 1));
    const instantBombProb = Math.min(1.0, hazardCount / cardsLeft);
    cumulativeNoHazardProb *= (1.0 - instantBombProb);
    const cumulativeExplosionChance = Math.min(100, Math.round((1.0 - cumulativeNoHazardProb) * 1000) / 10);

    survivalCurve.push({
      turn,
      cardsLeft,
      instantChance: Math.round(instantBombProb * 1000) / 10,
      cumulativeExplosionChance
    });
  }

  // Expected average turn when the first hazard is drawn
  const firstBombExpectedTurn = hazardCount > 0 
    ? Math.max(1, Math.round(drawPileSize / (hazardCount + 1)))
    : drawPileSize;

  // Volatility Score (1 to 100)
  // Higher hazard density, fewer extra defuses, more players increase volatility
  const hazardDensity = hazardCount / drawPileSize; // typically 0.05 to 0.30
  let rawScore = (hazardDensity * 220) + (playerCount * 3) - (extraDefuses * 4);
  const volatilityScore = Math.max(10, Math.min(99, Math.round(rawScore)));

  // Danger Category & Theme Color
  let dangerLevel = 'Standard Russian Roulette';
  let dangerColor = '#ffb4a0';
  let analysisSummary = 'Balanced Russian roulette tension with steady elimination pacing.';

  if (volatilityScore <= 35) {
    dangerLevel = 'Mild & Strategic Chill';
    dangerColor = '#8be5a0';
    analysisSummary = 'Generous safe card buffer. Players have plenty of time to build combos before bombs appear.';
  } else if (volatilityScore <= 60) {
    dangerLevel = 'Balanced Russian Roulette';
    dangerColor = '#ffd248';
    analysisSummary = 'Classic Exploding Kittens tension. High bluffing and steady elimination pacing.';
  } else if (volatilityScore <= 80) {
    dangerLevel = 'Spicy & High Hazard';
    dangerColor = '#ff9800';
    analysisSummary = 'High bomb density! Drawing cards is treacherous from early turns. Every turn counts.';
  } else {
    dangerLevel = 'Apocalyptic Mayhem';
    dangerColor = '#ff5252';
    analysisSummary = 'Extreme hazard density! Imploding/Streaking mechanics and high bomb concentration.';
  }

  return {
    hazardCount,
    drawPileSize,
    turn1HazardChance,
    survivalCurve,
    volatilityScore,
    dangerLevel,
    dangerColor,
    firstBombExpectedTurn,
    analysisSummary
  };
}
