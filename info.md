# 墨排 (mopai)

免费、开源的 Markdown 转微信公众号排版工具，让写作回归内容本身。

## 特性

- **21 套精心设计的公众号排版主题**，一键切换，风格统一且移动端友好
- **实时预览**，左侧编辑、右侧即时呈现公众号效果
- **一键复制 HTML**，直接粘贴到公众号编辑器即可发布
- **图片多方式插入**：上传、粘贴截图、拖拽文件，自动以 Base64 内联，无需图床
- **代码高亮**（highlight.js）、**数学公式**（KaTeX）、**任务列表**等富文本支持
- **草稿自动备份**到当前浏览器标签页（sessionStorage），关闭即清除，保护隐私

## 技术栈

React 19 · Vite · TypeScript · Tailwind CSS · marked · highlight.js · KaTeX

## 本地开发

```bash
npm install
npm run dev      # 本地预览 http://localhost:3000
npm run build    # 生产构建（产物输出至 dist/）
npm run test     # 运行单元测试
npm run lint     # 代码检查
```
