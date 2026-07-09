import { marked } from "marked"
import { extractMathSvg, injectRenderedMathSvg } from "./mathSvgRenderer"
import { extractTaskBlocks, injectTaskBlocks } from "./taskRenderer"
import { themes, type Theme } from "./themes"
import { renderGzhDesignMarkdown } from "./gzhDesign/renderer"

// Configure marked for GFM
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * Convert local/relative image paths to full URLs for preview.
 * Leaves absolute URLs (http/https/data) untouched.
 *
 * Root-relative paths like "/images/..." are resolved against the current
 * page's directory so they work when the app is deployed under a subpath
 * (e.g. GitHub Pages project sites).
 */
function resolveImagePaths(html: string): string {
  const base =
    typeof window !== "undefined"
      ? new URL(".", window.location.href).href
      : ""
  return html.replace(
    /src="(\/|\.\/)/g,
    (_, slash: string) => `src="${slash === "/" ? base : ""}`
  )
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

function unescapeHtml(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

// ─── gzh-design-skill inspired WeChat-safe transforms ───
// These transforms align the rendered HTML with the proven practices from
// gzh-design-skill (https://github.com/isjiamu/gzh-design-skill):
//   - <span leaf=""> wraps every text node (paste safety)
//   - code blocks rendered as <section> with per-line <p> (no white-space:pre)
//   - images wrapped in a WeChat-safe card component
//   - section auto-numbering for h2 headings
// Both DOM (browser) and regex (SSR/Node) implementations are provided so
// the output is consistent whether rendered in the browser or exported.

/**
 * Wrap every non-empty text node in <span leaf="">.
 * This is the single most important WeChat paste-safety measure:
 * without it, the editor can strip or rewrite inline styles.
 */
function wrapTextNodesWithLeaf(html: string): string {
  if (typeof document === "undefined") {
    return wrapTextNodesWithLeafRegex(html)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  function walk(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ""
      if (!text.trim()) return
      const span = document.createElement("span")
      span.setAttribute("leaf", "")
      span.textContent = text
      node.parentNode?.replaceChild(span, node)
      return
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const tag = el.tagName.toLowerCase()
      if (tag === "script" || tag === "style") return
      if (tag === "span" && el.hasAttribute("leaf")) return
      Array.from(el.childNodes).forEach((child) => walk(child))
    }
  }

  Array.from(doc.body.childNodes).forEach((child) => walk(child))
  return doc.body.innerHTML
}

function wrapTextNodesWithLeafRegex(html: string): string {
  // Lightweight stack-based text wrapper for SSR/Node environments.
  // Skips text inside <script>, <style>, <pre>, <code> and inside existing
  // <span leaf=""> ... </span> blocks.
  const skipTags = new Set(["script", "style", "pre"])
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"])
  const parts = html.split(/(<[^>]+>)/)
  const stack: { tag: string; leaf: boolean }[] = []
  let result = ""

  for (const part of parts) {
    if (!part) continue

    if (part.startsWith("<")) {
      const isClosing = part.startsWith("</")
      const tagMatch = part.match(/^<\/?([a-z0-9]+)/i)
      const tag = tagMatch ? tagMatch[1].toLowerCase() : ""
      const selfClosing = part.endsWith("/>") || voidTags.has(tag)

      if (isClosing) {
        const top = stack[stack.length - 1]
        if (top && top.tag === tag) {
          stack.pop()
        }
        result += part
      } else {
        const isLeafSpan = tag === "span" && /leaf\s*=/.test(part)
        if (!selfClosing) {
          stack.push({ tag, leaf: isLeafSpan })
        }
        result += part
      }
    } else {
      const inSkip = stack.some((s) => skipTags.has(s.tag))
      const inLeaf = stack.some((s) => s.leaf)
      if (inSkip || inLeaf || !part.trim()) {
        result += part
      } else {
        result += `<span leaf="">${part}</span>`
      }
    }
  }

  return result
}

/**
 * Convert marked's <pre><code> blocks into gzh-design-style <section> blocks.
 * Avoids white-space:pre, which renders source indentation as visible gaps.
 */
function transformCodeBlocks(html: string): string {
  if (typeof document === "undefined") {
    return transformCodeBlocksRegex(html)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  doc.body.querySelectorAll("pre > code").forEach((code) => {
    const pre = code.parentElement
    if (!pre) return

    const languageClass = Array.from(code.classList).find((c) =>
      c.startsWith("language-")
    )
    const language = languageClass ? languageClass.replace("language-", "") : ""
    const raw = code.textContent || ""

    const replacement = buildCodeBlockHtml(language, raw)

    const wrapper = document.createElement("div")
    wrapper.innerHTML = replacement
    pre.parentNode?.replaceChild(wrapper.firstElementChild as Node, pre)
  })

  return doc.body.innerHTML
}

function transformCodeBlocksRegex(html: string): string {
  return html.replace(
    /<pre(?:\s[^>]*)?><code(?:\s[^>]*)?>([^]*?)<\/code><\/pre>/g,
    (match, code) => {
      const classMatch = match.match(/class="([^"]*)"/)
      const classAttr = classMatch ? classMatch[1] : ""
      const languageMatch = classAttr.match(/language-(\S+)/)
      const language = languageMatch ? languageMatch[1] : ""
      return buildCodeBlockHtml(language, unescapeHtml(code))
    }
  )
}

function buildCodeBlockHtml(language: string, raw: string): string {
  const lines = raw
    .split("\n")
    .filter((line, idx, arr) => {
      if (idx === arr.length - 1 && line === "") return false
      return true
    })
    .map((line) => {
      let indent = 0
      while (indent < line.length && line[indent] === " ") indent++
      const fullIndent = "　".repeat(Math.min(indent, 8))
      const content = line.slice(indent)
      return `<p style="margin:0;font-family:'SF Mono',Consolas,Monaco,monospace;font-size:13px;line-height:1.6;color:#E2E8F0;"><span leaf="">${fullIndent}${escapeHtml(content)}</span></p>`
    })

  const languageTag = language
    ? `<span style="margin-left:12px;font-size:12px;color:#64748B;font-family:Consolas,Monaco,monospace;letter-spacing:1px;"><span leaf="">${escapeHtml(language)}</span></span>`
    : ""

  const titleBar = `<section style="display:flex;align-items:center;padding:9px 14px;background:#0F172A;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#FF5F56;margin-right:7px;font-size:0;line-height:0;overflow:hidden;"><span leaf=""><br></span></span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#FFBD2E;margin-right:7px;font-size:0;line-height:0;overflow:hidden;"><span leaf=""><br></span></span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#27C93F;font-size:0;line-height:0;overflow:hidden;"><span leaf=""><br></span></span>${languageTag}</section>`

  return `
    <section style="margin:0 0 20px;border-radius:8px;overflow:hidden;background:#1E293B;box-shadow:0 4px 16px -8px rgba(15,23,42,0.4);">
      ${titleBar}
      <section style="padding:11px 14px;">
        ${lines.join("")}
      </section>
    </section>
  `
}

/**
 * Wrap standalone <img> tags in a WeChat-safe card.
 * Uses max-width:100% without width:100% so small images stay crisp.
 */
function transformImages(html: string): string {
  if (typeof document === "undefined") {
    return transformImagesRegex(html)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  doc.body.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || ""
    const alt = img.getAttribute("alt") || ""
    const replacement = buildImageHtml(src, alt)

    const wrapper = document.createElement("div")
    wrapper.innerHTML = replacement
    const container = wrapper.firstElementChild as Node

    const parent = img.parentElement
    const grandParent = parent?.parentElement
    if (parent && grandParent && parent.tagName.toLowerCase() === "p" && parent.childNodes.length === 1) {
      const captionEl = wrapper.children[1]
      grandParent.replaceChild(container, parent)
      if (captionEl) {
        grandParent.insertBefore(captionEl, container.nextSibling)
      }
    } else {
      img.parentNode?.replaceChild(container, img)
    }
  })

  return doc.body.innerHTML
}

function transformImagesRegex(html: string): string {
  // Standalone image inside a paragraph: replace the whole <p>...</p>.
  let result = html.replace(
    /<p(?:\s[^>]*)?>\s*<img\s+([^>]*?)\/?>\s*<\/p>/g,
    (_, imgAttrs) => buildImageBlock(imgAttrs)
  )
  // Inline images that are not already inside our image card.
  result = result.replace(
    /<img(?![^>]*style="[^"]*max-width:100%)(\s[^>]*)?\/?>/g,
    (_, imgAttrs = "") => buildImageBlock(imgAttrs.trimStart())
  )
  return result
}

