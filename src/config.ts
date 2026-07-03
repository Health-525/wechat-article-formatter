// ============================================================
// Site Configuration - Markdown to WeChat Article Formatter
// ============================================================

// --- Site ---

export interface SiteConfig {
  language: string
  brandName: string
}

export const siteConfig: SiteConfig = {
  language: "zh-CN",
  brandName: "墨排",
}

// --- Navigation ---

export interface NavigationConfig {
  menuLabel: string
  closeLabel: string
  fullscreenMenuLinks: { label: string; target: string }[]
  menuSideInfo: string[]
}

export const navigationConfig: NavigationConfig = {
  menuLabel: "菜单",
  closeLabel: "关闭",
  fullscreenMenuLinks: [
    { label: "开始排版", target: "hero" },
    { label: "如何使用", target: "consciousness" },
    { label: "主题风格", target: "waves-gallery" },
    { label: "立即体验", target: "lighthouse" },
    { label: "关于我们", target: "footer" },
  ],
  menuSideInfo: [
    "MARKDOWN TO WECHAT",
    "VERSION 2.0",
    "2025 PRODUCTION",
  ],
}

// --- Hero Room Gallery ---

export interface RoomConfig {
  name: string
  className: string
  theme: "light" | "dark"
  images: {
    back: string[]
    left: string[]
    right: string[]
  }
}

export interface HeroConfig {
  mainTitle: string
  rooms: RoomConfig[]
  metaLines: string[]
}

export const heroConfig: HeroConfig = {
  mainTitle: "墨排",
  rooms: [
    {
      name: "极简工作室",
      className: "room--monk",
      theme: "light",
      images: {
        back: ["images/rooms/room1-back.jpg"],
        left: ["images/rooms/room1-back.jpg"],
        right: ["images/rooms/room1-back.jpg"],
      },
    },
    {
      name: "深夜编辑器",
      className: "room--lighthouse",
      theme: "dark",
      images: {
        back: ["images/rooms/room2-back.jpg"],
        left: ["images/rooms/room2-back.jpg"],
        right: ["images/rooms/room2-back.jpg"],
      },
    },
    {
      name: "杂志编辑部",
      className: "room--orlando",
      theme: "light",
      images: {
        back: ["images/rooms/room3-back.jpg"],
        left: ["images/rooms/room3-back.jpg"],
        right: ["images/rooms/room3-back.jpg"],
      },
    },
    {
      name: "创意写作间",
      className: "room--waves",
      theme: "dark",
      images: {
        back: ["images/rooms/room4-back.jpg"],
        left: ["images/rooms/room4-back.jpg"],
        right: ["images/rooms/room4-back.jpg"],
      },
    },
  ],
  metaLines: [
    "Markdown 转公众号排版工具",
    "一键生成 · 精美主题 · 实时预览",
  ],
}

// --- Particle Sculpture (How to Use) ---

export interface ParticleConfig {
  sectionLabel: string
  title: string
  paragraphs: string[]
  quote: string
}

export const particleConfig: ParticleConfig = {
  sectionLabel: "02 / 使用指南",
  title: "三步完成精美排版",
  paragraphs: [
    "<strong>第一步：导入 Markdown</strong> — 将您的 Markdown 文件直接粘贴到编辑器中，或点击上传按钮选择 .md 文件。支持完整的 Markdown 语法，包括标题、列表、代码块、引用、表格等。",
    "<strong>第二步：选择主题风格</strong> — 我们提供六种精心设计的公众号排版主题，从极简白到深夜模式，从文艺清新到商务专业，总有一款适合您的内容调性。",
    "<strong>第三步：复制到公众号</strong> — 点击复制按钮，将渲染好的 HTML 直接粘贴到微信公众号编辑器中。所有样式已内联，无需额外调整，即刻发布。",
  ],
  quote: "让每一篇文章，都拥有出版级的排版品质",
}

// --- Lighthouse Video (Editor Showcase) ---

