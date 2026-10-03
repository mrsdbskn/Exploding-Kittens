import urllib.request
import os

os.makedirs('public/cards/cat-card/artworks', exist_ok=True)

variants = [
    ("beard-cat", "Beard-Cat.jpg", "Beard Cat"),
    ("bikini-cat", "Bikini-Cat.jpg", "Bikini Cat"),
    ("cat-henge", "Cat-Henge.jpg", "Cat-Henge"),
    ("cat-o-lantern", "Cat-O-Lantern.jpg", "Cat-O-Lantern"),
    ("cats-schrodinger", "Cats-Schrodinger.jpg", "Cat's Schrödinger"),
    ("cattermelon", "Cattermelon.jpg", "Cattermelon"),
    ("de-cat-ipated", "De-Cat-Ipated.jpg", "De-Cat-Ipated"),
    ("electrocat", "Electrocat.jpg", "Electrocat"),
    ("football-cat", "Football-Cat.jpg", "Football Cat"),
    ("hairy-potato-cat", "Hairy-Potato-Cat.jpg", "Hairy Potato Cat"),
    ("horse-cat", "Horse-Cat.jpg", "Horse Cat"),
    ("kit-tea-cat", "Kit-Tea-Cat.jpg", "Kit-Tea Cat"),
    ("knight-cat", "Knight-Cat.jpg", "Knight Cat"),
    ("loch-ness-kitty", "Loch-Ness-Kitty.jpg", "Loch Ness Kitty"),
    ("mercat", "Mercat.jpg", "Mercat"),
    ("momma-cat", "Momma-Cat.jpg", "Momma Cat"),
    ("rainbow-ralphing-cat", "Rainbow-Ralphing-Cat.jpg", "Rainbow-Ralphing Cat"),
    ("shy-bladder-cat", "Shy-Bladder-Cat.jpg", "Shy Bladder Cat"),
    ("tacocat", "Tacocat.jpg", "Tacocat"),
    ("telephone-boxcat", "Telephone-Boxcat.jpg", "Telephone Boxcat"),
    ("troll-cat", "Troll-Cat.jpg", "Troll Cat"),
    ("vampire-cat", "Vampire-Cat.jpg", "Vampire Cat"),
    ("zombie-cat", "Zombie-Cat.jpg", "Zombie Cat"),
]

headers = {'User-Agent': 'Mozilla/5.0'}

for slug, filename, name in variants:
    # 1. Download artwork JPG
    art_url = f"https://explodi.ng/images/cards/cat-card/artworks/{filename}"
    target_art = f"public/cards/cat-card/artworks/{filename}"
    try:
        req = urllib.request.Request(art_url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(target_art, 'wb') as out:
            out.write(resp.read())
        print(f"Downloaded artwork: {filename} ({os.path.getsize(target_art)} bytes)")
    except Exception as e:
        print(f"Failed art {filename}: {e}")

    # 2. Also check if png icon exists in /images/cards/cat-card/{slug}.png
    png_url = f"https://explodi.ng/images/cards/cat-card/{slug}.png"
    target_png = f"public/cards/cat-card/{slug}.png"
    if not os.path.exists(target_png):
        try:
            req = urllib.request.Request(png_url, headers=headers)
            with urllib.request.urlopen(req) as resp, open(target_png, 'wb') as out:
                out.write(resp.read())
            print(f"  Downloaded PNG icon: {slug}.png ({os.path.getsize(target_png)} bytes)")
        except Exception as e:
            print(f"  No PNG at {png_url}: {e}")
