import re
import json

with open('src/data/decksData.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'export const DECKS = (\[.*?\]);\n\nexport const ALL_CARDS_CATALOG', content, re.DOTALL)
decks = json.loads(m.group(1))

for d in decks:
    for c in d['cards']:
        if c['slug'] == 'cat-card':
            print(f"{d['name']} ({d['slug']}): qty={c['quantity']}, icons={c.get('icons')}")