export interface LighthouseVideoConfig {
  sectionLabel: string
  dataPoints: string[]
  description: string
  videoPath: string
}

export const lighthouseVideoConfig: LighthouseVideoConfig = {
  sectionLabel: "功能亮点",
  dataPoints: [
    "支持标准 Markdown 全语法解析",
    "六种精美主题一键切换",
    "代码高亮 · 表格渲染 · 数学公式",
    "自动适配公众号图片尺寸",
  ],
  description: "无需注册，打开即用，让排版回归内容本身",
  videoPath: "",
}

// --- Waves Video ---

export interface WavesVideoConfig {
  sectionLabel: string
  title: string
  ctaText: string
  videoPath: string
}

export const wavesVideoConfig: WavesVideoConfig = {
  sectionLabel: "05 / 开始创作",
  title: "专注内容，交给我们来排版",
  ctaText: "立即开始排版",
  videoPath: "",
}

// --- Image Gallery ---

export interface GalleryItem {
  src: string
  caption: string
  description: string
}

export interface GalleryConfig {
  sectionLabel: string
  sectionTitle: string
  items: GalleryItem[]
  lightboxCloseHint: string
}

export const galleryConfig: GalleryConfig = {
  sectionLabel: "04 / 主题风格",
  sectionTitle: "精选排版主题",
  items: [
    {
      src: "images/gallery/style1.jpg",
      caption: "极简白",
      description: "大量留白，黑色细线分隔，优雅衬线字体标题。适合长文阅读、严肃内容、学术分享。",
    },
    {
      src: "images/gallery/style2.jpg",
      caption: "深夜模式",
      description: "深色背景配白色文字，代码块高亮显示。适合技术文章、开发者博客、编程教程。",
    },
    {
      src: "images/gallery/style3.jpg",
      caption: "杂志风",
      description: "大标题配精美配图，引用块设计，多栏布局。适合时尚、生活方式、品牌故事。",
    },
    {
      src: "images/gallery/style4.jpg",
      caption: "文艺清新",
      description: "淡绿色调，手写字体元素，植物装饰边框。适合散文、诗歌、生活感悟。",
    },
    {
      src: "images/gallery/style5.jpg",
      caption: "商务专业",
      description: "蓝色调，数据图表展示，结构化列表。适合行业报告、数据分析、商业洞察。",
    },
    {
      src: "images/gallery/style6.jpg",
      caption: "复古中式",
      description: "宣纸质感背景，竖排文字元素，红色印章点缀。适合文化、历史、传统美学内容。",
    },
    {
      src: "images/gallery/style1.jpg",
      caption: "简约灰",
      description: "灰色主调配橙色点缀，现代简洁。适合产品说明、使用教程、FAQ文档。",
    },
    {
      src: "images/gallery/style3.jpg",
      caption: "温暖橙",
      description: "暖橙色调，圆润卡片设计，亲和力强。适合美食、旅行、亲子内容。",
    },
    {
      src: "images/gallery/style5.jpg",
      caption: "科技蓝",
      description: "深蓝渐变背景，霓虹光效，未来感十足。适合AI、区块链、前沿科技内容。",
    },
  ],
  lightboxCloseHint: "按 Esc 或点击外部关闭",
}

// --- Footer ---

export interface FooterLinkColumn {
  heading: string
  links: string[]
}

export interface FooterConfig {
  linkColumns: FooterLinkColumn[]
  tickerWords: string[]
  copyright: string
}

export const footerConfig: FooterConfig = {
  linkColumns: [
    {
      heading: "排版主题",
      links: ["极简白", "深夜模式", "杂志风", "文艺清新", "商务专业", "复古中式"],
    },
    {
      heading: "支持功能",
      links: ["Markdown 解析", "代码高亮", "表格渲染", "图片自适应", "一键复制"],
    },
  ],
  tickerWords: ["MARKDOWN", "WECHAT", "EDITOR", "THEME", "ARTICLE", "COPY", "PASTE", "SHARE"],
  copyright: "© 2025 墨排 - Markdown to WeChat Formatter",
}
