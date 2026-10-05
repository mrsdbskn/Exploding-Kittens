/**
 * Comprehensive English and German (de) Translations for Exploding Kittens Deck Architect
 * Official German Edition (Asmodee) card names, mechanics, and UI terms.
 */

export const TRANSLATIONS = {
  en: {
    nav: {
      title: "Exploding Kittens",
      subtitle: "Custom Deck Architect & Balance Harmonizer",
      officialRecipes: "Official Recipes",
      rulebooksGuide: "Rulebooks & Guide",
      gameCompanion: "Game Night Companion",
      cardCodex: "Card Lore Codex",
      customStudio: "Custom Studio",
      resetAll: "Reset",
      resetConfirm: "Reset your configuration to default original deck?",
      langToggle: "DE"
    },
    steps: {
      decks: "1. Decks",
      cards: "2. Cards",
      synergies: "3. Synergies",
      recipe: "4. Deck Recipe",
      shortDecks: "Decks",
      shortCards: "Cards",
      shortSynergies: "Synergies",
      shortRecipe: "Recipe"
    },
    deckSelector: {
      heroTitle: "Step 1: Which Decks Do You Own?",
      heroDesc: "Select all the Exploding Kittens core games and expansions you physically have in your collection. The deck builder will automatically pool all their available cards and mechanics.",
      quickPresets: "Quick Presets:",
      presetAll: "Select All (11)",
      presetClassicExpansions: "Classic + 3 Expansions",
      presetRecipes: "Recipes for Disaster",
      presetParty: "Party Pack",
      presetZombie: "Zombie Kittens",
      presetClear: "Clear All",
      filterAll: "All Decks",
      filterStandalone: "Standalone Games",
      filterExpansion: "Expansions",
      summarySelected: "decks selected",
      summaryTotalPool: "total cards pool",
      badgeStandalone: "Standalone",
      badgeExpansion: "Expansion",
      totalCardsLabel: "total cards",
      peekCards: "Peek Cards",
      hideCards: "Hide Cards",
      statDecksChosen: "Decks Chosen",
      statCards: "cards",
      btnConfigureDesktop: "Configure Cards & Players",
      btnConfigureMobile: "Configure Cards"
    },
    cardConfigurator: {
      heroTitle: "Step 2: Configure Card Pool & Players",
      heroDesc: "Set the number of players, fine-tune card quantities, or exclude unwanted mechanics.",
      playerCountLabel: "Player Count",
      startingHandLabel: "Starting Hand Size (Non-Defuse)",
      drawPileSummary: "Draw Pile:",
      cardsShortage: "Shortage: Need more cards to deal full hands!",
      explodingNeeded: "Exploding Kittens Needed:",
      defusesNeeded: "Defuses Needed:",
      totalHandCards: "Hand Cards Total:",
      searchPlaceholder: "Search cards by name, category, or mechanics...",
      sortLabel: "Sort:",
      viewUnified: "Unified Pool",
      viewByDeck: "By Deck Source",
      btnIncludeAll: "Include All Cards",
      btnToggleCat: "Toggle Cat Cards",
      btnViewCatArt: "View 18 Artwork Styles",
      catVariantsInDecks: "Artworks in your decks:",
      artworkStylesCatalog: "Artwork Styles Catalog",
      fromLabel: "From:",
      badgeInPool: "In Pool",
      badgeExcluded: "Excluded",
      badgeActive: "Active",
      btnBack: "← Back to Decks",
      btnReviewDesktop: "Review Synergies & Rules",
      btnReviewMobile: "Review Synergies"
    },
    synergies: {
      heroTitle: "Step 3: Synergy Harmonizer & Dependency Rules",
      heroDesc: "We check your custom pool for missing pairs, broken mechanics, and official rule dependencies.",
      allHarmonizedTitle: "All Synergies Harmonized!",
      allHarmonizedDesc: "Your custom deck configuration has no broken mechanics or missing combos. Ready to build the deck recipe!",
      btnResolveAll: "Resolve All Suggestions",
      btnAutoFix: "Auto-Fix",
      btnDismiss: "Dismiss",
      btnBack: "← Back to Cards",
      btnContinue: "Continue to Deck Recipe →"
    },
    recipe: {
      heroTitle: "Step 4: Your Custom Deck Recipe & Assembly Guide",
      heroDesc: "Physical assembly guide and probability stats for your customized Exploding Kittens game night.",
      btnCopy: "Copy Recipe",
      btnCopied: "Copied to Clipboard!",
      btnPrint: "Print Recipe",
      btnRestart: "Create Another Deck",
      btnBack: "← Back to Synergies",
      assemblyTitle: "Deck Assembly Guide",
      step1Title: "Step 1: Deal Starter Hands",
      step1Desc: "Deal 1 Defuse and {count} random non-defuse cards to each of the {players} players ({total} cards total).",
      step2Title: "Step 2: Seed the Draw Pile",
      step2Desc: "Insert {ek} Exploding Kittens and {defuses} extra Defuses into the remaining {pool} cards.",
      step3Title: "Step 3: Shuffle & Begin Play",
      step3Desc: "Thoroughly shuffle the draw pile and place it face down in the center of the table. Have fun!",
      tabDrawPile: "Draw Pile Cards",
      tabStarterHands: "Starter Hand Pool",
      tabCatArtworks: "Cat Artworks Breakdown",
      tabBoxCards: "Keep in Game Box",
      cardsToKeepInBox: "Cards to Keep in Game Box (Excess Safe Cards)"
    },
    danger: {
      title: "Danger Meter & Hazard Volatility",
      subtitle: "Dynamically adjust game stakes, death frequency, and draw-pile tension.",
      turn1Hazard: "Turn 1 Hazard Chance",
      volatility: "Draw Pile Volatility",
      safeRatioLabel: "Safe Cards in Draw Pile",
      bonusEKLabel: "Bonus Exploding Kittens",
      extraDefusesLabel: "Extra Defuses in Draw Pile",
      implodingToggleLabel: "Imploding Kitten replaces 1 Exploding Kitten",
      presets: {
        balanced: { name: "Official Rules", desc: "Standard official ratio: Players - 1 Exploding Kittens, 2 extra Defuses." },
        chill: { name: "Chill / Training", desc: "Forgiving play: 4 extra Defuses, 100% safe cards. Great for beginners." },
        casual: { name: "Casual Social", desc: "Balanced party pace: 3 extra Defuses, standard hazards, plenty of saves." },
        spicy: { name: "Spicy High Stakes", desc: "+1 Exploding Kitten, reduced safe buffer. Quick elimination rounds." },
        mayhem: { name: "Pure Mayhem", desc: "+2 Exploding Kittens, 0 extra Defuses, tightly trimmed draw pile. High mortality!" },
        custom: { name: "Custom Tuning", desc: "Fine-tune sliders to create your own unique hazard calibration." }
      }
    },
    rulesBot: {
      fabLabel: "Rules Bot",
      drawerTitle: "Kitten Rules Referee",
      drawerSubtitle: "Official Rulebooks & Card Mechanics Assistant",
      inputPlaceholder: "Ask a rule question (e.g. Can you Nope a Defuse?)...",
      suggestedLabel: "Suggested Questions:",
      inspectBtn: "Inspect",
      clearTooltip: "Clear Conversation",
      rulebooksTooltip: "View Embedded Rulebooks",
      initialGreeting: "Meow! I am your **Exploding Kittens Rules Referee**.\nAsk me any question about card timing, Nopes, Defuses, combos, or expansion rules during your game!",
      initialReference: "Official Exploding Kittens Rulebooks",
      initialFollowups: [
        "Can you play a Nope on a Defuse?",
        "Can you Nope a Nope?",
        "How does Streaking Kitten work with Exploding Kittens?",
        "Do Attack cards stack turns?",
        "How do Cat Card combos work?"
      ],
      clearedMessage: "Conversation cleared. Ask me any rule or card question!"
    },
    categories: {
      all: "All Categories",
      hazards: "Exploding & Hazards",
      defense: "Defensive & Saves",
      attacks: "Attacks & Turns",
      stealing: "Actions & Stealing",
      vision: "Future & Deck Intel",
      cats: "Cat Cards & Pairs",
      chaos: "Chaos & Special"
    }
  },

  de: {
    nav: {
      title: "Exploding Kittens",
      subtitle: "Deck-Architekt & Balance-Harmonisierer",
      officialRecipes: "Offizielle Rezepte",
      rulebooksGuide: "Regeln & Anleitungen",
      gameCompanion: "Spielabend-Begleiter",
      cardCodex: "Karten-Kodex",
      customStudio: "Eigene Rezepte",
      resetAll: "Zurücksetzen",
      resetConfirm: "Möchtest du deine Konfiguration auf das Standard-Originaldeck zurücksetzen?",
      langToggle: "EN"
    },
    steps: {
      decks: "1. Decks",
      cards: "2. Karten",
      synergies: "3. Synergien",
      recipe: "4. Deck-Rezept",
      shortDecks: "Decks",
      shortCards: "Karten",
      shortSynergies: "Synergien",
      shortRecipe: "Rezept"
    },
    deckSelector: {
      heroTitle: "Schritt 1: Welche Decks besitzt du?",
      heroDesc: "Wähle alle Exploding Kittens Grundspiele und Erweiterungen aus, die du physisch besitzt. Der Deck-Architekt bündelt alle Karten und Mechaniken deiner Sammlung.",
      quickPresets: "Schnell-Auswahl:",
      presetAll: "Alle auswählen (11)",
      presetClassicExpansions: "Klassiker + 3 Erweiterungen",
      presetRecipes: "Rezepte für die Katastrophe",
      presetParty: "Party Pack",
      presetZombie: "Zombie Kätzchen",
      presetClear: "Alle abwählen",
      filterAll: "Alle Decks",
      filterStandalone: "Eigenständige Spiele",
      filterExpansion: "Erweiterungen",
      summarySelected: "Decks ausgewählt",
      summaryTotalPool: "Gesamtkarten im Pool",
      badgeStandalone: "Eigenständig",
      badgeExpansion: "Erweiterung",
      totalCardsLabel: "Karten insgesamt",
      peekCards: "Karten ansehen",
      hideCards: "Karten ausblenden",
      statDecksChosen: "Decks gewählt",
      statCards: "Karten",
      btnConfigureDesktop: "Karten & Spieler konfigurieren",
      btnConfigureMobile: "Karten konfigurieren"
    },
    cardConfigurator: {
      heroTitle: "Schritt 2: Kartenpool & Spieler konfigurieren",
      heroDesc: "Stelle die Spieleranzahl ein, passe Kartenmengen an oder schließe bestimmte Mechaniken aus.",
      playerCountLabel: "Spieleranzahl",
      startingHandLabel: "Start-Handkarten (ohne Entschärfung)",
      drawPileSummary: "Nachziehstapel:",
      cardsShortage: "Kartenmangel: Füge mehr Decks hinzu, um volle Hände auszuteilen!",
      explodingNeeded: "Benötigte Bomben:",
      defusesNeeded: "Benötigte Entschärfungen:",
      totalHandCards: "Gesamte Handkarten:",
      searchPlaceholder: "Karten nach Name, Kategorie oder Mechanik suchen...",
      sortLabel: "Sortierung:",
      viewUnified: "Gesamter Pool",
      viewByDeck: "Nach Deck-Herkunft",
      btnIncludeAll: "Alle Karten einbeziehen",
      btnToggleCat: "Katzenkarten umschalten",
      btnViewCatArt: "18 Artwork-Stile ansehen",
      catVariantsInDecks: "Illustrationen in deinen Decks:",
      artworkStylesCatalog: "Illustrations-Katalog",
      fromLabel: "Aus:",
      badgeInPool: "Im Pool",
      badgeExcluded: "Ausgeschlossen",
      badgeActive: "Aktiv",
      btnBack: "← Zurück zu Decks",
      btnReviewDesktop: "Synergien & Regeln prüfen",
      btnReviewMobile: "Synergien prüfen"
    },
    synergies: {
      heroTitle: "Schritt 3: Synergie-Harmonisierung & Regeln",
      heroDesc: "Automatische Prüfung auf fehlende Kartenpaare, unlösbare Mechaniken und offizielle Regel-Abhängigkeiten.",
      allHarmonizedTitle: "Alle Synergien perfekt harmonisiert!",
      allHarmonizedDesc: "Deine Deck-Konfiguration enthält keine unlösbaren Mechaniken oder fehlenden Kombos. Bereit für das Deck-Rezept!",
      btnResolveAll: "Alle Vorschläge anwenden",
      btnAutoFix: "Automatisch beheben",
      btnDismiss: "Schließen",
      btnBack: "← Zurück zu Karten",
      btnContinue: "Weiter zum Deck-Rezept →"
    },
    recipe: {
      heroTitle: "Schritt 4: Dein individuelles Deck-Rezept",
      heroDesc: "Physische Bauanleitung und Wahrscheinlichkeits-Statistiken für deinen Exploding Kittens Spieleabend.",
      btnCopy: "Rezept kopieren",
      btnCopied: "In die Zwischenablage kopiert!",
      btnPrint: "Rezept drucken",
      btnRestart: "Neues Deck erstellen",
      btnBack: "← Zurück zu Synergien",
      assemblyTitle: "Deck-Bauanleitung",
      step1Title: "Schritt 1: Start-Hände austeilen",
      step1Desc: "Teile 1 Entschärfung und {count} zufällige Karten an jeden der {players} Spieler aus ({total} Karten insgesamt).",
      step2Title: "Schritt 2: Nachziehstapel bestücken",
      step2Desc: "Mische {ek} Explodierende Kätzchen und {defuses} zusätzliche Entschärfungen unter die verbleibenden {pool} Karten.",
      step3Title: "Schritt 3: Mischen & Spiel beginnen",
      step3Desc: "Mische den Nachziehstapel gründlich und platziere ihn verdeckt in der Tischmitte. Viel Vergnügen!",
      tabDrawPile: "Karten im Nachziehstapel",
      tabStarterHands: "Start-Handkarten Pool",
      tabCatArtworks: "Katzen-Artworks Aufschlüsselung",
      tabBoxCards: "In der Spielschachtel lassen",
      cardsToKeepInBox: "In der Schachtel lassen (Überschüssige sichere Karten)"
    },
    danger: {
      title: "Gefahren-Pegel & Spiel-Volatilität",
      subtitle: "Passe Spieleinsatz, Tödlichkeit und die Spannung im Nachziehstapel dynamisch an.",
      turn1Hazard: "Gefahr in Zug 1",
      volatility: "Nachziehstapel-Volatilität",
      safeRatioLabel: "Sichere Nachziehstapel-Karten",
      bonusEKLabel: "Zusätzliche Bomben",
      extraDefusesLabel: "Zusätzliche Entschärfungen im Stapel",
      implodingToggleLabel: "Implodierendes Kätzchen ersetzt 1 Explodierendes Kätzchen",
      presets: {
        balanced: { name: "Offizielle Regeln", desc: "Standard-Verhältnis: Spieler minus 1 Bomben, 2 Extra-Entschärfungen." },
        chill: { name: "Entspannt / Training", desc: "Fehlerverzeihend: 4 Extra-Entschärfungen, 100% sichere Karten. Perfekt für Anfänger." },
        casual: { name: "Locker / Social", desc: "Ausgewogenes Partytempo: 3 Extra-Entschärfungen, viele Rettungschancen." },
        spicy: { name: "Scharf / High Stakes", desc: "+1 Bombe, reduzierter Puffer. Schnelle Ausscheidungsrunden." },
        mayhem: { name: "Reines Chaos", desc: "+2 Bomben, 0 Extra-Entschärfungen, kompakter Stapel. Hohe Tödlichkeit!" },
        custom: { name: "Benutzerdefiniert", desc: "Stelle die Regler frei ein für deine ganz persönliche Gefahren-Einstellung." }
      }
    },
    rulesBot: {
      fabLabel: "Regel-Bot",
      drawerTitle: "Kätzchen Schiedsrichter",
      drawerSubtitle: "Offizieller Regel- & Mechanik-Assistent",
      inputPlaceholder: "Stelle eine Regelfrage (z.B. Kann man ein Nö! auf eine Entschärfung spielen?)...",
      suggestedLabel: "Vorgeschlagene Fragen:",
      inspectBtn: "Ansehen",
      clearTooltip: "Verlauf leeren",
      rulebooksTooltip: "Regelbücher anzeigen",
      initialGreeting: "Miau! Ich bin dein **Exploding Kittens Schiedsrichter**.\nFrag mich alles über Regeln, Kartentiming, Nö!-Karten, Entschärfungen, Kombos oder Erweiterungsregeln während deines Spiels!",
      initialReference: "Offizielle Exploding Kittens Regelbücher",
      initialFollowups: [
        "Kann man ein Nö! auf eine Entschärfung spielen?",
        "Kann man ein Nö! auf ein Nö! spielen?",
        "Wie funktioniert Streaking Kitten mit Bomben?",
        "Addieren sich Angriffskarten?",
        "Wie funktionieren Katzenkarten-Kombos?"
      ],
      clearedMessage: "Verlauf geleert. Stelle mir eine beliebige Regel- oder Kartenfrage!"
    },
    categories: {
      all: "Alle Kategorien",
      hazards: "Explosionen & Gefahren",
      defense: "Verteidigung & Lebensretter",
      attacks: "Angriffe & Spielzüge",
      stealing: "Aktionen & Diebstahl",
      vision: "Zukunft & Kartenvorschau",
      cats: "Katzenkarten & Pärchen",
      chaos: "Chaos & Spezialkarten"
    }
  }
};

