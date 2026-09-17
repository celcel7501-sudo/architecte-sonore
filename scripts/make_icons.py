from pathlib import Path
from PIL import Image, ImageDraw

BG = "#141311"
GOLD = "#e8d7a8"
OUT = Path(__file__).resolve().parents[1] / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)


def make_icon(size: int, maskable: bool = False) -> Image.Image:
    scale = 4
    canvas = Image.new("RGB", (size * scale, size * scale), BG)
    draw = ImageDraw.Draw(canvas)
    padding = size * (0.245 if maskable else 0.165) * scale
    cx = cy = size * scale / 2
    radii = (size * 0.335, size * 0.19, size * 0.064)
    widths = (size * 0.038, size * 0.026)

    for radius, width in zip(radii[:2], widths):
        bounds = (cx - radius * scale, cy - radius * scale, cx + radius * scale, cy + radius * scale)
        draw.ellipse(bounds, outline=GOLD, width=max(1, round(width * scale)))

    dot = radii[2] * scale
    draw.ellipse((cx - dot, cy - dot, cx + dot, cy + dot), fill=GOLD)

    if not maskable:
        corner = size * 0.205 * scale
        draw.rounded_rectangle(
            (padding / 2, padding / 2, size * scale - padding / 2, size * scale - padding / 2),
            radius=corner,
            outline=BG,
            width=1,
        )

    return canvas.resize((size, size), Image.Resampling.LANCZOS)


make_icon(192).save(OUT / "icon-192.png", optimize=True)
make_icon(512).save(OUT / "icon-512.png", optimize=True)
make_icon(512, maskable=True).save(OUT / "icon-maskable-512.png", optimize=True)
