import { RULEBOOKS, RULES_FAQS } from '../data/rulesKnowledge.js';
import { ALL_CARDS_CATALOG } from '../data/decksData.js';

/**
 * Intelligent Exploding Kittens Rules Bot Engine
 * Resolves rule questions, conflicts, and edge cases using official rulebooks and card mechanics.
 */

export function queryRulesEngine(userQuery) {
  if (!userQuery || !userQuery.trim()) {
    return {
      answer: "I am your Exploding Kittens Rules Referee! Ask me anything about card interactions, turn timing, Nopes, combos, or expansion rules.",
      reference: null,
      relatedCards: [],
      suggestedQuestions: [
        "Can you Nope a Defuse?",
        "Can you Nope a Nope?",
        "What happens if someone steals my Exploding Kitten with Streaking Kitten?",
        "Do Attack cards stack turns?",
        "How do Cat Card combos work?"
      ]
    };
  }

  const query = userQuery.toLowerCase().trim();
  const tokens = query.split(/\W+/).filter(t => t.length > 2);

  // 1. Direct FAQ Matching
  let bestFaqMatch = null;
  let highestFaqScore = 0;

  for (const faq of RULES_FAQS) {
    let score = 0;
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();

    // Check key phrase matches
    if (query.includes(qLower) || qLower.includes(query)) {
      score += 15;
    }

    // Token overlap
    for (const t of tokens) {
      if (qLower.includes(t)) score += 3;
      if (aLower.includes(t)) score += 1;
      if (faq.relatedCards.some(rc => rc.includes(t))) score += 4;
    }

    if (score > highestFaqScore && score >= 5) {
      highestFaqScore = score;
      bestFaqMatch = faq;
    }
  }

  if (bestFaqMatch) {
    return {
      answer: bestFaqMatch.answer,
      reference: `Official Rulebook FAQ: ${bestFaqMatch.ruleDeck}`,
      relatedCards: bestFaqMatch.relatedCards,
      suggestedQuestions: getSuggestedFollowups(bestFaqMatch.id)
    };
  }

  // 2. Card-Specific Lookup
  let bestCardMatch = null;
  let highestCardScore = 0;

  for (const slug in ALL_CARDS_CATALOG) {
    const card = ALL_CARDS_CATALOG[slug];
    const nameLower = card.name.toLowerCase();
    let score = 0;

    if (query.includes(nameLower) || query.includes(slug.replace(/-/g, ' '))) {
      score += 12;
    }

    for (const t of tokens) {
      if (nameLower.includes(t)) score += 4;
      if (card.shortDesc && card.shortDesc.toLowerCase().includes(t)) score += 1.5;
      if (card.mechanics && card.mechanics.toLowerCase().includes(t)) score += 1;
    }

    if (score > highestCardScore && score >= 5) {
      highestCardScore = score;
      bestCardMatch = card;
    }
  }

  if (bestCardMatch) {
    let explanation = `Here are the official rules for **${bestCardMatch.name}**:\n\n`;
    if (bestCardMatch.shortDesc) {
      explanation += `*${bestCardMatch.shortDesc}*\n\n`;
    }
    if (bestCardMatch.mechanics) {
      explanation += `${bestCardMatch.mechanics}`;
    } else {
      explanation += `Follow the specific instructions printed on the face of the card before ending your turn.`;
    }

    return {
      answer: explanation,
      reference: `Card Mechanics: ${bestCardMatch.name}`,
      relatedCards: [bestCardMatch.slug],
      suggestedQuestions: [
        "Can this card be Noped?",
        "When can I play this card?",
        "Does this card end my turn?"
      ]
    };
  }

  // 3. Rulebook Section Search
  let bestSectionMatch = null;
  let sectionScore = 0;

  for (const rb of RULEBOOKS) {
    for (const sec of rb.sections) {
      let score = 0;
      const sTitle = sec.title.toLowerCase();
      const sContent = sec.content.toLowerCase();

      for (const t of tokens) {
        if (sTitle.includes(t)) score += 4;
        if (sContent.includes(t)) score += 1;
      }

      if (score > sectionScore && score >= 4) {
        sectionScore = score;
        bestSectionMatch = {
          deckTitle: rb.title,
          sectionTitle: sec.title,
          content: sec.content
        };
      }
    }
  }

  if (bestSectionMatch) {
    return {
      answer: `**${bestSectionMatch.sectionTitle}** (${bestSectionMatch.deckTitle}):\n\n${bestSectionMatch.content}`,
      reference: `${bestSectionMatch.deckTitle} — ${bestSectionMatch.sectionTitle}`,
      relatedCards: [],
      suggestedQuestions: [
        "Can you play cards without drawing?",
        "What happens when you draw an Exploding Kitten?",
        "How do Cat Card combos work?"
      ]
    };
  }

  // Fallback smart general reply
  return {
    answer: `I could not find an exact rule for "${userQuery}".\n\n**Key Exploding Kittens Principles:**\n• You may play as many cards as you want, or no cards at all, on your turn.\n• Playing cards does NOT end your turn — drawing a card ends your turn (unless you play an Attack or Skip).\n• Exploding Kittens and Defuse cards can NEVER be Noped.\n• Nopes can be played at any time, even on other Nopes ("Yup!").\n• Cat cards only work in combos (pairs, 3 of a kind, or 5 different).`,
    reference: 'Official General Rulebook',
    relatedCards: ['exploding-kitten', 'defuse', 'nope'],
    suggestedQuestions: [
      "Can you Nope a Defuse?",
      "Do Attack cards stack?",
      "What is the 5-card combo?",
      "How does Streaking Kitten work?"
    ]
  };
}

function getSuggestedFollowups(currentId) {
  const followups = {
    'nope-defuse': [
      "Can you Nope a Nope?",
      "Can a Barking Kitten be Noped?",
      "Can Imploding Kitten be defused?"
    ],
    'nope-a-nope': [
      "Can you Nope a Defuse?",
      "Can you Nope after drawing a card?",
      "Can Godcat be Noped?"
    ],
    'attack-stacking': [
      "Does Super Skip end all attack turns?",
      "Can I play an Attack on an Attack?",
      "What happens if I draw an Exploding Kitten on my first attack turn?"
    ],
    'cat-combo-steals': [
      "How does Feral Cat work?",
      "What is the 5-card combo?",
      "Can I steal cards with Tower of Power?"
    ],
    'streaking-stolen-ek': [
      "How many Exploding Kittens do you use with Streaking Kitten?",
      "What happens if I lose my Streaking Kitten?",
      "Can you hold two Exploding Kittens?"
    ]
  };
  return followups[currentId] || [
    "Can you Nope a Defuse?",
    "Do Attack cards stack?",
    "How does Streaking Kitten work?"
  ];
}
