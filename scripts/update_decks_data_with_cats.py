import re
import json

CAT_VARIANTS_CATALOG = [
    {
        "slug": "beard-cat",
        "name": "Beard Cat",
        "icon": "./cards/cat-card/beard-cat.png",
        "art": "./cards/cat-card/artworks/Beard-Cat.jpg",
        "decks": [
            "exploding-kittens-original-edition",
            "exploding-kittens-party-pack-edition",
            "exploding-kittens-cat-burglar-edition",
            "exploding-kittens-recipes-for-disaster",
            "exploding-kittens-2-player-edition"
        ]
    },
    {
        "slug": "bikini-cat",
        "name": "Bikini Cat",
        "icon": "./cards/cat-card/bikini-cat.png",
        "art": "./cards/cat-card/artworks/Bikini-Cat.jpg",
        "decks": ["exploding-kittens-nsfw-edition"]
    },
    {
        "slug": "cat-henge",
        "name": "Cat-Henge",
        "icon": "./cards/cat-card/cat-henge.png",
        "art": "./cards/cat-card/artworks/Cat-Henge.jpg",
        "decks": []
    },
    {
        "slug": "cat-o-lantern",
        "name": "Cat-O-Lantern",
        "icon": "./cards/cat-card/cat-o-lantern.png",
        "art": "./cards/cat-card/artworks/Cat-O-Lantern.jpg",
        "decks": ["exploding-kittens-zombie-kittens"]
    },
    {
        "slug": "cats-schrodinger",
        "name": "Cat's Schrödinger",
        "icon": "./cards/cat-card/cats-schrodinger.png",
        "art": "./cards/cat-card/artworks/Cats-Schrodinger.jpg",
        "decks": ["exploding-kittens-nsfw-edition"]
    },
    {
        "slug": "cattermelon",
        "name": "Cattermelon",
        "icon": "./cards/cat-card/cattermelon.png",
        "art": "./cards/cat-card/artworks/Cattermelon.jpg",
        "decks": [
            "exploding-kittens-original-edition",
            "exploding-kittens-party-pack-edition",
            "exploding-kittens-cat-burglar-edition"
        ]
    },
    {
        "slug": "de-cat-ipated",
        "name": "De-Cat-Ipated",
        "icon": "./cards/cat-card/de-cat-ipated.png",
        "art": "./cards/cat-card/artworks/De-Cat-Ipated.jpg",
        "decks": ["exploding-kittens-zombie-kittens"]
    },
    {
        "slug": "electrocat",
        "name": "Electrocat",
        "icon": "./cards/cat-card/electrocat.png",
        "art": "./cards/cat-card/artworks/Electrocat.jpg",
        "decks": ["exploding-kittens-zombie-kittens"]
    },
    {
        "slug": "football-cat",
        "name": "Football Cat",
        "icon": "./cards/cat-card/football-cat.png",
        "art": "./cards/cat-card/artworks/Football-Cat.jpg",
        "decks": []
    },
    {
        "slug": "hairy-potato-cat",
        "name": "Hairy Potato Cat",
        "icon": "./cards/cat-card/hairy-potato-cat.png",
        "art": "./cards/cat-card/artworks/Hairy-Potato-Cat.jpg",
        "decks": [
            "exploding-kittens-original-edition",
            "exploding-kittens-party-pack-edition",
            "exploding-kittens-cat-burglar-edition"
        ]
    },
    {
        "slug": "horse-cat",
        "name": "Horse Cat",
        "icon": "./cards/cat-card/horse-cat.png",
        "art": "./cards/cat-card/artworks/Horse-Cat.jpg",
        "decks": ["exploding-kittens-good-vs-evil"]
    },
    {
        "slug": "kit-tea-cat",
        "name": "Kit-Tea Cat",
        "icon": "./cards/cat-card/kit-tea-cat.png",
        "art": "./cards/cat-card/artworks/Kit-Tea-Cat.jpg",
        "decks": []
    },
    {
        "slug": "knight-cat",
        "name": "Knight Cat",
        "icon": "./cards/cat-card/knight-cat.png",
        "art": "./cards/cat-card/artworks/Knight-Cat.jpg",
        "decks": ["exploding-kittens-good-vs-evil"]
    },
    {
        "slug": "loch-ness-kitty",
        "name": "Loch Ness Kitty",
        "icon": "./cards/cat-card/loch-ness-kitty.png",
        "art": "./cards/cat-card/artworks/Loch-Ness-Kitty.jpg",
        "decks": []
    },
    {
        "slug": "mercat",
        "name": "Mercat",
        "icon": "./cards/cat-card/mercat.png",
        "art": "./cards/cat-card/artworks/Mercat.jpg",
        "decks": ["exploding-kittens-good-vs-evil"]
    },
    {
        "slug": "momma-cat",
        "name": "Momma Cat",
        "icon": "./cards/cat-card/momma-cat.png",
        "art": "./cards/cat-card/artworks/Momma-Cat.jpg",
        "decks": ["exploding-kittens-nsfw-edition"]
    },
    {
        "slug": "rainbow-ralphing-cat",
        "name": "Rainbow-Ralphing Cat",
        "icon": "./cards/cat-card/rainbow-ralphing-cat.png",
        "art": "./cards/cat-card/artworks/Rainbow-Ralphing-Cat.jpg",
        "decks": [
            "exploding-kittens-original-edition",
            "exploding-kittens-party-pack-edition",
            "exploding-kittens-cat-burglar-edition",
            "exploding-kittens-recipes-for-disaster",
            "exploding-kittens-2-player-edition"
        ]
    },
    {
        "slug": "shy-bladder-cat",
        "name": "Shy Bladder Cat",
        "icon": "./cards/cat-card/shy-bladder-cat.png",
        "art": "./cards/cat-card/artworks/Shy-Bladder-Cat.jpg",
        "decks": ["exploding-kittens-nsfw-edition"]
    },
    {
        "slug": "tacocat",
        "name": "Tacocat",
        "icon": "./cards/cat-card/tacocat.png",
        "art": "./cards/cat-card/artworks/Tacocat.jpg",
        "decks": [
            "exploding-kittens-original-edition",
            "exploding-kittens-party-pack-edition",
            "exploding-kittens-cat-burglar-edition",
            "exploding-kittens-recipes-for-disaster",
            "exploding-kittens-2-player-edition"
        ]
    },
    {
        "slug": "telephone-boxcat",
        "name": "Telephone Boxcat",
        "icon": "./cards/cat-card/telephone-boxcat.png",
        "art": "./cards/cat-card/artworks/Telephone-Boxcat.jpg",
        "decks": []
    },
    {
        "slug": "troll-cat",
        "name": "Troll Cat",
        "icon": "./cards/cat-card/troll-cat.png",
        "art": "./cards/cat-card/artworks/Troll-Cat.jpg",
        "decks": ["exploding-kittens-good-vs-evil"]
    },
    {
        "slug": "vampire-cat",
        "name": "Vampire Cat",
        "icon": "./cards/cat-card/vampire-cat.png",
        "art": "./cards/cat-card/artworks/Vampire-Cat.jpg",
        "decks": ["exploding-kittens-zombie-kittens"]
    },
    {
        "slug": "zombie-cat",
        "name": "Zombie Cat",
        "icon": "./cards/cat-card/zombie-cat.png",
        "art": "./cards/cat-card/artworks/Zombie-Cat.jpg",
        "decks": [
            "exploding-kittens-nsfw-edition",
            "exploding-kittens-recipes-for-disaster"
        ]
    }
]

