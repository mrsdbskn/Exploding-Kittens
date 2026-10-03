import urllib.request
from bs4 import BeautifulSoup
import re
import json

DECKS = [
    "exploding-kittens-original-edition",
    "exploding-kittens-nsfw-edition",
    "exploding-kittens-cat-burglar-edition",
    "exploding-kittens-party-pack-edition",
    "exploding-kittens-recipes-for-disaster",
    "exploding-kittens-good-vs-evil",
    "exploding-kittens-zombie-kittens",
    "exploding-kittens-2-player-edition",
    "imploding-kittens-expansion",
    "streaking-kittens-expansion",
    "barking-kittens-expansion"
]

headers = {'User-Agent': 'Mozilla/5.0'}

results = {}

for d in DECKS:
    url = f"https://explodi.ng/decks/{d}"
    req = urllib.request.Request(url, headers=headers)
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Official total shown on page header
    badge = soup.find(lambda tag: tag.name in ['div', 'span', 'h2'] and 'Cards (' in tag.get_text())
    official_header_count = badge.get_text(strip=True) if badge else "N/A"
    
    items = soup.find_all('li', class_='cardList-item')
    cards_list = []
    
    for item in items:
        name_el = item.find(class_='cardList-item-name')
        name = name_el.get_text(strip=True).replace("Now IconNOW", "").replace("NOW", "").strip() if name_el else ""
        
        icons = item.find_all('img')
        icons_count = len(icons)
        
        # Check cells
        with_paw_el = item.find(class_=lambda c: c and 'withPaw' in c)
        without_paw_el = item.find(class_=lambda c: c and 'withoutPaw' in c)
        single_count_el = item.find(class_='cardList-item-count')
        
        with_paw_text = with_paw_el.get_text(strip=True) if with_paw_el else ""
        without_paw_text = without_paw_el.get_text(strip=True) if without_paw_el else ""
        raw_count_text = single_count_el.get_text(separator=' | ', strip=True) if single_count_el else ""
        
        cards_list.append({
            'name': name,
            'withPaw': with_paw_text,
            'withoutPaw': without_paw_text,
            'raw': raw_count_text,
            'iconsCount': icons_count
        })
        
    results[d] = {
        'header': official_header_count,
        'cardsCount': len(cards_list),
        'cards': cards_list
    }

with open('all_decks_count_inspection.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("Saved all_decks_count_inspection.json")
