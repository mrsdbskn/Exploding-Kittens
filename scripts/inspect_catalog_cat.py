import re
import json

with open('src/data/decksData.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'export const ALL_CARDS_CATALOG = ({.*?});\n\nexport const CATEGORIES', content, re.DOTALL)
catalog = json.loads(m.group(1))

print("Catalog cat-card:")
print(json.dumps(catalog.get('cat-card'), indent=2))