# Deck variant breakdowns:
DECK_VARIANTS = {
    "exploding-kittens-original-edition": [
        ("beard-cat", 4),
        ("cattermelon", 4),
        ("hairy-potato-cat", 4),
        ("rainbow-ralphing-cat", 4),
        ("tacocat", 4)
    ],
    "exploding-kittens-nsfw-edition": [
        ("bikini-cat", 4),
        ("cats-schrodinger", 4),
        ("momma-cat", 4),
        ("shy-bladder-cat", 4),
        ("zombie-cat", 4)
    ],
    "exploding-kittens-cat-burglar-edition": [
        ("beard-cat", 4),
        ("cattermelon", 4),
        ("hairy-potato-cat", 4),
        ("rainbow-ralphing-cat", 4),
        ("tacocat", 4)
    ],
    "exploding-kittens-party-pack-edition": [
        ("beard-cat", 7),
        ("cattermelon", 7),
        ("hairy-potato-cat", 7),
        ("rainbow-ralphing-cat", 7),
        ("tacocat", 7)
    ],
    "exploding-kittens-recipes-for-disaster": [
        ("beard-cat", 4),
        ("rainbow-ralphing-cat", 4),
        ("tacocat", 4),
        ("zombie-cat", 4)
    ],
    "exploding-kittens-good-vs-evil": [
        ("horse-cat", 4),
        ("knight-cat", 4),
        ("mercat", 4),
        ("troll-cat", 4)
    ],
    "exploding-kittens-zombie-kittens": [
        ("cat-o-lantern", 4),
        ("de-cat-ipated", 4),
        ("electrocat", 4),
        ("vampire-cat", 4)
    ],
    "exploding-kittens-2-player-edition": [
        ("beard-cat", 4),
        ("rainbow-ralphing-cat", 4),
        ("tacocat", 4)
    ]
}

