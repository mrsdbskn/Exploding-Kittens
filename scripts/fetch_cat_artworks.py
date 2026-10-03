import urllib.request
from bs4 import BeautifulSoup
import re
import os

url = 'https://explodi.ng/card/cat-card'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')

# Find all images
imgs = [img['src'] for img in soup.find_all('img') if img.get('src')]
cat_imgs = [s for s in imgs if 'cat-card' in s]
print('Cat card images found:', len(cat_imgs))
for s in cat_imgs:
    print(s)
