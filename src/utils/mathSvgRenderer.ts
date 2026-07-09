import { renderFormulaToHtml } from "./mathRenderer"

export interface MathSvgSnippet {
  id: string
  tex: string
  displayMode: boolean
}

let idCounter = 0

function nextId(): string {
  return `__MATHSVG_${idCounter++}__`
}

const BLOCK_PLACEHOLDER = (id: string) =>
  `<div class="math-svg-block-placeholder" data-math="${id}"></div>`
const INLINE_PLACEHOLDER = (id: string) =>
  `<span class="math-svg-inline-placeholder" data-math="${id}"></span>`

/**
 * Extract LaTeX math expressions and replace them with placeholders.
 *
 * Note: despite the module name, gzh-design themes now render formulas as
 * KaTeX HTML with inline styles instead of SVG images. The placeholder class
 * names are kept for backwards compatibility with existing renderers.
 */
export function extractMathSvg(markdown: string): {
  prepared: string
  snippets: MathSvgSnippet[]
} {
  idCounter = 0
  const snippets: MathSvgSnippet[] = []

  let prepared = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_, rawTex: string) => {
    const id = nextId()
    snippets.push({ id, tex: rawTex.trim(), displayMode: true })
    return BLOCK_PLACEHOLDER(id)
  })

  prepared = prepared.replace(
    /(?<!\$)\$([^$\n]+?)\$(?!\$)/g,
    (_, rawTex: string) => {
      const id = nextId()
      snippets.push({ id, tex: rawTex.trim(), displayMode: false })
      return INLINE_PLACEHOLDER(id)
    }
  )

  return { prepared, snippets }
}

/**
 * Replace placeholders with rendered formula HTML.
 *
 * Uses KaTeX with inlined CSS so formulas appear as selectable text in the
 * WeChat editor rather than external images.
 */
export function injectRenderedMathSvg(
  html: string,
  snippets: MathSvgSnippet[]
): string {
  let result = html

  for (const { id, tex, displayMode } of snippets) {
    try {
      const rendered = renderFormulaToHtml(tex, displayMode)
      const placeholder = displayMode
        ? BLOCK_PLACEHOLDER(id)
        : INLINE_PLACEHOLDER(id)
      result = result.replace(placeholder, rendered)
    } catch {
      const fallback = displayMode
        ? `<pre style="background:#f5f5f5;padding:12px;border-radius:6px;overflow-x:auto;">${tex}</pre>`
        : `<code style="background:#f5f5f5;padding:2px 5px;border-radius:3px;">${tex}</code>`
      const placeholder = displayMode
        ? BLOCK_PLACEHOLDER(id)
        : INLINE_PLACEHOLDER(id)
      result = result.replace(placeholder, fallback)
    }
  }

  return result
}
