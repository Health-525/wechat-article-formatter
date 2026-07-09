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

function latexToSvgUrl(tex: string): string {
  // Use CodeCogs LaTeX-to-SVG service so formulas appear as images in WeChat.
  // WeChat strips CSS classes, so image-based formulas are the only reliable option.
  const cleaned = tex.replace(/^\\\[/, "").replace(/\\\]$/, "").trim()
  return `https://latex.codecogs.com/svg.latex?${encodeURIComponent(cleaned)}`
}

/**
 * Replace placeholders with rendered formula images.
 */
export function injectRenderedMathSvg(
  html: string,
  snippets: MathSvgSnippet[]
): string {
  let result = html

  for (const { id, tex, displayMode } of snippets) {
    const src = latexToSvgUrl(tex)
    const placeholder = displayMode ? BLOCK_PLACEHOLDER(id) : INLINE_PLACEHOLDER(id)

    if (displayMode) {
      const replacement = `<section style="text-align:center;margin:16px 0;"><img src="${src}" alt="${tex.replace(/"/g, "&quot;")}" style="max-width:100%;height:auto;display:block;margin:0 auto;"></section>`
      result = result.replace(placeholder, replacement)
    } else {
      const replacement = `<img src="${src}" alt="${tex.replace(/"/g, "&quot;")}" style="height:1em;width:auto;vertical-align:middle;display:inline-block;">`
      result = result.replace(placeholder, replacement)
    }
  }

  return result
}
