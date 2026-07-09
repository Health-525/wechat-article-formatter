import { marked, type Token, type Tokens } from "marked"
import * as lib from "../themes/moyu-ticket"
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

interface RichBlock extends Block {
  ordered?: boolean
}

const AUTO_UNDERLINE_KEYWORDS = [
  "核心",
  "关键",
  "结论",
  "评级",
  "建议",
  "避坑",
  "必看",
  "要点",
]

function renderInline(text: string): string {
  // Protect inline math placeholders so the markdown lexer does not corrupt them.
  const mathPlaceholders: string[] = []
  text = text.replace(
    /<span class="math-svg-inline-placeholder" data-math="([^"]+)"><\/span>/g,
    (_, id) => {
      mathPlaceholders.push(id)
      return `__MATH_INLINE_${mathPlaceholders.length - 1}__`
    }
  )

  // Process inline code first so it doesn't get caught by other patterns.
  const codeSegments: string[] = []
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    codeSegments.push(lib.inlineCode(escapeHtml(code)))
    return `__CODE_PLACEHOLDER_${codeSegments.length - 1}__`
  })

  // Ticket style: auto-underline 1-2 short key phrases per plain paragraph.
  text = autoMarkParagraph(text)

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

  // Restore inline math placeholders verbatim; they will be replaced with SVG images later.
  text = text.replace(/__MATH_INLINE_(\d+)__/g, (_, index) => {
    const id = mathPlaceholders[Number(index)]
    return `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`
  })

  return span(text)
}

function autoMarkParagraph(text: string): string {
  return markKeyPhrases(text, AUTO_UNDERLINE_KEYWORDS, "++", 2)
}

function assignListOrdering(blocks: RichBlock[], tokens: Token[]): void {
  let tokenIndex = 0
  for (const block of blocks) {
    if (block.type !== "list") continue

    while (tokenIndex < tokens.length && tokens[tokenIndex].type !== "list") {
      tokenIndex++
    }

    if (tokenIndex < tokens.length) {
      const listToken = tokens[tokenIndex] as Tokens.List
      block.ordered = listToken.ordered === true
      tokenIndex++
    }
  }
}

function renderBlock(block: RichBlock): string {
  switch (block.type) {
    case "paragraph": {
      const img = parseStandaloneImage(block.content)
      if (img) return lib.imageCard(img.src, img.alt)
      return lib.paragraph(renderInline(block.content))
    }
    case "blockquote":
      // Ticket theme has no standalone quote block; render as a conclusion card.
      return lib.quoteBox(renderInline(block.content))
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
      const items = block.content
        .split("\n")
        .filter(Boolean)
        .map((line) => line.replace(/^•\s*/, ""))
      return lib.list(items, block.ordered ?? false)
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

export function render(markdown: string): string {
  // Extract LaTeX math so it survives the component renderer and is rendered as SVG images.
  const { prepared, snippets } = extractMathSvg(markdown)

  const tokens = marked.lexer(prepared)
  const blocks = parseBlocks(tokens) as RichBlock[]
  assignListOrdering(blocks, tokens)

  const sections: Section[] = splitIntoSections(blocks)

  const chapterSections = sections.filter((s) => s.type === "chapter")
  const totalChapters = chapterSections.length

  let html = ""

  // Render cover + intro content. The ticket theme intentionally has no TOC.
  const introSection = sections.find((s) => s.type === "intro")
  if (introSection) {
    const coverInfo = extractCoverInfo(introSection.content)
    if (coverInfo) {
      html += lib.cover(
        coverInfo.title,
        coverInfo.subtitle,
        coverInfo.image,
        "TICKET",
        "VALID FOR ONE READ"
      )

      html += coverInfo.remaining.map((b) => renderBlock(b as RichBlock)).join("")
    } else {
      const quoteInfo = detectIntroQuote(introSection.content)
      if (quoteInfo) {
        // Render as a conclusion card instead of a generic oneliner.
        html += lib.quoteBox(renderInline(quoteInfo.quote))
        html += quoteInfo.remaining.map((b) => renderBlock(b as RichBlock)).join("")
      } else {
        html += introSection.content.map((b) => renderBlock(b as RichBlock)).join("")
      }
    }
  }

  // Render chapters.
  sections.forEach((section) => {
    if (section.type !== "chapter") return

    const chapterIndex = chapterSections.findIndex((s) => s === section)
    const title = section.title || ""

    const meta = lib.chapterMeta(chapterIndex, totalChapters, title)

    html += lib.chapterTitle(meta.number, title, meta.label, chapterIndex === 0)
    html += section.content.map((b) => renderBlock(b as RichBlock)).join("")
  })

  // Footer + end mark inside the container.
  html += lib.footerCta()
  html += `<p style="text-align:center;color:#9CA3AF;font-size:14px;margin:24px 0 0 0;">${span("/")}</p>`

  html = lib.container(html)

  // Replace math placeholders with rendered formula images.
  html = injectRenderedMathSvg(html, snippets)

  return html
}
