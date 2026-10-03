import urllib.request
from bs4 import BeautifulSoup
import json

url = 'https://explodi.ng/decks/exploding-kittens-party-pack-edition'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

items = soup.find_all('li', class_='cardList-item')
print('Found items in Party Pack:', len(items))

cards_info = []
for item in items:
    name_el = item.find(class_='cardList-item-name')
    name = name_el.get_text(strip=True) if name_el else 'Unknown'
    count_el = item.find(class_='cardList-item-count')
    
    # Check all children of count_el
    cells = item.find_all(class_=lambda c: c and 'count-cell' in c)
    cells_data = []
    for c in cells:
        cells_data.append({
            'text': c.get_text(strip=True),
            'class': c.get('class', [])
        })
    
    icons = item.find_all('img')
    cards_info.append({
        'name': name,
        'raw_count_text': count_el.get_text(separator=' | ', strip=True) if count_el else "",
        'cells': cells_data,
        'icons_count': len(icons)
    })

print(json.dumps(cards_info, indent=2))
