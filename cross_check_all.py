import urllib.request
from bs4 import BeautifulSoup
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

# Load our local decksData
with open('src/data/decksData.js', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const DECKS = (\[.*?\]);\n\nexport const ALL_CARDS_CATALOG = ({.*?});\n\nexport const CATEGORIES', content, re.DOTALL)
local_decks = json.loads(match.group(1))
local_catalog = json.loads(match.group(2))

# Map local deck card counts by (deckSlug, cardSlug) -> qty
local_counts = {}
for d in local_decks:
    for c in d['cards']:
        local_counts[(d['slug'], c['slug'])] = c['quantity']

print(f"Total local deck-card combinations: {len(local_counts)}")

headers = {'User-Agent': 'Mozilla/5.0'}
card_slugs = sorted(list(local_catalog.keys()))
print(f"Cross-checking {len(card_slugs)} unique cards from explodi.ng/card/<slug>...")

discrepancies = []
checked_links_count = 0

for slug in card_slugs:
    url = f"https://explodi.ng/card/{slug}"
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        decks_row = soup.find(class_=lambda c: c and 'forDecks' in c)
        if not decks_row:
            continue
            
        links = decks_row.find_all('a', class_=lambda c: c and 'deckList-link' in c)
        for a in links:
            href = a.get('href', '').replace('/decks/', '').strip('/')
            raw_text = a.get_text(separator=' ', strip=True)
            
            # Extract number of cards
            m = re.search(r'(\d+)\s*card', raw_text, re.IGNORECASE)
            if not m:
                # Sometimes just a number
                nums = re.findall(r'(\d+)', raw_text)
                remote_qty = int(nums[-1]) if nums else 0
            else:
                remote_qty = int(m.group(1))
                
            local_qty = local_counts.get((href, slug), 0)
            checked_links_count += 1
            
            if local_qty != remote_qty:
                discrepancies.append({
                    'card': slug,
                    'deck': href,
                    'remote_card_page': remote_qty,
                    'local_count': local_qty,
                    'raw_text': raw_text
                })
        time.sleep(0.1)
    except Exception as e:
        print(f"Error checking {slug}: {e}")

print(f"\nFinished cross-checking {checked_links_count} card-in-deck references.")
if discrepancies:
    print(f"⚠️ FOUND {len(discrepancies)} DISCREPANCIES:")
    for d in discrepancies:
        print(f"  Card: {d['card']} in {d['deck']}: Local={d['local_count']} vs RemoteCardPage={d['remote_card_page']}")
else:
    print("✅ 100% PERFECT MATCH! All card counts across all individual card pages match our local database exactly!")
