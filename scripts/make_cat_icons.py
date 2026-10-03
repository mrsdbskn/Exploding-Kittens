from PIL import Image, ImageDraw
import os

uk_cats = [
    ("cat-henge", "Cat-Henge.jpg"),
    ("football-cat", "Football-Cat.jpg"),
    ("kit-tea-cat", "Kit-Tea-Cat.jpg"),
    ("loch-ness-kitty", "Loch-Ness-Kitty.jpg"),
    ("telephone-boxcat", "Telephone-Boxcat.jpg"),
    ("cats-schrodinger", "Cats-Schrodinger.jpg")
]

for slug, filename in uk_cats:
    art_path = f"public/cards/cat-card/artworks/{filename}"
    out_png = f"public/cards/cat-card/{slug}.png"
    if not os.path.exists(art_path):
        continue
    
    img = Image.open(art_path).convert("RGBA")
    w, h = img.size
    
    # In Exploding Kittens cards, the illustration is in the middle:
    # between 20% from top and 70% from top, horizontally centered
    crop_w = int(w * 0.7)
    crop_h = crop_w
    left = (w - crop_w) // 2
    top = int(h * 0.28)
    right = left + crop_w
    bottom = top + crop_h
    
    cropped = img.crop((left, top, right, bottom))
    cropped = cropped.resize((128, 128), Image.Resampling.LANCZOS)
    
    # Apply rounded corners mask for clean icon look
    mask = Image.new('L', (128, 128), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (128, 128)], radius=28, fill=255)
    
    cropped.putalpha(mask)
    cropped.save(out_png, "PNG")
    print(f"Generated clean icon for {slug} -> {out_png}")

# Also ensure cats-schrodinger has cat-s-schrodinger symlink/copy if needed
if os.path.exists("public/cards/cat-card/cat-s-schrodinger.png"):
    import shutil
    shutil.copyfile("public/cards/cat-card/cat-s-schrodinger.png", "public/cards/cat-card/cats-schrodinger.png")
