/**
 * Exploding Kittens Official Rulebooks Knowledge Base & FAQs
 * Covering all 11 games and expansions with official mechanics and edge cases.
 */

export const RULEBOOKS = [
  {
    deckId: 'exploding-kittens-original-edition',
    title: 'Exploding Kittens: Original Edition',
    subtitle: 'Base Game Rules & Turn Flow',
    pdfUrl: 'https://dumekj556jp75.cloudfront.net/exploding-kittens/English.pdf',
    sections: [
      {
        title: 'Game Overview & Goal',
        content: `Exploding Kittens is a feline-powered Russian Roulette card game. Players draw cards until somebody draws an Exploding Kitten, at which point they explode, die, and are out of the game — unless that player has a Defuse Card. All other cards in the deck are used to move, mitigate, or avoid the Exploding Kittens. The last player remaining wins the game.`
      },
      {
        title: 'Turn Structure (Play, Pass, Draw)',
        content: `On your turn:
1. Pass or Play: You may play as many cards as you want from your hand face up onto the Discard Pile, or play no cards at all. Some cards have special instructions on them.
2. End your turn by DRAWING: End your turn by drawing 1 card from the top of the Draw Pile into your hand, hoping it is not an Exploding Kitten. (Play continues clockwise around the table).
Note: Playing cards does NOT end your turn; drawing a card does (unless an Attack or Skip card was played).`
      },
      {
        title: 'Defusing & Placing Exploding Kittens',
        content: `If you draw an Exploding Kitten and have a Defuse Card:
1. Play your Defuse Card into the Discard Pile.
2. Take the Exploding Kitten, and without reordering or viewing the other cards, secretly insert it back into the Draw Pile anywhere you want! You can place it on top, on the bottom, or anywhere in between.
3. Your turn is over.`
      },
      {
        title: 'Special Combos (Cat Cards & Pairs)',
        content: `Cat Cards have no instructions on their own, but can be played in powerful combos:
• Two of a Kind: Play 2 matching Cat Cards (or Feral Cat wildcard) to steal 1 random card from any player's hand.
• Three of a Kind: Play 3 matching cards to name a specific card (e.g., "Defuse"). If the target player has it, they must give you 1 of them. If not, you get nothing.
• Five Different Cards: Play 5 cards with different names/icons to search the Discard Pile and take any 1 card of your choice into your hand.`
      },
      {
        title: 'Nope Cards & Restrictions',
        content: `• A Nope Card stops any action card played by another player (Attack, Favor, See the Future, Shuffle, Skip, Cat Combos).
• You can play a Nope at ANY time, even when it is not your turn!
• You can play a Nope on another Nope ("Yup!"), canceling it and allowing the original action to proceed.
• CRITICAL: You CANNOT Nope an Exploding Kitten or a Defuse Card!`
      }
    ]
  },
  {
    deckId: 'exploding-kittens-party-pack-edition',
    title: 'Exploding Kittens: Party Pack Edition',
    subtitle: 'Rules for 2 to 10 Players & Paw Print System',
    pdfUrl: 'https://dumekj556jp75.cloudfront.net/ek-party-pack/EK_Party_Pack-Rules_wAttack.pdf',
    sections: [
      {
        title: 'The Paw Print (🐾) Mechanic',
        content: `The Party Pack includes 120 cards designed to scale dynamically from 2 to 10 players:
• 2 to 3 Players: Use ONLY cards WITHOUT the paw print icon (🐾) in the corner.
• 4 to 7 Players: Use cards WITH the paw print icon (🐾).
• 8 to 10 Players: Combine ALL cards (both with and without paw prints)!`
      },
      {
        title: 'Scaled Exploding Kittens & Defuses',
        content: `• Always include Exploding Kittens equal to Number of Players - 1.
• With 10 players, insert 9 Exploding Kittens into the draw pile!
• Deal 1 Defuse to each player, then shuffle the remaining Defuses into the Draw Pile.`
      }
    ]
  },
  {
    deckId: 'streaking-kittens-expansion',
    title: 'Streaking Kittens: Expansion',
    subtitle: 'Secret Kitten Holding & +1 Hazard Rule',
    pdfUrl: 'https://ek-instructions.s3.amazonaws.com/streaking-kittens/streaking-kittens-rules.pdf',
    sections: [
      {
        title: 'Streaking Kitten Secret Holding',
        content: `While you hold the Streaking Kitten secretly in your hand, you are permitted to draw and hold 1 Exploding Kitten in your hand without blowing up!
• Keep it secret: Do not show anyone that you are holding the Streaking Kitten or the Exploding Kitten.
• If another player steals a card from your hand blindly and picks the Exploding Kitten, THEY explode and must play a Defuse or die!`
      },
      {
        title: 'Extra Exploding Kitten Setup Rule',
        content: `Because 1 player can hold an Exploding Kitten safely in their hand, when setting up the deck with Streaking Kitten, insert EXPLOING KITTENS EQUAL TO THE NUMBER OF PLAYERS (instead of Players - 1). This ensures that exactly one player will survive.`
      },
      {
        title: 'Losing the Streaking Kitten',
        content: `If you are holding an Exploding Kitten and lose your Streaking Kitten (by playing it, having it stolen, or discarding it with Garbage Collection), you must immediately Defuse your Exploding Kitten or explode on the spot!`
      }
    ]
  },
  {
    deckId: 'barking-kittens-expansion',
    title: 'Barking Kittens: Expansion',
    subtitle: 'Twin Barking Kittens & Tower of Power Crown',
    pdfUrl: 'https://dumekj556jp75.cloudfront.net/barking-kittens/barking-kittens-rules.pdf',
    sections: [
      {
        title: 'Barking Kitten Twin Duel',
        content: `Barking Kittens only function as a pair:
• When you play 1 Barking Kitten, place it face up in front of you and ask if anyone has the other Barking Kitten.
• If another player has the other Barking Kitten, they are your target and must immediately play a Defuse Card or explode! Discard both Barking Kittens.
• If NO ONE has the other Barking Kitten, leave your Barking Kitten face up in front of you. When another player eventually plays the second Barking Kitten, YOU become their target and must Defuse or explode.
• If you hold BOTH Barking Kittens, play them together and choose ANY player as your target!`
      },
      {
        title: 'Tower of Power Crown & Stash',
        content: `At the start of the game, 6 cards are set aside blindly as the Crown Stash:
• When you play the Tower of Power card, place the wearable Cat Crown on your head and put the 6 stash cards inside it.
• Protection: Whenever ANY player tries to steal a card from you (Favor, 2-of-a-kind Cat combo, etc.), they must blindly draw a random card from your Crown instead of your hand!
• You may never take cards from your Crown into your own hand.`
      }
    ]
  },
  {
    deckId: 'imploding-kittens-expansion',
    title: 'Imploding Kittens: Expansion',
    subtitle: 'The Inevitable Face-Up Hazard',
    pdfUrl: 'https://dumekj556jp75.cloudfront.net/imploding-kittens/imploding-english.pdf',
    sections: [
      {
        title: 'Imploding Kitten Rules',
        content: `The Imploding Kitten cannot be Defused or Noped!
1. When drawn FACE DOWN for the first time: You do NOT explode. Without using a Defuse, flip the Imploding Kitten FACE UP and insert it anywhere into the Draw Pile in secret.
2. When drawn FACE UP: You explode immediately! This card CANNOT be defused by any card and you are instantly eliminated.`
      }
    ]
  },
  {
    deckId: 'exploding-kittens-zombie-kittens',
    title: 'Exploding Kittens: Zombie Kittens',
    subtitle: 'Playing from the Grave & Undead Resurrection',
    pdfUrl: 'https://ek-instructions.s3.amazonaws.com/ek-zombie-kittens/zombie-kittens-rules.pdf',
    sections: [
      {
        title: 'Dead Players Stay in the Game',
        content: `In Zombie Kittens, when a player explodes without a Zombie Kitten, they are DEAD but NOT out of the game:
• Dead players keep their cards in hand.
• Dead players cannot take regular turns, but can play "NOW" cards and participate in card effects (Attack of the Dead, Feed the Dead, Grave Robber).`
      },
      {
        title: 'Zombie Kitten Resurrection',
        content: `When a living player draws an Exploding Kitten, they can play a Zombie Kitten to:
1. Defuse the Exploding Kitten and put it back into the Draw Pile.
2. Choose 1 DEAD player to immediately bring back to life! That player becomes alive again and takes turns normally.`
      }
    ]
  },
  {
    deckId: 'exploding-kittens-good-vs-evil',
    title: 'Exploding Kittens: Good vs. Evil',
    subtitle: 'Armageddon Showdown & Godcat / Devilcat',
    pdfUrl: 'https://cdn.shopify.com/s/files/1/0345/9180/1483/files/EK-GVE-6_Instructions_09NOV2022_R2.pdf',
    sections: [
      {
        title: 'Godcat & Devilcat Playmat Placement',
        content: `At the start of the game, place Godcat and Devilcat face up on the playmat:
• Godcat can be played as ANY card in the entire game (except a Nope).
• Devilcat explodes if drawn during Armageddon unless you play a Defuse.`
      },
      {
        title: 'Armageddon Duel',
        content: `• Armageddon can ONLY be played if Godcat is on the playmat!
• When played, take Godcat and Devilcat, shuffle them face down, and place 1 in front of you and 1 in front of an opponent. Both players reveal simultaneously: whoever got Devilcat explodes (or must Defuse), and whoever got Godcat keeps it in hand!`
      }
    ]
  },
  {
    deckId: 'exploding-kittens-recipes-for-disaster',
    title: 'Exploding Kittens: Recipes for Disaster',
    subtitle: '13 Custom Game Recipes & Recipe Booklets',
    pdfUrl: 'https://dumekj556jp75.cloudfront.net/recipes-for-disaster/RFD_instructions.pdf',
    sections: [
      {
        title: 'How Recipes Work',
        content: `Recipes for Disaster includes 121 cards and 13 official Recipe Booklets that alter the mechanics, speed, and strategies of the game. Rather than using every card, each recipe dictates an exact curated pool of cards for a targeted experience (e.g. Lightning Kittens, Danger Danger, Seeing Double).`
      }
    ]
  }
];

