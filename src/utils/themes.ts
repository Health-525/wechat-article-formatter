// ============================================================
// 12 WeChat Article Themes — Design System v3.0
//
// Design tokens + createTheme builder for consistency.
// WeChat-safe rules:
//   - All styles inline, <section> container
//   - No position/transform/animation/clip-path
//   - No negative margins on images
//   - No display:inline-block on headings
//   - No linear-gradient on inline emphasis (strong/em)
//   - Lists keep visible bullets/numbers
// ============================================================

export interface Theme {
  id: string
  name: string
  description: string
  previewBg: string
  category: string
  accent: string
  headingNumberStyle?: "plain" | "badge" | "outline"
  styles: ThemeStyles
}

export interface ThemeStyles {
  container: string
  title: string
  subtitle: string
  h1: string
  h2: string
  h3: string
  paragraph: string
  blockquote: string
  code: string
  codeBlock: string
  pre: string
  ul: string
  ol: string
  li: string
  strong: string
  em: string
  a: string
  img: string
  table: string
  th: string
  td: string
  hr: string
}

// ─── Font stacks ───
const SANS = "-apple-system,BlinkMacSystemFont,'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif"
const SERIF = "'Noto Serif SC','Songti SC','STSong',Georgia,'SimSun',serif"
const MONO = "'SF Mono',Monaco,'Source Code Pro','Fira Code','Cascadia Code',monospace"

// ─── Typography tokens ───
const BASE = {
  fontSize: 16,
  lineHeight: 1.8,
  letterSpacing: 0.5,
  paragraphGap: 16,
  headingGapTop: 32,
  headingGapBottom: 12,
  wordBreak: "word-break:break-word;",
}

// ─── Width presets ───
const WIDTH = {
  narrow: 600,
  normal: 680,
  wide: 720,
}

// ─── Radius presets ───
const RADIUS = {
  sharp: 2,
  soft: 6,
  round: 12,
  pill: 20,
}

