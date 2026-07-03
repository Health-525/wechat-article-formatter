#!/usr/bin/env python3
"""Extract KaTeX CSS into a TypeScript string constant for inline injection."""

from pathlib import Path

ROOT = Path(__file__).parent.parent
CSS_PATH = ROOT / "node_modules" / "katex" / "dist" / "katex.min.css"
OUT_PATH = ROOT / "src" / "utils" / "katexCss.ts"


def main():
    if not CSS_PATH.exists():
        raise FileNotFoundError(f"KaTeX CSS not found at {CSS_PATH}")

    css = CSS_PATH.read_text(encoding="utf-8")
    # Minify a bit more: remove comments and excessive whitespace
    css = " ".join(css.split())

    ts_content = (
        "// Auto-generated from node_modules/katex/dist/katex.min.css\n"
        "// Run: python scripts/extract-katex-css.py\n\n"
        f"export const katexCss = {repr(css)}\n"
    )

    OUT_PATH.write_text(ts_content, encoding="utf-8")
    print(f"Extracted {len(css)} bytes of KaTeX CSS to {OUT_PATH}")


if __name__ == "__main__":
    main()