function parseImgAttrs(attrs: string): { src: string; alt: string } {
  const srcMatch = attrs.match(/src="([^"]*)"/)
  const altMatch = attrs.match(/alt="([^"]*)"/)
  return {
    src: srcMatch ? unescapeHtml(srcMatch[1]) : "",
    alt: altMatch ? unescapeHtml(altMatch[1]) : "",
  }
}

function buildImageBlock(imgAttrs: string): string {
  const { src, alt } = parseImgAttrs(imgAttrs)
  return buildImageHtml(src, alt)
}

function buildImageHtml(src: string, alt: string): string {
  const caption = alt
    ? `<p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0 0 24px;"><span leaf="">— ${escapeHtml(alt)}</span></p>`
    : ""

  return `
    <section style="background:#FFF;border-radius:12px;padding:6px;border:1px solid #E5E7EB;box-shadow:0 4px 12px -2px rgba(0,0,0,0.08);margin-bottom:8px;">
      <section style="margin:0;border-radius:8px;overflow:hidden;">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="width:100%;max-width:100%;height:auto;display:block;margin:0 auto;">
      </section>
    </section>
    ${caption}
  `.trim()
}

/**
 * Auto-number h2 headings as 01, 02, 03... following gzh-design convention.
 * The last heading is kept as a plain number unless it already contains one.
 */
