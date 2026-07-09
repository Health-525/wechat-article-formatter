import { describe, expect, it } from "vitest"
import { renderMarkdownToHtml, wrapArticle } from "../markdownParser"

describe("markdownParser", () => {
  describe("renderMarkdownToHtml", () => {
    it("renders headings with inline theme styles", () => {
      const html = renderMarkdownToHtml("# Hello", "minimal-white")
      expect(html).toContain("<section")
      expect(html).toContain("Hello")
      expect(html).toContain("<h1")
      expect(html).toContain("style=")
    })

    it("renders lists with inline theme styles", () => {
      const html = renderMarkdownToHtml("- one\n- two", "minimal-white")
      expect(html).toContain("<ul")
      expect(html).toContain("<li")
      expect(html).toContain("one")
      expect(html).toContain("two")
    })

    it("renders code blocks as gzh-design-style WeChat-safe sections", () => {
      const html = renderMarkdownToHtml("```ts\nconst x = 1\n```", "minimal-white")
      expect(html).toContain("<section")
      expect(html).toContain("<span leaf=\"\">ts</span>")
      expect(html).toContain("<span leaf=\"\">const x = 1</span>")
      expect(html).not.toContain("<pre")
      expect(html).not.toContain("white-space:pre")
    })

    it("wraps content in a section container", () => {
      const html = renderMarkdownToHtml("paragraph", "minimal-white")
      expect(html.startsWith("<section")).toBe(true)
      expect(html.endsWith("</section>")).toBe(true)
    })

    it("resolves root-relative image paths", () => {
      const html = renderMarkdownToHtml("![alt](/images/photo.jpg)", "minimal-white")
      expect(html).toContain('src="http')
      expect(html).toContain("/images/photo.jpg")
    })

    it("falls back to the first theme when themeId is unknown", () => {
      const html = renderMarkdownToHtml("# Title", "unknown-theme")
      expect(html).toContain("<section")
      expect(html).toContain("Title")
    })

    it("renders math as KaTeX HTML with inline styles for classic themes", () => {
      const html = renderMarkdownToHtml("$x^2$", "minimal-white")
      expect(html).toContain("katex")
      expect(html).toContain("style=")
      expect(html).not.toContain("<style>")
      expect(html).not.toContain("latex.codecogs.com")
      expect(html).not.toContain("<img")
    })

    it("renders complex gzh-design output with sections, numbering, and leaf spans", () => {
      const md = `## 标题一\n\n这是一段测试文字，包含**加粗**和\`行内代码\`。\n\n\`\`\`typescript\nconst x = 1;\nfunction hello() {\n  return world;\n}\n\`\`\`\n\n![示例图片](https://example.com/img.jpg)\n\n---\n\n## 总结\n\n第二段文字在这里。`
      const html = renderMarkdownToHtml(md, "moyu-green")
      expect(html).toContain("<section")
      expect(html).toContain("<span leaf=\"\">01</span>")
      expect(html).toContain("<span leaf=\"\">///</span>")
      expect(html).toContain("<span leaf=\"\">LAST</span>")
      expect(html).toContain("#059669")
      expect(html).not.toContain("<pre")
      expect(html).not.toContain("white-space:pre")
    })

    it.each([
      ["moyu-green", "01", "///", "LAST"],
      ["red-white", "01", "∞", "THE END"],
      ["graphite-minimal", "01", "∞", "END"],
      ["zen-whitespace", "01 · CHAPTER", "∞ · POSTSCRIPT", "POSTSCRIPT"],
      ["moyu-ticket", "01", "02", "/ CHAPTER"],
      ["olive-journal", "01", "///", "END"],
    ])("renders gzh-design theme %s with expected chapter markers", (themeId, first, last, label) => {
      const md = "## 第一章\n\n正文一。\n\n---\n\n## 第二章 总结与展望\n\n正文二。"
      const html = renderMarkdownToHtml(md, themeId)
      expect(html).toContain(first)
      expect(html).toContain(last)
      expect(html).toContain(label)
      expect(html).toContain("<section")
      expect(html).not.toContain("<pre")
      expect(html).not.toContain("white-space:pre")
    })
  })

  describe("wrapArticle", () => {
    it("injects title and subtitle into the section", () => {
      const html = renderMarkdownToHtml("body", "minimal-white")
      const wrapped = wrapArticle(html, "Article Title", "Article Subtitle", "minimal-white")
      expect(wrapped).toContain("Article Title")
      expect(wrapped).toContain("Article Subtitle")
      expect(wrapped).toContain("body")
    })

    it("escapes HTML in title and subtitle", () => {
      const html = renderMarkdownToHtml("body", "minimal-white")
      const wrapped = wrapArticle(html, "<script>alert(1)</script>", "", "minimal-white")
      expect(wrapped).not.toContain("<script>alert(1)</script>")
      expect(wrapped).toContain("&lt;script&gt;")
    })

    it.each(["moyu-green", "red-white", "graphite-minimal", "zen-whitespace", "moyu-ticket", "olive-journal"])(
      "renders LaTeX formulas as SVG images for gzh-design theme %s",
      (themeId) => {
        const md = "## 标题\n\n行内 $E=mc^2$ 测试。\n\n$$\\frac{1}{2}$$"
        const html = renderMarkdownToHtml(md, themeId)
        expect(html).toContain("<img")
        expect(html).toContain("latex.codecogs.com")
        expect(html).toContain("E=mc^2")
        expect(html).not.toContain("math-svg-inline-placeholder")
        expect(html).not.toContain("math-svg-block-placeholder")
      }
    )

    it.each(["moyu-green", "red-white", "graphite-minimal", "zen-whitespace", "moyu-ticket", "olive-journal"])(
      "renders cover and TOC for gzh-design theme %s",
      (themeId) => {
        const md = "# 封面标题\n\n封面副标题。\n\n## 第一章\n\n正文一。\n\n## 第二章\n\n正文二。"
        const html = renderMarkdownToHtml(md, themeId)
        expect(html).toContain("封面标题")
        expect(html).toContain("封面副标题")
        expect(html).toContain("01")
        expect(html).toContain("第一章")
      }
    )

    it.each(["moyu-green", "red-white", "graphite-minimal", "zen-whitespace", "moyu-ticket", "olive-journal"])(
      "renders subheading, lists, and divider for gzh-design theme %s",
      (themeId) => {
        const md = "## 章节\n\n### 小标题\n\n- 项目一\n- 项目二\n\n1. 第一步\n2. 第二步\n\n---\n\n正文。"
        const html = renderMarkdownToHtml(md, themeId)
        expect(html).toContain("小标题")
        expect(html).toContain("项目一")
        expect(html).toContain("第一步")
      }
    )
  })
})
