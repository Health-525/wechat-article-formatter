// Isolated renderer for the gzh-design "graphite-minimal" theme.
// Hard-wired to ../themes/graphite-minimal; no references to any other theme.

import { marked, type Tokens } from "marked"
import * as lib from "../themes/graphite-minimal"
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

// The shared parser loses list ordering, so we augment list blocks locally.
type LocalBlock = Block & { ordered?: boolean }
type LocalSection = Omit<Section, "content"> & { content: LocalBlock[] }

const AUTO_UNDERLINE_KEYWORDS = [
  "核心",
  "关键",
  "本质",
  "原则",
  "建议",
  "方法",
  "结论",
  "注意",
  "误区",
]

// Inline design tokens so the renderer can build recipe-specific layout
// pieces that are not exported by the theme component library.
const T = {
  primary: "#52525B",
  title: "#27272A",
  muted: "#A1A1AA",
  line: "#E4E4E7",
  secondary: "#71717A",
  bg: "#FFFFFF",
}

function renderInline(text: string): string {
  // Protect inline math placeholders so inline markdown rules do not corrupt them.
  const mathPlaceholders: string[] = []
  text = text.replace(
    /<span class="math-svg-inline-placeholder" data-math="([^"]+)"><\/span>/g,
    (_, id) => {
      mathPlaceholders.push(id)
      return `__MATH_INLINE_${mathPlaceholders.length - 1}__`
    }
  )

  // Process inline code first so backtick content is not caught by other rules.
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

  // Graphite Minimal signature: discreet graphite underline on 1-2 key phrases.
  text = autoMarkParagraph(text)

  // Restore inline code.
  text = text.replace(
    /__CODE_PLACEHOLDER_(\d+)__/g,
    (_, index) => codeSegments[Number(index)]
  )

  // Restore inline math placeholders verbatim; they become SVG images later.
  text = text.replace(/__MATH_INLINE_(\d+)__/g, (_, index) => {
    const id = mathPlaceholders[Number(index)]
    return `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`
  })

  return span(text)
}

function autoMarkParagraph(text: string): string {
  return markKeyPhrases(text, AUTO_UNDERLINE_KEYWORDS, "++", 2)
}

function parseQuoteAuthor(text: string): { quote: string; author: string } {
  const trimmed = text.trim()
  const match = trimmed.match(/^(.*)[\n\r\s]*(?:——|--|—)[\s]*(.+?)\s*$/s)
  if (match) {
    return { quote: match[1].trim(), author: match[2].trim() }
  }
  return { quote: trimmed, author: "" }
}

function renderIntroQuote(text: string): string {
  const { quote, author } = parseQuoteAuthor(text)

  const authorLine = author
    ? `<p style="text-align:right;font-size:12px;color:${T.muted};margin:16px 0 0;letter-spacing:1px;">
        ${span(`—— ${author}`)}
      </p>`
    : ""

  return `
<section style="margin:10px 10px 40px;padding:32px 24px 24px;border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};background:${T.bg};">
  <p style="font-size:11px;color:${T.muted};letter-spacing:2px;margin:0 0 18px;font-weight:400;">
    ${span("QUOTE")}
  </p>
  <p style="font-size:18px;font-weight:700;color:${T.title};margin:0 0 8px;line-height:1.7;letter-spacing:0.5px;">
    ${renderInline(quote)}
  </p>
  ${authorLine}
</section>`
}

function thematicDivider(): string {
  return `
<section style="padding:0 10px;">
  <section style="height:1px;background:${T.line};margin:0 0 36px;">
    <span leaf=""><br></span>
  </section>
</section>`
}

function renderBlock(block: LocalBlock): string {
  switch (block.type) {
    case "paragraph": {
      const img = parseStandaloneImage(block.content)
      if (img) return lib.imageCard(img.src, img.alt)
      return lib.paragraph(renderInline(block.content))
    }
    case "blockquote":
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
        .map(renderInline)
      return lib.list(items, block.ordered ?? false)
    }
    case "html":
      if (block.content === "<hr>") {
        return thematicDivider()
      }
      // Preserve block math placeholders and any other raw HTML as-is.
      return block.content
    default:
      return ""
  }
}

