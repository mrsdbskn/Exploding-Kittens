import json
import re

with open('all_decks_count_inspection.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for deck_slug, d in data.items():
    deck_total = 0
    cat_cards_total = 0
    for c in d['cards']:
        total_for_card = 0
        if c['withPaw'] or c['withoutPaw']:
            if c['withPaw']:
                m = re.search(r'(\d+)', c['withPaw'])
                qty = int(m.group(1)) if m else 0
                if "of each" in c['withPaw'].lower():
                    qty *= c['iconsCount']
                total_for_card += qty
            if c['withoutPaw']:
                m = re.search(r'(\d+)', c['withoutPaw'])
                qty = int(m.group(1)) if m else 0
                if "of each" in c['withoutPaw'].lower():
                    qty *= c['iconsCount']
                total_for_card += qty
        else:
            m = re.search(r'(\d+)', c['raw'])
            qty = int(m.group(1)) if m else 1
            if "of each" in c['raw'].lower():
                qty *= c['iconsCount']
            total_for_card = qty
            
        deck_total += total_for_card
        if 'cat card' in c['name'].lower():
            cat_cards_total = total_for_card
            
    print(f"{deck_slug:<40}: Total = {deck_total:>3} cards | Cat Cards = {cat_cards_total}")
