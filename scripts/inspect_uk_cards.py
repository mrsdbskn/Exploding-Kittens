from PIL import Image
import os

files = ['Cat-Henge.jpg', 'Football-Cat.jpg', 'Kit-Tea-Cat.jpg', 'Loch-Ness-Kitty.jpg', 'Telephone-Boxcat.jpg']

for f in files:
    path = f"public/cards/cat-card/artworks/{f}"
    im = Image.open(path)
    print(f, im.size)
