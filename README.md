<div align="center">

# ✍️ 墨排 · Mopai

**Markdown 转微信公众号排版工具**

<p align="center">
  <a href="https://health-525.github.io/wechat-article-formatter/">
    <img src="https://img.shields.io/badge/🔗_在线体验-https://health--525.github.io/wechat--article--formatter/-f25b29?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo">
  </a>
  <a href="https://github.com/Health-525/wechat-article-formatter">
    <img src="https://img.shields.io/badge/📦_GitHub-Health--525/wechat--article--formatter-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

> 🎯 **输入 Markdown，一键生成精美公众号排版。**<br>
> 无需注册、打开即用，让每一篇文章都拥有出版级排版品质。

</div>

---

## 🎯 适用场景

- **公众号推文** — 技术、产品、运营、设计类长文一键排版
- **技术博客转载** — 把 Markdown 博文转换成微信可读样式
- **产品文档 / 教程** — 代码块、表格、图片清晰呈现
- **课程讲义 / 知识分享** — 多主题适配不同内容调性
- **企业内部周刊** — 统一品牌视觉，快速出稿

---

## 📸 预览

<p align="center">
  <a href="https://health-525.github.io/wechat-article-formatter/">
    <img src="docs/screenshot.png" alt="墨排编辑器预览" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://health-525.github.io/wechat-article-formatter/">
    <img src="https://img.shields.io/badge/👆_点击访问在线演示-f25b29?style=flat-square" alt="Preview">
  </a>
</p>

<div align="center">

| 编辑模式 | 实时预览 |
|:--:|:--:|
| 左侧 Markdown 编辑 + 工具栏 | 右侧公众号排版效果 |

</div>

---

## ✨ 核心特性

### 📝 编辑器体验

- **完整 Markdown 支持**：标题、段落、列表、表格、代码块、引用、图片、分隔线、链接、数学公式。
- **可视化工具栏**：快速插入标题、粗体、斜体、引用、代码、链接、列表、表格、分隔线。
- **LaTeX 数学公式**：支持 `$...$` 行内公式和 `$$...$$` 块级公式，基于 KaTeX 渲染。
- **快捷键**：`Ctrl/Cmd + B` 加粗、`Ctrl/Cmd + I` 斜体、`Ctrl/Cmd + Shift + C` 复制 HTML。
- **自动保存**：内容实时保存到浏览器本地，刷新不丢失。
- **全屏编辑**：沉浸式写作模式。

### 🎨 排版主题

内置 **12 套精选主题**，一键切换：

| 简约 | 文艺 | 潮流 | 时尚 | 治愈 | 商务 | 国风 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 极简留白 | 新中式 | 潮流先锋 | 杂志画报 | 温暖治愈 | 商务蓝调 | 党政红金 |
| 灰调雅致 | 莫兰迪文艺 | 赛博霓虹 | 法式浪漫 | 清新自然 | — | — |

### 📋 输出与分享

- **一键复制**：生成带内联样式的 HTML，直接粘贴到微信公众号编辑器。
- **导出 HTML**：下载 `.html` 文件，方便存档或二次编辑。
- **图片三种插入方式**：点击上传、粘贴截图、拖拽文件，自动 Base64 嵌入。
- **文件导入**：支持 `.md`、`.markdown`、`.txt`。

---

## 🚀 快速开始

### 在线使用（推荐）

👉 **[https://health-525.github.io/wechat-article-formatter/](https://health-525.github.io/wechat-article-formatter/)**

1. 在左侧输入或导入 Markdown
2. 从顶部选择喜欢的主题风格
3. 点击右上角「复制」按钮
4. 粘贴到微信公众号编辑器，直接发布

### 本地开发

> 源码位于 `source` 分支，部署产物位于 `main` 分支。

```bash
# 1. 克隆仓库
git clone https://github.com/Health-525/wechat-article-formatter.git
cd wechat-article-formatter

# 2. 切换到源码分支
git checkout source

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

打开 http://localhost:3000 即可使用。

---

## 🛠 技术栈

- **[React 19](https://react.dev/)** — UI 框架
- **[TypeScript](https://www.typescriptlang.org/)** — 类型安全
- **[Vite 7](https://vitejs.dev/)** — 构建工具
- **[Tailwind CSS 3](https://tailwindcss.com/)** — 原子化 CSS
- **[Marked](https://marked.js.org/)** — Markdown 解析
- **[highlight.js](https://highlightjs.org/)** — 代码高亮
- **[KaTeX](https://katex.org/)** — 数学公式渲染
- **[lucide-react](https://lucide.dev/)** — 图标库

---

## 📁 项目结构

```
src/
  components/
    EditorWorkspace.tsx      # 主编辑器（编辑、预览、工具栏、主题）
    ErrorBoundary.tsx        # 错误边界，防止渲染异常白屏
  utils/
    markdownParser.ts        # Markdown 解析 + 内联样式注入 + 剪贴板
    mathRenderer.ts          # LaTeX 数学公式提取与渲染
    katexCss.ts              # KaTeX 样式字符串（自动生成）
    themes.ts                # 12 套公众号排版主题
  App.tsx                    # 根组件
  main.tsx                   # React 入口
  index.css                  # 全局样式
public/
  favicon.ico                # 网站图标
  og-image.png               # 社交分享卡片封面
  apple-touch-icon.png       # iOS 主屏幕图标
  images/demo-article.jpg    # 示例图片
```

---

## 🚀 部署 workflow

本项目使用 GitHub Pages 托管，`main` 分支为部署分支，`source` 分支为源码分支。

```bash
# 1. 在 source 分支开发并构建
git checkout source
npm install
npm run build

# 2. 将 dist/ 产物推送到 main 分支
git checkout main
cp -r dist/* .
git add -A
git commit -m "deploy: update site"
git push origin main
```

GitHub Pages 会自动从 `main` 分支根目录部署。

---

## 🚀 即将上线

- [ ] 云端草稿同步 — 换设备也能继续写
- [ ] 模板市场 — 一键套用热门排版模板
- [ ] 团队协作 — 共享主题与草稿
- [ ] 导出 PDF / 长图 — 多平台分发更灵活
- [ ] 自定义主题 — 上传品牌色与字体配置

如果你有想要的功能，欢迎提 [Issue](https://github.com/Health-525/wechat-article-formatter/issues/new/choose) 告诉我们！

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 在 `source` 分支上创建特性分支：`git checkout -b feature/xxx`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/xxx`
5. 提交 Pull Request

---

## 📝 使用小贴士

- 💡 图片建议使用 **Base64 嵌入**，避免公众号外链失效。
- 💡 代码块会自动高亮，支持多种编程语言。
- 💡 表格会渲染成带样式的 HTML 表格。
- 💡 数学公式使用 `$...$`（行内）或 `$$...$$`（块级）语法，基于 KaTeX 渲染。
- 💡 所有样式均为 **内联样式**，可直接粘贴到公众号编辑器。
- 💡 复制到微信公众号后，建议检查公式显示效果；如样式异常，可导出 HTML 文件备用。

---

## 📄 许可证

[MIT](LICENSE) © 2025 墨排

---

<div align="center">

## 💖 喜欢墨排？

如果这个项目帮到了你，欢迎 **⭐ Star**、**🍴 Fork** 或 **分享给朋友**！

你的每一次传播，都是对我们最大的支持。

<a href="https://github.com/Health-525/wechat-article-formatter/stargazers">
  <img src="https://img.shields.io/github/stars/Health-525/wechat-article-formatter?style=social" alt="GitHub Stars">
</a>

</div>
