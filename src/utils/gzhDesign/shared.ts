import type { Token, Tokens } from "marked"

export interface Section {
  type: "intro" | "chapter" | "outro"
  title?: string
  content: Block[]
}

export interface Block {
  type: "paragraph" | "blockquote" | "code" | "image" | "heading" | "list" | "html"
  content: string
  language?: string
  alt?: string
  src?: string
  level?: number
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function span(text: string): string {
  return `<span leaf="">${text}</span>`
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * 在纯文本段落中，把前 `max` 个命中 `keywords` 的关键词用 `wrapper` 包起来。
 * 如果段落里已经有行内代码、加粗、高亮、下划线等标记，就不自动处理，避免样式打架。
 */
export function markKeyPhrases(
  text: string,
  keywords: string[],
  wrapper: string,
  max = 2
): string {
  if (!keywords.length || /[`*+=<~]/.test(text)) return text

  let count = 0
  const result = text.replace(
    new RegExp(
      `(?<![\\u4e00-\\u9fa5A-Za-z0-9_])(${keywords.map(escapeRegExp).join("|")})(?![\\u4e00-\\u9fa5A-Za-z0-9_])`,
      "g"
    ),
    (match) => {
      if (count >= max) return match
      count++
      return `${wrapper}${match}${wrapper}`
    }
  )
  return result
}

export function parseBlocks(tokens: Token[]): Block[] {
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
        blocks.push({ type: "code", content: token.text, language: token.lang || "" })
        break
      case "image":
        blocks.push({ type: "image", content: "", src: token.href, alt: token.text })
        break
      case "heading":
        blocks.push({ type: "heading", content: token.text, level: token.depth })
        break
      case "list": {
        const listToken = token as Tokens.List
        blocks.push({
          type: "list",
          content: listToken.items.map((item) => `• ${item.text}`).join("\n"),
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

export function splitIntoSections(blocks: Block[]): Section[] {
  const sections: Section[] = []
  let current: Section = { type: "intro", content: [] }

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 2) {
      if (current.content.length > 0) {
        sections.push(current)
      }
      current = {
        type: "chapter",
        title: block.content,
        content: [],
      }
    } else {
      current.content.push(block)
    }
  }

  if (current.content.length > 0) {
    sections.push(current)
  }

  return sections
}

export function isConclusionTitle(title: string): boolean {
  return /(总结|结语|写在最后|后记|番外|尾声|结语与展望|总结与展望)/.test(title)
}

export function parseStandaloneImage(
  content: string
): { src: string; alt: string } | null {
  const match = content.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
  if (match) {
    return { alt: match[1], src: match[2] }
  }
  return null
}

export function detectIntroQuote(blocks: Block[]): { quote: string; remaining: Block[] } | null {
  if (blocks.length > 0 && blocks[0].type === "blockquote") {
    return { quote: blocks[0].content, remaining: blocks.slice(1) }
  }
  return null
}

export function splitCoverTitle(title: string): { line1: string; highlight: string; line2: string } {
  const markerMatch = title.match(/^(.*?)(?:：|——|--)(.+)$/)
  if (markerMatch) {
    return { line1: markerMatch[1].trim(), highlight: markerMatch[2].trim(), line2: "" }
  }

  if (title.length > 6) {
    const highlightLength = Math.min(4, Math.max(2, Math.floor(title.length * 0.3)))
    const splitIndex = title.length - highlightLength
    return { line1: title.slice(0, splitIndex).trim(), highlight: title.slice(splitIndex).trim(), line2: "" }
  }

  return { line1: title, highlight: "", line2: "" }
}

export function extractCoverInfo(blocks: Block[]): {
  title: string
  titleHighlight: string
  titleLine2: string
  subtitle: string
  image?: string
  remaining: Block[]
} | null {
  const h1Index = blocks.findIndex((b) => b.type === "heading" && b.level === 1)
  if (h1Index === -1) return null

  const rawTitle = blocks[h1Index].content
  const { line1, highlight, line2 } = splitCoverTitle(rawTitle)
  const remaining: Block[] = []
  let subtitle = ""
  let image: string | undefined

  for (let i = 0; i < blocks.length; i++) {
    if (i === h1Index) continue

    const block = blocks[i]

    if (!image && i > h1Index && block.type === "paragraph") {
      const standaloneImage = block.content.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (standaloneImage) {
        image = standaloneImage[2]
        continue
      }
    }

    if (!subtitle && i > h1Index && block.type === "paragraph") {
      subtitle = block.content
      continue
    }

    if (!image && block.type === "image") {
      image = block.src
      continue
    }

    remaining.push(block)
  }

  return { title: line1, titleHighlight: highlight, titleLine2: line2, subtitle, image, remaining }
}

export interface ThemeComponents {
  container: (children: string) => string
  cover: (title: string, subtitle: string, image?: string, tag?: string, date?: string, titleHighlight?: string, titleLine2?: string) => string
  toc: (chapters: Array<{ number: string; title: string }>) => string
  chapterMeta?: (index: number, total: number, title: string) => { number: string; label: string }
  chapterTitle: (number: string, title: string, label: string, isFirst: boolean) => string
  subheading: (title: string) => string
  paragraph: (children: string) => string
  strong: (text: string) => string
  inlineCode: (text: string) => string
  underline: (text: string) => string
  highlight: (text: string) => string
  quoteBox: (children: string) => string
  codeBlock: (language: string, code: string) => string
  imageCard: (src: string, alt: string) => string
  list: (items: string[], ordered?: boolean) => string
  divider: () => string
  footerCta: () => string
  onelinerCard: (text: string) => string
}
