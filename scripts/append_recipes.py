import re
import json

with open("scripts/update_decks_data_with_cats.py", "r", encoding="utf-8") as f:
    py_code = f.read()

# Let's restore OFFICIAL_RECIPES
OFFICIAL_RECIPES = [
  {
    "id": "classic-56",
    "name": "Classic Original",
    "badge": "Standard",
    "players": "2-5 Players",
    "minPlayers": 2,
    "maxPlayers": 5,
    "time": "15 min",
    "complexity": "Beginner",
    "description": "The authentic, timeless original Russian roulette experience.",
    "targetDecks": [
      "exploding-kittens-original-edition"
    ],
    "cardCounts": {
      "defuse": 6,
      "exploding-kitten": 4,
      "attack-2x": 4,
      "favor": 4,
      "nope": 5,
      "shuffle": 4,
      "skip": 4,
      "see-the-future-3x": 5,
      "cat-card": 20
    }
  },
  {
    "id": "party-pack-10p",
    "name": "Party Pack Full Experience",
    "badge": "2-10 Players",
    "players": "2-10 Players",
    "minPlayers": 2,
    "maxPlayers": 10,
    "time": "25 min",
    "complexity": "Party Mega Game",
    "description": "The complete 120-card Party Pack set featuring all paw and non-paw cards, including all 35 Cat Cards and 9 Exploding Kittens.",
    "targetDecks": [
      "exploding-kittens-party-pack-edition"
    ],
    "cardCounts": {
      "defuse": 10,
      "exploding-kitten": 9,
      "attack-2x": 5,
      "targeted-attack-2x": 5,
      "see-the-future-3x": 6,
      "alter-the-future-3x": 6,
      "nope": 9,
      "shuffle": 6,
      "skip": 10,
      "draw-from-the-bottom": 7,
      "favor": 6,
      "feral-cat": 6,
      "cat-card": 35
    }
  },
  {
    "id": "lightning-kittens",
    "name": "Lightning Kittens",
    "badge": "Recipes for Disaster #1",
    "players": "2-5 Players",
    "minPlayers": 2,
    "maxPlayers": 5,
    "time": "10 min",
    "complexity": "Fast & Furious",
    "description": "A breakneck high-speed game with zero cat combos, packed with instant attacks, skips, and alter-futures.",
    "targetDecks": [
      "exploding-kittens-recipes-for-disaster"
    ],
    "cardCounts": {
      "defuse": 4,
      "exploding-kitten": 4,
      "attack-2x": 4,
      "targeted-attack-2x": 3,
      "super-skip": 2,
      "skip": 4,
      "alter-the-future-3x": 3,
      "alter-the-future-3x-now": 2,
      "see-the-future-3x": 4,
      "nope": 4
    }
  },
  {
    "id": "danger-danger",
    "name": "Danger, Danger!",
    "badge": "Recipes for Disaster #2",
    "players": "2-5 Players",
    "minPlayers": 2,
    "maxPlayers": 5,
    "time": "15 min",
    "complexity": "Extreme Hazards",
    "description": "High stakes survival with Imploding Kittens, Catomic Bombs, and Streaking Kittens.",
    "targetDecks": [
      "exploding-kittens-recipes-for-disaster",
      "imploding-kittens-expansion",
      "streaking-kittens-expansion"
    ],
    "cardCounts": {
      "defuse": 5,
      "exploding-kitten": 4,
      "imploding-kitten": 1,
      "streaking-kitten": 1,
      "catomic-bomb": 1,
      "barking-kitten": 2,
      "attack-2x": 3,
      "targeted-attack-2x": 3,
      "see-the-future-5x": 2,
      "alter-the-future-3x": 3,
      "nope": 5,
      "skip": 4
    }
  },
  {
    "id": "seeing-double",
    "name": "Seeing Double",
    "badge": "Recipes for Disaster #3",
    "players": "2-5 Players",
    "minPlayers": 2,
    "maxPlayers": 5,
    "time": "15 min",
    "complexity": "Mind Games",
    "description": "Double turns, clones, and deep future altering to outsmart your opponents.",
    "targetDecks": [
      "exploding-kittens-recipes-for-disaster"
    ],
    "cardCounts": {
      "defuse": 5,
      "exploding-kitten": 4,
      "attack-2x": 4,
      "personal-attack-3x": 3,
      "alter-the-future-3x": 3,
      "see-the-future-3x": 4,
      "swap-top-and-bottom": 3,
      "bury": 3,
      "nope": 5,
      "skip": 4,
      "reverse": 4
    }
  },
  {
    "id": "black-hole",
    "name": "The Black Hole",
    "badge": "Recipes for Disaster #4",
    "players": "2-5 Players",
    "minPlayers": 2,
    "maxPlayers": 5,
    "time": "15 min",
    "complexity": "Deck Manipulation",
    "description": "Manipulate the bottom and top of the deck with Bottom Draws, Buries, and Swaps.",
    "targetDecks": [
      "exploding-kittens-recipes-for-disaster",
      "imploding-kittens-expansion"
    ],
    "cardCounts": {
      "defuse": 5,
      "exploding-kitten": 4,
      "imploding-kitten": 1,
      "draw-from-the-bottom": 3,
      "swap-top-and-bottom": 3,
      "bury": 4,
      "alter-the-future-3x": 3,
      "reverse": 4,
      "attack-2x": 3,
      "nope": 4,
      "garbage-collection": 2
    }
  },
  {
    "id": "zombie-apocalypse",
    "name": "Zombie Apocalypse",
    "badge": "Undead Mechanics",
    "players": "2-5 Players",
    "minPlayers": 2,
    "maxPlayers": 5,
    "time": "20 min",
    "complexity": "High Interaction",
    "description": "Dead players stay active, haunting the living and clawing back into life with Zombie Kittens.",
    "targetDecks": [
      "exploding-kittens-zombie-kittens"
    ],
    "cardCounts": {
      "zombie-kitten": 5,
      "exploding-kitten": 4,
      "attack-of-the-dead": 3,
      "feed-the-dead": 2,
      "grave-robber": 1,
      "clairvoyance": 2,
      "clone": 3,
      "dig-deeper": 4,
      "attack-2x": 2,
      "super-skip": 2,
      "see-the-future-3x": 4,
      "nope": 5,
      "shuffle-now": 2,
      "cat-card": 16
    }
  },
  {
    "id": "good-vs-evil",
    "name": "Armageddon Face-Off",
    "badge": "Good vs Evil",
    "players": "2-5 Players",
    "minPlayers": 2,
    "maxPlayers": 5,
    "time": "15 min",
    "complexity": "Divine Duel",
    "description": "Trigger the Armageddon face-off where Godcat and Devilcat clash for ultimate kitten supremacy.",
    "targetDecks": [
      "exploding-kittens-good-vs-evil"
    ],
    "cardCounts": {
      "defuse": 6,
      "exploding-kitten": 4,
      "godcat": 1,
      "devilcat": 1,
      "armageddon": 3,
      "raising-heck": 2,
      "reveal-the-future-3x": 3,
      "targeted-attack-2x": 2,
      "attack-2x": 2,
      "favor": 4,
      "feral-cat": 4,
      "cat-card": 16,
      "nope": 5,
      "shuffle": 2
    }
  }
]

# Append OFFICIAL_RECIPES to decksData.js
with open("src/data/decksData.js", "a", encoding="utf-8") as f:
    f.write(f"\nexport const OFFICIAL_RECIPES = {json.dumps(OFFICIAL_RECIPES, indent=2)};\n")

print("Appended OFFICIAL_RECIPES to decksData.js")