/**
 * German Translations for Card Names, Short Descriptions, and Rule Mechanics
 */
export const CARD_TRANSLATIONS_DE = {
  'exploding-kitten': {
    name: 'Explodierendes Kätzchen',
    shortDesc: 'Zeige diese Karte sofort vor. Wenn du keine Entschärfung hast, explodierst du und scheidest aus!',
    mechanics: 'Wenn du diese Karte ziehst, musst du sie sofort aufdecken. Spiele unverzüglich eine Entschärfungskarte, oder du explodierst, stirbst und bist aus dem Spiel ausgeschieden. Lege alle deine restlichen Karten auf den Ablagestapel.'
  },
  'defuse': {
    name: 'Entschärfung',
    shortDesc: 'Rettet dich vor einem Explodierenden Kätzchen. Stecke die Bombe geheim zurück in den Stapel.',
    mechanics: 'Wenn du ein Explodierendes Kätzchen ziehst, kannst du diese Karte ausspielen, anstatt zu explodieren. Lege deine Entschärfung auf den Ablagestapel. Nimm das Explodierende Kätzchen und stecke es geheim an eine beliebige Stelle im Nachziehstapel zurück (oben, unten oder mittendrin), ohne die anderen Karten anzuschauen oder umzusortieren.'
  },
  'attack-2x': {
    name: 'Angriff (2x)',
    shortDesc: 'Beende deinen Zug ohne zu ziehen und zwinge den nächsten Spieler zu 2 Spielzügen hintereinander.',
    mechanics: 'Beende deinen Spielzug sofort, ohne eine Karte zu ziehen. Der nächste Spieler muss 2 Züge hintereinander ausführen. Er spielt ganz normal seinen Zug und zieht eine Karte. Wenn er nicht explodiert, muss er noch einen zweiten Zug ausführen. Wenn ein angegriffener Spieler selbst einen Angriff ausspielt, beendet er seine Züge und der nächste Spieler muss alle verbleibenden Züge plus 2 ausführen!'
  },
  'targeted-attack-2x': {
    name: 'Gezielter Angriff (2x)',
    shortDesc: 'Beende deinen Zug ohne zu ziehen und wähle einen beliebigen Spieler, der 2 Züge ausführen muss.',
    mechanics: 'Beende sofort deinen Zug ohne eine Karte zu ziehen. Wähle einen beliebigen Spieler am Tisch. Dieser Spieler muss 2 Spielzüge nacheinander ausführen.'
  },
  'personal-attack-3x': {
    name: 'Persönlicher Angriff (3x)',
    shortDesc: 'Führe selbst sofort 3 Spielzüge hintereinander aus.',
    mechanics: 'Du musst sofort 3 Züge nacheinander ausführen. Du kannst zwischen den Zügen Karten spielen, musst aber am Ende jedes deiner 3 Züge eine Karte ziehen (sofern du keine weiteren Züge überspringst).'
  },
  'skip': {
    name: 'Aussetzen',
    shortDesc: 'Beende sofort deinen Spielzug, ohne eine Karte vom Nachziehstapel zu ziehen.',
    mechanics: 'Beende sofort deinen Spielzug, ohne eine Karte zu ziehen. Falls du durch einen Angriff mehrere Züge ausführen musstest, beendet ein normales Aussetzen nur einen einzigen dieser Züge!'
  },
  'super-skip': {
    name: 'Super-Aussetzen',
    shortDesc: 'Beende ALLE deine verbleibenden Züge sofort, ohne eine Karte zu ziehen.',
    mechanics: 'Beende sofort alle Züge, die du in dieser Runde noch ausführen müsstest, ohne eine Karte zu ziehen (selbst wenn du mehrfach angegriffen wurdest).'
  },
  'reverse': {
    name: 'Richtungswechsel',
    shortDesc: 'Kehre die Spielrichtung um und beende sofort deinen Zug, ohne eine Karte zu ziehen.',
    mechanics: 'Kehrt die Spielreihenfolge um (Uhrzeigersinn wird zu Gegenuhrzeigersinn oder umgekehrt) und beendet sofort deinen aktuellen Zug, ohne dass du eine Karte ziehen musst.'
  },
  'favor': {
    name: 'Huldige der Katze (Gefallen)',
    shortDesc: 'Zwinge einen anderen Spieler, dir 1 Handkarte seiner Wahl zu geben.',
    mechanics: 'Wähle einen Mitspieler. Dieser Spieler MUSS eine Handkarte seiner Wahl auswählen und sie dir verdeckt auf die Hand geben.'
  },
  'shuffle': {
    name: 'Mischen (Mischmasch)',
    shortDesc: 'Mische den Nachziehstapel gründlich durch, bis ein Spieler Stopp sagt.',
    mechanics: 'Mische den Nachziehstapel gründlich durch, ohne die Karten anzuschauen. Nützlich, wenn du weißt, dass oben ein Explodierendes Kätzchen lauert.'
  },
  'see-the-future-3x': {
    name: 'Blick in die Zukunft (3x)',
    shortDesc: 'Sieh dir heimlich die obersten 3 Karten des Nachziehstapels an.',
    mechanics: 'Nimm dir heimlich die obersten 3 Karten des Nachziehstapels und schaue sie dir an. Lege sie in exakt derselben Reihenfolge verdeckt zurück auf den Stapel. Zeige sie keinem Mitspieler.'
  },
  'see-the-future-5x': {
    name: 'Blick in die Zukunft (5x)',
    shortDesc: 'Sieh dir heimlich die obersten 5 Karten des Nachziehstapels an.',
    mechanics: 'Nimm dir heimlich die obersten 5 Karten des Nachziehstapels und schaue sie dir an. Lege sie in exakt derselben Reihenfolge verdeckt zurück auf den Stapel.'
  },
  'alter-the-future-3x': {
    name: 'Verändere die Zukunft (3x)',
    shortDesc: 'Sieh dir die obersten 3 Karten an und ordne sie in beliebiger Reihenfolge neu an.',
    mechanics: 'Nimm die obersten 3 Karten des Nachziehstapels, schaue sie an und lege sie in einer beliebigen Reihenfolge verdeckt oben auf den Stapel zurück.'
  },
  'alter-the-future-5x': {
    name: 'Verändere die Zukunft (5x)',
    shortDesc: 'Sieh dir die obersten 5 Karten an und ordne sie in beliebiger Reihenfolge neu an.',
    mechanics: 'Nimm die obersten 5 Karten des Nachziehstapels, schaue sie an und lege sie in einer beliebigen Reihenfolge verdeckt oben auf den Stapel zurück.'
  },
  'share-the-future-3x': {
    name: 'Teile die Zukunft (3x)',
    shortDesc: 'Sieh dir die obersten 3 Karten an, ordne sie neu und zeige sie dem nächsten Spieler.',
    mechanics: 'Sieh dir die obersten 3 Karten des Nachziehstapels an und ordne sie beliebig an. Zeige diese 3 Karten danach dem nächsten Spieler, bevor du sie zurücklegst.'
  },
  'draw-from-the-bottom': {
    name: 'Ziehe von unten',
    shortDesc: 'Beende deinen Spielzug, indem du die unterste Karte des Nachziehstapels ziehst.',
    mechanics: 'Beende deinen Spielzug, indem du die UNTERSTE Karte des Nachziehstapels ziehst, anstatt der obersten.'
  },
  'bury': {
    name: 'Vergraben',
    shortDesc: 'Beende deinen Zug, sieh dir die oberste Karte an und stecke sie an eine beliebige Stelle zurück.',
    mechanics: 'Beende deinen Spielzug, indem du die oberste Karte des Nachziehstapels geheim anschaust. Stecke sie danach an eine beliebige Stelle im Nachziehstapel zurück (wie beim Entschärfen).'
  },
  'potluck': {
    name: 'Eintopf',
    shortDesc: 'Jeder Spieler (beginnend bei dir) legt 1 Handkarte oben auf den Nachziehstapel.',
    mechanics: 'Jeder Spieler (beginnend mit dir im Uhrzeigersinn) wählt 1 Karte aus seiner Hand und legt sie verdeckt oben auf den Nachziehstapel.'
  },
  'ill-take-that': {
    name: 'Das nehm ich!',
    shortDesc: 'Lege diese Karte vor einen Mitspieler. Er muss dir seine nächste gezogene Karte geben.',
    mechanics: 'Lege diese Karte vor einen Mitspieler. Wenn dieser Spieler das nächste Mal eine Karte vom Nachziehstapel zieht, muss er sie dir geben, ohne sie anzusehen.'
  },
  'garbage-collection': {
    name: 'Müllabfuhr',
    shortDesc: 'Jeder Spieler muss 1 Handkarte geheim in den Nachziehstapel einmischen.',
    mechanics: 'Jeder Spieler (auch du) muss 1 Handkarte auswählen und sie verdeckt in den Nachziehstapel stecken. Danach wird der gesamte Nachziehstapel gemischt.'
  },
  'nope': {
    name: 'Nö!',
    shortDesc: 'Stoppe jede Aktion eines Mitspielers zu jedem beliebigen Zeitpunkt. Kann nicht gegen Bomben gespielt werden.',
    mechanics: 'Stoppe jede Aktion eines Mitspielers (Angriff, Gefallen, Blick in die Zukunft, Mischen, Katzen-Kombos). Du kannst diese Karte jederzeit spielen, auch wenn du gar nicht am Zug bist! Du kannst auch ein Nö! auf ein anderes Nö! spielen ("Doch!"). ACHTUNG: Du kannst NIEMALS ein Explodierendes Kätzchen oder eine Entschärfungskarte mit Nö! abwehren.'
  },
  'feral-cat': {
    name: 'Wilde Katze',
    shortDesc: 'Verwende diese Karte als Joker für jede beliebige Katzenkarte, um Kombos zu bilden.',
    mechanics: 'Gilt als Joker für jede Katzenkarte (Tacocat, Bart-Katze, Katzenmelone, etc.). Sie kann nicht als Aktionskarte oder Entschärfung eingesetzt werden.'
  },
  'cat-card': {
    name: 'Katzenkarten (Standard)',
    shortDesc: 'Haben alleine keine Funktion, entfalten aber mächtige Effekte in 2er-, 3er- oder 5er-Kombos.',
    mechanics: 'Spiele 2 gleiche Katzenkarten, um 1 zufällige Handkarte eines Mitspielers zu klauen. Spiele 3 gleiche Katzenkarten, um eine bestimmte Karte (z.B. Entschärfung) zu verlangen. Spiele 5 verschiedene Karten mit unterschiedlichen Symbolen, um eine beliebige Karte aus dem Ablagestapel auf die Hand zu nehmen.'
  },
  'streaking-kitten': {
    name: 'Streaking Kitten',
    shortDesc: 'Erlaubt es dir, 1 Explodierendes Kätzchen heimlich auf der Hand zu halten, ohne zu explodieren!',
    mechanics: 'Solange du Streaking Kitten auf der Hand hältst, kannst du 1 Explodierendes Kätzchen auf der Hand halten, ohne zu explodieren! Wenn ein Mitspieler blind eine Karte aus deiner Hand zieht und die Bombe erwischt, explodiert ER sofort!'
  },
  'barking-kitten': {
    name: 'Barking Kitten (Kläffendes Kätzchen)',
    shortDesc: 'Spiele diese Karte, um den Besitzer des zweiten Barking Kittens zum Entschärfen zu zwingen.',
    mechanics: 'Lege die Karte vor dir ab. Wenn ein anderer Spieler das zweite Barking Kitten hat, muss er sofort eine Entschärfung spielen oder er explodiert! Hast du beide auf der Hand, wählst du einen beliebigen Spieler als Ziel.'
  },
  'imploding-kitten': {
    name: 'Implodierendes Kätzchen',
    shortDesc: 'Beim 1. Ziehen wird es offen eingesteckt. Wird es offen gezogen, stirbst du sofort ohne Entschärfungschance!',
    mechanics: 'Wird es verdeckt gezogen, explodierst du nicht: Drehe es mit der Bildseite nach oben und stecke es geheim zurück. Wird es mit der Bildseite nach oben gezogen, explodierst du sofort und bist ausgeschieden — diese Karte kann durch NICHTS entschärft oder mit Nö! abgewehrt werden!'
  },
  'zombie-kitten': {
    name: 'Zombie Kätzchen',
    shortDesc: 'Entschärft ein Explodierendes Kätzchen und belebt sofort 1 toten Mitspieler wieder zum Leben.',
    mechanics: 'Funktioniert wie eine Entschärfung, wenn du ein Explodierendes Kätzchen ziehst. Zusätzlich darfst du sofort 1 toten Spieler auswählen, der wiederbelebt wird und ganz normal weiterspielt!'
  },
  'attack-of-the-dead': {
    name: 'Angriff der Toten',
    shortDesc: 'Beende deinen Zug. Jeder tote Spieler steuert 1 Angriff gegen den nächsten lebenden Spieler bei.',
    mechanics: 'Beende deinen Spielzug sofort, ohne zu ziehen. Der nächste lebende Spieler muss 3 Züge ausführen, plus jeweils 1 zusätzlichen Zug für jeden toten Spieler am Tisch.'
  },
  'feed-the-dead': {
    name: 'Füttert die Toten',
    shortDesc: 'Wähle einen toten Spieler. Jeder lebende Spieler muss ihm 1 Handkarte schenken.',
    mechanics: 'Wähle einen toten Spieler aus. Jeder lebende Spieler (inklusive dir) muss diesem toten Spieler 1 Handkarte seiner Wahl schenken.'
  },
  'grave-robber': {
    name: 'Grabräuber',
    shortDesc: 'Jeder tote Spieler muss 1 Karte in den Nachziehstapel mischen.',
    mechanics: 'Jeder tote Spieler wählt 1 Karte aus seiner Hand und mischt sie in den Nachziehstapel ein.'
  },
  'clairvoyance': {
    name: 'Hellsicht',
    shortDesc: 'Spiele dies, wenn ein Spieler eine Bombe in den Stapel steckt, um zu sehen, wo er sie platziert.',
    mechanics: 'Spiele diese Karte, während ein Mitspieler ein Explodierendes Kätzchen zurück in den Nachziehstapel steckt. Du darfst genau zusehen, an welche Stelle er sie hineinsteckt.'
  },
  'tower-of-power': {
    name: 'Turm der Macht (Krone)',
    shortDesc: 'Setze die Katzenkrone mit 6 Schutzkarten auf. Wer dich beklaut, muss blind aus deiner Krone ziehen.',
    mechanics: 'Nimm die Katzenkrone und fülle sie mit den 6 beiseitegelegten Versteck-Karten. Wenn ein Mitspieler eine Karte von dir verlangt oder stiehlt (durch Gefallen oder Katzen-Pärchen), zieht er blind aus deiner Krone statt aus deiner Hand!'
  },
  'godcat': {
    name: 'Gottkatze',
    shortDesc: 'Gottkatze kann als jede beliebige Karte im Spiel eingesetzt werden (außer als Nö!).',
    mechanics: 'Gottkatze liegt zu Spielbeginn auf der Spielmatte. Sie kann als jede Karte im Spiel verwendet werden (Angriff, Blick in die Zukunft, Entschärfung etc.), DARF jedoch NIEMALS als Nö!-Karte gespielt werden.'
  },
  'devilcat': {
    name: 'Teufelskatze',
    shortDesc: 'Explodiert sofort bei Aufdeckung im Armageddon-Duell, falls du keine Entschärfung hast.',
    mechanics: 'Liegt zu Spielbeginn auf der Spielmatte und wird während Armageddon mit Gottkatze gemischt und verdeckt an zwei Duellanten verteilt.'
  },
  'armageddon': {
    name: 'Armageddon',
    shortDesc: 'Starte ein Schicksalsduell zwischen dir und einem Gegner mit Gottkatze und Teufelskatze.',
    mechanics: 'Kann nur gespielt werden, wenn Gottkatze auf der Matte liegt. Nimm Gottkatze und Teufelskatze, mische sie verdeckt und teile je 1 Karte an dich und einen Gegner aus. Wer die Teufelskatze aufdeckt, explodiert sofort!'
  },
  'catomic-bomb': {
    name: 'Katzenbombe (Catomic Bomb)',
    shortDesc: 'Nimm alle Bomben aus dem Stapel, mische den Rest und lege alle Bomben oben drauf!',
    mechanics: 'Nimm alle Explodierenden Kätzchen aus dem Nachziehstapel und zeige sie vor. Mische den restlichen Stapel gründlich und lege alle Explodierenden Kätzchen verdeckt oben auf den Stapel. Dein Zug endet sofort, ohne dass du ziehst!'
  }
};

