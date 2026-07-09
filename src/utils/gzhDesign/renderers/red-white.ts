import { marked, type Token, type Tokens } from "marked"
import * as lib from "../themes/red-white"
import {
  splitIntoSections,
  detectIntroQuote,
  extractCoverInfo,
  escapeHtml,
  span,
  markKeyPhrases,
  parseStandaloneImage,
  type Section,
  type Block as SharedBlock,
} from "../shared"
import { extractMathSvg, injectRenderedMathSvg } from "../../mathSvgRenderer"

type Block = SharedBlock & { ordered?: boolean }

const t = lib.DESIGN_TOKENS

const AUTO_UNDERLINE_KEYWORDS = [
  "核心",
  "关键",
  "真相",
  "必须",
  "重点",
  "建议",
  "推荐",
  "实战",
  "干货",
  "方法",
  "技巧",
  "误区",
  "结论",
]

function renderInline(text: string): string {
  // Protect inline math placeholders so markdown rules do not corrupt them.
  // Block placeholders are kept as raw HTML and replaced by injectRenderedMathSvg later.
  const mathPlaceholders: string[] = []
  text = text.replace(
    /<span class="math-svg-inline-placeholder" data-math="([^"]+)"><\/span>/g,
    (_, id) => {
      mathPlaceholders.push(id)
      return `__MATH_INLINE_${mathPlaceholders.length - 1}__`
    }
  )

  // Process inline code first so it is not matched by bold/highlight rules.
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

  // Restore inline code placeholders.
  text = text.replace(
    /__CODE_PLACEHOLDER_(\d+)__/g,
    (_, index) => codeSegments[Number(index)]
  )

  // Restore inline math placeholders verbatim; SVG injection happens after layout.
  text = text.replace(/__MATH_INLINE_(\d+)__/g, (_, index) => {
    const id = mathPlaceholders[Number(index)]
    return `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`
  })

  return span(text)
}

function parseBlocks(tokens: Token[]): Block[] {
  const blocks: Block[] = []

  for (const token of tokens) {
    switch (token.type) {
      case "paragraph":
        blocks.push({ type: "paragraph", content: token.text })
        break
      case "blockquote":
        blocks.push({ type: "blockquote", content: token.text })
        break
      case "code":
        blocks.push({
          type: "code",
          content: token.text,
          language: token.lang || "",
        })
        break
      case "image":
        blocks.push({
          type: "image",
          content: "",
          src: token.href,
          alt: token.text,
        })
        break
      case "heading":
        blocks.push({
          type: "heading",
          content: token.text,
          level: token.depth,
        })
        break
      case "list": {
        const listToken = token as Tokens.List
        blocks.push({
          type: "list",
          content: listToken.items.map((item) => item.text).join("\n"),
          ordered: listToken.ordered,
        })
        break
      }
      case "hr":
        blocks.push({ type: "html", content: "<hr>" })
        break
      case "space":
        break
      default:
        if ("text" in token && typeof token.text === "string") {
          blocks.push({ type: "paragraph", content: token.text })
        }
    }
  }

  return blocks
}

// 淡粉下划线是红白色系的标志性强调：只在命中关键词时自动加，避免随机下划线。
function autoMarkParagraph(text: string): string {
  return markKeyPhrases(text, AUTO_UNDERLINE_KEYWORDS, "++", 2)
}

// 组件 2：开头引言卡片（白底 + 红色光晕 + 引号装饰，更克制）
function renderIntroQuote(raw: string): string {
  return `
<section style="margin:10px 10px 32px;background:${t.white};border-radius:12px;box-shadow:0 4px 24px -4px rgba(220,38,38,0.12);padding:24px 24px 22px;overflow:hidden;">
  <section style="display:flex;align-items:flex-start;gap:10px;">
    <span style="font-size:28px;color:${t.primaryLight};font-weight:900;line-height:1;flex-shrink:0;">${span("“")}</span>
    <p style="font-size:16px;font-weight:700;color:${t.title};margin:0;line-height:1.75;">${renderInline(raw)}</p>
  </section>
</section>`
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case "paragraph": {
      const img = parseStandaloneImage(block.content)
      if (img) return lib.imageCard(img.src, img.alt)
      return lib.paragraph(renderInline(autoMarkParagraph(block.content)))
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
      const items = block.content.split("\n").filter(Boolean)
      return lib.list(items, block.ordered)
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
    if (lib.chapterMeta) {
      const meta = lib.chapterMeta(index, chapters.length, section.title)
      return { number: meta.number, title: section.title }
    }
    const number = String(index + 1).padStart(2, "0")
    return { number, title: section.title }
  })
}

export function render(markdown: string): string {
  const { prepared, snippets } = extractMathSvg(markdown)
  const tokens = marked.lexer(prepared)
  const blocks = parseBlocks(tokens)
  const sections = splitIntoSections(blocks)

  let html = ""
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

      const tocChapters = buildTocChapters(sections)
      if (tocChapters.length >= 2) {
        // 红白色系导读区展示精选看点，最多三列。
        html += lib.toc(tocChapters.slice(0, 3))
      }

      const quoteInfo = detectIntroQuote(coverInfo.remaining)
      if (quoteInfo) {
        html += renderIntroQuote(quoteInfo.quote)
        html += quoteInfo.remaining.map((b) => renderBlock(b as Block)).join("")
      } else {
        html += coverInfo.remaining.map((b) => renderBlock(b as Block)).join("")
      }
    } else {
      const quoteInfo = detectIntroQuote(introSection.content)
      if (quoteInfo) {
        html += renderIntroQuote(quoteInfo.quote)
        html += quoteInfo.remaining
          .map((b) => renderBlock(b as Block))
          .join("")
      } else {
        html += introSection.content
          .map((b) => renderBlock(b as Block))
          .join("")
      }
    }
  }

  const chapterSections = sections.filter((s) => s.type === "chapter")
  const totalChapters = chapterSections.length
  let chapterIndex = 0

  for (const section of sections) {
    if (section.type !== "chapter") continue

    let number: string
    let label: string

    if (lib.chapterMeta) {
      const meta = lib.chapterMeta(
        chapterIndex,
        totalChapters,
        section.title || ""
      )
      number = meta.number
      label = meta.label
    } else {
      number = String(chapterIndex + 1).padStart(2, "0")
      label = "PART"
    }

    html += lib.chapterTitle(number, section.title || "", label, chapterIndex === 0)
    html += `<section style="padding:0 10px;">`
    html += section.content.map((b) => renderBlock(b as Block)).join("")
    html += `</section>`

    chapterIndex++
  }

  html += `<section style="padding:0 10px;">`
  html += lib.footerCta()
  html += `</section>`

  html = lib.container(html)
  html = injectRenderedMathSvg(html, snippets)

  return html
}
