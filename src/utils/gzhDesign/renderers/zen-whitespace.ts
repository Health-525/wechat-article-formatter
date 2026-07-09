import { marked, type Token, type Tokens } from "marked"
import * as lib from "../themes/zen-whitespace"
import {
  parseBlocks,
  splitIntoSections,
  detectIntroQuote,
  extractCoverInfo,
  escapeHtml,
  span,
  markKeyPhrases,
  parseStandaloneImage,
  type Section,
  type Block,
} from "../shared"
import { extractMathSvg, injectRenderedMathSvg } from "../../mathSvgRenderer"

const ORDERED_MARKER = "__ZEN_ORDERED__"

const AUTO_UNDERLINE_KEYWORDS = [
  "核心",
  "关键",
  "本质",
  "心法",
  "原则",
  "觉察",
  "节奏",
  "留白",
  "专注",
  "方法",
]

function prepareOrderedLists(tokens: Token[]): Token[] {
  return tokens.map((token) => {
    if (token.type !== "list") return token

    const listToken = token as Tokens.List
    if (!listToken.ordered) return token

    return {
      ...listToken,
      items: listToken.items.map((item) => ({
        ...item,
        text: `${ORDERED_MARKER}${item.text}`,
      })),
    } as Tokens.List
  })
}

// Split a blockquote into a main quote and an optional attribution line.
function splitQuoteAuthor(text: string): { quote: string; author?: string } {
  const separators = ["——", "—", "--"]
  for (const sep of separators) {
    const idx = text.lastIndexOf(sep)
    if (idx > 0) {
      const after = text.slice(idx + sep.length).trim()
      const before = text.slice(0, idx).trim()
      if (after && before) {
        return { quote: before, author: after }
      }
    }
  }

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  const last = lines[lines.length - 1]
  if (last && /^[-–—]+\s*/.test(last)) {
    const author = last.replace(/^[-–—]+\s*/, "")
    return { quote: lines.slice(0, -1).join("\n"), author }
  }

  return { quote: text }
}

// Zen-whitespace recipe: each plain paragraph should have 1-2 key phrases
// underlined with a muted green underline, but only when keywords appear.
function autoUnderline(text: string): string {
  return markKeyPhrases(text, AUTO_UNDERLINE_KEYWORDS, "++", 2)
}

function renderInline(text: string): string {
  // Protect inline math placeholders so markdown styling does not corrupt them.
  const mathPlaceholders: string[] = []
  text = text.replace(
    /<span class="math-svg-inline-placeholder" data-math="([^"]+)"><\/span>/g,
    (_, id) => {
      mathPlaceholders.push(id)
      return `__MATH_INLINE_${mathPlaceholders.length - 1}__`
    }
  )

  // Process inline code first so it is not caught by bold/highlight patterns.
  const codeSegments: string[] = []
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    codeSegments.push(lib.inlineCode(escapeHtml(code)))
    return `__CODE_PLACEHOLDER_${codeSegments.length - 1}__`
  })

  // ==highlight==
  text = text.replace(/==([^=]+)==/g, (_, content) => lib.highlight(content))

  // <u>underline</u> or ++underline++
  text = text.replace(/<u>([^<]+)<\/u>/g, (_, content) => lib.underline(content))
  text = text.replace(/\+\+([^+]+)\+\+/g, (_, content) => lib.underline(content))

  // **bold**
  text = text.replace(/\*\*([^*]+)\*\*/g, (_, content) => lib.strong(content))

  // Restore code placeholders.
  text = text.replace(
    /__CODE_PLACEHOLDER_(\d+)__/g,
    (_, index) => codeSegments[Number(index)]
  )

  // Restore inline math placeholders verbatim; they will become SVG images later.
  text = text.replace(/__MATH_INLINE_(\d+)__/g, (_, index) => {
    const id = mathPlaceholders[Number(index)]
    return `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`
  })

  return span(text)
}

