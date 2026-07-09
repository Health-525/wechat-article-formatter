import { describe, expect, it } from "vitest"
import { extractMathSvg, injectRenderedMathSvg } from "../mathSvgRenderer"
import { renderMarkdownToHtml } from "../markdownParser"

describe("mathSvgRenderer", () => {
  it("extracts inline math snippets", () => {
    const { prepared, snippets } = extractMathSvg("行内公式 $E=mc^2$ 测试")
    expect(prepared).not.toContain("$E=mc^2$")
    expect(snippets).toHaveLength(1)
    expect(snippets[0].tex).toBe("E=mc^2")
    expect(snippets[0].displayMode).toBe(false)
  })

  it("extracts block math snippets", () => {
    const { prepared, snippets } = extractMathSvg("$$\\frac{1}{2}$$")
    expect(prepared).not.toContain("$$")
    expect(snippets).toHaveLength(1)
    expect(snippets[0].tex).toBe("\\frac{1}{2}")
    expect(snippets[0].displayMode).toBe(true)
  })

  it("does not extract double dollars as inline math", () => {
    const { snippets } = extractMathSvg("$$a$$ 和 $b$")
    expect(snippets).toHaveLength(2)
    expect(snippets[0].displayMode).toBe(true)
    expect(snippets[1].displayMode).toBe(false)
  })

  it("renders inline math as an SVG image", () => {
    const { prepared, snippets } = extractMathSvg("$x^2$")
    const html = injectRenderedMathSvg(`<p>${prepared}</p>`, snippets)
    expect(html).toContain("latex.codecogs.com")
    expect(html).toContain("<img")
    expect(html).not.toContain("math-svg-inline-placeholder")
  })

  it("renders block math as a centered SVG image", () => {
    const { prepared, snippets } = extractMathSvg("$$x^2$$")
    const html = injectRenderedMathSvg(prepared, snippets)
    expect(html).toContain("latex.codecogs.com")
    expect(html).toContain("<img")
    expect(html).toContain("text-align:center")
    expect(html).not.toContain("math-svg-block-placeholder")
  })

  it("does not break normal markdown rendering", () => {
    const html = renderMarkdownToHtml("# Title\n\n$x^2$", "minimal-white")
    expect(html).toContain("Title")
    expect(html).toContain("latex.codecogs.com")
  })

  it("falls back gracefully on invalid LaTeX", () => {
    const { prepared, snippets } = extractMathSvg("$\\invalid$")
    const html = injectRenderedMathSvg(`<p>${prepared}</p>`, snippets)
    expect(html).not.toContain("math-svg-inline-placeholder")
  })

  it("does not inject KaTeX CSS or class attributes", () => {
    const withMath = renderMarkdownToHtml("$x^2$", "minimal-white")
    expect(withMath).not.toContain("<style>")
    expect(withMath).not.toContain("@font-face")
    expect(withMath).not.toContain('class="katex')
    expect(withMath).not.toContain("position:absolute")

    const withoutMath = renderMarkdownToHtml("hello world", "minimal-white")
    expect(withoutMath).not.toContain("<style>")
  })
})
