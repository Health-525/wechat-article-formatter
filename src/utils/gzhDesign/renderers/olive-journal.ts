// Olive Journal theme renderer — isolated, self-contained.
// Imports only the olive-journal theme components and shared gzh-design utilities.

import { marked, type Tokens } from "marked"
import * as lib from "../themes/olive-journal"
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

type LocalBlock = Block & { ordered?: boolean }

const AUTO_UNDERLINE_KEYWORDS = [
  "核心",
  "关键",
  "重点",
  "建议",
  "结论",
  "方法",
  "步骤",
  "案例",
  "数据",
]

function renderInline(text: string): string {
  // Protect inline math placeholders so markdown inline rules do not corrupt them.
  const mathPlaceholders: string[] = []
  text = text.replace(
    /<span class="math-svg-inline-placeholder" data-math="([^"]+)"><\/span>/g,
    (_, id: string) => {
      mathPlaceholders.push(id)
      return `__MATH_INLINE_${mathPlaceholders.length - 1}__`
    }
  )

  // Process inline code first so its contents are not touched by other rules.
  const codeSegments: string[] = []
  text = text.replace(/`([^`]+)`/g, (_, code: string) => {
    codeSegments.push(lib.inlineCode(escapeHtml(code)))
    return `__CODE_PLACEHOLDER_${codeSegments.length - 1}__`
  })

  // ==highlight==
  text = text.replace(/==([^=]+)==/g, (_, content: string) => lib.highlight(content))

  // <u>underline</u> or ++underline++
  text = text.replace(/<u>([^<]+)<\/u>/g, (_, content: string) => lib.underline(content))
  text = text.replace(/\+\+([^+]+)\+\+/g, (_, content: string) => lib.underline(content))

  // **bold**
  text = text.replace(/\*\*([^*]+)\*\*/g, (_, content: string) => lib.strong(content))

  // Restore inline code placeholders.
  text = text.replace(
    /__CODE_PLACEHOLDER_(\d+)__/g,
    (_, index: string) => codeSegments[Number(index)]
  )

  // Restore inline math placeholders verbatim; they will become SVG images later.
  text = text.replace(/__MATH_INLINE_(\d+)__/g, (_, index: string) => {
    const id = mathPlaceholders[Number(index)]
    return `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`
  })

  return span(text)
}

function autoMarkParagraph(text: string): string {
  return markKeyPhrases(text, AUTO_UNDERLINE_KEYWORDS, "++", 2)
}

function renderList(block: LocalBlock): string {
  const items = block.content
    .split("\n")
    .filter(Boolean)
    .map((line) => line.replace(/^•\s*/, ""))
  return lib.list(items, block.ordered ?? false)
}

function renderSubheading(title: string): string {
  // Recipe: choose between step-heading-inline, kicker-title, or highlight-title
  // depending on the shape of the H3 text.
  const stepMatch = title.match(/^(?:[Ss]tep\s*)?(\d+)[.、\s]*(.+)$/)
  if (stepMatch) {
    const step = `STEP ${String(stepMatch[1]).padStart(2, "0")}`
    return lib.stepHeading(stepMatch[2].trim(), step)
  }

  const numberedStepMatch = title.match(/^(第[一二三四五六七八九十\d]+步)[：:\s]*(.+)$/)
  if (numberedStepMatch) {
    return lib.stepHeading(numberedStepMatch[2].trim(), numberedStepMatch[1].trim())
  }

  if (/[:：|·]/.test(title)) {
    const parts = title.split(/[:：|·]/)
    if (parts.length >= 2) {
      const kicker = parts[0].trim()
      const rest = parts.slice(1).join("·").trim()
      return lib.kickerTitle(kicker, rest)
    }
  }

  return lib.highlightTitle(title)
}

function renderBlock(block: LocalBlock): string {
  switch (block.type) {
    case "paragraph": {
      const img = parseStandaloneImage(block.content)
      if (img) return lib.imageCard(img.src, img.alt)
      const text = autoMarkParagraph(block.content)
      return lib.paragraph(renderInline(text))
    }
    case "blockquote":
      return lib.quoteBox(renderInline(block.content))
    case "code":
      return lib.codeBlock(block.language || "", block.content)
    case "image":
      return lib.imageCard(block.src || "", block.alt || "")
    case "heading":
      if (block.level === 3) {
        return renderSubheading(block.content)
      }
      return ""
    case "list":
      return renderList(block)
    case "html":
      if (block.content === "<hr>") {
        return lib.divider()
      }
      return block.content
    default:
      return ""
  }
}

function buildChapterEntries(sections: Section[]): Array<{ number: string; title: string }> {
  const chapters = sections.filter(
    (s): s is Section & { type: "chapter"; title: string } =>
      s.type === "chapter" && !!s.title
  )

  return chapters.map((section, index) => {
    const meta = lib.chapterMeta(index, chapters.length, section.title)
    return { number: meta.number, title: section.title }
  })
}

export function render(markdown: string): string {
  // Extract LaTeX math and replace with placeholders that survive the markdown lexer.
  const { prepared, snippets } = extractMathSvg(markdown)

  const tokens = marked.lexer(prepared)
  const blocks = parseBlocks(tokens) as LocalBlock[]

  // Marked's list token carries ordering info; the shared Block type does not, so
  // we augment list blocks by aligning non-space tokens with their parsed blocks.
  let blockIndex = 0
  for (const token of tokens) {
    if (token.type === "space") continue
    if (token.type === "list") {
      blocks[blockIndex].ordered = (token as Tokens.List).ordered
    }
    blockIndex++
  }

  const sections = splitIntoSections(blocks as Block[])

  let html = ""

  // Intro: cover, table of contents, optional editor's note, and remaining blocks.
  const intro = sections.find((s) => s.type === "intro")
  if (intro) {
    const coverInfo = extractCoverInfo(intro.content)
    if (coverInfo) {
      html += lib.cover(
        coverInfo.title,
        coverInfo.subtitle,
        coverInfo.image,
        "内刊",
        "",
        coverInfo.titleHighlight,
        "",
        "",
        "本期编辑手记 · 要点一览",
        "SELECT",
        "READ"
      )

      const chapters = buildChapterEntries(sections)
      if (chapters.length >= 2) {
        html += lib.toc(chapters)
      }

      const quoteInfo = detectIntroQuote(coverInfo.remaining)
      if (quoteInfo) {
        html += lib.quoteBox(renderInline(quoteInfo.quote))
        html += quoteInfo.remaining
          .map((b) => renderBlock(b as LocalBlock))
          .join("")
      } else {
        html += coverInfo.remaining
          .map((b) => renderBlock(b as LocalBlock))
          .join("")
      }
    } else {
      const quoteInfo = detectIntroQuote(intro.content)
      if (quoteInfo) {
        html += lib.quoteBox(renderInline(quoteInfo.quote))
        html += quoteInfo.remaining
          .map((b) => renderBlock(b as LocalBlock))
          .join("")
      } else {
        html += intro.content
          .map((b) => renderBlock(b as LocalBlock))
          .join("")
      }
    }
  }

  // Chapters: each H2 becomes a part using the theme's own chapter meta.
  const chapterSections = sections.filter((s) => s.type === "chapter")
  const totalChapters = chapterSections.length
  let chapterIndex = 0

  for (const section of sections) {
    if (section.type !== "chapter") continue

    const meta = lib.chapterMeta(chapterIndex, totalChapters, section.title || "")
    html += lib.chapterTitle(
      meta.number,
      section.title || "",
      meta.label,
      false
    )
    html += section.content
      .map((b) => renderBlock(b as LocalBlock))
      .join("")

    chapterIndex++
  }

  // Footer call-to-action.
  html += lib.footerCta()

  // Wrap in the olive-journal container and inject rendered formula SVGs.
  html = lib.container(html)
  html = injectRenderedMathSvg(html, snippets)

  return html
}
