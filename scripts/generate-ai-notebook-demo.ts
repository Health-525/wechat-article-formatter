import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { renderGzhDesignMarkdown } from "../src/utils/gzhDesign/renderer"

const __dirname = dirname(fileURLToPath(import.meta.url))
const mdPath = resolve(__dirname, "ai-notebook-demo.md")
const outPath = resolve(__dirname, "ai-notebook-demo.html")

const markdown = readFileSync(mdPath, "utf-8")
const body = renderGzhDesignMarkdown(markdown, "ai-notebook")

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>智思手记主题完整渲染示例</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F8FAFA;">
${body}
</body>
</html>
`

writeFileSync(outPath, html, "utf-8")
console.log(`已生成：${outPath}`)
