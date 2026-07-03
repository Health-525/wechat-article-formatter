import katex from "katex"

export interface MathSnippet {
  id: string
  tex: string
  displayMode: boolean
}

let idCounter = 0

function nextId(): string {
  return `__MATH_${idCounter++}__`
}

const BLOCK_PLACEHOLDER = (id: string) =>
  `<div class="math-block-placeholder" data-math="${id}"></div>`
const INLINE_PLACEHOLDER = (id: string) =>
  `<span class="math-inline-placeholder" data-math="${id}"></span>`

/**
 * Extract LaTeX math expressions from Markdown and replace them with
 * placeholders so that the Markdown parser does not corrupt them.
 *
 * Supports:
 *   - Inline math:  $...$
 *   - Block math:   $$...$$
 */
export function extractMath(markdown: string): {
  prepared: string
  snippets: MathSnippet[]
} {
  idCounter = 0
  const snippets: MathSnippet[] = []

  // Extract block math ($$...$$) first so it is not mistaken for inline math.
  let prepared = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_, rawTex: string) => {
    const id = nextId()
    snippets.push({ id, tex: rawTex.trim(), displayMode: true })
    return BLOCK_PLACEHOLDER(id)
  })

  // Extract inline math ($...$), avoiding $$ boundaries.
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
 * Replace placeholders inside rendered HTML with actual KaTeX output.
 */
export function injectRenderedMath(
  html: string,
  snippets: MathSnippet[]
): string {
  let result = html

  for (const { id, tex, displayMode } of snippets) {
    try {
      const rendered = katex.renderToString(tex, {
        throwOnError: false,
        displayMode,
        strict: false,
      })
      const placeholder = displayMode
        ? BLOCK_PLACEHOLDER(id)
        : INLINE_PLACEHOLDER(id)
      result = result.replace(placeholder, rendered)
    } catch {
      // Fallback: show raw TeX so the user can still see the content.
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
