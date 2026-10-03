from PIL import Image, ImageDraw

def create_pwa_icon(size, filename):
    img = Image.new("RGBA", (size, size), (30, 27, 24, 255))
    draw = ImageDraw.Draw(img)

    # Ambient glow
    draw.ellipse(
        [(size * 0.15, size * 0.15), (size * 0.85, size * 0.85)],
        fill=(235, 115, 80, 50)
    )

    # Load exploding kitten icon
    kitten = Image.open("public/cards/exploding-kitten/exploding-kitten.png").convert("RGBA")
    
    # Scale kitten into center safe zone (65% of size)
    k_size = int(size * 0.65)
    kitten_resized = kitten.resize((k_size, k_size), Image.Resampling.LANCZOS)
    
    offset = ((size - k_size) // 2, (size - k_size) // 2)
    img.alpha_composite(kitten_resized, offset)
    
    img.save(f"public/{filename}", "PNG")
    print(f"Created public/{filename} ({size}x{size})")

create_pwa_icon(192, "icon-192.png")
create_pwa_icon(512, "icon-512.png")
