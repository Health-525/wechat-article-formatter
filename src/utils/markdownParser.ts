import { marked } from "marked"
import { themes, type Theme } from "./themes"

// Configure marked for GFM
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * Convert local/relative image paths to full URLs for preview.
 * Leaves absolute URLs (http/https/data) untouched.
 */
function resolveImagePaths(html: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return html.replace(
    /src="(\/|\.\/)/g,
    (_, slash: string) => `src="${slash === "/" ? origin + "/" : ""}`
  )
}

/**
 * Render markdown to themed HTML for WeChat articles.
 *
 * CRITICAL: WeChat editor filters <div> tags completely!
 * We use <section> as the container instead.
 * All styles must be inline (style="...") — <style> tags are stripped.
 */
export function renderMarkdownToHtml(markdown: string, themeId: string = "minimal-white"): string {
  const theme = themes.find((t) => t.id === themeId) || themes[0]
  const s = theme.styles

  // Parse markdown to HTML
  let html = marked.parse(markdown) as string

  // Resolve local image paths for preview
  html = resolveImagePaths(html)

  // Apply inline styles to all elements (DOM-based, merges safely with existing styles)
  html = applyInlineStyles(html, theme)

  // Wrap in <section> container (NOT <div> — WeChat filters div!)
  html = `<section style="${s.container}">${html}</section>`

  return html
}

/**
 * Map of tag names to theme style keys.
 */
const STYLE_MAP: Record<string, keyof Theme["styles"]> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "paragraph",
  blockquote: "blockquote",
  code: "code",
  pre: "pre",
  ul: "ul",
  ol: "ol",
  li: "li",
  strong: "strong",
  em: "em",
  a: "a",
  img: "img",
  table: "table",
  th: "th",
  td: "td",
  hr: "hr",
}

/**
 * Apply theme styles inline to all HTML elements using the DOM.
 * WeChat requires ALL styles to be inline — no <style> tags allowed.
 * Unsupported CSS in WeChat: position, transform, animation, clip-path
 */
function applyInlineStyles(html: string, theme: Theme): string {
  if (typeof document === "undefined") {
    // Fallback for SSR/non-browser environments
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  for (const [tag, styleKey] of Object.entries(STYLE_MAP)) {
    const styleValue = theme.styles[styleKey]
    if (!styleValue) continue

    const elements = doc.body.querySelectorAll(tag)
    elements.forEach((el) => {
      const existing = el.getAttribute("style") || ""
      // Merge styles: theme first, then existing (existing can override)
      el.setAttribute("style", `${styleValue}${existing ? ";" + existing : ""}`)
    })
  }

  // Special handling for <pre><code>: apply codeBlock style to the inner <code>
  doc.body.querySelectorAll("pre > code").forEach((code) => {
    const existing = code.getAttribute("style") || ""
    code.setAttribute(
      "style",
      `${theme.styles.codeBlock}${existing ? ";" + existing : ""}`
    )
  })

  return doc.body.innerHTML
}

/**
 * Wrap rendered HTML with article title and subtitle.
 */
export function wrapArticle(
  html: string,
  title: string = "",
  subtitle: string = "",
  themeId: string = "minimal-white"
): string {
  const theme = themes.find((t) => t.id === themeId) || themes[0]
  const s = theme.styles

  let headerHtml = ""
  if (title) {
    headerHtml += `<h1 style="${s.title}">${escapeHtml(title)}</h1>`
  }
  if (subtitle) {
    headerHtml += `<p style="${s.subtitle}">${escapeHtml(subtitle)}</p>`
  }

  return html.replace(`<section style="${s.container}">`, `<section style="${s.container}">${headerHtml}`)
}

/**
 * Escape HTML special characters to prevent injection.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// ─── CRITICAL: WeChat-compatible clipboard copy ───
// WeChat editor only accepts rich text via clipboardData.setData('text/html', ...)
// navigator.clipboard.writeText() only writes plain text, which shows as raw HTML code!

/**
 * Copy HTML to clipboard in WeChat-compatible format.
 * Uses the deprecated but universally supported document.execCommand('copy')
 * with clipboardData to set both text/html and text/plain formats.
 */
export async function copyToClipboard(html: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Use a contenteditable div so the browser copies rich text
    const tempDiv = document.createElement("div")
    tempDiv.contentEditable = "true"
    tempDiv.innerHTML = html
    tempDiv.style.position = "fixed"
    tempDiv.style.left = "-9999px"
    tempDiv.style.top = "-9999px"
    tempDiv.style.opacity = "0"
    document.body.appendChild(tempDiv)

    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(tempDiv)
    selection?.removeAllRanges()
    selection?.addRange(range)

    let success = false

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Set both formats — text/html is what WeChat reads
      e.clipboardData?.setData("text/html", html)
      e.clipboardData?.setData("text/plain", html)

      success = true
      document.removeEventListener("copy", handleCopy)
      cleanup()
      resolve(true)
    }

    document.addEventListener("copy", handleCopy)

    // Trigger the copy command
    try {
      document.execCommand("copy")
    } catch {
      // Fallback failed
    }

    // Cleanup if the event didn't fire
    const cleanup = () => {
      selection?.removeAllRanges()
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv)
      }
    }

    setTimeout(() => {
      if (!success) {
        document.removeEventListener("copy", handleCopy)
        cleanup()
        // Last resort: try modern API (will paste as code, not styled)
        navigator.clipboard.writeText(html)
          .then(() => resolve(true))
          .catch(() => resolve(false))
      }
    }, 200)
  })
}

// ─── Demo Markdown Content ───
export const demoMarkdown = `## 什么是墨排？

**墨排**是一款专为公众号作者打造的 Markdown 排版工具。输入 Markdown，即刻获得出版级排版效果。

![写作时光](/images/demo-article.jpg)

> *好的排版让内容更有说服力。真正的美，存在于克制之中。*
>
> —— 墨排设计哲学

### 核心特性

- **十二套精选主题** — 从极简留白到新中式美学，一键切换
- **完整 Markdown 支持** — 标题、列表、表格、代码块、图片全兼容
- **图片一键插入** — 支持上传、粘贴、拖拽三种方式
- **所见即所得** — 实时预览，公众号效果一目了然
- **一键复制** — HTML 内联样式，粘贴即用

### 代码高亮

\`\`\`typescript
interface Article {
  title: string;
  content: string;
  theme: Theme;
}

function publish(article: Article): Promise<void> {
  const html = render(article.content, article.theme);
  return copyToWeChat(html);
}
\`\`\`

### 数据展示

| 功能 | 状态 | 备注 |
|------|------|------|
| Markdown 渲染 | ✅ 已上线 | 完整 GFM 语法 |
| 主题切换 | ✅ 已上线 | 12 套精品主题 |
| 代码高亮 | ✅ 已上线 | 自动识别语言 |
| 表格渲染 | ✅ 已上线 | 含表头样式 |
| 图片支持 | ✅ 已上线 | 上传/粘贴/拖拽 |

### 排版原则

**字间距**、行高、段间距经过精心调校，适配手机屏幕阅读习惯。每个主题都有独立的色彩体系，确保品牌辨识度。

---

*选择一个主题，开始你的创作之旅。*
`
