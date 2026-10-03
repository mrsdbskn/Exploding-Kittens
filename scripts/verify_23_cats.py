import os

CAT_VARIANTS = [
    {"slug": "beard-cat", "name": "Beard Cat", "art": "Beard-Cat.jpg", "icon": "beard-cat.png"},
    {"slug": "bikini-cat", "name": "Bikini Cat", "art": "Bikini-Cat.jpg", "icon": "bikini-cat.png"},
    {"slug": "cat-henge", "name": "Cat-Henge", "art": "Cat-Henge.jpg", "icon": "cat-henge.png"},
    {"slug": "cat-o-lantern", "name": "Cat-O-Lantern", "art": "Cat-O-Lantern.jpg", "icon": "cat-o-lantern.png"},
    {"slug": "cats-schrodinger", "name": "Cat's Schrödinger", "art": "Cats-Schrodinger.jpg", "icon": "cats-schrodinger.png"},
    {"slug": "cattermelon", "name": "Cattermelon", "art": "Cattermelon.jpg", "icon": "cattermelon.png"},
    {"slug": "de-cat-ipated", "name": "De-Cat-Ipated", "art": "De-Cat-Ipated.jpg", "icon": "de-cat-ipated.png"},
    {"slug": "electrocat", "name": "Electrocat", "art": "Electrocat.jpg", "icon": "electrocat.png"},
    {"slug": "football-cat", "name": "Football Cat", "art": "Football-Cat.jpg", "icon": "football-cat.png"},
    {"slug": "hairy-potato-cat", "name": "Hairy Potato Cat", "art": "Hairy-Potato-Cat.jpg", "icon": "hairy-potato-cat.png"},
    {"slug": "horse-cat", "name": "Horse Cat", "art": "Horse-Cat.jpg", "icon": "horse-cat.png"},
    {"slug": "kit-tea-cat", "name": "Kit-Tea Cat", "art": "Kit-Tea-Cat.jpg", "icon": "kit-tea-cat.png"},
    {"slug": "knight-cat", "name": "Knight Cat", "art": "Knight-Cat.jpg", "icon": "knight-cat.png"},
    {"slug": "loch-ness-kitty", "name": "Loch Ness Kitty", "art": "Loch-Ness-Kitty.jpg", "icon": "loch-ness-kitty.png"},
    {"slug": "mercat", "name": "Mercat", "art": "Mercat.jpg", "icon": "mercat.png"},
    {"slug": "momma-cat", "name": "Momma Cat", "art": "Momma-Cat.jpg", "icon": "momma-cat.png"},
    {"slug": "rainbow-ralphing-cat", "name": "Rainbow-Ralphing Cat", "art": "Rainbow-Ralphing-Cat.jpg", "icon": "rainbow-ralphing-cat.png"},
    {"slug": "shy-bladder-cat", "name": "Shy Bladder Cat", "art": "Shy-Bladder-Cat.jpg", "icon": "shy-bladder-cat.png"},
    {"slug": "tacocat", "name": "Tacocat", "art": "Tacocat.jpg", "icon": "tacocat.png"},
    {"slug": "telephone-boxcat", "name": "Telephone Boxcat", "art": "Telephone-Boxcat.jpg", "icon": "telephone-boxcat.png"},
    {"slug": "troll-cat", "name": "Troll Cat", "art": "Troll-Cat.jpg", "icon": "troll-cat.png"},
    {"slug": "vampire-cat", "name": "Vampire Cat", "art": "Vampire-Cat.jpg", "icon": "vampire-cat.png"},
    {"slug": "zombie-cat", "name": "Zombie Cat", "art": "Zombie-Cat.jpg", "icon": "zombie-cat.png"},
]

print(f"Total defined variants: {len(CAT_VARIANTS)}")
all_ok = True
for v in CAT_VARIANTS:
    art_path = f"public/cards/cat-card/artworks/{v['art']}"
    icon_path = f"public/cards/cat-card/{v['icon']}"
    if not os.path.exists(art_path):
        print(f"MISSING ART: {art_path}")
        all_ok = False
    if not os.path.exists(icon_path):
        print(f"MISSING ICON: {icon_path}")
        all_ok = False

if all_ok:
    print("ALL 23 CAT VARIANTS HAVE BOTH ARTWORK AND ICON VALIDATED!")
