<div align="center">

# 墨排 — Markdown 转微信公众号排版工具

[![Live Demo](https://img.shields.io/badge/在线体验-墨排-f25b29?style=for-the-badge)](https://health-525.github.io/wechat-article-formatter/)
[![GitHub](https://img.shields.io/badge/GitHub-仓库-181717?style=for-the-badge&logo=github)](https://github.com/Health-525/wechat-article-formatter)

**输入 Markdown，一键生成精美公众号排版。**

</div>

## ✨ 在线体验

👉 **[https://health-525.github.io/wechat-article-formatter/](https://health-525.github.io/wechat-article-formatter/)**

无需注册、打开即用。左侧写 Markdown，右侧实时预览，满意后一键复制到微信公众号编辑器。

## 🚀 核心功能

- **完整 Markdown 语法**：标题、段落、列表、表格、代码块、引用、图片、分隔线、链接等。
- **12 套精选主题**：极简留白、灰调雅致、新中式、莫兰迪文艺、潮流先锋、赛博霓虹、杂志画报、法式浪漫、温暖治愈、清新自然、商务蓝调、党政红金。
- **实时预览**：边写边看，排版效果一目了然。
- **Markdown 工具栏**：快速插入标题、粗体、斜体、引用、代码、链接、列表、表格、分隔线。
- **一键复制/导出**：复制带内联样式的 HTML 到公众号，或导出 `.html` 文件。
- **图片三种插入方式**：点击上传、粘贴截图、拖拽文件。图片自动以 Base64 嵌入。
- **文件导入**：支持 `.md`、`.markdown`、`.txt`。
- **自动保存**：编辑内容自动保存到浏览器本地，刷新不丢失。
- **全屏编辑**：沉浸式写作模式。
- **快捷键支持**：复制、加粗、斜体、快捷键帮助面板。

## 🛠 技术栈

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Marked**（Markdown 解析）
- **highlight.js**（代码高亮）
- **lucide-react**（图标）

## 📦 本地开发

源码位于 `source` 分支。

```bash
# 切换到源码分支
git checkout source

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 🚀 部署 workflow

本仓库使用 `main` 分支作为 GitHub Pages 部署分支，`source` 分支保存源码。

```bash
# 1. 在 source 分支开发、构建
git checkout source
npm install
npm run build

# 2. 将 dist 产物推送到 main 分支（示例）
git checkout main
cp -r dist/* .
git add -A
git commit -m "deploy: update site"
git push origin main
```

## 📁 分支说明

| 分支 | 用途 |
|------|------|
| `main` | GitHub Pages 部署分支，只包含构建产物 |
| `source` | 源码分支，包含 React + TypeScript 源码 |

## 📝 使用提示

- 图片建议使用 **Base64 嵌入**，避免公众号外链失效。
- 代码块会自动高亮，支持多种编程语言。
- 表格会渲染成带样式的 HTML 表格。
- 所有样式均为 **内联样式**，可直接粘贴到公众号编辑器。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。请在 `source` 分支上进行开发。

## 📄 许可证

MIT License
