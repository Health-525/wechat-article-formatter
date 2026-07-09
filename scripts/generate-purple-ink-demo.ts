import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { render } from "../src/utils/gzhDesign/renderers/purple-ink"

const __dirname = dirname(fileURLToPath(import.meta.url))
const mdPath = resolve(__dirname, "purple-ink-demo.md")
const outPath = resolve(__dirname, "purple-ink-demo.html")

const markdown = readFileSync(mdPath, "utf-8")
const body = render(markdown)

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>紫墨主题完整渲染示例</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#FAF8FB;">
${body}
</body>
</html>
`

writeFileSync(outPath, html, "utf-8")
console.log(`已生成：${outPath}`)
