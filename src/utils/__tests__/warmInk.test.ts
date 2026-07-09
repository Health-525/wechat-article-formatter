import { it, expect } from "vitest"
import { renderMarkdownToHtml } from "../markdownParser"

const md = `# 封面主标题：副标题高亮

这是副标题，带一点**加粗**和\`inline code\`。

> *好的排版让内容更有说服力。真正的美，存在于克制之中。*\n> —— 墨排设计哲学

## 第一章 核心方法

正文第一段，包含 **加粗**、==高亮==、\`代码\` 和下划线 ++重点++。

![示例图片](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800)

- 列表项 A，带 **加粗**
- 列表项 B，带 \`代码\`
- 列表项 C

1. 第一步
2. 第二步，带 **强调**
3. 第三步

### 小标题示例

下面是一段代码：

\`\`\`typescript
interface Article {
  title: string;
  content: string;
}
\`\`\`

---

## 总结与展望

结语内容。*选择一个主题，开始你的创作之旅。*
`

it("renders warm-ink with rich markdown", () => {
  const html = renderMarkdownToHtml(md, "warm-ink")

  // 容器与核心结构
  expect(html).toContain('<section style="max-width:677px')
  expect(html).toContain('<span leaf="">封面主标题</span>')
  expect(html).toContain("<h2")
  expect(html).toContain("<h3")

  // 封面高亮与结语特殊编号
  expect(html).toContain("副标题高亮")
  expect(html).toContain("FINALE")
  expect(html).toContain("∞")

  // 行内样式都被渲染
  expect(html).toContain("<strong")
  expect(html).toContain("inline code")

  // 代码块使用 <section> 按行渲染，而不是 <pre>
  expect(html).not.toContain("<pre")
  expect(html).toContain("typescript")

  // 图片说明与 alt
  expect(html).toContain("— 示例图片")
  expect(html).toContain('alt="示例图片"')

  // 引言与正文引用都保留了换行，且支持 *斜体* 但不支持 **加粗**
  expect(html).toContain("克制之中。")
  expect(html).toContain("<br>—— 墨排设计哲学")
  expect(html).toContain("<em")
  expect(html).not.toContain("**")
  expect(html).toContain("选择一个主题，开始你的创作之旅")

  // 列表存在
  expect(html).toContain("列表项 A")
  expect(html).toContain("第一步")
})