function buildTocTitles(sections: LocalSection[]): string[] {
  return sections
    .filter(
      (s): s is LocalSection & { type: "chapter"; title: string } =>
        s.type === "chapter" && !!s.title
    )
    .map((section) => section.title)
}

function renderToc(titles: string[]): string {
  const preview = titles.slice(0, 3)
  if (preview.length < 2) return ""

  const items = preview
    .map((title, index) => {
      const isLast = index === preview.length - 1
      return `
    <section style="flex:1;background:#FAFAFA;border-top:1px solid ${T.line};padding:18px 12px 16px;margin-right:${isLast ? "0" : "8px"};">
      <p style="font-size:11px;color:${T.muted};font-weight:500;margin:0 0 8px;letter-spacing:1px;">
        ${span(String(index + 1).padStart(2, "0"))}
      </p>
      <p style="font-size:13px;font-weight:700;color:${T.title};margin:0;line-height:1.5;">
        ${span(title)}
      </p>
    </section>`
    })
    .join("")

  return `
<section style="padding:0 10px 40px;">
  <p style="font-size:11px;color:${T.muted};margin:0 0 16px;letter-spacing:2px;">
    ${span("CONTENTS")}
  </p>
  <section style="display:flex;justify-content:space-between;">
    ${items}
  </section>
</section>`
}

export function render(markdown: string): string {
  const { prepared, snippets } = extractMathSvg(markdown)

  const tokens = marked.lexer(prepared)
  const blocks = parseBlocks(tokens)

  // Re-attach list ordering information from the original marked tokens.
  const orderedFlags: boolean[] = []
  let tokenIndex = 0
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    while (tokenIndex < tokens.length && tokens[tokenIndex].type === "space") {
      tokenIndex++
    }
    const token = tokens[tokenIndex]
    if (token?.type === "list") {
      orderedFlags[blockIndex] = (token as Tokens.List).ordered
    }
    tokenIndex++
  }

  const localBlocks: LocalBlock[] = blocks.map((block, index) =>
    block.type === "list" ? { ...block, ordered: orderedFlags[index] } : block
  )

  const sections = splitIntoSections(localBlocks) as LocalSection[]

  let html = ""

  // Render cover, TOC, and intro content from the intro section.
  const introSection = sections.find((s) => s.type === "intro")
  if (introSection) {
    const coverInfo = extractCoverInfo(introSection.content)
    if (coverInfo) {
      html += lib.cover(
        coverInfo.title,
        coverInfo.subtitle,
        coverInfo.image,
        undefined,
        undefined,
        coverInfo.titleHighlight,
        coverInfo.titleLine2
      )

      const tocTitles = buildTocTitles(sections)
      if (tocTitles.length >= 2) {
        html += renderToc(tocTitles)
      }

      const quoteInfo = detectIntroQuote(coverInfo.remaining)
      if (quoteInfo) {
        html += renderIntroQuote(quoteInfo.quote)
        html += quoteInfo.remaining.map(renderBlock).join("")
      } else {
        html += coverInfo.remaining.map(renderBlock).join("")
      }
    } else {
      const quoteInfo = detectIntroQuote(introSection.content)
      if (quoteInfo) {
        html += renderIntroQuote(quoteInfo.quote)
        html += quoteInfo.remaining.map(renderBlock).join("")
      } else {
        html += introSection.content.map(renderBlock).join("")
      }
    }
  }

  // Render chapters.
  const chapterSections = sections.filter((s) => s.type === "chapter")
  const totalChapters = chapterSections.length
  let chapterIndex = 0

  for (const section of sections) {
    if (section.type !== "chapter") continue

    const meta = lib.chapterMeta(
      chapterIndex,
      totalChapters,
      section.title || ""
    )

    html += lib.chapterTitle(
      meta.number,
      section.title || "",
      meta.label,
      chapterIndex === 0
    )
    html += `<section style="padding:0 10px;">`
    html += section.content.map(renderBlock).join("")
    html += `</section>`

    chapterIndex++
  }

  // Footer: END divider (component 15) + signature (component 16).
  html += lib.divider()
  html += lib.footerCta()

  html = lib.container(html)
  html = injectRenderedMathSvg(html, snippets)

  return html
}