# Lookup map
catalog_by_slug = {v["slug"]: v for v in CAT_VARIANTS_CATALOG}

# Read existing decksData.js
with open("src/data/decksData.js", "r", encoding="utf-8") as f:
    code = f.read()

m = re.search(r"export const DECKS = (\[.*?\]);\n\nexport const ALL_CARDS_CATALOG = ({.*?});\n\nexport const CATEGORIES = (\[.*?\]);", code, re.DOTALL)
if not m:
    print("Failed to parse decksData.js regex!")
    exit(1)

decks = json.loads(m.group(1))
catalog = json.loads(m.group(2))
categories = json.loads(m.group(3))

# Update cat-card in catalog
all_cat_icons = [v["icon"] for v in CAT_VARIANTS_CATALOG]
catalog["cat-card"]["icons"] = all_cat_icons
catalog["cat-card"]["variants"] = CAT_VARIANTS_CATALOG

# Update decks
for d in decks:
    slug = d.get("slug")
    if slug in DECK_VARIANTS:
        for c in d.get("cards", []):
            if c.get("slug") == "cat-card":
                variant_list = []
                for v_slug, qty in DECK_VARIANTS[slug]:
                    v_meta = catalog_by_slug[v_slug]
                    variant_list.append({
                        "slug": v_slug,
                        "name": v_meta["name"],
                        "quantity": qty,
                        "icon": v_meta["icon"],
                        "art": v_meta["art"]
                    })
                c["variants"] = variant_list
                c["icons"] = [v["icon"] for v in variant_list]

new_code = f"""// Auto-generated Exploding Kittens complete dataset with full cat card artwork variants
export const CAT_VARIANTS_CATALOG = {json.dumps(CAT_VARIANTS_CATALOG, indent=2)};

export const DECKS = {json.dumps(decks, indent=2)};

export const ALL_CARDS_CATALOG = {json.dumps(catalog, indent=2)};

export const CATEGORIES = {json.dumps(categories, indent=2)};
"""

with open("src/data/decksData.js", "w", encoding="utf-8") as f:
    f.write(new_code)

print("Successfully updated src/data/decksData.js with 23 cat variants!")
