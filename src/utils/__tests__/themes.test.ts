import { describe, expect, it } from "vitest"
import { themes, themeCategories } from "../themes"

const STYLE_KEYS = [
  "container",
  "title",
  "subtitle",
  "h1",
  "h2",
  "h3",
  "paragraph",
  "blockquote",
  "code",
  "codeBlock",
  "pre",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "a",
  "img",
  "table",
  "th",
  "td",
  "hr",
] as const

describe("themes", () => {
  it("exports 21 themes grouped into categories", () => {
    expect(themes).toHaveLength(21)
    const totalInCategories = themeCategories.reduce(
      (sum, cat) => sum + cat.themes.length,
      0
    )
    expect(totalInCategories).toBe(21)
  })

  it.each(themes.map((t) => [t.id, t] as const))(
    "%s has all required style keys and metadata",
    (_, theme) => {
      expect(theme.id).toBeTruthy()
      expect(theme.name).toBeTruthy()
      expect(theme.description).toBeTruthy()
      expect(theme.previewBg).toMatch(/^#/)
      expect(theme.category).toBeTruthy()

      for (const key of STYLE_KEYS) {
        expect(theme.styles[key]).toBeTruthy()
      }
    }
  )

  it.each(themes.map((t) => [t.id, t] as const))(
    "%s container has safe base styles",
    (_, theme) => {
      expect(theme.styles.container).toContain("max-width")
      expect(theme.styles.container).toContain("padding")
      expect(theme.styles.container).toContain("font-size")
      expect(theme.styles.container).toContain("word-break")
    }
  )

  it.each(themes.map((t) => [t.id, t] as const))(
    "%s images never overflow and tables collapse borders",
    (_, theme) => {
      expect(theme.styles.img).toContain("max-width:100%")
      expect(theme.styles.table).toContain("border-collapse:collapse")
    }
  )

  it.each(themes.map((t) => [t.id, t] as const))(
    "%s headings are block-level and WeChat-safe",
    (_, theme) => {
      expect(theme.styles.h1).not.toContain("display:inline-block")
      expect(theme.styles.h2).not.toContain("display:inline-block")
      expect(theme.styles.h3).not.toContain("display:inline-block")
    }
  )

  it.each(themes.map((t) => [t.id, t] as const))(
    "%s strong does not use linear-gradient",
    (_, theme) => {
      expect(theme.styles.strong).not.toContain("linear-gradient")
    }
  )

  it.each(themes.map((t) => [t.id, t] as const))(
    "%s lists preserve visible bullets or numbers",
    (_, theme) => {
      expect(theme.styles.ul).not.toContain("list-style:none")
      expect(theme.styles.ol).not.toContain("list-style:none")
    }
  )

  it.each(themes.map((t) => [t.id, t] as const))(
    "%s links are underlined for accessibility",
    (_, theme) => {
      expect(theme.styles.a).toContain("border-bottom")
    }
  )
})