/**
 * Helper to retrieve translated string with param interpolation
 */
export function t(keyPath, lang = 'en', params = {}) {
  const parts = keyPath.split('.');
  let current = TRANSLATIONS[lang] || TRANSLATIONS.en;
  for (const p of parts) {
    if (current && current[p] !== undefined) {
      current = current[p];
    } else {
      // Fallback to English
      let fallback = TRANSLATIONS.en;
      for (const fp of parts) {
        if (fallback && fallback[fp] !== undefined) {
          fallback = fallback[fp];
        } else {
          return keyPath;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') return current;

  // Interpolate {param}
  let res = current;
  for (const k in params) {
    res = res.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
  }
  return res;
}

/**
 * Get card localized display name
 */
export function getCardDisplayName(slug, defaultName, lang = 'en') {
  if (lang === 'de' && CARD_TRANSLATIONS_DE[slug]?.name) {
    return CARD_TRANSLATIONS_DE[slug].name;
  }
  return defaultName;
}

/**
 * Get card localized short description
 */
export function getCardDisplayDesc(slug, defaultDesc, lang = 'en') {
  if (lang === 'de' && CARD_TRANSLATIONS_DE[slug]?.shortDesc) {
    return CARD_TRANSLATIONS_DE[slug].shortDesc;
  }
  return defaultDesc;
}

/**
 * Get card localized mechanics explanation
 */
export function getCardDisplayMechanics(slug, defaultMechanics, lang = 'en') {
  if (lang === 'de' && CARD_TRANSLATIONS_DE[slug]?.mechanics) {
    return CARD_TRANSLATIONS_DE[slug].mechanics;
  }
  return defaultMechanics;
}

/**
 * Get category localized name
 */
export function getCategoryDisplayName(catId, defaultName, lang = 'en') {
  const dict = TRANSLATIONS[lang]?.categories || TRANSLATIONS.en.categories;
  return dict[catId] || defaultName;
}
