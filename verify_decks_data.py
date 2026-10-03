import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/decksData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract DECKS json
match = re.search(r'export const DECKS = (\[.*?\]);\n\nexport const ALL_CARDS_CATALOG', content, re.DOTALL)
if match:
    decks = json.loads(match.group(1))
    print("Found decks in src/data/decksData.js:", len(decks))
    for d in decks:
        cat_card = next((c for c in d['cards'] if c['slug'] == 'cat-card'), None)
        cat_info = f"Cat Cards = {cat_card['quantity']} ({cat_card.get('pawDetailNote', '')})" if cat_card else "No Cat Cards"
        print(f"  {d['name']:<40} -> Total: {d['totalCards']:>3} cards | {cat_info}")
else:
    print("Could not parse DECKS from file")
