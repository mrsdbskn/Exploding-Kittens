import json

with open('scraped_decks.json', 'r', encoding='utf-8') as f:
    decks = json.load(f)

for d in decks:
    slug = d.get('slug', '')
    cards = d.get('cards', [])
    cat_cards = [c for c in cards if c.get('slug') == 'cat-card']
    if cat_cards:
        cc = cat_cards[0]
        print(f"Deck: {d.get('name')}")
        print(f"  Total Cat Cards: {cc.get('quantity')}")
        print(f"  Note: {cc.get('pawDetailNote')}")
        print(f"  Icons: {cc.get('icons')}")
        print()