function parseListContent(content: string): { items: string[]; ordered: boolean } {
  const lines = content.split("\n").filter(Boolean)
  let ordered = false
  const items = lines.map((line) => {
    const withoutBullet = line.replace(/^•\s*/, "")
    if (withoutBullet.startsWith(ORDERED_MARKER)) {
      ordered = true
      return withoutBullet.slice(ORDERED_MARKER.length)
    }
    return withoutBullet
  })
  return { items, ordered }
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case "paragraph": {
      const img = parseStandaloneImage(block.content)
      if (img) return lib.imageCard(img.src, img.alt)
      return lib.paragraph(renderInline(autoUnderline(block.content)))
    }
    case "blockquote":
      return lib.centeredQuote(renderInline(block.content))
    case "code":
      return lib.codeBlock(block.language || "", block.content)
    case "image":
      return lib.imageCard(block.src || "", block.alt || "")
    case "heading":
      if (block.level === 3) {
        return lib.subheading(block.content)
      }
      return ""
    case "list": {
      const { items, ordered } = parseListContent(block.content)
      return lib.list(items, ordered)
    }
    case "html":
      if (block.content === "<hr>") {
        return lib.divider()
      }
      return block.content
    default:
      return ""
  }
}

function buildTocChapters(
  sections: Section[]
): Array<{ number: string; title: string }> {
  const chapters = sections.filter(
    (s): s is Section & { type: "chapter"; title: string } =>
      s.type === "chapter" && !!s.title
  )

  return chapters.map((section, index) => {
    const meta = lib.chapterMeta
      ? lib.chapterMeta(index, chapters.length, section.title)
      : { number: String(index + 1).padStart(2, "0"), label: "CHAPTER" }
    return { number: meta.number, title: section.title }
  })
}

export function render(markdown: string): string {
  const { prepared, snippets } = extractMathSvg(markdown)

  const tokens = marked.lexer(prepared)
  const blocks = parseBlocks(prepareOrderedLists(tokens))
  const sections = splitIntoSections(blocks)

  let html = ""

  const introSection = sections.find((s) => s.type === "intro")
  if (introSection) {
    // Zen-whitespace opens with the opening quote card (component 2) if the
    // user starts with a blockquote; the cover title follows after it.
    const quoteInfo = detectIntroQuote(introSection.content)
    const introQuote = quoteInfo ? splitQuoteAuthor(quoteInfo.quote) : null
    const introRemaining = quoteInfo ? quoteInfo.remaining : introSection.content

    if (introQuote) {
      html += lib.onelinerCard(introQuote.quote, introQuote.author)
    }

    const coverInfo = extractCoverInfo(introRemaining)

    if (coverInfo) {
      // This theme keeps the cover text-only; any lead image is rendered as a
      // regular image card below the cover to preserve the spacious layout.
      html += lib.cover(
        coverInfo.title,
        coverInfo.subtitle,
        undefined,
        undefined,
        undefined,
        coverInfo.titleHighlight,
        coverInfo.titleLine2
      )

      if (coverInfo.image) {
        html += lib.imageCard(coverInfo.image, "")
      }

      const tocChapters = buildTocChapters(sections)
      if (tocChapters.length >= 2) {
        html += lib.toc(tocChapters)
      }

      html += coverInfo.remaining.map((b) => renderBlock(b)).join("")
    } else {
      html += introRemaining.map((b) => renderBlock(b)).join("")
    }
  }

  const chapterSections = sections.filter((s) => s.type === "chapter")
  const totalChapters = chapterSections.length

  chapterSections.forEach((section, index) => {
    const meta = lib.chapterMeta
      ? lib.chapterMeta(index, totalChapters, section.title || "")
      : { number: String(index + 1).padStart(2, "0"), label: "CHAPTER" }

    html += lib.chapterTitle(
      meta.number,
      section.title || "",
      meta.label,
      index === 0
    )
    html += section.content.map((b) => renderBlock(b)).join("")
  })

  html += lib.footerCta()

  html = lib.container(html)
  html = injectRenderedMathSvg(html, snippets)

  return html
}