export const RULES_FAQS = [
  {
    id: 'nope-defuse',
    question: 'Can you play a Nope card on a Defuse card?',
    answer: 'NO. Defuse Cards and Exploding Kittens CANNOT be Noped. Once a player plays a Defuse card, it is immediately valid and cannot be canceled.',
    relatedCards: ['nope', 'defuse', 'exploding-kitten'],
    ruleDeck: 'Original Edition',
    category: 'defense'
  },
  {
    id: 'nope-a-nope',
    question: 'Can you Nope a Nope?',
    answer: 'YES! You can play a Nope on another player\'s Nope card (often called a "Yup!"). This cancels their Nope and allows the original card action to proceed. Nopes can be chained indefinitely until no one has another Nope.',
    relatedCards: ['nope'],
    ruleDeck: 'Original Edition',
    category: 'defense'
  },
  {
    id: 'attack-stacking',
    question: 'Do Attack cards stack turns?',
    answer: 'YES! If a player who is targeted by an Attack card plays another Attack card on any of their turns, they do not draw any cards, and the next player must take ALL remaining turns PLUS the number of attacks on the new card (e.g. 2 + 2 = 4 turns, then 6 turns, etc.).',
    relatedCards: ['attack-2x', 'targeted-attack-2x', 'personal-attack-3x'],
    ruleDeck: 'Original Edition',
    category: 'attacks'
  },
  {
    id: 'cat-combo-steals',
    question: 'How do Cat Card combos work? Can I play 2 different cats?',
    answer: 'Cat Cards have no power alone, but can be played in combos:\n• 2 of the SAME Cat: Steal 1 random card from any player.\n• 3 of the SAME Cat: Name a specific card (e.g. "Defuse"); if they have it, they must give it to you.\n• 5 DIFFERENT Cards: Take ANY card from the Discard Pile into your hand!\nFeral Cat acts as a wildcard for ANY Cat Card.',
    relatedCards: ['cat-card', 'feral-cat'],
    ruleDeck: 'Original Edition',
    category: 'stealing'
  },
  {
    id: 'streaking-stolen-ek',
    question: 'What happens if someone steals my Exploding Kitten when I have Streaking Kitten?',
    answer: 'THEY EXPLODE! If a player blindly steals a card from your hand (via Favor, 2-of-a-kind Cat combo, etc.) and picks your held Exploding Kitten, they are holding an Exploding Kitten without a Streaking Kitten and must immediately play a Defuse or die!',
    relatedCards: ['streaking-kitten', 'exploding-kitten', 'defuse'],
    ruleDeck: 'Streaking Kittens Expansion',
    category: 'hazards'
  },
  {
    id: 'barking-kitten-nope',
    question: 'Can a Barking Kitten be Noped?',
    answer: 'NO. Like all Kitten cards (Exploding Kitten, Imploding Kitten, Streaking Kitten, Barking Kitten), Barking Kittens CANNOT be Noped. Once played, the twin duel must proceed.',
    relatedCards: ['barking-kitten', 'nope'],
    ruleDeck: 'Barking Kittens Expansion',
    category: 'chaos'
  },
  {
    id: 'super-skip-attacks',
    question: 'Does Super Skip end all turns when attacked multiple times?',
    answer: 'YES! Unlike a standard Skip which only ends 1 turn, a Super Skip ends ALL of your remaining turns immediately without drawing any cards.',
    relatedCards: ['super-skip', 'skip', 'attack-2x'],
    ruleDeck: 'Recipes for Disaster / Barking Kittens',
    category: 'attacks'
  },
  {
    id: 'imploding-kitten-defuse',
    question: 'Can Imploding Kitten be defused?',
    answer: 'NO! When drawn face up, the Imploding Kitten CANNOT be defused by a Defuse or Zombie Kitten card, and cannot be Noped. You explode and are instantly eliminated.',
    relatedCards: ['imploding-kitten', 'defuse'],
    ruleDeck: 'Imploding Kittens Expansion',
    category: 'hazards'
  },
  {
    id: 'godcat-nope',
    question: 'Can Godcat be played as a Nope card?',
    answer: 'NO. The rules explicitly state: "Godcat can be played as any card in the game, EXCEPT a Nope card." Also, Godcat cannot be used as a Nope.',
    relatedCards: ['godcat', 'nope', 'armageddon'],
    ruleDeck: 'Good vs. Evil',
    category: 'chaos'
  },
  {
    id: 'dead-player-zombie-turns',
    question: 'Can dead players play cards in Zombie Kittens?',
    answer: 'YES, but only certain cards! Dead players keep their cards and do not take normal turns, but they can play "NOW" cards (like Shuffle NOW or Alter the Future NOW) and can be chosen for effects like Attack of the Dead, Feed the Dead, and Grave Robber.',
    relatedCards: ['zombie-kitten', 'attack-of-the-dead', 'feed-the-dead'],
    ruleDeck: 'Zombie Kittens',
    category: 'lifesavers'
  },
  {
    id: 'bury-timing',
    question: 'How does the Bury card work?',
    answer: 'When you play Bury, end your turn by secretly drawing the top card of the draw pile. Look at it, and then put it back ANYWHERE into the draw pile in secret (just like defusing a card). If it is an Exploding Kitten, you dodged it without using a Defuse!',
    relatedCards: ['bury', 'draw-from-the-bottom'],
    ruleDeck: 'Recipes for Disaster / Barking Kittens',
    category: 'chaos'
  },
  {
    id: 'catomic-bomb-order',
    question: 'What is the exact sequence when playing Catomic Bomb?',
    answer: '1. Take all Exploding Kittens out of the Draw Pile and show them to everyone.\n2. Shuffle the rest of the Draw Pile.\n3. Place all the Exploding Kittens face down ON TOP of the Draw Pile.\n4. Your turn ends without drawing a card!',
    relatedCards: ['catomic-bomb', 'exploding-kitten', 'see-the-future-3x'],
    ruleDeck: 'Streaking Kittens Expansion',
    category: 'chaos'
  }
];

