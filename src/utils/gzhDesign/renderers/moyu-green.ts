import { marked } from "marked"
import * as lib from "../themes/moyu-green"
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

interface ListBlock extends Block {
  ordered?: boolean
}

// 摸鱼绿默认给正文关键词加绿色下划线；这些词出现时自动标记。
const AUTO_UNDERLINE_KEYWORDS = [
  "核心",
  "关键",
  "秘诀",
  "真相",
  "必须",
  "注意",
  "重点",
  "建议",
  "推荐",
  "实战",
  "干货",
]

function renderInline(text: string): string {
  // Protect inline math placeholders so markdown formatting does not corrupt them.
  const mathPlaceholders: string[] = []
  text = text.replace(
    /<span class="math-svg-inline-placeholder" data-math="([^"]+)"><\/span>/g,
    (_, id) => {
      mathPlaceholders.push(id)
      return `__MATH_INLINE_${mathPlaceholders.length - 1}__`
    }
  )

  // Process inline code first so it is not matched by bold/highlight/underline patterns.
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

  // Restore inline math placeholders so they can be replaced with SVG images later.
  text = text.replace(/__MATH_INLINE_(\d+)__/g, (_, index) => {
    const id = mathPlaceholders[Number(index)]
    return `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`
  })

  return span(text)
}

