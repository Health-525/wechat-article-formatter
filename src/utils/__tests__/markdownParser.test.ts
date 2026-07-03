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

    it("renders code blocks with inline theme styles", () => {
      const html = renderMarkdownToHtml("```ts\nconst x = 1\n```", "minimal-white")
      expect(html).toContain("<pre")
      expect(html).toContain("<code")
      expect(html).toContain("const x = 1")
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
  })
})
