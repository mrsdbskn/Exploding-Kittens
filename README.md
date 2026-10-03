# 💣😼 Exploding Kittens - Custom Deck Builder & Recipe Assembly Engine

A modern web application built with **Vue 3**, **Vite**, and **Material You (Material 3) Dark Mode** to build custom Exploding Kittens decks tailored to the exact games and expansions you physically own.

Deployed and fully compatible with **GitHub Pages**.

---

## 🌟 Key Features

### 1. Step 1: Owned Decks Selection (Collection Layer)
- Mark which of the 11 official games and expansions you physically own:
  - **Original Edition** (56 cards)
  - **NSFW Edition** (56 cards)
  - **Recipes for Disaster** (121 cards)
  - **Party Pack Edition** (120 cards - including all 35 Cat Cards with paw distribution)
  - **Good vs. Evil** (55 cards)
  - **Zombie Kittens** (61 cards)
  - **2-Player Edition** (32 cards)
  - **Cat Burglar Edition** (56 cards)
  - **Imploding Kittens Expansion** (20 cards)
  - **Streaking Kittens Expansion** (15 cards)
  - **Barking Kittens Expansion** (20 cards)
- Displays official logos, theme colors, and card breakdown peeks for each deck.
- Quick presets: *Select All*, *Classic + 3 Expansions*, *Recipes for Disaster*, *Party Pack*, etc.

### 2. 🤖 Kitten Rules Referee (Interactive Chatbot)
- Floating **Rules Bot** accessible from any screen on game night!
- Answers questions instantly using official rulebooks and mechanics:
  - *"Can you Nope a Defuse?"* -> Explains why Defuses and Exploding Kittens cannot be Noped.
  - *"Can you Nope a Nope?"* -> Explains Nope chains ("Yup!").
  - *"What happens if someone steals my Exploding Kitten when I have Streaking Kitten?"*
  - *"Do Attack cards stack?"*
  - *"How do Cat Card combos work?"*
  - *"Can Imploding Kitten be defused?"*
  - *"Can Godcat be played as a Nope?"*
- Features 1-click suggested question chips, card inspection links, and official rule citations.

### 3. 📖 Embedded Official Rulebooks & PDF Links
- Dedicated in-app **Rules Reader**:
  - Full readable sections for all 11 decks: *Overview*, *Turn Structure (Play, Pass, Draw)*, *Defusing*, *Cat Combos*, and *Expansion Mechanics*.
  - Direct links to official rulebook PDFs on CloudFront, AWS S3, and Shopify.
  - Global text search across all rulebooks.

### 2. Step 2: Card Exclusions & Player Count Configurator
- Set Player Count from **2 to 10 players**.
- Select starting hand mode: **Standard (7+1)** or **Quick Game (4+1)**.
- Filter by category pills: *Hazards & Bombs*, *Defuses & Revives*, *Attacks & Turns*, *Future & Intel*, *Combos & Stealing*, *Deck Chaos & Twists*, *Nopes & Defense*.
- Switch between **Unified Card Pool** and **By Deck** views.
- Fine-tune exact quantities with `[-]` and `[+]` or 1-click **Exclude** / **Include**.
- Quick bulk actions: *Include All*, *Exclude All Cat Cards* (for non-combo fast action games).

### 3. Step 3: Smart Synergy & Dependency Harmonizer
The intelligent rules engine detects card relationships and guides deck balance:
- **Barking Kittens Twin Rule**: Barking Kittens must be in the game as a pair of 2. If only 1 is active, alerts the player with 1-click buttons: `Include Pair (2)` or `Exclude All`.
- **Streaking Kitten +1 Exploding Kitten Rule**: Automatically adds 1 extra Exploding Kitten (Total = Players) so that the player holding Streaking Kitten can safely hold an Exploding Kitten without prematurely ending the game.
- **Good vs Evil (Armageddon & Godcat / Devilcat)**: Armageddon requires Godcat on the playmat. If Godcat is excluded while Armageddon is enabled, warns and provides a 1-click `Add Godcat` button.
- **Zombie Kittens & Dead Player Mechanics**: Detects cards that target dead players (*Attack of the Dead*, *Feed the Dead*, *Grave Robber*, *Clairvoyance*). If Zombie Kittens are missing, warns that dead-player mechanics are inactive and offers a 1-click fix.
- **Cat Cards & Combos**: Warns if Cat Cards are insufficient for pairs without Feral Cat wildcards.
- **1-Click Auto-Harmonize All**: Resolves all critical dependency issues in one tap.

### 4. Step 4: Step-by-Step Physical Assembly Guide & Interactive Checklist
- **Summary Statistics Banner**:
  - Total Game Cards
  - Cards Dealt to Hands (`Players × (Hand Size + 1)`)
  - Draw Pile Size
  - Hazards & Exploding Kittens Count
  - Defuses in Hand & Deck
- **Exact Step-by-Step Assembly Instructions**:
  1. *Deal Starting Hands*: Exact card deal to each player.
  2. *Table Stash Setup*: Playmat placement for Godcat/Devilcat or Tower of Power crown.
  3. *Draw Pile Assembly*: Exact count of Exploding Kittens and extra Defuses to shuffle into remaining cards.
  4. *Shuffle & Play*: Ready to start!
- **Interactive Gathering Checklist**:
  - Organized by card category with checkboxes.
  - Tick off each card type as you pull it from your physical boxes.
  - Live progress bar with celebratory confetti when 100% gathered!
- **Export & Print**:
  - Copy recipe text to clipboard (formatted for Discord/WhatsApp).
  - Export recipe as JSON.
  - Print-friendly layout.

### 5. Official Recipes for Disaster Booklets Built-In
Includes presets from *Recipes for Disaster*:
- **Lightning Kittens** (Fast, no cat cards, pure action)
- **Danger, Danger!** (Imploding Kitten, Catomic Bomb, Streaking Kitten)
- **Seeing Double** (Double turns, clones, deep future viewing)
- **The Black Hole** (Bottom draws, swaps, deck manipulation)
- **Zombie Apocalypse** (Undead interactions)
- **Armageddon Face-Off** (Good vs Evil duel)
- **Mega Party Pack** (6-10 players)
- **Save & Load Custom Presets** to browser `localStorage`.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
# http://localhost:5173/
```

To run the automated rules engine test suite:
```bash
npm test
```

To build for production:
```bash
npm run build
```

---

## 🌐 Deploying to GitHub Pages

This project is pre-configured with `base: './'` in `vite.config.js` and includes a GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Deployment Steps:
1. Push this repository to GitHub on `main` or `master`.
2. In your GitHub repository settings:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push any commit or trigger the workflow manually under **Actions**. Your site will automatically build and publish!
