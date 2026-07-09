import { themes } from "../src/utils/themes"
import { renderMarkdownToHtml, validateWeChatHtml } from "../src/utils/markdownParser"

const DATA_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

const md = `# 测试标题

这是一段**加粗**正文，包含 \`行内代码\` 与 [链接](https://example.com)。

> 引用：好的排版让内容更有说服力。

### 小标题

- 列表项一
- 列表项二

\`\`\`js
const a = 1
function f(x) { return x + 1 }
\`\`\`

| 列一 | 列二 |
|------|------|
| A | B |

![hosted](https://example.com/photo.png)

![local](${DATA_PNG})

---

结尾段落。
`

const allIds = themes.map((t) => t.id)

let grandErrors = 0
let grandWarnings = 0

for (const id of allIds) {
  let html = ""
  try {
    html = renderMarkdownToHtml(md, id)
  } catch (e) {
    console.log(`❌ ${id}: RENDER THREW -> ${(e as Error).message}`)
    grandErrors++
    continue
  }

  const v = validateWeChatHtml(html)
  const imgCount = (html.match(/<img\b/gi) || []).length
  const dataImgs = (html.match(/src="data:/gi) || []).length
  const blobImgs = (html.match(/src="blob:/gi) || []).length
  const boxShadow = (html.match(/box-shadow/gi) || []).length
  const positionAbs = (html.match(/position:\s*(fixed|absolute|sticky)/gi) || []).length
  const grid = (html.match(/display:\s*grid/gi) || []).length
  const cls = (html.match(/\sclass\s*=/gi) || []).length
  const div = (html.match(/<div\b/gi) || []).length
  const varCss = (html.match(/var\(\s*--/gi) || []).length
  const bgUrl = (html.match(/url\(/gi) || []).length
  const imgInLeaf = (html.match(/<span leaf="[^>]*>\s*<img/gi) || []).length

  const errCount = v.errors.length
  const warnCount = v.warnings.length
  grandErrors += errCount
  grandWarnings += warnCount

  const flag = errCount > 0 ? "❌" : warnCount > 0 ? "⚠️" : "✅"
  console.log(
    `${flag} ${id.padEnd(18)} err=${errCount} warn=${warnCount} img=${imgCount} data/blob=${dataImgs + blobImgs} shadow=${boxShadow} posAbs=${positionAbs} grid=${grid} class=${cls} div=${div} var=${varCss} bgUrl=${bgUrl} imgInLeaf=${imgInLeaf}`
  )
  if (errCount > 0) {
    v.errors.forEach((e) => console.log(`     · ${e}`))
  }
}

console.log(
  `\nSUMMARY: themes=${allIds.length} totalErrors=${grandErrors} totalWarnings=${grandWarnings}`
)
