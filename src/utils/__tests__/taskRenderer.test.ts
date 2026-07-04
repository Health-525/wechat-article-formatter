import { describe, expect, it } from "vitest"
import { extractTaskBlocks, injectTaskBlocks, renderTaskBlock } from "../taskRenderer"

describe("taskRenderer", () => {
  it("extracts a task block and replaces it with a placeholder", () => {
    const md = "# Plan\n\n:::task\n- [x] Done\n- [ ] Todo\n:::\n\nDone"
    const { prepared, blocks } = extractTaskBlocks(md)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].items).toEqual([
      { text: "Done", done: true },
      { text: "Todo", done: false },
    ])
    expect(prepared).toContain('<div class="mopai-task-placeholder"')
    expect(prepared).not.toContain(":::task")
  })

  it("renders an animated task card", () => {
    const html = renderTaskBlock({
      id: "test",
      items: [
        { text: "Step 1", done: true },
        { text: "Step 2", done: false },
      ],
    })
    expect(html).toContain("任务清单")
    expect(html).toContain("已完成 1 / 2")
    expect(html).toContain("mopai-task-progress")
    expect(html).toContain("Step 1")
    expect(html).toContain("Step 2")
  })

  it("injects rendered blocks back into HTML", () => {
    const md = ":::task\n- [x] A\n:::\n"
    const { prepared, blocks } = extractTaskBlocks(md)
    const rendered = injectTaskBlocks(prepared, blocks)
    expect(rendered).toContain("任务清单")
    expect(rendered).not.toContain("mopai-task-placeholder")
  })
})
