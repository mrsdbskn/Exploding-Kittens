import urllib.request
from bs4 import BeautifulSoup
import json
import os
import re

DECKS_META = [
    {"slug": "exploding-kittens-original-edition", "name": "Exploding Kittens: Original Edition", "type": "Standalone", "themeColor": "#861618"},
    {"slug": "exploding-kittens-nsfw-edition", "name": "Exploding Kittens: NSFW Edition", "type": "Standalone", "themeColor": "#1e1c1a"},
    {"slug": "exploding-kittens-cat-burglar-edition", "name": "Exploding Kittens: Cat Burglar Edition", "type": "Standalone", "themeColor": "#861618"},
    {"slug": "exploding-kittens-party-pack-edition", "name": "Exploding Kittens: Party Pack Edition", "type": "Standalone", "themeColor": "#690040"},
    {"slug": "exploding-kittens-recipes-for-disaster", "name": "Exploding Kittens: Recipes for Disaster", "type": "Standalone", "themeColor": "#00152e"},
    {"slug": "exploding-kittens-good-vs-evil", "name": "Exploding Kittens: Good vs. Evil", "type": "Standalone", "themeColor": "#6d0e1f"},
    {"slug": "exploding-kittens-zombie-kittens", "name": "Exploding Kittens: Zombie Kittens", "type": "Standalone", "themeColor": "#bad434"},
    {"slug": "exploding-kittens-2-player-edition", "name": "Exploding Kittens 2-Player Edition", "type": "Standalone", "themeColor": "#861618"},
    {"slug": "imploding-kittens-expansion", "name": "Imploding Kittens: Expansion", "type": "Expansion", "themeColor": "#282929"},
    {"slug": "streaking-kittens-expansion", "name": "Streaking Kittens: Expansion", "type": "Expansion", "themeColor": "#0d6938"},
    {"slug": "barking-kittens-expansion", "name": "Barking Kittens: Expansion", "type": "Expansion", "themeColor": "#fef1d1"},
]

CATEGORY_MAP = {
    'exploding-kitten': 'hazards',
    'imploding-kitten': 'hazards',
    'devilcat': 'hazards',
    'defuse': 'lifesavers',
    'zombie-kitten': 'lifesavers',
    'attack-2x': 'attacks',
    'targeted-attack-2x': 'attacks',
    'personal-attack-3x': 'attacks',
    'attack-of-the-dead': 'attacks',
    'skip': 'attacks',
    'super-skip': 'attacks',
    'reverse': 'attacks',
    'see-the-future-3x': 'vision',
    'see-the-future-5x': 'vision',
    'alter-the-future-3x': 'vision',
    'alter-the-future-3x-now': 'vision',
    'alter-the-future-5x': 'vision',
    'reveal-the-future-3x': 'vision',
    'share-the-future-3x': 'vision',
    'clairvoyance': 'vision',
    'cat-card': 'stealing',
    'feral-cat': 'stealing',
    'favor': 'stealing',
    'i-ll-take-that': 'stealing',
    'nope': 'defense',
    'shuffle': 'chaos',
    'shuffle-now': 'chaos',
    'draw-from-the-bottom': 'chaos',
    'bury': 'chaos',
    'swap-top-and-bottom': 'chaos',
    'catomic-bomb': 'chaos',
    'garbage-collection': 'chaos',
    'curse-of-the-cat-butt': 'chaos',
    'streaking-kitten': 'chaos',
    'barking-kitten': 'chaos',
    'tower-of-power': 'chaos',
    'potluck': 'chaos',
    'dig-deeper': 'chaos',
    'raising-heck': 'chaos',
    'clone': 'chaos',
    'grave-robber': 'chaos',
    'feed-the-dead': 'chaos',
    'armageddon': 'chaos',
    'godcat': 'chaos',
}

headers = {'User-Agent': 'Mozilla/5.0'}

processed_decks = []
all_unique_cards = {}

