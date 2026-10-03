import json

with open('all_decks_count_inspection.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

zk = data.get('exploding-kittens-zombie-kittens')
print("Zombie Kittens cards count:", len(zk['cards']))
for c in zk['cards']:
    print(c)