export const RULES_FAQS_DE = [
  {
    id: 'nope-defuse',
    question: 'Kann man eine Entschärfung mit Nö! abwehren?',
    answer: 'NEIN. Entschärfungen (Defuse) und Explodierende Kätzchen können NIEMALS mit einer Nö!-Karte abgewehrt werden. Sobald eine Entschärfung ausgespielt wird, ist sie sofort gültig und kann nicht verhindert werden.',
    relatedCards: ['nope', 'defuse', 'exploding-kitten'],
    ruleDeck: 'Original Edition',
    category: 'defense'
  },
  {
    id: 'nope-a-nope',
    question: 'Kann man ein Nö! auf ein Nö! spielen?',
    answer: 'JA! Du kannst ein Nö! auf das Nö! eines anderen Spielers spielen (oft "Doch!" genannt). Dies hebt das gegnerische Nö! auf und die ursprüngliche Kartenaktion wird normal ausgeführt. Nö!-Ketten können beliebig lang fortgesetzt werden, solange Spieler Nö!-Karten haben.',
    relatedCards: ['nope'],
    ruleDeck: 'Original Edition',
    category: 'defense'
  },
  {
    id: 'attack-stacking',
    question: 'Addieren sich Angriffskarten (Angriff stacken)?',
    answer: 'JA! Wenn ein angegriffener Spieler selbst eine Angriffskarte ausspielt, beendet er sofort seine aktuellen Züge, ohne eine Karte zu ziehen. Der nächste Spieler muss dann ALLE verbleibenden Züge PLUS die Züge der neuen Angriffskarte übernehmen (z.B. 2 + 2 = 4 Züge, dann 6 Züge, usw.).',
    relatedCards: ['attack-2x', 'targeted-attack-2x', 'personal-attack-3x'],
    ruleDeck: 'Original Edition',
    category: 'attacks'
  },
  {
    id: 'cat-combo-steals',
    question: 'Wie funktionieren Katzenkarten-Kombos? Kann man 2 verschiedene Katzen spielen?',
    answer: 'Katzenkarten haben alleine keine Anweisung, aber sie entfalten mächtige Effekte in Kombos:\n• 2 GLEICHE Katzen: Ziehe 1 zufällige Karte aus der Hand eines beliebigen Spielers.\n• 3 GLEICHE Katzen: Verlange eine bestimmte Karte (z.B. "Entschärfung"); hat der Spieler sie, muss er sie dir geben.\n• 5 VERSCHIEDENE Karten: Nimm eine BELIEBIGE Karte deiner Wahl aus dem Ablagestapel auf die Hand!\nWilde Katzen (Feral Cat) gelten als Joker für jede Katzenkarte.',
    relatedCards: ['cat-card', 'feral-cat'],
    ruleDeck: 'Original Edition',
    category: 'stealing'
  },
  {
    id: 'streaking-stolen-ek',
    question: 'Was passiert, wenn jemand mein Explodierendes Kätzchen stiehlt, während ich Streaking Kitten habe?',
    answer: 'ER EXPLODIERT! Wenn ein Spieler blind eine Karte aus deiner Hand zieht (durch Gefallen/Huldige der Katze, Katzen-Pärchen etc.) und das Explodierende Kätzchen erwischt, hält er ein Explodierendes Kätzchen OHNE Streaking Kitten und muss sofort eine Entschärfung spielen oder scheidet aus!',
    relatedCards: ['streaking-kitten', 'exploding-kitten', 'defuse'],
    ruleDeck: 'Streaking Kittens Erweiterung',
    category: 'hazards'
  },
  {
    id: 'barking-kitten-nope',
    question: 'Kann ein Barking Kitten (Kläffendes Kätzchen) mit Nö! abgewehrt werden?',
    answer: 'NEIN. Wie alle Kätzchen-Karten (Explodierendes Kätzchen, Implodierendes Kätzchen, Streaking Kitten, Barking Kitten) kann das Barking Kitten NICHT mit Nö! abgewehrt werden. Das Duell wird sofort ausgeführt.',
    relatedCards: ['barking-kitten', 'nope'],
    ruleDeck: 'Barking Kittens Erweiterung',
    category: 'chaos'
  },
  {
    id: 'super-skip-attacks',
    question: 'Beendet Super-Aussetzen alle Züge, wenn man mehrfach angegriffen wurde?',
    answer: 'JA! Im Gegensatz zu einem normalen Aussetzen (das nur 1 Zug beendet), beendet Super-Aussetzen SOFORT ALLE deine noch verbleibenden Züge, ohne dass du eine Karte ziehen musst.',
    relatedCards: ['super-skip', 'skip', 'attack-2x'],
    ruleDeck: 'Rezepte für die Katastrophe / Barking Kittens',
    category: 'attacks'
  },
  {
    id: 'imploding-kitten-defuse',
    question: 'Kann das Implodierende Kätzchen entschärft werden?',
    answer: 'NEIN! Wenn das Implodierende Kätzchen OFFEN (Bildseite nach oben) gezogen wird, kann es durch KEINE Entschärfung oder Zombie-Kätzchen abgewendet werden und kann nicht mit Nö! blockiert werden. Du explodierst sofort und scheidest aus.',
    relatedCards: ['imploding-kitten', 'defuse'],
    ruleDeck: 'Imploding Kittens Erweiterung',
    category: 'hazards'
  },
  {
    id: 'godcat-nope',
    question: 'Kann die Gottkatze als Nö!-Karte gespielt werden?',
    answer: 'NEIN. Die offiziellen Regeln besagen ausdrücklich: "Gottkatze kann als jede beliebige Karte im Spiel eingesetzt werden, AUSSER als Nö!-Karte." Auch kann Gottkatze nicht als Nö! agieren.',
    relatedCards: ['godcat', 'nope', 'armageddon'],
    ruleDeck: 'Good vs. Evil',
    category: 'chaos'
  },
  {
    id: 'dead-player-zombie-turns',
    question: 'Können tote Spieler in Zombie Kittens noch Karten spielen?',
    answer: 'JA, aber nur bestimmte Karten! Tote Spieler behalten ihre Handkarten. Sie führen keine regulären Züge aus, dürfen aber "SOFORT"-Karten (wie Mischen SOFORT oder Verändere die Zukunft SOFORT) spielen und können von Effekten wie "Angriff der Toten", "Füttert die Toten" und "Grabräuber" betroffen werden.',
    relatedCards: ['zombie-kitten', 'attack-of-the-dead', 'feed-the-dead'],
    ruleDeck: 'Zombie Kittens',
    category: 'lifesavers'
  },
  {
    id: 'bury-timing',
    question: 'Wie funktioniert die Vergraben-Karte (Bury)?',
    answer: 'Wenn du Vergraben spielst, beendest du deinen Zug, indem du heimlich die oberste Karte des Nachziehstapels anschaust. Stecke sie danach geheim an eine BELIEBIGE Stelle im Nachziehstapel zurück (genau wie beim Entschärfen). Ist es ein Explodierendes Kätzchen, bist du ihm entkommen, ohne eine Entschärfung zu verbrauchen!',
    relatedCards: ['bury', 'draw-from-the-bottom'],
    ruleDeck: 'Rezepte für die Katastrophe / Barking Kittens',
    category: 'chaos'
  },
  {
    id: 'catomic-bomb-order',
    question: 'Was ist der genaue Ablauf bei der Catomic Bomb (Katzenbombe)?',
    answer: '1. Nimm alle Explodierenden Kätzchen aus dem Nachziehstapel und zeige sie allen Spielern.\n2. Mische den restlichen Nachziehstapel gründlich.\n3. Lege alle Explodierenden Kätzchen verdeckt OBEN AUF den Nachziehstapel.\n4. Dein Zug endet sofort, ohne dass du eine Karte ziehst!',
    relatedCards: ['catomic-bomb', 'exploding-kitten', 'see-the-future-3x'],
    ruleDeck: 'Streaking Kittens Erweiterung',
    category: 'chaos'
  }
];

