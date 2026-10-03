import os

variants = [
    ('beard-cat', 'Beard-Cat.jpg'),
    ('bikini-cat', 'Bikini-Cat.jpg'),
    ('cat-henge', 'Cat-Henge.jpg'),
    ('cat-o-lantern', 'Cat-O-Lantern.jpg'),
    ('cats-schrodinger', 'Cats-Schrodinger.jpg'),
    ('cattermelon', 'Cattermelon.jpg'),
    ('de-cat-ipated', 'De-Cat-Ipated.jpg'),
    ('electrocat', 'Electrocat.jpg'),
    ('football-cat', 'Football-Cat.jpg'),
    ('hairy-potato-cat', 'Hairy-Potato-Cat.jpg'),
    ('horse-cat', 'Horse-Cat.jpg'),
    ('kit-tea-cat', 'Kit-Tea-Cat.jpg'),
    ('knight-cat', 'Knight-Cat.jpg'),
    ('loch-ness-kitty', 'Loch-Ness-Kitty.jpg'),
    ('mercat', 'Mercat.jpg'),
    ('momma-cat', 'Momma-Cat.jpg'),
    ('rainbow-ralphing-cat', 'Rainbow-Ralphing-Cat.jpg'),
    ('shy-bladder-cat', 'Shy-Bladder-Cat.jpg'),
    ('tacocat', 'Tacocat.jpg'),
    ('telephone-boxcat', 'Telephone-Boxcat.jpg'),
    ('troll-cat', 'Troll-Cat.jpg'),
    ('vampire-cat', 'Vampire-Cat.jpg'),
    ('zombie-cat', 'Zombie-Cat.jpg'),
]

existing_pngs = os.listdir('public/cards/cat-card')

for slug, art in variants:
    png_path = f"public/cards/cat-card/{slug}.png"
    if os.path.exists(png_path):
        print(f"EXACT MATCH: {slug}.png")
    else:
        # Check if cats-schrodinger vs cat-s-schrodinger
        matches = [f for f in existing_pngs if f.endswith('.png') and (slug.replace('-', '') in f.replace('-', '') or f.replace('.png', '') in slug)]
        print(f"NO EXACT MATCH for {slug}: candidates={matches}")