for meta in DECKS_META:
    url = f"https://explodi.ng/decks/{meta['slug']}"
    req = urllib.request.Request(url, headers=headers)
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    desc_header = soup.find(lambda tag: tag.name in ['h2', 'div', 'span'] and 'Description' in tag.get_text())
    desc_text = ""
    if desc_header and desc_header.parent:
        desc_text = desc_header.parent.get_text(separator=' ', strip=True).replace('Description', '').strip()

    items = soup.find_all('li', class_='cardList-item')
    deck_cards = []

    for item in items:
        name_el = item.find(class_='cardList-item-name')
        name_clean = name_el.get_text(strip=True).replace("Now IconNOW", "").replace("NOW", "").strip() if name_el else ""

        link_el = item.find('a', href=lambda h: h and h.startswith('/card/'))
        card_slug = link_el['href'].replace('/card/', '').strip('/') if link_el else re.sub(r'[^a-z0-9]+', '-', name_clean.lower()).strip('-')

        # Icons
        icon_imgs = item.find_all('img')
        local_icons = []
        for img in icon_imgs:
            src = img.get('src', '')
            if src:
                rel = src.replace('https://explodi.ng/images/cards/', '').replace('/images/cards/', '').lstrip('/')
                local_icons.append('./cards/' + rel)
        
        icons_count = max(1, len(local_icons))

        # Check for withPaw and withoutPaw
        with_paw_el = item.find(class_=lambda c: c and 'withPaw' in c)
        without_paw_el = item.find(class_=lambda c: c and 'withoutPaw' in c)
        single_count_el = item.find(class_='cardList-item-count')

        with_paw_qty = 0
        without_paw_qty = 0
        single_qty = 0
        paw_detail_note = ""

        if with_paw_el or without_paw_el:
            if with_paw_el:
                wp_text = with_paw_el.get_text(strip=True)
                m = re.search(r'(\d+)', wp_text)
                base = int(m.group(1)) if m else 0
                if "of each" in wp_text.lower():
                    base *= icons_count
                with_paw_qty = base

            if without_paw_el:
                wop_text = without_paw_el.get_text(strip=True)
                m = re.search(r'(\d+)', wop_text)
                base = int(m.group(1)) if m else 0
                if "of each" in wop_text.lower():
                    base *= icons_count
                without_paw_qty = base

            total_qty = with_paw_qty + without_paw_qty
            if with_paw_qty > 0 and without_paw_qty > 0:
                paw_detail_note = f"{with_paw_qty} with 🐾, {without_paw_qty} without 🐾"
            elif with_paw_qty > 0:
                paw_detail_note = f"{with_paw_qty} with 🐾"
            else:
                paw_detail_note = f"{without_paw_qty} cards"
        else:
            raw_text = single_count_el.get_text(separator=' ', strip=True) if single_count_el else ""
            m = re.search(r'(\d+)', raw_text)
            base = int(m.group(1)) if m else 1
            if "of each" in raw_text.lower():
                base *= icons_count
            total_qty = base
            single_qty = base
            paw_detail_note = f"{total_qty} cards"

        desc_row = item.find(class_='forDescription')
        short_desc = desc_row.get_text(strip=True) if desc_row else ""

        mechanics_row = item.find(class_='forMechanics')
        mechanics = mechanics_row.get_text(separator='\n', strip=True) if mechanics_row else ""

        category = CATEGORY_MAP.get(card_slug, 'chaos')

        deck_cards.append({
            'slug': card_slug,
            'name': name_clean,
            'quantity': total_qty,
            'withPawQty': with_paw_qty,
            'withoutPawQty': without_paw_qty,
            'pawDetailNote': paw_detail_note,
            'icons': local_icons,
            'shortDesc': short_desc,
            'mechanics': mechanics,
            'category': category
        })

        if card_slug not in all_unique_cards:
            all_unique_cards[card_slug] = {
                'slug': card_slug,
                'name': name_clean,
                'icons': local_icons,
                'shortDesc': short_desc,
                'mechanics': mechanics,
                'category': category,
                'decks': []
            }
        all_unique_cards[card_slug]['decks'].append(meta['slug'])

    total_cards_in_deck = sum(c['quantity'] for c in deck_cards)

    processed_decks.append({
        'id': meta['slug'],
        'slug': meta['slug'],
        'name': meta['name'],
        'type': meta['type'],
        'themeColor': meta['themeColor'],
        'totalCards': total_cards_in_deck,
        'logo': f"./decks/{meta['slug']}.webp",
        'description': desc_text,
        'cards': deck_cards
    })

