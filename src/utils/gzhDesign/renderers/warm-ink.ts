import { marked, type Tokens } from "marked"
import * as lib from "../themes/warm-ink"
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
  "方法",
  "结论",
  "实战",
  "干货",
]

function renderInline(text: string): string {
  const mathPlaceholders: string[] = []
  text = text.replace(
    /<span class="math-svg-inline-placeholder" data-math="([^"]+)"><\/span>/g,
    (_, id) => {
      mathPlaceholders.push(id)
      return `__MATH_INLINE_${mathPlaceholders.length - 1}__`
    }
  )

  const codeSegments: string[] = []
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    codeSegments.push(lib.inlineCode(escapeHtml(code)))
    return `__CODE_PLACEHOLDER_${codeSegments.length - 1}__`
  })

  text = text.replace(/==([^=]+)==/g, (_, content) => lib.highlight(content))
  text = text.replace(/<u>([^<]+)<\/u>/g, (_, content) => lib.underline(content))
  text = text.replace(/\+\+([^+]+)\+\+/g, (_, content) => lib.underline(content))
  text = text.replace(/\*\*([^*]+)\*\*/g, (_, content) => lib.strong(content))

  text = text.replace(
    /__CODE_PLACEHOLDER_(\d+)__/g,
    (_, index) => codeSegments[Number(index)]
  )
  text = text.replace(/__MATH_INLINE_(\d+)__/g, (_, index) => {
    const id = mathPlaceholders[Number(index)]
    return `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`
  })

  text = text.replace(
    /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
    (_, content) => `<em style="font-style:italic;">${span(content)}</em>`
  )
  text = text.replace(
    /(?<!_)_([^_\n]+)_(?!_)/g,
    (_, content) => `<em style="font-style:italic;">${span(content)}</em>`
  )

  return span(text)
}

function autoMarkParagraph(text: string): string {
  return markKeyPhrases(text, AUTO_UNDERLINE_KEYWORDS, "++", 2)
}

/** 引用/金句只保留斜体（*斜体* 或 _斜体_），不渲染 **、==、`++` 等行内样式，避免破坏克制感。 */
function renderQuoteInline(text: string): string {
  const escaped = escapeHtml(text)

  // 按 emphasis 标记拆分，仅处理单星号/单下划线，**bold** / __bold__ 会原样保留
  const parts = escaped.split(/(\*[^*\n]+\*|_[^_\n]+_)/g)

  return parts
    .map((part) => {
      if (!part) return part
      const starMatch = part.match(/^\*([^*\n]+)\*$/)
      const underMatch = part.match(/^_([^_\n]+)_$/)
      const content = starMatch?.[1] ?? underMatch?.[1]
      if (content !== undefined) {
        return `<em style="font-style:italic;">${span(content)}</em>`
      }
      return span(part)
    })
    .join("")
}

/** 把引用/金句里的段落拆成视觉段落，段内换行用 <br>。 */
function renderQuoteText(text: string): string {
  return text
    .split(/\n\n+/)
    .map((part) => renderQuoteInline(part).replace(/[\r\n]+/g, "<br>"))
    .join("<br><br>")
}

function renderBlock(block: LocalBlock): string {
  switch (block.type) {
    case "paragraph": {
      const img = parseStandaloneImage(block.content)
      if (img) return lib.imageCard(img.src, img.alt)
      return lib.paragraph(renderInline(autoMarkParagraph(block.content)))
    }
    case "blockquote":
      return lib.quoteBox(renderQuoteText(block.content))
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
        .map((line) => renderInline(line.replace(/^•\s*/, "")))
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

function buildChapters(
  sections: Section[]
): Array<{ number: string; title: string }> {
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
  const { prepared, snippets } = extractMathSvg(markdown)
  const tokens = marked.lexer(prepared)
  const blocks = parseBlocks(tokens) as LocalBlock[]

  // Restore list ordering from marked tokens.
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

  blocks.forEach((block, index) => {
    if (block.type === "list") {
      block.ordered = orderedFlags[index]
    }
  })

  const sections = splitIntoSections(blocks as Block[])
  let html = ""
  let coverTitle = ""

  const introSection = sections.find((s) => s.type === "intro")
  if (introSection) {
    const coverInfo = extractCoverInfo(introSection.content)
    if (coverInfo) {
      coverTitle = coverInfo.title
      html += lib.cover(
        coverInfo.title,
        renderInline(coverInfo.subtitle),
        coverInfo.image,
        undefined,
        undefined,
        coverInfo.titleHighlight,
        coverInfo.titleLine2,
        false
      )

      const chapters = buildChapters(sections)
      if (chapters.length >= 2) {
        html += lib.toc(chapters)
      }

      html += `<section style="padding:0 20px;box-sizing:border-box;">`
      const quoteInfo = detectIntroQuote(coverInfo.remaining)
      if (quoteInfo) {
        html += lib.onelinerCard(renderQuoteText(quoteInfo.quote))
        html += quoteInfo.remaining.map(renderBlock).join("")
      } else {
        html += coverInfo.remaining.map(renderBlock).join("")
      }
      html += `</section>`
    } else {
      html += `<section style="padding:0 20px;box-sizing:border-box;">`
      const quoteInfo = detectIntroQuote(introSection.content)
      if (quoteInfo) {
        html += lib.onelinerCard(renderQuoteText(quoteInfo.quote))
        html += quoteInfo.remaining.map(renderBlock).join("")
      } else {
        html += introSection.content.map(renderBlock).join("")
      }
      html += `</section>`
    }
  }

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
    html += `<section style="padding:0 20px;box-sizing:border-box;">`
    html += section.content.map(renderBlock).join("")
    html += `</section>`

    chapterIndex++
  }

  html += lib.mascotWatermark()

  html = lib.heroMascot(coverTitle) + html

  html = lib.container(html)
  html = injectRenderedMathSvg(html, snippets)

  return html
}
