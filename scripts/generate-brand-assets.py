#!/usr/bin/env python3
"""Generate brand assets for 墨排 (Mopai)."""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).parent.parent
OUT = ROOT / "public"
OUT.mkdir(parents=True, exist_ok=True)

ACCENT = "#f25b29"
BG_DARK = "#0a0a0b"
BG_LIGHT = "#ffffff"
TEXT_LIGHT = "#ffffff"
TEXT_DARK = "#1a1a1a"

# Try common Chinese fonts on Windows
FONT_CANDIDATES = [
    "msyh.ttc",
    "simhei.ttf",
    "simsun.ttc",
    "msyhbd.ttc",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for name in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            continue
    raise RuntimeError("No Chinese font found")


def create_icon(size: int, dark: bool = True) -> Image.Image:
    bg = BG_DARK if dark else BG_LIGHT
    text_color = TEXT_LIGHT if dark else TEXT_DARK
    img = Image.new("RGB", (size, size), bg)
    draw = ImageDraw.Draw(img)

    # Draw a subtle rounded square background accent
    pad = int(size * 0.12)
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=int(size * 0.18),
        fill=ACCENT,
    )

    # Draw 墨 character
    font_size = int(size * 0.55)
    font = load_font(font_size)
    text = "墨"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1] - int(size * 0.02)
    draw.text((x, y), text, font=font, fill=text_color)

    return img


def create_og_image() -> Image.Image:
    width, height = 1200, 630
    img = Image.new("RGB", (width, height), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Background gradient-like effect with accent circles
    draw.ellipse([700, -100, 1300, 400], fill=(20, 20, 22))
    draw.ellipse([800, 300, 1250, 700], fill="#1e120e")

    # Logo square
    logo_size = 140
    logo = create_icon(logo_size, dark=True)
    img.paste(logo, (90, 245))

    # Title
    title_font = load_font(72)
    draw.text((270, 230), "墨排 · Mopai", font=title_font, fill=TEXT_LIGHT)

    # Subtitle
    subtitle_font = load_font(36)
    draw.text(
        (270, 330),
        "免费 Markdown 转微信公众号排版工具",
        font=subtitle_font,
        fill="#cccccc",
    )

    # Tagline
    tagline_font = load_font(28)
    draw.text(
        (270, 400),
        "12 套精美主题 · 实时预览 · 一键复制",
        font=tagline_font,
        fill=ACCENT,
    )

    # URL at bottom
    url_font = load_font(24)
    draw.text(
        (90, 560),
        "health-525.github.io/wechat-article-formatter",
        font=url_font,
        fill="#666666",
    )

    return img


def create_favicon_ico() -> None:
    icon16 = create_icon(16)
    icon32 = create_icon(32)
    icon16.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32)])


def main():
    print("Generating brand assets...")

    create_icon(32).save(OUT / "favicon-32x32.png")
    create_icon(180).save(OUT / "apple-touch-icon.png")
    create_icon(192).save(OUT / "android-chrome-192x192.png")
    create_icon(512).save(OUT / "android-chrome-512x512.png")
    create_og_image().save(OUT / "og-image.png")
    create_favicon_ico()

    print("Done. Assets saved to public/")
    for f in OUT.iterdir():
        if f.suffix in {".png", ".ico"}:
            print(f"  - {f.name} ({f.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