categories_def = [
    {
        'id': 'all',
        'name': 'All Cards',
        'icon': 'layers',
        'color': '#80b4ff',
        'desc': 'All Exploding Kittens cards'
    },
    {
        'id': 'hazards',
        'name': 'Hazards & Bombs',
        'icon': 'flame',
        'color': '#ff5449',
        'desc': 'Exploding Kittens and game-ending hazards'
    },
    {
        'id': 'lifesavers',
        'name': 'Defuses & Revives',
        'icon': 'shield',
        'color': '#7bd78d',
        'desc': 'Defuses and Zombie resurrection cards'
    },
    {
        'id': 'attacks',
        'name': 'Attacks & Turns',
        'icon': 'swords',
        'color': '#ff9548',
        'desc': 'Attack, Skip, and Reverse turn actions'
    },
    {
        'id': 'vision',
        'name': 'Future & Intel',
        'icon': 'eye',
        'color': '#8ab4f8',
        'desc': 'See and Alter the Future'
    },
    {
        'id': 'stealing',
        'name': 'Combos & Stealing',
        'icon': 'sparkles',
        'color': '#d48aff',
        'desc': 'Cat cards, Feral Cats, and Favors'
    },
    {
        'id': 'defense',
        'name': 'Defense & Nopes',
        'icon': 'ban',
        'color': '#5ec5ff',
        'desc': 'Stops card actions in their tracks'
    },
    {
        'id': 'chaos',
        'name': 'Deck Chaos & Twists',
        'icon': 'dice',
        'color': '#ffd248',
        'desc': 'Shuffles, Bombs, Buries, and special game modifiers'
    }
]

