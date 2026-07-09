"""Generate subtle seamless paper textures for the warm-ink theme."""
from PIL import Image, ImageDraw
import numpy as np
from pathlib import Path

ROOT = Path(__file__).parent.parent
OUT_PATHS = {
    "bg": [
        ROOT / "public/images/warm-ink-paper-bg.png",
        ROOT / "scripts/images/warm-ink-paper-bg.png",
    ],
    "card": [
        ROOT / "public/images/warm-ink-paper-card.png",
        ROOT / "scripts/images/warm-ink-paper-card.png",
    ],
}

SIZE = 512
GRID = 32  # number of cells per axis -> low-frequency noise


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def smoothstep(t: np.ndarray) -> np.ndarray:
    return t * t * (3 - 2 * t)


def seamless_value_noise(size: int, grid: int, amplitude: float) -> np.ndarray:
    """Generate tileable low-frequency value noise."""
    # Random values at grid points, periodic boundary
    values = np.random.rand(grid, grid).astype(np.float32)
    # Prepare interpolation coordinates
    xs = np.arange(size, dtype=np.float32)
    ys = np.arange(size, dtype=np.float32)
    # Normalized cell coordinates
    cx = (xs / size * grid) % grid
    cy = (ys / size * grid) % grid
    ix0 = cx.astype(np.int32)
    iy0 = cy.astype(np.int32)
    ix1 = (ix0 + 1) % grid
    iy1 = (iy0 + 1) % grid
    fx = cx - ix0
    fy = cy - iy0
    fx = smoothstep(fx)
    fy = smoothstep(fy)
    # Bilinear interpolation
    # Values at four corners for each cell
    v00 = values[iy0[:, None], ix0[None, :]]
    v10 = values[iy0[:, None], ix1[None, :]]
    v01 = values[iy1[:, None], ix0[None, :]]
    v11 = values[iy1[:, None], ix1[None, :]]
    noise = (
        v00 * (1 - fx) * (1 - fy)
        + v10 * fx * (1 - fy)
        + v01 * (1 - fx) * fy
        + v11 * fx * fy
    )
    return (noise - 0.5) * 2 * amplitude


def draw_fibers(
    draw: ImageDraw.Draw,
    size: int,
    base: tuple[int, int, int],
    count: int = 120,
    max_len: float = 28.0,
    alpha: int = 18,
):
    """Draw many short semi-transparent fibers to simulate paper grain."""
    for _ in range(count):
        x0, y0 = np.random.rand(2) * size
        angle = np.random.rand() * 2 * np.pi
        length = np.random.rand() * max_len + 6
        x1 = x0 + np.cos(angle) * length
        y1 = y0 + np.sin(angle) * length
        # Vary color slightly around base
        delta = np.random.randint(-18, 19, size=3)
        color = tuple(np.clip(np.array(base) + delta, 0, 255).astype(int).tolist()) + (alpha,)
        draw.line([(x0, y0), (x1, y1)], fill=color, width=1)


def generate_texture(base_hex: str) -> Image.Image:
    base = hex_to_rgb(base_hex)
    arr = np.full((SIZE, SIZE, 3), base, dtype=np.uint8)

    # Add seamless low-frequency brightness variation
    noise = seamless_value_noise(SIZE, GRID, amplitude=2.5)
    arr = np.clip(arr.astype(np.int16) + noise[:, :, None], 0, 255).astype(np.uint8)

    img = Image.fromarray(arr)
    draw = ImageDraw.Draw(img, "RGBA")

    # Add tiny specks
    for _ in range(200):
        x, y = np.random.randint(0, SIZE, size=2)
        delta = np.random.randint(-8, 9, size=3)
        color = tuple(np.clip(np.array(base) + delta, 0, 255).astype(int).tolist()) + (8,)
        draw.point((x, y), fill=color)

    draw_fibers(draw, SIZE, base, count=90, max_len=24, alpha=6)

    return img


def main():
    for name, paths in OUT_PATHS.items():
        base_hex = "#FDFBF7" if name == "bg" else "#F7F2EC"
        img = generate_texture(base_hex)
        for p in paths:
            p.parent.mkdir(parents=True, exist_ok=True)
            img.save(p, "PNG", optimize=True)
            print(f"saved {p} ({p.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