// ─── Color helpers ───
function withAlpha(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "")
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r},${g},${b},${alpha})`
}

// ─── Theme builder ───
interface ThemeMeta {
  id: string
  name: string
  description: string
  previewBg: string
  category: string
  headingNumberStyle?: "plain" | "badge" | "outline"
}

interface ThemeTokens {
  width: number
  bg: string
  text: string
  textHeading: string
  textSecondary: string
  accent: string
  surface: string
  border: string
  link: string
  codeBg: string
  codeText: string
  codeInlineBg: string
  codeInlineText: string
  fontBody: "sans" | "serif"
  fontHeading: "sans" | "serif" | "mono"
  headingAlign?: "left" | "center"
  bodySize?: 14 | 15 | 16
  lineHeight?: 1.75 | 1.8 | 1.85 | 1.9 | 2.0
  letterSpacing?: number
  paragraphGap?: number
  radius?: number
  indent?: boolean
  justify?: boolean
  uppercase?: boolean
}

function createTheme(
  meta: ThemeMeta,
  tokens: ThemeTokens,
  overrides: Partial<ThemeStyles> = {}
): Theme {
  const {
    width,
    bg,
    text,
    textHeading,
    textSecondary,
    accent,
    surface,
    border,
    link,
    codeBg,
    codeText,
    codeInlineBg,
    codeInlineText,
    fontBody,
    fontHeading,
    headingAlign = "left",
    bodySize = BASE.fontSize,
    lineHeight = BASE.lineHeight,
    letterSpacing = BASE.letterSpacing,
    paragraphGap = BASE.paragraphGap,
    radius = RADIUS.soft,
    indent = false,
    justify = false,
    uppercase = false,
  } = tokens

  const fontBodyStack = fontBody === "serif" ? SERIF : SANS
  const headingTextTransform = uppercase ? "text-transform:uppercase;" : ""
  const headingLetterSpacing = uppercase ? "letter-spacing:1px;" : "letter-spacing:0.3px;"
  const align = headingAlign === "center" ? "text-align:center;" : ""

  const headingFont =
    fontHeading === "serif"
      ? `font-family:${SERIF};`
      : fontHeading === "mono"
        ? `font-family:${MONO};`
        : ""

  const baseParagraph = `margin:${paragraphGap}px 0;color:${text};line-height:${lineHeight};font-size:${bodySize}px;${indent ? "text-indent:2em;" : ""}${justify ? "text-align:justify;" : ""}`

  const styles: ThemeStyles = {
    container: `max-width:${width}px;margin:0 auto;padding:${width >= 680 ? 32 : 24}px 16px 40px;background:${bg};font-family:${fontBodyStack};color:${text};font-size:${bodySize}px;line-height:${lineHeight};letter-spacing:${letterSpacing}px;${BASE.wordBreak}`,

    title: `font-size:${width >= 680 ? 22 : 20}px;font-weight:700;color:${textHeading};line-height:1.3;margin-bottom:8px;${headingLetterSpacing}${headingFont}${align}`,

    subtitle: `font-size:12px;color:${textSecondary};margin-bottom:32px;padding-bottom:12px;border-bottom:1px solid ${border};${headingFont}${align}`,

    h1: `font-size:18px;font-weight:700;color:${textHeading};margin:${BASE.headingGapTop}px 0 ${BASE.headingGapBottom}px;padding-bottom:10px;border-bottom:2px solid ${accent};line-height:1.4;${headingLetterSpacing}${headingFont}${align}${headingTextTransform}`,

    h2: `font-size:16px;font-weight:700;color:${textHeading};margin:26px 0 10px;padding-left:${headingAlign === "center" ? 0 : 12}px;${headingAlign === "center" ? "" : `border-left:3px solid ${accent};`}line-height:1.4;${headingLetterSpacing}${headingFont}${align}${headingTextTransform}`,

    h3: `font-size:15px;font-weight:700;color:${accent};margin:20px 0 8px;line-height:1.4;${headingLetterSpacing}${headingFont}${align}${headingTextTransform}`,

    paragraph: baseParagraph,

    blockquote: `margin:22px 0;padding:14px 16px;background:${surface};border-left:3px solid ${accent};color:${textSecondary};font-size:14px;line-height:1.85;border-radius:0 ${radius}px ${radius}px 0;font-style:italic;${fontBody === "serif" ? `font-family:${SERIF};` : ""}`,

    code: `background:${codeInlineBg};padding:1px 5px;border-radius:${Math.max(2, radius - 2)}px;font-family:${MONO};font-size:13px;color:${codeInlineText};border:1px solid ${border};`,

    codeBlock: `background:${codeBg};color:${codeText};padding:16px;border-radius:${radius}px;overflow-x:auto;font-family:${MONO};font-size:12px;line-height:1.75;margin:20px 0;`,

    pre: `margin:20px 0;overflow-x:auto;border-radius:${radius}px;`,

    ul: `margin:${paragraphGap}px 0;padding-left:22px;list-style:disc;`,

    ol: `margin:${paragraphGap}px 0;padding-left:22px;`,

    li: `margin:8px 0;color:${text};line-height:${lineHeight};font-size:${bodySize}px;`,

    strong: `font-weight:700;color:${textHeading};background:${withAlpha(accent, 0.12)};padding:1px 5px;border-radius:${Math.max(2, radius - 2)}px;`,

    em: `font-style:italic;color:${textSecondary};${fontBody === "serif" ? `font-family:${SERIF};` : ""}`,

    a: `color:${link};text-decoration:none;border-bottom:1px solid ${link};font-weight:600;`,

    img: `max-width:100%;height:auto;display:block;margin:20px auto;border-radius:${radius}px;`,

    table: `width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;border:1px solid ${border};background:${bg};`,

    th: `padding:10px 12px;background:${surface};border-bottom:2px solid ${accent};text-align:left;font-weight:700;color:${textHeading};font-size:12px;${headingFont}`,

    td: `padding:10px 12px;border-bottom:1px solid ${border};color:${text};`,

    hr: `border:none;height:1px;background:${border};margin:32px 0;`,
  }

  return {
    ...meta,
    accent,
    headingNumberStyle: meta.headingNumberStyle,
    styles: { ...styles, ...overrides },
  }
}

// ═══════════════════════════════════════════════════════════
//  01 极简留白 — 冷淡克制，细线，黄标高亮
// ═══════════════════════════════════════════════════════════
const t01 = createTheme(
  {
    id: "minimal-white",
    name: "极简留白",
    description: "冷淡克制",
    previewBg: "#ffffff",
    category: "简约",
  },
  {
    width: WIDTH.wide,
    bg: "#ffffff",
    text: "#3f3f3f",
    textHeading: "#1a1a1a",
    textSecondary: "#888888",
    accent: "#1a1a1a",
    surface: "#fafafa",
    border: "#e8e8e8",
    link: "#1890ff",
    codeBg: "#f5f5f7",
    codeText: "#2c2c2e",
    codeInlineBg: "#f5f5f7",
    codeInlineText: "#d4380d",
    fontBody: "sans",
    fontHeading: "sans",
    lineHeight: 1.8,
    radius: RADIUS.sharp,
  },
  {
    h1: "font-size:18px;font-weight:700;color:#1a1a1a;margin:32px 0 12px;padding-bottom:8px;border-bottom:1.5px solid #1a1a1a;line-height:1.4;letter-spacing:0.3px;",
    h2: "font-size:16px;font-weight:700;color:#333333;margin:26px 0 10px;padding-left:10px;border-left:2px solid #999999;line-height:1.4;letter-spacing:0.3px;",
    strong: "font-weight:700;color:#1a1a1a;background:#fff3b0;padding:1px 5px;border-radius:2px;",
    hr: "border:none;height:1px;background:#e0e0e0;margin:32px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  02 灰调雅致 — 更宽、更疏朗，蓝灰渐变高亮
// ═══════════════════════════════════════════════════════════
const t02 = createTheme(
  {
    id: "gray-elegant",
    name: "灰调雅致",
    description: "专业沉稳",
    previewBg: "#f7f8fa",
    category: "简约",
  },
  {
    width: WIDTH.wide,
    bg: "#f7f8fa",
    text: "#3f3f3f",
    textHeading: "#1a202c",
    textSecondary: "#718096",
    accent: "#4a5568",
    surface: "#edf2f7",
    border: "#d0dce8",
    link: "#2980b9",
    codeBg: "#1a202c",
    codeText: "#e2e8f0",
    codeInlineBg: "#edf2f7",
    codeInlineText: "#c53030",
    fontBody: "sans",
    fontHeading: "sans",
    lineHeight: 1.85,
    radius: RADIUS.soft,
  },
  {
    subtitle: "font-size:13px;color:#718096;margin-bottom:36px;padding-bottom:14px;border-bottom:2px solid #cbd5e0;",
    h1: "font-size:18px;font-weight:700;color:#1a202c;margin:32px 0 12px;padding-bottom:10px;border-bottom:3px solid #4a5568;line-height:1.4;letter-spacing:0.3px;",
    h3: "font-size:15px;font-weight:700;color:#4a5568;margin:20px 0 8px;padding:6px 12px;background:#edf2f7;border-radius:4px;line-height:1.4;letter-spacing:0.3px;",
    strong: "font-weight:700;color:#1a202c;background:#bee3f8;padding:1px 5px;border-radius:2px;",
    hr: "border:0;border-top:2px dashed #cbd5e0;height:0;margin:36px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  03 新中式 — 东方气韵，宣纸感，首行缩进
// ═══════════════════════════════════════════════════════════
const t03 = createTheme(
  {
    id: "neo-chinese",
    name: "新中式",
    description: "东方气韵",
    previewBg: "#f9f6f1",
    category: "文艺",
    headingNumberStyle: "outline",
  },
  {
    width: WIDTH.narrow,
    bg: "#f9f6f1",
    text: "#4a3728",
    textHeading: "#5c3d2e",
    textSecondary: "#8b7355",
    accent: "#a67c52",
    surface: "#f0ebe3",
    border: "#e0d5c7",
    link: "#8b4513",
    codeBg: "#3d2b1f",
    codeText: "#efebe9",
    codeInlineBg: "#f0ebe3",
    codeInlineText: "#8b4513",
    fontBody: "serif",
    fontHeading: "serif",
    headingAlign: "center",
    bodySize: 16,
    lineHeight: 2.0,
    letterSpacing: 1,
    paragraphGap: 16,
    radius: RADIUS.sharp,
    indent: true,
    justify: false,
  },
  {
    title: "font-size:24px;font-weight:700;color:#2c1810;line-height:1.4;margin-bottom:12px;text-align:center;letter-spacing:4px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:13px;color:#a08b76;text-align:center;margin-bottom:40px;letter-spacing:3px;font-family:'PingFang SC',sans-serif;",
    h1: "font-size:20px;font-weight:700;color:#5c3d2e;margin:40px 0 14px;padding-bottom:10px;border-bottom:2px solid #a67c52;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:17px;font-weight:700;color:#6b4423;margin:30px 0 12px;padding:10px 16px;background:#f0ebe3;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    h3: "font-size:16px;font-weight:700;color:#7a5c3c;margin:20px 0 8px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    blockquote: "margin:26px 0;padding:16px 18px;background:#f0ebe3;border-left:4px solid #a67c52;color:#5c3d2e;font-size:15px;line-height:2.0;border-radius:0 2px 2px 0;font-style:italic;font-family:'Noto Serif SC',serif;text-align:center;",
    strong: "font-weight:700;color:#2c1810;background:#e8d4b8;padding:1px 5px;border-radius:2px;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;border:1px solid #d4c5a0;background:#fdfbf7;",
    th: "padding:12px 14px;background:#f0ebe3;border-bottom:2px solid #a67c52;text-align:center;font-weight:700;color:#5c3d2e;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:1px;",
    td: "padding:12px 14px;border-bottom:1px solid #e8ddd0;color:#4a3728;text-align:center;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 10px,#c4b5a5 10px,#c4b5a5 20px,transparent 20px,transparent 30px);margin:36px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  04 莫兰迪文艺 — 低饱和温柔，大圆角
// ═══════════════════════════════════════════════════════════
const t04 = createTheme(
  {
    id: "morandi-art",
    name: "莫兰迪文艺",
    description: "低饱和温柔",
    previewBg: "#f0ece6",
    category: "文艺",
  },
  {
    width: WIDTH.normal,
    bg: "#f0ece6",
    text: "#4a4038",
    textHeading: "#5a4038",
    textSecondary: "#8b7d6e",
    accent: "#a89080",
    surface: "#e4dbd0",
    border: "#d4c8ba",
    link: "#8b5e3c",
    codeBg: "#e4dbd0",
    codeText: "#4a4038",
    codeInlineBg: "#e4dbd0",
    codeInlineText: "#8b5e3c",
    fontBody: "serif",
    fontHeading: "serif",
    headingAlign: "center",
    lineHeight: 1.9,
    radius: RADIUS.round,
    justify: false,
  },
  {
    title: "font-size:24px;font-weight:400;color:#4a4038;line-height:1.3;margin-bottom:10px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;font-style:italic;",
    subtitle: "font-size:12px;color:#8b7d6e;text-align:center;margin-bottom:36px;letter-spacing:2px;font-family:'PingFang SC',sans-serif;border-top:1px solid #d4c8ba;border-bottom:1px solid #d4c8ba;padding:10px 0;",
    h1: "font-size:18px;font-weight:600;color:#5a4038;margin:36px 0 12px;padding-bottom:10px;border-bottom:1px solid #a89080;text-align:center;font-style:italic;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:600;color:#6a5040;margin:26px 0 10px;padding:10px 18px;background:#e4dbd0;border-radius:12px;text-align:center;letter-spacing:0.5px;font-family:'Noto Serif SC','Songti SC',serif;",
    h3: "font-size:15px;font-weight:600;color:#7a6050;margin:18px 0 8px;padding:6px 14px;background:#e4dbd0;border-radius:8px;text-align:center;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    blockquote: "margin:22px 0;padding:16px 20px;background:#e4dbd0;border-left:4px solid #a89080;color:#5a4038;font-size:14px;line-height:1.9;border-radius:0 12px 12px 0;font-style:italic;font-family:'Noto Serif SC',serif;",
    strong: "font-weight:700;color:#4a4038;background:#d8c8b8;padding:1px 6px;border-radius:4px;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:12px;border:6px solid #e4dbd0;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,#c4b0a0 8px,#c4b0a0 16px,transparent 16px,transparent 24px);margin:32px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  05 潮流先锋 — 街头态度，红色冲击
// ═══════════════════════════════════════════════════════════
const t05 = createTheme(
  {
    id: "street-hype",
    name: "潮流先锋",
    description: "街头态度",
    previewBg: "#0a0a0a",
    category: "潮流",
    headingNumberStyle: "badge",
  },
  {
    width: WIDTH.wide,
    bg: "#0a0a0a",
    text: "#d0d0d0",
    textHeading: "#ffffff",
    textSecondary: "#888888",
    accent: "#ff3333",
    surface: "#141414",
    border: "#333333",
    link: "#ff3333",
    codeBg: "#141414",
    codeText: "#e8e8e8",
    codeInlineBg: "#141414",
    codeInlineText: "#ff3333",
    fontBody: "sans",
    fontHeading: "sans",
    bodySize: 14,
    lineHeight: 1.75,
    paragraphGap: 10,
    radius: RADIUS.sharp,
    uppercase: true,
  },
  {
    title: "font-size:24px;font-weight:900;color:#ffffff;line-height:1.15;margin-bottom:6px;text-transform:uppercase;font-style:italic;letter-spacing:-0.5px;",
    subtitle: "font-size:11px;color:#666666;margin-bottom:28px;font-weight:500;letter-spacing:2px;text-transform:uppercase;border-left:3px solid #ff3333;padding-left:10px;",
    h1: "font-size:18px;font-weight:900;color:#ffffff;margin:32px 0 10px;padding-bottom:8px;border-bottom:3px solid #ff3333;text-transform:uppercase;letter-spacing:1px;",
    h2: "font-size:14px;font-weight:800;color:#ffffff;margin:22px 0 8px;padding-left:10px;border-left:4px solid #ff3333;text-transform:uppercase;letter-spacing:0.5px;",
    h3: "font-size:12px;font-weight:800;color:#ff3333;margin:14px 0 6px;text-transform:uppercase;letter-spacing:1px;",
    blockquote: "margin:18px 0;padding:12px 14px;background:#141414;border-left:4px solid #ff3333;color:#dddddd;font-size:13px;line-height:1.8;font-weight:600;",
    code: "background:#141414;padding:1px 5px;border-radius:2px;font-family:'SF Mono',Monaco,monospace;font-size:12px;color:#ff3333;font-weight:700;border:1px solid #333333;",
    codeBlock: "background:#141414;color:#e8e8e8;padding:14px;border-radius:4px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:11px;line-height:1.65;margin:14px 0;border:1px solid #333333;",
    pre: "margin:14px 0;overflow-x:auto;border-radius:4px;",
    ul: "margin:10px 0;padding-left:16px;list-style:square;",
    ol: "margin:10px 0;padding-left:16px;",
    li: "margin:6px 0;color:#d0d0d0;line-height:1.75;font-size:14px;",
    strong: "font-weight:900;color:#ffffff;background:#ff3333;padding:2px 6px;border-radius:2px;font-style:italic;",
    img: "max-width:100%;height:auto;display:block;margin:14px auto;border-radius:2px;border:1px solid #222222;",
    table: "width:100%;border-collapse:collapse;margin:14px 0;font-size:12px;border:1px solid #333333;background:#111111;",
    th: "padding:10px 12px;background:#000000;border-bottom:2px solid #ff3333;text-align:left;font-weight:800;color:#ffffff;font-size:11px;text-transform:uppercase;letter-spacing:1px;",
    td: "padding:10px 12px;border-bottom:1px solid #333333;color:#d0d0d0;",
    hr: "border:none;height:3px;background:#ff3333;margin:24px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  06 赛博霓虹 — 未来科技，绿色霓虹
// ═══════════════════════════════════════════════════════════
const t06 = createTheme(
  {
    id: "cyber-neon",
    name: "赛博霓虹",
    description: "未来科技",
    previewBg: "#060a10",
    category: "潮流",
    headingNumberStyle: "badge",
  },
  {
    width: WIDTH.wide,
    bg: "#060a10",
    text: "#b0c4de",
    textHeading: "#00ff88",
    textSecondary: "#5a7a6a",
    accent: "#00ff88",
    surface: "#0a1a12",
    border: "#1e2830",
    link: "#00ff88",
    codeBg: "#0c1418",
    codeText: "#b0c4de",
    codeInlineBg: "#0a1a12",
    codeInlineText: "#00ff88",
    fontBody: "sans",
    fontHeading: "mono",
    lineHeight: 1.85,
    letterSpacing: 0.8,
    radius: RADIUS.soft,
  },
  {
    title: "font-size:22px;font-weight:800;color:#00ff88;line-height:1.2;margin-bottom:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;background:#0a1a12;padding:10px 16px;border-radius:4px;",
    subtitle: "font-size:12px;color:#5a7a6a;margin-bottom:32px;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;border-left:2px solid #00ff88;padding-left:12px;",
    h1: "font-size:17px;font-weight:800;color:#00ff88;margin:32px 0 12px;padding:10px 0;border-bottom:1px solid #00ff88;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;background:#0a1a12;padding-left:12px;border-radius:4px;",
    h2: "font-size:14px;font-weight:700;color:#e0f0e8;margin:24px 0 10px;padding:8px 12px;border-left:3px solid #00ff88;background:#0a1a12;font-family:'SF Mono',Monaco,monospace;letter-spacing:1px;border-radius:4px;",
    h3: "font-size:12px;font-weight:700;color:#00ff88;margin:16px 0 6px;text-transform:uppercase;font-family:'SF Mono',Monaco,monospace;letter-spacing:3px;",
    blockquote: "margin:22px 0;padding:14px 16px;background:#0a1a12;border:1px solid #00ff88;border-left:3px solid #00ff88;color:#c0d0c8;font-size:14px;line-height:1.85;border-radius:0 6px 6px 0;",
    strong: "font-weight:800;color:#00ff88;background:#0a1a12;padding:2px 6px;border-radius:2px;font-family:'SF Mono',Monaco,monospace;font-size:14px;",
    a: "color:#00ff88;text-decoration:none;border-bottom:1px solid #00ff88;font-weight:700;font-family:'SF Mono',Monaco,monospace;",
    img: "max-width:100%;height:auto;display:block;margin:18px auto;border-radius:2px;border:1px solid #1e2830;",
    table: "width:100%;border-collapse:collapse;margin:18px 0;font-size:13px;border:1px solid #1e2830;background:#0c1418;",
    th: "padding:10px 12px;background:#060a10;border-bottom:1px solid #00ff88;text-align:left;font-weight:800;color:#00ff88;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-family:'SF Mono',Monaco,monospace;",
    td: "padding:10px 12px;border-bottom:1px solid #1e2830;color:#b0c4de;",
    hr: "border:none;height:1px;background:#00ff88;margin:28px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  07 杂志画报 — 高级时尚，通栏图片
// ═══════════════════════════════════════════════════════════
const t07 = createTheme(
  {
    id: "magazine-editorial",
    name: "杂志画报",
    description: "高级时尚",
    previewBg: "#ffffff",
    category: "时尚",
    headingNumberStyle: "outline",
  },
  {
    width: WIDTH.narrow,
    bg: "#ffffff",
    text: "#3f3f3f",
    textHeading: "#1a1a1a",
    textSecondary: "#888888",
    accent: "#1a1a1a",
    surface: "#faf9f6",
    border: "#e8e8e8",
    link: "#1a1a1a",
    codeBg: "#1c1c1e",
    codeText: "#f5f5f7",
    codeInlineBg: "#f5f5f7",
    codeInlineText: "#8b008b",
    fontBody: "serif",
    fontHeading: "serif",
    headingAlign: "center",
    lineHeight: 2.0,
    radius: RADIUS.sharp,
    justify: false,
  },
  {
    title: "font-size:28px;font-weight:400;color:#1a1a1a;line-height:1.15;margin-bottom:12px;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;font-style:italic;",
    subtitle: "font-size:10px;color:#888888;text-align:center;margin-bottom:40px;letter-spacing:4px;text-transform:uppercase;font-family:'PingFang SC',sans-serif;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;padding:12px 0;",
    h1: "font-size:19px;font-weight:600;color:#1a1a1a;margin:36px 0 14px;padding-bottom:12px;border-bottom:1px solid #1a1a1a;text-align:center;font-style:italic;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:15px;font-weight:600;color:#1a1a1a;margin:26px 0 12px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;padding:0 16px;",
    h3: "font-size:11px;font-weight:600;color:#666666;margin:18px 0 8px;text-transform:uppercase;letter-spacing:3px;font-family:'PingFang SC',sans-serif;text-align:center;",
    blockquote: "margin:28px 0;padding:24px 28px;background:#faf9f6;color:#1a1a1a;font-size:15px;line-height:2.0;text-align:center;font-family:'Noto Serif SC','Songti SC',serif;font-style:italic;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;",
    strong: "font-weight:700;color:#1a1a1a;font-family:'Noto Serif SC','Songti SC',serif;",
    img: "max-width:100%;height:auto;display:block;margin:24px auto;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;border-top:2px solid #1a1a1a;border-bottom:2px solid #1a1a1a;",
    th: "padding:12px 10px;border-bottom:1px solid #1a1a1a;text-align:center;font-weight:600;font-family:'Noto Serif SC',serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;",
    td: "padding:12px 10px;border-bottom:1px solid #e0e0e0;text-align:center;",
    hr: "border:none;height:1px;background:#e8e8e8;margin:36px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  08 法式浪漫 — 优雅轻奢，虚线装饰
// ═══════════════════════════════════════════════════════════
const t08 = createTheme(
  {
    id: "french-romance",
    name: "法式浪漫",
    description: "优雅轻奢",
    previewBg: "#fdf8f5",
    category: "时尚",
  },
  {
    width: WIDTH.normal,
    bg: "#fdf8f5",
    text: "#4a4038",
    textHeading: "#3d2b1f",
    textSecondary: "#8b6d4f",
    accent: "#c4956a",
    surface: "#f5ebe0",
    border: "#e0d0c0",
    link: "#a0522d",
    codeBg: "#f5ebe0",
    codeText: "#3d2b1f",
    codeInlineBg: "#f5ebe0",
    codeInlineText: "#a0522d",
    fontBody: "serif",
    fontHeading: "serif",
    headingAlign: "center",
    lineHeight: 2.0,
    radius: RADIUS.sharp,
    justify: false,
  },
  {
    title: "font-size:24px;font-weight:400;color:#3d2b1f;line-height:1.35;margin-bottom:12px;text-align:center;letter-spacing:3px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:12px;color:#8b6d4f;text-align:center;margin-bottom:36px;font-style:italic;letter-spacing:2px;",
    h1: "font-size:18px;font-weight:600;color:#5a3d2b;margin:36px 0 12px;padding:14px 0;border-bottom:1px dashed #c4956a;border-top:1px dashed #c4956a;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:15px;font-weight:600;color:#6a4d3b;margin:26px 0 10px;padding:12px 20px;background:#f5ebe0;border:1px dashed #d4b896;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    h3: "font-size:14px;font-weight:600;color:#8b6d4f;margin:18px 0 8px;padding:6px 16px;background:#f5ebe0;border:1px dashed #d4b896;text-align:center;letter-spacing:0.5px;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    blockquote: "margin:24px 0;padding:16px 22px;background:#f5ebe0;border:1px dashed #c4956a;color:#5a3d2b;font-size:14px;line-height:2.0;border-radius:2px;font-style:italic;font-family:'Noto Serif SC',serif;text-align:center;",
    strong: "font-weight:700;color:#3d2b1f;background:#e8c8a0;padding:1px 6px;border-radius:2px;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border:1px dashed #d4b896;padding:6px;background:#f5ebe0;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,#c4956a 8px,#c4956a 16px,transparent 16px,transparent 24px);margin:32px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  09 温暖治愈 — 奶油暖调，大圆角
// ═══════════════════════════════════════════════════════════
const t09 = createTheme(
  {
    id: "warm-healing",
    name: "温暖治愈",
    description: "奶油暖调",
    previewBg: "#faf6f0",
    category: "治愈",
  },
  {
    width: WIDTH.normal,
    bg: "#faf6f0",
    text: "#3f3f3f",
    textHeading: "#3d3229",
    textSecondary: "#8b7d6b",
    accent: "#c75c2e",
    surface: "#f0e8da",
    border: "#e0d4c4",
    link: "#c75c2e",
    codeBg: "#f0e8da",
    codeText: "#3d3229",
    codeInlineBg: "#f0e8da",
    codeInlineText: "#c75c2e",
    fontBody: "sans",
    fontHeading: "sans",
    headingAlign: "center",
    lineHeight: 1.9,
    radius: RADIUS.pill,
  },
  {
    title: "font-size:22px;font-weight:700;color:#3d3229;line-height:1.45;margin-bottom:10px;text-align:center;letter-spacing:1px;background:#f0e8da;padding:12px 20px;border-radius:16px;",
    subtitle: "font-size:12px;color:#8b7d6b;text-align:center;margin-bottom:32px;font-style:italic;letter-spacing:1px;",
    h1: "font-size:17px;font-weight:700;color:#5c4b37;margin:32px 0 12px;padding:14px 18px;background:#f0e8da;line-height:1.45;border-radius:16px;text-align:center;",
    h2: "font-size:15px;font-weight:700;color:#7a6b5d;margin:24px 0 10px;padding:10px 14px;background:#f0e8da;border-radius:12px;text-align:center;border-bottom:2px dashed #e0d4c4;",
    h3: "font-size:14px;font-weight:700;color:#8b7d6b;margin:16px 0 6px;padding:6px 14px;background:#f0e8da;text-align:center;border-radius:20px;",
    blockquote: "margin:22px 0;padding:14px 18px;background:#f0e8da;color:#7a6b5d;font-size:14px;line-height:1.9;border-radius:20px;font-style:italic;",
    strong: "font-weight:700;color:#3d3229;background:#f0e8da;padding:2px 8px;border-radius:8px;border:1px solid #e0d4c4;",
    img: "max-width:100%;height:auto;display:block;margin:18px auto;border-radius:16px;border:2px solid #e0d4c4;",
    hr: "border:none;height:2px;background:repeating-linear-gradient(90deg,#e0d4c4,#e0d4c4 8px,transparent 8px,transparent 16px);margin:28px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  10 清新自然 — 绿意盎然，呼吸感
// ═══════════════════════════════════════════════════════════
const t10 = createTheme(
  {
    id: "fresh-nature",
    name: "清新自然",
    description: "绿意盎然",
    previewBg: "#f2f7f0",
    category: "治愈",
  },
  {
    width: WIDTH.normal,
    bg: "#f2f7f0",
    text: "#3f3f3f",
    textHeading: "#1a3c2a",
    textSecondary: "#5a8a5a",
    accent: "#2d8a4a",
    surface: "#d8e8d4",
    border: "#c0d8c0",
    link: "#2d8a4a",
    codeBg: "#d8e8d4",
    codeText: "#1a3c2a",
    codeInlineBg: "#d8e8d4",
    codeInlineText: "#1a3c2a",
    fontBody: "sans",
    fontHeading: "sans",
    headingAlign: "center",
    lineHeight: 1.9,
    radius: RADIUS.round,
  },
  {
    title: "font-size:22px;font-weight:700;color:#1a3c2a;line-height:1.45;margin-bottom:10px;text-align:center;letter-spacing:1px;background:#d8e8d4;padding:12px 20px;border-radius:12px;",
    subtitle: "font-size:12px;color:#5a8a5a;text-align:center;margin-bottom:32px;font-style:italic;letter-spacing:1px;",
    h1: "font-size:17px;font-weight:700;color:#2d4a35;margin:32px 0 12px;padding:14px 18px;background:#d8e8d4;line-height:1.45;border-radius:12px;text-align:center;",
    h2: "font-size:15px;font-weight:700;color:#3d6a45;margin:24px 0 10px;padding:10px 14px;background:#d8e8d4;border-radius:12px;text-align:center;border-bottom:2px dashed #a0c8a0;",
    h3: "font-size:14px;font-weight:700;color:#4d7a55;margin:16px 0 6px;padding:6px 14px;background:#d8e8d4;text-align:center;border-radius:12px;",
    blockquote: "margin:22px 0;padding:14px 18px;background:#d8e8d4;border-left:4px solid #4a8a4a;color:#1a3c2a;font-size:14px;line-height:1.9;border-radius:0 12px 12px 0;font-style:italic;",
    strong: "font-weight:700;color:#1a3c2a;background:#d8e8d4;padding:2px 8px;border-radius:6px;",
    img: "max-width:100%;height:auto;display:block;margin:18px auto;border-radius:12px;border:2px solid #c0d8c0;",
    hr: "border:none;height:2px;background:repeating-linear-gradient(90deg,#a0c8a0,#a0c8a0 8px,transparent 8px,transparent 16px);margin:28px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  11 商务蓝调 — 专业可靠，严格网格
// ═══════════════════════════════════════════════════════════
const t11 = createTheme(
  {
    id: "business-blue",
    name: "商务蓝调",
    description: "专业可靠",
    previewBg: "#f0f4f8",
    category: "商务",
  },
  {
    width: WIDTH.wide,
    bg: "#f0f4f8",
    text: "#3f3f3f",
    textHeading: "#0d2137",
    textSecondary: "#6b7f99",
    accent: "#2b6cb0",
    surface: "#dbe4f0",
    border: "#c0cee0",
    link: "#2b6cb0",
    codeBg: "#dbe4f0",
    codeText: "#0d2137",
    codeInlineBg: "#dbe4f0",
    codeInlineText: "#c53030",
    fontBody: "sans",
    fontHeading: "sans",
    lineHeight: 1.75,
    radius: RADIUS.sharp,
  },
  {
    title: "font-size:20px;font-weight:800;color:#0d2137;line-height:1.3;margin-bottom:6px;letter-spacing:-0.3px;",
    subtitle: "font-size:12px;color:#6b7f99;margin-bottom:28px;padding-bottom:10px;border-bottom:2px solid #c0cee0;",
    h1: "font-size:17px;font-weight:800;color:#0d2137;margin:28px 0 10px;padding-bottom:8px;border-bottom:2px solid #2b6cb0;line-height:1.4;",
    h2: "font-size:15px;font-weight:700;color:#1e3a5f;margin:22px 0 8px;padding-left:10px;border-left:4px solid #2b6cb0;line-height:1.4;",
    h3: "font-size:14px;font-weight:700;color:#2b6cb0;margin:16px 0 6px;background:#dbe4f0;padding:5px 10px;border-radius:3px;",
    blockquote: "margin:14px 0;padding:10px 14px;background:#dbe4f0;border-left:4px solid #2b6cb0;color:#1e3a5f;font-size:13px;line-height:1.8;border-radius:0 4px 4px 0;",
    code: "background:#dbe4f0;padding:1px 5px;border-radius:3px;font-family:'SF Mono',Monaco,monospace;font-size:12px;color:#c53030;border:1px solid #c0cee0;",
    codeBlock: "background:#dbe4f0;color:#0d2137;padding:12px;border-radius:4px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:11px;line-height:1.65;margin:14px 0;border:1px solid #c0cee0;",
    pre: "margin:14px 0;overflow-x:auto;border-radius:4px;",
    ul: "margin:10px 0;padding-left:18px;list-style:disc;",
    ol: "margin:10px 0;padding-left:18px;",
    li: "margin:6px 0;color:#3f3f3f;line-height:1.75;font-size:15px;",
    strong: "font-weight:800;color:#0d2137;background:#a8c4e8;padding:1px 4px;border-radius:2px;",
    img: "max-width:100%;height:auto;display:block;margin:14px auto;border-radius:3px;border:1px solid #c0cee0;",
    table: "width:100%;border-collapse:collapse;margin:14px 0;font-size:13px;border:1px solid #c0cee0;background:#ffffff;",
    th: "padding:10px 12px;background:#dbe4f0;border-bottom:2px solid #2b6cb0;text-align:left;font-weight:800;color:#0d2137;font-size:12px;",
    td: "padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#3f3f3f;",
    hr: "border:none;height:2px;background:#c0cee0;margin:24px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  12 党政红金 — 庄重大气，红金配色
// ═══════════════════════════════════════════════════════════
const t12 = createTheme(
  {
    id: "red-gold",
    name: "党政红金",
    description: "庄重大气",
    previewBg: "#fdf6f0",
    category: "国风",
    headingNumberStyle: "badge",
  },
  {
    width: WIDTH.narrow,
    bg: "#fdf6f0",
    text: "#5c1a1a",
    textHeading: "#b22222",
    textSecondary: "#8b1a1a",
    accent: "#c4956a",
    surface: "#f5e6d3",
    border: "#e0c8a0",
    link: "#b22222",
    codeBg: "#5c1a1a",
    codeText: "#f5e6d3",
    codeInlineBg: "#f5e6d3",
    codeInlineText: "#b22222",
    fontBody: "serif",
    fontHeading: "serif",
    headingAlign: "center",
    bodySize: 16,
    lineHeight: 2.0,
    letterSpacing: 1,
    paragraphGap: 14,
    radius: RADIUS.sharp,
    indent: true,
    justify: false,
  },
  {
    title: "font-size:26px;font-weight:700;color:#b22222;line-height:1.4;margin-bottom:12px;text-align:center;letter-spacing:4px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:13px;color:#c4956a;text-align:center;margin-bottom:36px;letter-spacing:3px;font-family:'PingFang SC',sans-serif;",
    h1: "font-size:21px;font-weight:700;color:#b22222;margin:36px 0 14px;padding:12px 0;border-bottom:2px solid #c4956a;border-top:2px solid #c4956a;text-align:center;letter-spacing:3px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:17px;font-weight:700;color:#8b1a1a;margin:26px 0 10px;padding:10px 18px;background:#f5e6d3;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    h3: "font-size:15px;font-weight:700;color:#a63d3d;margin:18px 0 8px;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    blockquote: "margin:24px 0;padding:16px 22px;background:#f5e6d3;border:1px solid #c4956a;color:#6a1a1a;font-size:15px;line-height:2.0;border-radius:2px;font-style:italic;font-family:'Noto Serif SC',serif;text-align:center;",
    strong: "font-weight:700;color:#b22222;background:#f5e6d3;padding:1px 5px;border-radius:2px;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border:6px solid #f5e6d3;background:#f5e6d3;",
    table: "width:100%;border-collapse:collapse;margin:18px 0;font-size:14px;border:1px solid #e0c8a0;background:#ffffff;",
    th: "padding:12px 16px;background:#f5e6d3;border-bottom:2px solid #c4956a;text-align:center;font-weight:700;color:#b22222;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:1px;",
    td: "padding:12px 16px;border-bottom:1px solid #f0dcc8;color:#5c1a1a;text-align:center;",
    hr: "border:none;height:2px;background:repeating-linear-gradient(90deg,#c4956a,#c4956a 10px,transparent 10px,transparent 20px);margin:32px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  EXPORT
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
//  13–18 gzh-design skill themes
//  Ported from https://github.com/isjiamu/gzh-design-skill
//  with WeChat-safe inline styles and <span leaf> wrapping.
// ═══════════════════════════════════════════════════════════

const t13 = createTheme(
  {
    id: "moyu-green",
    name: "摸鱼绿",
    description: "绿色杂志风",
    previewBg: "#ffffff",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#ffffff",
    text: "#374151",
    textHeading: "#111827",
    textSecondary: "#6B7280",
    accent: "#059669",
    surface: "#F0FDF4",
    border: "#BBF7D0",
    link: "#059669",
    codeBg: "#1E293B",
    codeText: "#E2E8F0",
    codeInlineBg: "#ECFDF5",
    codeInlineText: "#059669",
    fontBody: "sans",
    fontHeading: "sans",
    bodySize: 14,
    lineHeight: 1.9,
    letterSpacing: 0.5,
    paragraphGap: 14,
    radius: RADIUS.round,
  },
  {
    h1: "font-size:18px;font-weight:800;color:#111827;margin:32px 0 12px;padding-bottom:10px;border-bottom:2px solid #059669;line-height:1.4;letter-spacing:0.5px;",
    h2: "font-size:16px;font-weight:700;color:#111827;margin:26px 0 10px;padding-left:12px;border-left:3px solid #059669;line-height:1.4;letter-spacing:0.3px;",
    strong: "font-weight:700;color:#111827;background:#FDE68A;padding:1px 5px;border-radius:3px;",
    blockquote: "margin:22px 0;padding:14px 16px;background:#F0FDF4;border-left:3px solid #059669;color:#374151;font-size:14px;line-height:1.9;border-radius:0 10px 10px 0;",
  }
)

const t14 = createTheme(
  {
    id: "red-white",
    name: "红白色系",
    description: "经典编辑风",
    previewBg: "#ffffff",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#ffffff",
    text: "#374151",
    textHeading: "#1C1917",
    textSecondary: "#9CA3AF",
    accent: "#DC2626",
    surface: "#FEF2F2",
    border: "#FEE2E2",
    link: "#DC2626",
    codeBg: "#1E293B",
    codeText: "#E2E8F0",
    codeInlineBg: "#FEF2F2",
    codeInlineText: "#DC2626",
    fontBody: "sans",
    fontHeading: "sans",
    bodySize: 15,
    lineHeight: 1.8,
    letterSpacing: 0.5,
    paragraphGap: 16,
    radius: RADIUS.soft,
  },
  {
    h1: "font-size:18px;font-weight:800;color:#1C1917;margin:32px 0 12px;padding-bottom:10px;border-bottom:3px solid #DC2626;line-height:1.4;letter-spacing:0.5px;",
    h2: "font-size:16px;font-weight:700;color:#1C1917;margin:26px 0 10px;padding-left:12px;border-left:3px solid #DC2626;line-height:1.4;letter-spacing:0.3px;",
    strong: "font-weight:700;color:#1C1917;background:#FECACA;padding:1px 5px;border-radius:3px;",
    blockquote: "margin:22px 0;padding:16px 18px;background:#FEF2F2;border-left:4px solid #DC2626;color:#991B1B;font-size:15px;line-height:1.8;border-radius:0 10px 10px 0;",
  }
)

const t15 = createTheme(
  {
    id: "graphite-minimal",
    name: "石墨极简",
    description: "留白理性",
    previewBg: "#FFFFFF",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#FFFFFF",
    text: "#52525B",
    textHeading: "#27272A",
    textSecondary: "#A1A1AA",
    accent: "#52525B",
    surface: "#FAFAFA",
    border: "#E4E4E7",
    link: "#52525B",
    codeBg: "#1E293B",
    codeText: "#E2E8F0",
    codeInlineBg: "#F4F4F5",
    codeInlineText: "#52525B",
    fontBody: "sans",
    fontHeading: "sans",
    bodySize: 15,
    lineHeight: 1.8,
    letterSpacing: 0.3,
    paragraphGap: 18,
    radius: RADIUS.sharp,
  },
  {
    h1: "font-size:18px;font-weight:800;color:#27272A;margin:32px 0 12px;padding-bottom:10px;border-bottom:1px solid #E4E4E7;line-height:1.4;letter-spacing:0.3px;",
    h2: "font-size:16px;font-weight:700;color:#27272A;margin:28px 0 10px;padding-left:12px;border-left:3px solid #52525B;line-height:1.4;letter-spacing:0.3px;",
    strong: "font-weight:700;color:#27272A;background:#F4F4F5;padding:1px 5px;border-radius:2px;",
    blockquote: "margin:24px 0;padding:18px 20px;background:#FAFAFA;border-left:3px solid #52525B;color:#52525B;font-size:15px;line-height:1.8;border-radius:0 2px 2px 0;",
  }
)

const t16 = createTheme(
  {
    id: "zen-whitespace",
    name: "留白禅意",
    description: "呼吸感",
    previewBg: "#ffffff",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#ffffff",
    text: "#4A5D52",
    textHeading: "#4A5D52",
    textSecondary: "#8B9D92",
    accent: "#4A5D52",
    surface: "#F5F7F6",
    border: "#D8E0DC",
    link: "#4A5D52",
    codeBg: "#F5F7F6",
    codeText: "#4A5D52",
    codeInlineBg: "#F5F7F6",
    codeInlineText: "#4A5D52",
    fontBody: "serif",
    fontHeading: "serif",
    headingAlign: "center",
    bodySize: 15,
    lineHeight: 2.0,
    letterSpacing: 0.5,
    paragraphGap: 18,
    radius: RADIUS.sharp,
    justify: false,
  },
  {
    title: "font-size:24px;font-weight:700;color:#4A5D52;line-height:1.4;margin-bottom:12px;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:12px;color:#8B9D92;text-align:center;margin-bottom:40px;letter-spacing:2px;font-family:'PingFang SC',sans-serif;",
    h1: "font-size:18px;font-weight:700;color:#4A5D52;margin:40px 0 14px;padding-bottom:10px;border-bottom:1px solid #D8E0DC;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:600;color:#5A6D62;margin:30px 0 12px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    strong: "font-weight:700;color:#4A5D52;background:#E8EFEA;padding:1px 5px;border-radius:2px;",
    blockquote: "margin:28px 0;padding:22px 24px;background:#F5F7F6;color:#4A5D52;font-size:15px;line-height:2.0;text-align:center;font-family:'Noto Serif SC',serif;font-style:italic;border-top:1px solid #D8E0DC;border-bottom:1px solid #D8E0DC;",
  }
)

const t17 = createTheme(
  {
    id: "moyu-ticket",
    name: "摸鱼票据",
    description: "票据视觉隐喻",
    previewBg: "#ffffff",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#ffffff",
    text: "#374151",
    textHeading: "#111827",
    textSecondary: "#6B7280",
    accent: "#059669",
    surface: "#F0FDF4",
    border: "#BBF7D0",
    link: "#059669",
    codeBg: "#1E293B",
    codeText: "#E2E8F0",
    codeInlineBg: "#ECFDF5",
    codeInlineText: "#059669",
    fontBody: "sans",
    fontHeading: "sans",
    bodySize: 14,
    lineHeight: 1.85,
    letterSpacing: 0.5,
    paragraphGap: 14,
    radius: RADIUS.soft,
  },
  {
    h1: "font-size:18px;font-weight:800;color:#111827;margin:32px 0 12px;padding-bottom:10px;border-bottom:2px dashed #059669;line-height:1.4;letter-spacing:0.5px;",
    h2: "font-size:16px;font-weight:700;color:#111827;margin:26px 0 10px;padding-left:12px;border-left:3px solid #059669;line-height:1.4;letter-spacing:0.3px;",
    strong: "font-weight:700;color:#111827;background:#FDE68A;padding:1px 5px;border-radius:2px;",
    blockquote: "margin:22px 0;padding:14px 16px;background:#F0FDF4;border:1px dashed #BBF7D0;color:#374151;font-size:14px;line-height:1.85;border-radius:4px;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:4px;border:1px solid #E5E7EB;box-shadow:0 4px 12px -2px rgba(0,0,0,0.08);",
  }
)

const t18 = createTheme(
  {
    id: "olive-journal",
    name: "橄榄手记",
    description: "编辑部内刊质感",
    previewBg: "#ffffff",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#ffffff",
    text: "#1e1f23",
    textHeading: "#1e1f23",
    textSecondary: "#6b6d72",
    accent: "#ed7b2f",
    surface: "#f5f5f5",
    border: "#e5e5e5",
    link: "#ed7b2f",
    codeBg: "#1e1f23",
    codeText: "#f5f5f5",
    codeInlineBg: "#f5f5f5",
    codeInlineText: "#ed7b2f",
    fontBody: "sans",
    fontHeading: "sans",
    bodySize: 15,
    lineHeight: 1.85,
    letterSpacing: 0.3,
    paragraphGap: 16,
    radius: RADIUS.soft,
  },
  {
    h1: "font-size:18px;font-weight:800;color:#1e1f23;margin:32px 0 12px;padding-bottom:10px;border-bottom:2px solid #ed7b2f;line-height:1.4;letter-spacing:0.3px;",
    h2: "font-size:16px;font-weight:700;color:#1e1f23;margin:26px 0 10px;padding-left:12px;border-left:3px solid #ed7b2f;line-height:1.4;letter-spacing:0.3px;",
    strong: "font-weight:700;color:#1e1f23;background:#f5f5f5;padding:1px 5px;border-radius:3px;",
    blockquote: "margin:22px 0;padding:16px 18px;background:#f5f5f5;border-left:4px solid #ed7b2f;color:#1e1f23;font-size:15px;line-height:1.85;border-radius:0 8px 8px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  19 暖墨 —— 温柔克制，陶土红 + 衬线标题
// ═══════════════════════════════════════════════════════════

const t19 = createTheme(
  {
    id: "warm-ink",
    name: "暖墨",
    description: "温柔手记风",
    previewBg: "#FDFBF7",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#FDFBF7",
    text: "#4A403A",
    textHeading: "#2E2622",
    textSecondary: "#7A6E65",
    accent: "#B85C50",
    surface: "#F7F2EC",
    border: "#E0D5CC",
    link: "#B85C50",
    codeBg: "#2E2622",
    codeText: "#F7F2EC",
    codeInlineBg: "#F7F2EC",
    codeInlineText: "#B85C50",
    fontBody: "sans",
    fontHeading: "serif",
    bodySize: 15,
    lineHeight: 1.9,
    letterSpacing: 0.3,
    paragraphGap: 16,
    radius: RADIUS.round,
  },
  {
    title: "font-size:24px;font-weight:700;color:#2E2622;line-height:1.35;margin-bottom:12px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:13px;color:#7A6E65;text-align:center;margin-bottom:36px;letter-spacing:1px;font-style:italic;",
    h1: "font-size:18px;font-weight:700;color:#2E2622;margin:36px 0 12px;padding-bottom:10px;border-bottom:1px solid #E0D5CC;line-height:1.4;letter-spacing:0.5px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:700;color:#2E2622;margin:28px 0 10px;padding-left:12px;border-left:3px solid #B85C50;line-height:1.4;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    h3: "font-size:15px;font-weight:700;color:#B85C50;margin:20px 0 8px;line-height:1.4;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    strong: "font-weight:700;color:#2E2622;background:#FCE8E4;padding:1px 5px;border-radius:3px;",
    blockquote: "margin:24px 0;padding:18px 20px;background:#F7F2EC;border-left:3px solid #B85C50;color:#2E2622;font-size:15px;line-height:1.85;border-radius:0 10px 10px 0;font-style:italic;font-family:'Noto Serif SC',serif;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:8px;border:1px solid #E0D5CC;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,#E0D5CC 8px,#E0D5CC 16px,transparent 16px,transparent 24px);margin:32px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  20 智思手记 —— 为 AI / 技术学习者设计，暖灰底 + 深青强调
// ═══════════════════════════════════════════════════════════

const t20 = createTheme(
  {
    id: "ai-notebook",
    name: "智思手记",
    description: "AI 学习手记",
    previewBg: "#F8FAFA",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#F8FAFA",
    text: "#3D4F56",
    textHeading: "#1E2E33",
    textSecondary: "#5F737A",
    accent: "#2E6B75",
    surface: "#EDF2F2",
    border: "#D7E0E3",
    link: "#2E6B75",
    codeBg: "#263238",
    codeText: "#ECEFF1",
    codeInlineBg: "#EDF2F2",
    codeInlineText: "#2E6B75",
    fontBody: "sans",
    fontHeading: "serif",
    bodySize: 15,
    lineHeight: 1.85,
    letterSpacing: 0.3,
    paragraphGap: 16,
    radius: RADIUS.round,
  },
  {
    title: "font-size:24px;font-weight:700;color:#1E2E33;line-height:1.35;margin-bottom:12px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:13px;color:#5F737A;text-align:center;margin-bottom:36px;letter-spacing:1px;font-style:italic;",
    h1: "font-size:18px;font-weight:700;color:#1E2E33;margin:36px 0 12px;padding-bottom:10px;border-bottom:1px solid #D7E0E3;line-height:1.4;letter-spacing:0.5px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:700;color:#1E2E33;margin:28px 0 10px;padding-left:12px;border-left:3px solid #2E6B75;line-height:1.4;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    h3: "font-size:15px;font-weight:700;color:#2E6B75;margin:20px 0 8px;line-height:1.4;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    strong: "font-weight:700;color:#1E2E33;background:#D9ECEF;padding:1px 5px;border-radius:3px;",
    blockquote: "margin:24px 0;padding:18px 20px;background:#EDF2F2;border-left:3px solid #2E6B75;color:#1E2E33;font-size:15px;line-height:1.85;border-radius:0 10px 10px 0;font-style:italic;font-family:'Noto Serif SC',serif;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:8px;border:1px solid #D7E0E3;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,#D7E0E3 8px,#D7E0E3 16px,transparent 16px,transparent 24px);margin:32px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  21 紫墨 —— 淡紫底 + 烟紫强调，静谧手记风
// ═══════════════════════════════════════════════════════════

const t21 = createTheme(
  {
    id: "purple-ink",
    name: "紫墨",
    description: "淡紫静谧手记",
    previewBg: "#FAF8FB",
    category: "gzh-design",
  },
  {
    width: 677,
    bg: "#FAF8FB",
    text: "#4A3F4A",
    textHeading: "#2E2333",
    textSecondary: "#7D6E80",
    accent: "#7C4D9E",
    surface: "#F2EDF5",
    border: "#DDD5E1",
    link: "#7C4D9E",
    codeBg: "#2E2333",
    codeText: "#F2EDF5",
    codeInlineBg: "#F2EDF5",
    codeInlineText: "#7C4D9E",
    fontBody: "sans",
    fontHeading: "serif",
    bodySize: 15,
    lineHeight: 1.9,
    letterSpacing: 0.3,
    paragraphGap: 16,
    radius: RADIUS.round,
  },
  {
    title: "font-size:24px;font-weight:700;color:#2E2333;line-height:1.35;margin-bottom:12px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:13px;color:#7D6E80;text-align:center;margin-bottom:36px;letter-spacing:1px;font-style:italic;",
    h1: "font-size:18px;font-weight:700;color:#2E2333;margin:36px 0 12px;padding-bottom:10px;border-bottom:1px solid #DDD5E1;line-height:1.4;letter-spacing:0.5px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:700;color:#2E2333;margin:28px 0 10px;line-height:1.4;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    h3: "font-size:15px;font-weight:700;color:#7C4D9E;margin:20px 0 8px;line-height:1.4;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    strong: "font-weight:700;color:#2E2333;background:#F0E3F7;padding:1px 5px;border-radius:3px;",
    blockquote: "margin:24px 0;padding:18px 20px;background:#F2EDF5;color:#2E2333;font-size:15px;line-height:1.85;border-radius:10px;font-style:italic;font-family:'Noto Serif SC',serif;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:8px;border:1px solid #DDD5E1;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,#DDD5E1 8px,#DDD5E1 16px,transparent 16px,transparent 24px);margin:32px 0;",
  }
)

// ═══════════════════════════════════════════════════════════
//  EXPORT
// ═══════════════════════════════════════════════════════════

export const themes: Theme[] = [
  t01, t02, t03, t04, t05, t06,
  t07, t08, t09, t10, t11, t12,
  t13, t14, t15, t16, t17, t18, t19, t20, t21,
]

export const defaultTheme = themes[0]

export const themeCategories = [
  { label: "简约", themes: [t01, t02] },
  { label: "文艺", themes: [t03, t04] },
  { label: "潮流", themes: [t05, t06] },
  { label: "时尚", themes: [t07, t08] },
  { label: "治愈", themes: [t09, t10] },
  { label: "商务", themes: [t11] },
  { label: "国风", themes: [t12] },
  { label: "gzh-design", themes: [t13, t14, t15, t16, t17, t18, t19, t20, t21] },
]