// 自动给包含“核心/关键/实战”等词但还没有任何强调的段落加绿色下划线。
function autoMarkParagraph(text: string): string {
  return markKeyPhrases(text, AUTO_UNDERLINE_KEYWORDS, "++", 2)
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
      const listBlock = block as ListBlock
      const items = block.content
        .split("\n")
        .filter(Boolean)
        .map((line) => line.replace(/^•\s*/, ""))
      return lib.list(items, listBlock.ordered)
    }
    case "html":
      if (block.content === "<hr>") {
        // 摸鱼绿没有专属主题分割线，用轻量留白分隔。
        return `<section style="margin:24px 0;">${span("<br>")}</section>`
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

// 从副标题里尝试提取底部小标签；提取不到就返回默认标签。
function inferBottomTags(subtitle: string): string[] {
  const parts = subtitle
    .split(/[·|\\/\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 6)
    .slice(0, 2)
  if (parts.length >= 2) return parts
  return ["实战", "干货"]
}

// 杂志快讯封面：顶部标签/日期、划线旧认知、主副标题、可选右侧图、底部品牌条。
function coverBreaking(
  title: string,
  subtitle: string,
  image?: string,
  tag?: string,
  date?: string,
  titleHighlight?: string,
  titleLine2?: string
): string {
  const t = lib.DESIGN_TOKENS
  const topTag = escapeHtml(tag || "摸鱼绿 · 精选")
  const topDate = escapeHtml(
    date || new Date().toISOString().slice(0, 7).replace("-", ".")
  )
  const mainTitle = escapeHtml(title || "")
  const highlight = escapeHtml(titleHighlight || "")
  const line2 = escapeHtml(titleLine2 || "")
  const subTitle = escapeHtml(subtitle || "")

  // 仅当副标题是疑问句时把它当作“旧认知”划线句。
  const oldBelief = /[?？]$/.test(subtitle || "") ? subTitle : ""
  const bottomLeft = escapeHtml((title || "摸鱼绿").slice(0, 12))
  const [tag1, tag2] = inferBottomTags(subtitle || "").map(escapeHtml)

  const accentBar = `
    <section style="width:48px;height:3px;background:linear-gradient(to right,${t.primary},${t.lightGreen});border-radius:2px;margin-bottom:12px;">
      ${span("<br>")}
    </section>`

  const titleBlock = `
    ${
      oldBelief
        ? `<p style="font-size:15px;color:${t.divider};margin:0 0 6px;text-decoration:line-through;letter-spacing:0.5px;">${span(oldBelief)}</p>`
        : ""
    }
    <p style="font-size:24px;font-weight:900;color:${t.title};margin:0;line-height:1.05;letter-spacing:-2px;">
      ${span(mainTitle)}${highlight ? `<span style="color:${t.primary};margin-left:4px;">${span(highlight)}</span>` : ""}
    </p>
    ${
      line2
        ? `<p style="font-size:24px;font-weight:900;color:${t.primary};margin:0 0 16px;line-height:1.05;letter-spacing:-2px;">${span(line2)}</p>`
        : `<p style="margin:0 0 16px;line-height:0;">${span("<br>")}</p>`
    }
    ${accentBar}
    <p style="font-size:13px;color:${t.helper};margin:0;line-height:1.7;letter-spacing:0.5px;">
      ${span(subTitle)}
    </p>`

  const bodyContent = image
    ? `<section style="display:flex;align-items:center;gap:20px;">
        <section style="flex:1;min-width:0;">
          ${titleBlock}
        </section>
        <section style="flex-shrink:0;width:110px;height:110px;border-radius:16px;overflow:hidden;border:1px solid rgba(5,150,105,0.1);box-shadow:0 4px 12px rgba(0,0,0,0.06);">
          <img src="${escapeHtml(image)}" style="width:100%;height:auto;display:block;">
        </section>
      </section>`
    : `<section>${titleBlock}</section>`

  return `
<section style="margin:0 0 32px;background:#fff;border:1.5px solid rgba(5,150,105,0.15);border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);width:100%;">
  <section style="padding:32px 28px 28px;">
    <section style="display:flex;align-items:center;gap:8px;margin-bottom:28px;">
      <span style="width:6px;height:6px;background:${t.primary};border-radius:50%;">${span("<br>")}</span>
      <span style="font-size:11px;font-weight:700;letter-spacing:3px;color:${t.primary};">${span(topTag)}</span>
      <section style="flex:1;height:1px;overflow:hidden;background:linear-gradient(to right,rgba(5,150,105,0.12),transparent);">${span("<br>")}</section>
      <span style="font-size:10px;color:${t.divider};font-weight:600;">${span(topDate)}</span>
    </section>
    ${bodyContent}
  </section>
  <section style="background:linear-gradient(135deg,${t.primary},${t.primaryLight});padding:12px 28px;display:flex;align-items:center;justify-content:space-between;">
    <p style="font-size:12px;color:rgba(255,255,255,0.9);margin:0;font-weight:600;letter-spacing:0.5px;">${span(bottomLeft)}</p>
    <section style="display:flex;gap:4px;">
      <span style="background:rgba(255,255,255,0.2);padding:1px 6px;border-radius:3px;font-size:8px;color:#fff;font-weight:600;">${span(tag1)}</span>
      <span style="background:rgba(255,255,255,0.2);padding:1px 6px;border-radius:3px;font-size:8px;color:#fff;font-weight:600;">${span(tag2)}</span>
    </section>
  </section>
</section>`
}

export function render(markdown: string): string {
  const { prepared, snippets } = extractMathSvg(markdown)
  const tokens = marked.lexer(prepared)
  const blocks = parseBlocks(tokens) as ListBlock[]

  // The shared parseBlocks helper loses list ordering, so restore it from the
  // original marked tokens before rendering.
  let listTokenIndex = 0
  for (const block of blocks) {
    if (block.type !== "list") continue

    while (listTokenIndex < tokens.length && tokens[listTokenIndex].type !== "list") {
      listTokenIndex++
    }

    if (listTokenIndex < tokens.length) {
      const listToken = tokens[listTokenIndex] as { ordered?: boolean }
      block.ordered = listToken.ordered === true
      listTokenIndex++
    }
  }

  const sections = splitIntoSections(blocks)
  let html = ""

  // Cover + TOC + intro content
  const introSection = sections.find((s) => s.type === "intro")
  if (introSection) {
    const coverInfo = extractCoverInfo(introSection.content)

    if (coverInfo) {
      html += coverBreaking(
        coverInfo.title,
        coverInfo.subtitle,
        coverInfo.image,
        undefined,
        undefined,
        coverInfo.titleHighlight,
        coverInfo.titleLine2
      )

      const chapters = buildChapters(sections)
      if (chapters.length >= 2) {
        html += lib.toc(chapters)
      }

      // 前言正文统一放进 0 20px 的内容区，与封面/目录形成结构层级。
      html += `<section style="padding:0 20px;">`
      const quoteInfo = detectIntroQuote(coverInfo.remaining)
      if (quoteInfo) {
        html += lib.onelinerCard(quoteInfo.quote)
        html += quoteInfo.remaining.map(renderBlock).join("")
      } else {
        html += coverInfo.remaining.map(renderBlock).join("")
      }
      html += `</section>`
    } else {
      html += `<section style="padding:0 20px;">`
      const quoteInfo = detectIntroQuote(introSection.content)
      if (quoteInfo) {
        html += lib.onelinerCard(quoteInfo.quote)
        html += quoteInfo.remaining.map(renderBlock).join("")
      } else {
        html += introSection.content.map(renderBlock).join("")
      }
      html += `</section>`
    }
  }

  // Chapters
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
    html += `<section style="padding:0 20px;">`
    html += section.content.map(renderBlock).join("")
    html += `</section>`

    chapterIndex++
  }

  // Footer
  html += `<section style="padding:0 20px;">`
  html += lib.footerCta()
  html += `</section>`

  html = lib.container(html)
  html = injectRenderedMathSvg(html, snippets)

  return html
}
