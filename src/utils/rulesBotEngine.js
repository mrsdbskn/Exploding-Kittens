import { RULEBOOKS, RULES_FAQS, RULES_FAQS_DE } from '../data/rulesKnowledge.js';
import { ALL_CARDS_CATALOG } from '../data/decksData.js';
import { CARD_TRANSLATIONS_DE } from '../data/translations.js';

/**
 * Intelligent Exploding Kittens Rules Bot Engine
 * Resolves rule questions, conflicts, and edge cases using official rulebooks and card mechanics.
 * Supports both English (en) and German (de) query handling and official rule citations.
 */

export function queryRulesEngine(userQuery, lang = 'en') {
  const queryRaw = (userQuery || '').trim();

  // Auto-detect German keywords if lang not explicitly passed as 'de'
  const isGerman = lang === 'de' || /(kann|nicht|entschärf|angriff|aussetzen|nö|doch|misch|katze|bombe|toten|karte|zukunft|regel|spiel|wer|wann)/i.test(queryRaw);

  if (!queryRaw) {
    if (isGerman) {
      return {
        answer: "Miau! Ich bin dein Exploding Kittens Schiedsrichter. Frag mich alles über Regeln, Kartentiming, Nö!-Karten, Entschärfungen, Kombos oder Erweiterungsregeln während deines Spiels!",
        reference: null,
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
      answer: "I am your Exploding Kittens Rules Referee! Ask me anything about card interactions, turn timing, Nopes, combos, or expansion rules.",
      reference: null,
      relatedCards: ['nope', 'defuse', 'exploding-kitten'],
      suggestedQuestions: [
        "Can you Nope a Defuse?",
        "Can you Nope a Nope?",
        "What happens if someone steals my Exploding Kitten with Streaking Kitten?",
        "Do Attack cards stack turns?",
        "How do Cat Card combos work?"
      ]
    };
  }

  const query = queryRaw.toLowerCase();
  const STOP_WORDS = new Set([
    'wie', 'was', 'wer', 'wann', 'ist', 'sind', 'der', 'die', 'das', 'den', 'dem', 'des',
    'ein', 'eine', 'einer', 'einen', 'einem', 'eines', 'und', 'oder', 'aber', 'von', 'mit',
    'auf', 'aus', 'bei', 'nach', 'funktioniert', 'funktionieren',
    'how', 'what', 'who', 'when', 'the', 'and', 'for', 'can', 'you', 'does', 'did',
    'with', 'from', 'where', 'are', 'this', 'work', 'works'
  ]);
  const tokens = query.split(/\W+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));

  // 1. Direct FAQ Matching (Prioritize language-appropriate FAQ pool)
  const faqPool = isGerman ? RULES_FAQS_DE : RULES_FAQS;
  let bestFaqMatch = null;
  let highestFaqScore = 0;

  for (const faq of faqPool) {
    let score = 0;
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();

    // Key phrase matches
    if (query.includes(qLower) || qLower.includes(query)) {
      score += 18;
    }

    // Token overlap
    for (const t of tokens) {
      if (qLower.includes(t)) score += 4;
      if (aLower.includes(t)) score += 1.5;
      if (faq.relatedCards && faq.relatedCards.some(rc => rc.includes(t))) score += 4;
    }

    if (score > highestFaqScore && score >= 5) {
      highestFaqScore = score;
      bestFaqMatch = faq;
    }
  }

  // Cross-language fallback if no German FAQ hit
  if (!bestFaqMatch && isGerman) {
    for (const faq of RULES_FAQS) {
      let score = 0;
      for (const t of tokens) {
        if (faq.relatedCards && faq.relatedCards.some(rc => rc.includes(t))) score += 4;
      }
      if (score > highestFaqScore && score >= 6) {
        // Find corresponding German FAQ
        const matchDe = RULES_FAQS_DE.find(f => f.id === faq.id);
        if (matchDe) {
          bestFaqMatch = matchDe;
          highestFaqScore = score;
        }
      }
    }
  }

  if (bestFaqMatch) {
    const refPrefix = isGerman ? 'Offizielles Regelbuch FAQ:' : 'Official Rulebook FAQ:';
    return {
      answer: bestFaqMatch.answer,
      reference: `${refPrefix} ${bestFaqMatch.ruleDeck}`,
      relatedCards: bestFaqMatch.relatedCards,
      suggestedQuestions: isGerman ? getSuggestedFollowupsDe(bestFaqMatch.id) : getSuggestedFollowups(bestFaqMatch.id)
    };
  }

  // 2. Card-Specific Lookup (Bilingual check)
  let bestCardSlug = null;
  let highestCardScore = 0;

  for (const slug in ALL_CARDS_CATALOG) {
    const cardEn = ALL_CARDS_CATALOG[slug];
    const cardDe = CARD_TRANSLATIONS_DE[slug];
    const nameEn = cardEn.name.toLowerCase();
    const nameDe = cardDe?.name ? cardDe.name.toLowerCase() : '';
    let score = 0;

    if (query.includes(nameEn) || query.includes(slug.replace(/-/g, ' '))) {
      score += 15;
    }
    if (nameDe && query.includes(nameDe)) {
      score += 18;
    }

    for (const t of tokens) {
      if (nameEn.includes(t)) score += 4;
      if (nameDe && nameDe.includes(t)) score += 5;
      if (cardEn.shortDesc && cardEn.shortDesc.toLowerCase().includes(t)) score += 1.5;
      if (cardDe?.shortDesc && cardDe.shortDesc.toLowerCase().includes(t)) score += 2;
    }

    if (score > highestCardScore && score >= 5) {
      highestCardScore = score;
      bestCardSlug = slug;
    }
  }

  if (bestCardSlug) {
    const cardEn = ALL_CARDS_CATALOG[bestCardSlug];
    const cardDe = CARD_TRANSLATIONS_DE[bestCardSlug];

    if (isGerman && cardDe) {
      let explanation = `Hier sind die offiziellen Regeln für **${cardDe.name}**:\n\n`;
      if (cardDe.shortDesc) {
        explanation += `*${cardDe.shortDesc}*\n\n`;
      }
      if (cardDe.mechanics) {
        explanation += `${cardDe.mechanics}`;
      } else {
        explanation += `Befolge die spezifischen Anweisungen auf der Karte, bevor du deinen Zug beendest.`;
      }
      return {
        answer: explanation,
        reference: `Karten-Mechanik: ${cardDe.name}`,
        relatedCards: [bestCardSlug],
        suggestedQuestions: [
          "Kann diese Karte mit Nö! abgewehrt werden?",
          "Wann kann ich diese Karte spielen?",
          "Beendet diese Karte meinen Zug?"
        ]
      };
    } else {
      let explanation = `Here are the official rules for **${cardEn.name}**:\n\n`;
      if (cardEn.shortDesc) {
        explanation += `*${cardEn.shortDesc}*\n\n`;
      }
      if (cardEn.mechanics) {
        explanation += `${cardEn.mechanics}`;
      } else {
        explanation += `Follow the specific instructions printed on the face of the card before ending your turn.`;
      }
      return {
        answer: explanation,
        reference: `Card Mechanics: ${cardEn.name}`,
        relatedCards: [bestCardSlug],
        suggestedQuestions: [
          "Can this card be Noped?",
          "When can I play this card?",
          "Does this card end my turn?"
        ]
      };
    }
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
      suggestedQuestions: isGerman ? [
        "Kann man Karten spielen ohne zu ziehen?",
        "Was passiert beim Ziehen eines Explodierenden Kätzchens?",
        "Wie funktionieren Katzenkarten-Kombos?"
      ] : [
        "Can you play cards without drawing?",
        "What happens when you draw an Exploding Kitten?",
        "How do Cat Card combos work?"
      ]
    };
  }

  // 4. Fallback smart general reply
  if (isGerman) {
    return {
      answer: `Ich konnte keine exakte Regel für "${queryRaw}" finden.\n\n**Wichtige Exploding Kittens Grundregeln:**\n• Du darfst in deinem Zug so viele Handkarten ausspielen wie du möchtest, oder gar keine.\n• Karten ausspielen beendet deinen Zug NICHT — erst das Ziehen einer Karte beendet deinen Spielzug (außer bei Angriff oder Aussetzen).\n• Explodierende Kätzchen und Entschärfungen können NIEMALS mit einer Nö!-Karte abgewehrt werden.\n• Nö!-Karten können zu jedem Zeitpunkt gespielt werden, auch auf andere Nö!-Karten ("Doch!").\n• Katzenkarten haben alleine keinen Effekt, sondern entfalten ihre Wirkung in Kombos (2 gleiche, 3 gleiche oder 5 verschiedene).`,
      reference: 'Offizielles Regelbuch',
      relatedCards: ['exploding-kitten', 'defuse', 'nope'],
      suggestedQuestions: [
        "Kann man eine Entschärfung mit Nö! abwehren?",
        "Addieren sich Angriffskarten?",
        "Wie funktioniert Streaking Kitten?",
        "Wie funktionieren Katzenkarten-Kombos?"
      ]
    };
  }

  return {
    answer: `I could not find an exact rule for "${queryRaw}".\n\n**Key Exploding Kittens Principles:**\n• You may play as many cards as you want, or no cards at all, on your turn.\n• Playing cards does NOT end your turn — drawing a card ends your turn (unless you play an Attack or Skip).\n• Exploding Kittens and Defuse cards can NEVER be Noped.\n• Nopes can be played at any time, even on other Nopes ("Yup!").\n• Cat cards only work in combos (pairs, 3 of a kind, or 5 different).`,
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

function getSuggestedFollowupsDe(currentId) {
  const followups = {
    'nope-defuse': [
      "Kann man ein Nö! auf ein Nö! spielen?",
      "Kann ein Barking Kitten mit Nö! abgewehrt werden?",
      "Kann das Implodierende Kätzchen entschärft werden?"
    ],
    'nope-a-nope': [
      "Kann man eine Entschärfung mit Nö! abwehren?",
      "Kann man nach dem Kartenziehen noch ein Nö! spielen?",
      "Kann die Gottkatze als Nö! gespielt werden?"
    ],
    'attack-stacking': [
      "Beendet Super-Aussetzen alle Züge?",
      "Kann man einen Angriff auf einen Angriff spielen?",
      "Was passiert, wenn man beim ersten Angriffszug eine Bombe zieht?"
    ],
    'cat-combo-steals': [
      "Wie funktioniert die Wilde Katze (Feral Cat)?",
      "Was ist die 5-Karten-Kombo?",
      "Kann man Karten aus dem Turm der Macht stehlen?"
    ],
    'streaking-stolen-ek': [
      "Wie viele Bomben nimmt man mit Streaking Kitten?",
      "Was passiert, wenn man Streaking Kitten verliert?",
      "Darf man 2 Explodierende Kätzchen halten?"
    ]
  };
  return followups[currentId] || [
    "Kann man eine Entschärfung mit Nö! abwehren?",
    "Addieren sich Angriffskarten?",
    "Wie funktioniert Streaking Kitten mit Bomben?"
  ];
}