function headingNumberPrefix(num: string, theme: Theme): string {
  const style = theme.headingNumberStyle ?? "plain"
  const accent = theme.accent

  if (style === "badge") {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;background:${accent};color:#FFFFFF;font-size:12px;font-weight:800;padding:2px 7px;border-radius:4px;margin-right:8px;letter-spacing:0;"><span leaf="">${num}</span></span>`
  }

  if (style === "outline") {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;color:${accent};border:1px solid ${accent};font-size:12px;font-weight:800;padding:1px 6px;border-radius:4px;margin-right:8px;letter-spacing:0;"><span leaf="">${num}</span></span>`
  }

  return `<span style="color:${accent};font-size:0.95em;font-weight:800;margin-right:6px;"><span leaf="">${num}.</span></span>`
}

function autoNumberHeadings(html: string, theme: Theme): string {
  if (typeof document === "undefined") {
    return autoNumberHeadingsRegex(html, theme)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const h2s = Array.from(doc.body.querySelectorAll("h2"))

  h2s.forEach((h2, index) => {
    const num = String(index + 1).padStart(2, "0")
    const existing = h2.innerHTML.trim()
    if (!existing.startsWith(num) && !existing.startsWith("∞")) {
      h2.innerHTML = `${headingNumberPrefix(num, theme)}${existing}`
    }
  })

  return doc.body.innerHTML
}

function autoNumberHeadingsRegex(html: string, theme: Theme): string {
  let count = 0
  return html.replace(/<h2(\s[^>]*)?>(.*?)<\/h2>/g, (match, attrs = "", content) => {
    count++
    const num = String(count).padStart(2, "0")
    const trimmed = content.trim()
    if (trimmed.startsWith(num) || trimmed.startsWith("∞")) return match
    return `<h2${attrs}>${headingNumberPrefix(num, theme)}${content}</h2>`
  })
}

/**
 * Render markdown to themed HTML for WeChat articles.
 *
 * CRITICAL: WeChat editor filters <div> tags completely!
 * We use <section> as the container instead.
 * All styles must be inline (style="...") — <style> tags are stripped.
 */
const GZH_DESIGN_THEMES = new Set([
  "moyu-green",
  "red-white",
  "graphite-minimal",
  "zen-whitespace",
  "moyu-ticket",
  "olive-journal",
  "warm-ink",
  "purple-ink",
  "ai-notebook",
])

export function renderMarkdownToHtml(markdown: string, themeId: string = "minimal-white"): string {
  const theme = themes.find((t) => t.id === themeId) || themes[0]
  const s = theme.styles

  // gzh-design theme: use the full component-based renderer for authentic output.
  if (GZH_DESIGN_THEMES.has(themeId)) {
    return renderGzhDesignMarkdown(markdown, themeId)
  }

  // 1. Extract animated task blocks and replace with placeholders
  const { prepared: taskPrepared, blocks } = extractTaskBlocks(markdown)

  // 2. Extract LaTeX math expressions and replace with placeholders.
  //    Use SVG images instead of KaTeX HTML: WeChat strips KaTeX's class
  //    attributes, <style> tags and position:absolute rules.
  const { prepared, snippets } = extractMathSvg(taskPrepared)

  // 3. Parse markdown to HTML
  let html = marked.parse(prepared) as string

  // 4. Replace placeholders with WeChat-safe SVG formula images
  html = injectRenderedMathSvg(html, snippets)

  // 5. Replace placeholders with animated task cards
  html = injectTaskBlocks(html, blocks)

  // 6. Resolve local image paths for preview
  html = resolveImagePaths(html)

  // 7. Apply inline theme styles first, then run gzh-design structural transforms.
  //    The transforms replace <pre><code> and <img> with WeChat-safe <section>
  //    components; doing this after style injection avoids theme paragraph styles
  //    leaking into code-block lines.
  html = applyInlineStyles(html, theme)

  // 8. gzh-design structural transforms
  html = transformCodeBlocks(html)
  html = transformImages(html)
  html = autoNumberHeadings(html, theme)

  // 9. Wrap text nodes with <span leaf=""> for WeChat paste safety
  html = wrapTextNodesWithLeaf(html)

  // 10. Wrap in <section> container (NOT <div> — WeChat filters div!)
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
 * Apply theme styles inline to all HTML elements.
 * WeChat requires ALL styles to be inline — no <style> tags allowed.
 */
function applyInlineStyles(html: string, theme: Theme): string {
  if (typeof document === "undefined") {
    return applyInlineStylesRegex(html, theme)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  for (const [tag, styleKey] of Object.entries(STYLE_MAP)) {
    const styleValue = theme.styles[styleKey]
    if (!styleValue) continue

    const elements = doc.body.querySelectorAll(tag)
    elements.forEach((el) => {
      const existing = el.getAttribute("style") || ""
      el.setAttribute("style", `${styleValue}${existing ? ";" + existing : ""}`)
    })
  }

  return doc.body.innerHTML
}

function applyInlineStylesRegex(html: string, theme: Theme): string {
  for (const [tag, styleKey] of Object.entries(STYLE_MAP)) {
    const styleValue = theme.styles[styleKey]
    if (!styleValue) continue

    const regex = new RegExp(`<${tag}(\\s[^>]*)?(\\/?)>`, "g")
    html = html.replace(regex, (_, attrs = "", selfClosing = "") => {
      const styleMatch = attrs.match(/(^|\\s)style="([^"]*)"/)
      let newAttrs = attrs
      if (styleMatch) {
        const combined = `${styleValue};${styleMatch[2]}`
        newAttrs = attrs.replace(styleMatch[0], ` style="${combined}"`)
      } else {
        newAttrs = `${attrs} style="${styleValue}"`
      }
      return `<${tag}${newAttrs}${selfClosing}>`
    })
  }
  return html
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

  const result = html.replace(`<section style="${s.container}">`, `<section style="${s.container}">${headerHtml}`)
  return wrapTextNodesWithLeaf(result)
}

// ─── CRITICAL: WeChat-compatible clipboard copy ───
// WeChat editor only accepts rich text via clipboardData.setData('text/html', ...)
// navigator.clipboard.writeText() only writes plain text, which shows as raw HTML code!

export interface WeChatValidationResult {
  errors: string[]
  warnings: string[]
}

/**
 * Port of gzh-design-skill's validate_gzh_html.py to the browser.
 * Checks the generated HTML against WeChat editor restrictions.
 */
export function validateWeChatHtml(html: string): WeChatValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const forbidden = [
    { rx: /<style[\s>]/gi, msg: "<style> 标签会被过滤，样式必须内联" },
    { rx: /<script[\s>]/gi, msg: "<script> 标签会被过滤" },
    { rx: /<\/ ?div[\s>]/gi, msg: "<div> 会被改写，请用 <section>" },
    { rx: /<link[\s>]/gi, msg: "外部 <link>（CSS/字体）会被过滤" },
    { rx: /\sclass\s*=/gi, msg: "class 属性会被剥离，请用内联 style" },
    { rx: /\sid\s*=/gi, msg: "id 属性会被剥离" },
    { rx: /position\s*:\s*(fixed|absolute|sticky)/gi, msg: "position fixed/absolute/sticky 不被支持" },
    { rx: /float\s*:/gi, msg: "float 不被支持" },
    { rx: /@media/gi, msg: "@media 媒体查询不被支持" },
    { rx: /@keyframes/gi, msg: "@keyframes 动画不被支持" },
    { rx: /@import/gi, msg: "@import 不被支持" },
    { rx: /display\s*:\s*grid/gi, msg: "display:grid 不被支持，请用 flex" },
    { rx: /var\s*\(\s*--/gi, msg: "CSS 变量 var(--x) 不被支持，请写死值" },
    { rx: /url\s*\(\s*['"]?https?:\/\/[^)]*\.(woff2?|ttf|otf|eot)/gi, msg: "外部字体不被支持" },
  ]

  forbidden.forEach(({ rx, msg }) => {
    const hits = (html.match(rx) || []).length
    if (hits) errors.push(`${msg}（命中 ${hits} 处）`)
  })

  // span leaf coverage
  if (typeof document !== "undefined") {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    let totalTextNodes = 0
    let wrappedTextNodes = 0
    const unwrapped: string[] = []

    function walk(node: Node): void {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ""
        if (!text.trim()) return
        totalTextNodes++
        const parent = node.parentElement
        if (parent && parent.tagName.toLowerCase() === "span" && parent.hasAttribute("leaf")) {
          wrappedTextNodes++
        } else {
          unwrapped.push(text.slice(0, 24) + (text.length > 24 ? "…" : ""))
        }
        return
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element
        const tag = el.tagName.toLowerCase()
        if (tag === "script" || tag === "style") return
        Array.from(el.childNodes).forEach((child) => walk(child))
      }
    }

    Array.from(doc.body.childNodes).forEach((child) => walk(child))

    if (totalTextNodes > 0 && wrappedTextNodes === 0) {
      errors.push("全文没有任何 <span leaf=\"\"> 包裹——粘贴到公众号后样式会大面积丢失")
    } else if (unwrapped.length > 0) {
      warnings.push(
        `${unwrapped.length} 处文本未被 <span leaf> 包裹，样式可能丢失。例：${unwrapped.slice(0, 3).join("；")}`
      )
    }
  }

  // Half-width punctuation after CJK
  const halfPunct = /[\u4e00-\u9fa5][,;!?]/
  const halfHits = (html.match(halfPunct) || []).length
  if (halfHits) {
    warnings.push(`${halfHits} 处正文疑似半角标点，应改中文全角（代码块内除外）`)
  }

  return { errors, warnings }
}

/**
 * Detect images that WeChat cannot auto-upload when pasted.
 *
 * WeChat's editor only uploads images referenced by a *public* http(s) URL;
 * data:/blob:/relative sources are silently dropped on paste. (Verified
 * against wechat-publish-skill: "Base64 images are not supported by WeChat
 * upload".) This lets the UI warn the author before they lose images.
 */
export function getImageCompatibility(html: string): {
  incompatible: number
  examples: string[]
} {
  const imgs = html.match(/<img\b[^>]*>/gi) || []
  const examples: string[] = []
  let incompatible = 0
  for (const tag of imgs) {
    const m = tag.match(/src="([^"]*)"/i)
    const src = m ? m[1] : ""
    if (!/^https?:\/\//i.test(src)) {
      incompatible++
      if (examples.length < 3) examples.push(src.slice(0, 48))
    }
  }
  return { incompatible, examples }
}

/**
 * Copy HTML to clipboard in WeChat-compatible format.
 * Uses the deprecated but universally supported document.execCommand('copy')
 * with clipboardData to set both text/html and text/plain formats.
 */
export async function copyToClipboard(html: string): Promise<boolean> {
  const validation = validateWeChatHtml(html)
  if (validation.errors.length > 0) {
    console.error("墨排：生成的 HTML 存在公众号兼容性问题", validation)
  } else if (validation.warnings.length > 0) {
    console.warn("墨排：生成的 HTML 有公众号兼容性警告", validation)
  }

  // Images that WeChat cannot auto-upload (data:/blob:/relative) will be
  // silently dropped after paste — warn so the author isn't surprised.
  const imgReport = getImageCompatibility(html)
  if (imgReport.incompatible > 0) {
    console.warn(
      `墨排：检测到 ${imgReport.incompatible} 张图片无法通过公众号自动上传（data:/blob:/相对路径），粘贴后将不显示。请改用公网 https 图片地址，或在公众号编辑器内单独粘贴图片。`,
      imgReport.examples
    )
  }

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

### 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)
$$

### 数据展示

| 功能 | 状态 | 备注 |
|------|------|------|
| Markdown 渲染 | ✅ 已上线 | 完整 GFM 语法 |
| 主题切换 | ✅ 已上线 | 12 套精品主题 |
| 代码高亮 | ✅ 已上线 | 自动识别语言 |
| 表格渲染 | ✅ 已上线 | 含表头样式 |
| 图片支持 | ✅ 已上线 | 上传/粘贴/拖拽 |
| 数学公式 | ✅ 已上线 | 支持 LaTeX 语法 |

### 排版原则

**字间距**、行高、段间距经过精心调校，适配手机屏幕阅读习惯。每个主题都有独立的色彩体系，确保品牌辨识度。

---

*选择一个主题，开始你的创作之旅。*
`