official_recipes = [
    {
        'id': 'classic-56',
        'name': 'Classic Original',
        'badge': 'Standard',
        'players': '2-5 Players',
        'minPlayers': 2,
        'maxPlayers': 5,
        'time': '15 min',
        'complexity': 'Beginner',
        'description': 'The authentic, timeless original Russian roulette experience.',
        'targetDecks': ['exploding-kittens-original-edition'],
        'cardCounts': {
            'defuse': 6,
            'exploding-kitten': 4,
            'attack-2x': 4,
            'favor': 4,
            'nope': 5,
            'shuffle': 4,
            'skip': 4,
            'see-the-future-3x': 5,
            'cat-card': 20
        }
    },
    {
        'id': 'party-pack-10p',
        'name': 'Party Pack Full Experience',
        'badge': '2-10 Players',
        'players': '2-10 Players',
        'minPlayers': 2,
        'maxPlayers': 10,
        'time': '25 min',
        'complexity': 'Party Mega Game',
        'description': 'The complete 120-card Party Pack set featuring all paw and non-paw cards, including all 35 Cat Cards and 9 Exploding Kittens.',
        'targetDecks': ['exploding-kittens-party-pack-edition'],
        'cardCounts': {
            'defuse': 10,
            'exploding-kitten': 9,
            'attack-2x': 5,
            'targeted-attack-2x': 5,
            'see-the-future-3x': 6,
            'alter-the-future-3x': 6,
            'nope': 9,
            'shuffle': 6,
            'skip': 10,
            'draw-from-the-bottom': 7,
            'favor': 6,
            'feral-cat': 6,
            'cat-card': 35
        }
    },
    {
        'id': 'lightning-kittens',
        'name': 'Lightning Kittens',
        'badge': 'Recipes for Disaster #1',
        'players': '2-5 Players',
        'minPlayers': 2,
        'maxPlayers': 5,
        'time': '10 min',
        'complexity': 'Fast & Furious',
        'description': 'A breakneck high-speed game with zero cat combos, packed with instant attacks, skips, and alter-futures.',
        'targetDecks': ['exploding-kittens-recipes-for-disaster'],
        'cardCounts': {
            'defuse': 4,
            'exploding-kitten': 4,
            'attack-2x': 4,
            'targeted-attack-2x': 3,
            'super-skip': 2,
            'skip': 4,
            'alter-the-future-3x': 3,
            'alter-the-future-3x-now': 2,
            'see-the-future-3x': 4,
            'nope': 4
        }
    },
    {
        'id': 'danger-danger',
        'name': 'Danger, Danger!',
        'badge': 'Recipes for Disaster #2',
        'players': '2-5 Players',
        'minPlayers': 2,
        'maxPlayers': 5,
        'time': '15 min',
        'complexity': 'Extreme Hazards',
        'description': 'High stakes survival with Imploding Kittens, Catomic Bombs, and Streaking Kittens.',
        'targetDecks': ['exploding-kittens-recipes-for-disaster', 'imploding-kittens-expansion', 'streaking-kittens-expansion'],
        'cardCounts': {
            'defuse': 5,
            'exploding-kitten': 4,
            'imploding-kitten': 1,
            'streaking-kitten': 1,
            'catomic-bomb': 1,
            'barking-kitten': 2,
            'attack-2x': 3,
            'targeted-attack-2x': 3,
            'see-the-future-5x': 2,
            'alter-the-future-3x': 3,
            'nope': 5,
            'skip': 4
        }
    },
    {
        'id': 'seeing-double',
        'name': 'Seeing Double',
        'badge': 'Recipes for Disaster #3',
        'players': '2-5 Players',
        'minPlayers': 2,
        'maxPlayers': 5,
        'time': '15 min',
        'complexity': 'Mind Games',
        'description': 'Double turns, clones, and deep future altering to outsmart your opponents.',
        'targetDecks': ['exploding-kittens-recipes-for-disaster'],
        'cardCounts': {
            'defuse': 5,
            'exploding-kitten': 4,
            'attack-2x': 4,
            'personal-attack-3x': 3,
            'alter-the-future-3x': 3,
            'see-the-future-3x': 4,
            'swap-top-and-bottom': 3,
            'bury': 3,
            'nope': 5,
            'skip': 4,
            'reverse': 4
        }
    },
    {
        'id': 'black-hole',
        'name': 'The Black Hole',
        'badge': 'Recipes for Disaster #4',
        'players': '2-5 Players',
        'minPlayers': 2,
        'maxPlayers': 5,
        'time': '15 min',
        'complexity': 'Deck Manipulation',
        'description': 'Manipulate the bottom and top of the deck with Bottom Draws, Buries, and Swaps.',
        'targetDecks': ['exploding-kittens-recipes-for-disaster', 'imploding-kittens-expansion'],
        'cardCounts': {
            'defuse': 5,
            'exploding-kitten': 4,
            'imploding-kitten': 1,
            'draw-from-the-bottom': 3,
            'swap-top-and-bottom': 3,
            'bury': 4,
            'alter-the-future-3x': 3,
            'reverse': 4,
            'attack-2x': 3,
            'nope': 4,
            'garbage-collection': 2
        }
    },
    {
        'id': 'zombie-apocalypse',
        'name': 'Zombie Apocalypse',
        'badge': 'Undead Mechanics',
        'players': '2-5 Players',
        'minPlayers': 2,
        'maxPlayers': 5,
        'time': '20 min',
        'complexity': 'High Interaction',
        'description': 'Dead players stay active, haunting the living and clawing back into life with Zombie Kittens.',
        'targetDecks': ['exploding-kittens-zombie-kittens'],
        'cardCounts': {
            'zombie-kitten': 5,
            'exploding-kitten': 4,
            'attack-of-the-dead': 3,
            'feed-the-dead': 2,
            'grave-robber': 1,
            'clairvoyance': 2,
            'clone': 3,
            'dig-deeper': 4,
            'attack-2x': 2,
            'super-skip': 2,
            'see-the-future-3x': 4,
            'nope': 5,
            'shuffle-now': 2,
            'cat-card': 16
        }
    },
    {
        'id': 'good-vs-evil',
        'name': 'Armageddon Face-Off',
        'badge': 'Good vs Evil',
        'players': '2-5 Players',
        'minPlayers': 2,
        'maxPlayers': 5,
        'time': '15 min',
        'complexity': 'Divine Duel',
        'description': 'Trigger the Armageddon face-off where Godcat and Devilcat clash for ultimate kitten supremacy.',
        'targetDecks': ['exploding-kittens-good-vs-evil'],
        'cardCounts': {
            'defuse': 6,
            'exploding-kitten': 4,
            'godcat': 1,
            'devilcat': 1,
            'armageddon': 3,
            'raising-heck': 2,
            'reveal-the-future-3x': 3,
            'targeted-attack-2x': 2,
            'attack-2x': 2,
            'favor': 4,
            'feral-cat': 4,
            'cat-card': 16,
            'nope': 5,
            'shuffle': 2
        }
    }
]

os.makedirs('src/data', exist_ok=True)

with open('src/data/decksData.js', 'w', encoding='utf-8') as f:
    f.write('// Auto-generated Exploding Kittens complete dataset with full paw counts\n')
    f.write('export const DECKS = ' + json.dumps(processed_decks, indent=2, ensure_ascii=False) + ';\n\n')
    f.write('export const ALL_CARDS_CATALOG = ' + json.dumps(all_unique_cards, indent=2, ensure_ascii=False) + ';\n\n')
    f.write('export const CATEGORIES = ' + json.dumps(categories_def, indent=2, ensure_ascii=False) + ';\n\n')
    f.write('export const OFFICIAL_RECIPES = ' + json.dumps(official_recipes, indent=2, ensure_ascii=False) + ';\n')

print("Wrote src/data/decksData.js successfully!")
