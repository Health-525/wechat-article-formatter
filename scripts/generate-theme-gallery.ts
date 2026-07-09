import { writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { themes, themeCategories } from "../src/utils/themes"
import { renderMarkdownToHtml } from "../src/utils/markdownParser"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, "theme-gallery.html")

// 示例文章：覆盖标题层级、段落、引用、列表、代码、加粗、表格，便于观察排版差异
const sample = `# 公众号排版最佳实践（示例）

墨排是一款 Markdown 转微信公众号排版工具。下方用同一篇文章演示 21 套主题的排版效果，方便你横向对比。

## 为什么要重视排版

> 好的排版不是装饰，而是内容的延伸。读者扫读时，清晰的结构与舒适的留白直接决定阅读完成率。

排版的核心目标始终是**服务内容**，而不是喧宾夺主。建议遵循以下原则：

- 正文字号 16px 最优，长文可到 18px
- 行间距 1.5–1.8 倍，段落间留足呼吸感
- 正文用深灰而非纯黑，减轻视觉疲劳
- 对齐优先左对齐，避免两端对齐导致字间距参差

### 代码与数据

行内代码如 \`npm run build\` 应与正文区分。代码块保持深底白字更易读：

\`\`\`js
function greet(name) {
  return \`你好，\${name}！\`
}
\`\`\`

| 维度 | 推荐值 | 说明 |
| --- | --- | --- |
| 正文字号 | 16px | 技术类 15–16px |
| 行间距 | 1.75 | 1.5–1.8 倍 |
| 段间距 | 1.5–2 倍 | 比行高多 5–8px |

### 配图演示

![示例配图](https://picsum.photos/seed/mopai/600/220)

> 说明：公众号只能自动上传「公网可访问的 https 图片」。应用内上传/粘贴的图片会转为 data: 格式，复制时应用会提示这些图片在公众号里不会显示——请改用图床或公网地址。

## 小结

选一套与品牌气质一致的主题，把精力留给内容本身。复制后直接粘贴到公众号编辑器即可。
`

let sections = ""
for (const cat of themeCategories) {
  sections += `<div style="margin:0 0 8px;font-weight:700;color:#888;font-size:13px;letter-spacing:1px;">${cat.label}</div>`
  for (const t of cat.themes) {
    const html = renderMarkdownToHtml(sample, t.id)
    sections += `
<section style="max-width:760px;margin:0 auto 56px;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
  <div style="padding:10px 16px;background:#fafafa;border-bottom:1px solid #eee;font-size:13px;color:#333;display:flex;justify-content:space-between;align-items:center;">
    <strong>${t.name}</strong><span style="color:#999;">${t.id} · ${t.description}</span>
  </div>
  <div style="padding:8px 0;">${html}</div>
</section>`
  }
}

const page = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>墨排 · 21 套主题排版画廊</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  body{margin:0;background:#f4f4f5;font-family:'Noto Sans SC',-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;}
  .wrap{max-width:820px;margin:0 auto;padding:32px 16px 80px;}
  h1.page{font-size:22px;text-align:center;color:#222;}
  p.lead{text-align:center;color:#888;font-size:14px;margin-bottom:40px;}
</style>
</head>
<body>
<div class="wrap">
<h1 class="page">墨排 · 21 套主题排版画廊</h1>
<p class="lead">同一篇文章 × 21 套主题 · 已按公众号排版最佳实践优化（正文 16px / 深灰 / 左对齐）</p>
${sections}
</div>
</body>
</html>`

writeFileSync(outPath, page, "utf-8")
console.log(`已生成画廊：${outPath}（${themes.length} 套主题）`)
