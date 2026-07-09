import { marked } from "marked"

export interface TaskItem {
  text: string
  done: boolean
}

export interface TaskBlock {
  id: string
  items: TaskItem[]
}

let taskIdCounter = 0

function nextId(): string {
  return `__TASK_${taskIdCounter++}__`
}

const TASK_BLOCK_RE = /:::\s*task\s*\n([\s\S]*?)\n\s*:::/g
const TASK_ITEM_RE = /^[-*]\s*\[([ xX])\]\s*(.+)$/m

/**
 * Extract custom `:::task` blocks from Markdown and replace them with
 * placeholders so the Markdown parser does not corrupt the HTML we will
 * inject later.
 */
export function extractTaskBlocks(markdown: string): {
  prepared: string
  blocks: TaskBlock[]
} {
  taskIdCounter = 0
  const blocks: TaskBlock[] = []

  const prepared = markdown.replace(TASK_BLOCK_RE, (_, raw: string) => {
    const id = nextId()
    const items: TaskItem[] = []

    for (const line of raw.split("\n")) {
      const match = TASK_ITEM_RE.exec(line)
      if (match) {
        items.push({
          text: match[2].trim(),
          done: match[1].toLowerCase() === "x",
        })
      }
    }

    blocks.push({ id, items })
    return `<div class="mopai-task-placeholder" data-task="${id}"></div>`
  })

  return { prepared, blocks }
}

/**
 * Render a task block as a WeChat-safe HTML card.
 *
 * All styles are inline; no `<style>`, `@keyframes`, CSS variables or
 * positioning rules are used so the card survives paste into the
 * WeChat editor without losing its appearance.
 */
export function renderTaskBlock(block: TaskBlock): string {
  const { items } = block
  const completed = items.filter((i) => i.done).length
  const percent = items.length ? Math.round((completed / items.length) * 100) : 0

  const fontStack = "-apple-system,BlinkMacSystemFont,'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif"

  const header = `<section style="font-family:${fontStack};font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#f25b29;margin-bottom:10px;">任务清单</section>`

  // Static progress bar — no @keyframes or CSS variables so it survives paste.
  const progress = `<section style="height:6px;background:rgba(0,0,0,0.06);border-radius:3px;overflow:hidden;margin-bottom:14px;">
    <section style="height:100%;width:${percent}%;background:linear-gradient(90deg,#f25b29,#ff8f66);border-radius:3px;"></section>
  </section>`

  const listItems = items
    .map((item) => {
      const circle = item.done
        ? `<section style="width:20px;height:20px;border-radius:50%;background:#238636;border:2px solid #238636;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="12" height="12" viewBox="0 0 16 16" style="display:block;">
              <path d="M3 8l4 4 6-8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </section>`
        : `<section style="width:20px;height:20px;border-radius:50%;background:transparent;border:2px solid rgba(0,0,0,0.25);flex-shrink:0;"></section>`

      const textStyle = item.done
        ? "color:rgba(0,0,0,0.55);text-decoration:line-through;"
        : "color:rgba(0,0,0,0.85);"

      return `<li style="display:flex;align-items:center;gap:10px;padding:6px 0;">
        ${circle}
        <span style="font-family:${fontStack};font-size:14px;line-height:1.5;${textStyle}">${marked.parseInline(item.text) as string}</span>
      </li>`
    })
    .join("")

  const list = items.length
    ? `<ul style="list-style:none;padding:0;margin:0;">${listItems}</ul>`
    : `<p style="font-family:${fontStack};font-size:13px;color:rgba(0,0,0,0.45);margin:0;">暂无任务，请在列表中添加。</p>`

  const footer = `<section style="font-family:${fontStack};font-size:11px;color:rgba(0,0,0,0.4);margin-top:12px;text-align:right;">已完成 ${completed} / ${items.length}</section>`

  return `<section style="padding:16px 20px;background:rgba(242,91,41,0.04);border:1px solid rgba(242,91,41,0.12);border-radius:12px;margin:16px 0;">
    ${header}
    ${progress}
    ${list}
    ${footer}
  </section>`
}

/**
 * Replace task placeholders inside rendered HTML with animated cards.
 */
export function injectTaskBlocks(html: string, blocks: TaskBlock[]): string {
  let result = html
  for (const block of blocks) {
    const placeholder = `<div class="mopai-task-placeholder" data-task="${block.id}"></div>`
    result = result.replace(placeholder, renderTaskBlock(block))
  }
  return result
}
