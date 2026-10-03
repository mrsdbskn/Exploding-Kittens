import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('all_decks_count_inspection.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for deck_slug, d in data.items():
    print(f"\n=============================\n{deck_slug} (Header: {d['header']})")
    deck_total = 0
    for c in d['cards']:
        total_for_card = 0
        detail = []
        
        if c['withPaw'] or c['withoutPaw']:
            if c['withPaw']:
                m = re.search(r'(\d+)', c['withPaw'])
                qty = int(m.group(1)) if m else 0
                if "of each" in c['withPaw'].lower():
                    qty *= c['iconsCount']
                total_for_card += qty
                detail.append(f"withPaw: {qty}")
            
            if c['withoutPaw']:
                m = re.search(r'(\d+)', c['withoutPaw'])
                qty = int(m.group(1)) if m else 0
                if "of each" in c['withoutPaw'].lower():
                    qty *= c['iconsCount']
                total_for_card += qty
                detail.append(f"withoutPaw: {qty}")
        else:
            m = re.search(r'(\d+)', c['raw'])
            qty = int(m.group(1)) if m else 1
            if "of each" in c['raw'].lower():
                qty *= c['iconsCount']
            total_for_card = qty
            detail.append(f"single: {qty}")
            
        deck_total += total_for_card
        print(f"  {c['name']:<25}: {total_for_card:>2} ({', '.join(detail)}) [icons: {c['iconsCount']}]")
    print(f" TOTAL FOR {deck_slug}: {deck_total}")
