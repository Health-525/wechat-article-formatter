import { describe, expect, it } from "vitest"
import { extractMath, injectRenderedMath } from "../mathRenderer"
import { renderMarkdownToHtml } from "../markdownParser"

describe("mathRenderer", () => {
  it("extracts inline math snippets", () => {
    const { prepared, snippets } = extractMath("行内公式 $E=mc^2$ 测试")
    expect(prepared).not.toContain("$E=mc^2$")
    expect(snippets).toHaveLength(1)
    expect(snippets[0].tex).toBe("E=mc^2")
    expect(snippets[0].displayMode).toBe(false)
  })

  it("extracts block math snippets", () => {
    const { prepared, snippets } = extractMath("$$\\frac{1}{2}$$")
    expect(prepared).not.toContain("$$")
    expect(snippets).toHaveLength(1)
    expect(snippets[0].tex).toBe("\\frac{1}{2}")
    expect(snippets[0].displayMode).toBe(true)
  })

  it("does not extract double dollars as inline math", () => {
    const { snippets } = extractMath("$$a$$ 和 $b$")
    expect(snippets).toHaveLength(2)
    expect(snippets[0].displayMode).toBe(true)
    expect(snippets[1].displayMode).toBe(false)
  })

  it("renders inline math to HTML with inline styles", () => {
    const { prepared, snippets } = extractMath("$x^2$")
    const html = injectRenderedMath(`<p>${prepared}</p>`, snippets)
    expect(html).toContain("katex")
    expect(html).toContain("style=")
    expect(html).not.toContain("math-inline-placeholder")
    expect(html).not.toContain("<style>")
  })

  it("renders block math to HTML with inline styles", () => {
    const { prepared, snippets } = extractMath("$$x^2$$")
    const html = injectRenderedMath(prepared, snippets)
    expect(html).toContain("katex-display")
    expect(html).toContain("style=")
    expect(html).not.toContain("math-block-placeholder")
    expect(html).not.toContain("<style>")
  })

  it("does not break normal markdown rendering", () => {
    const html = renderMarkdownToHtml("# Title\n\n$x^2$", "minimal-white")
    expect(html).toContain("Title")
    expect(html).toContain("katex")
  })

  it("falls back gracefully on invalid LaTeX", () => {
    const { prepared, snippets } = extractMath("$\\invalid$")
    const html = injectRenderedMath(`<p>${prepared}</p>`, snippets)
    expect(html).not.toContain("math-inline-placeholder")
  })

  it("does not inject a global <style> tag for KaTeX CSS", () => {
    const withMath = renderMarkdownToHtml("$x^2$", "minimal-white")
    expect(withMath).not.toContain("<style>")
    expect(withMath).not.toContain("@font-face")

    const withoutMath = renderMarkdownToHtml("hello world", "minimal-white")
    expect(withoutMath).not.toContain("<style>")
  })
})
