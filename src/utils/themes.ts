// ============================================================
// 12 WeChat Article Themes — Design System v2.0
// Based on: design-system-builder + ui-blueprint + wechat-post-craft
// Standards:
//   - Body: 15px, line-height: 1.75-2.0, color: #3f3f3f (never pure black)
//   - Letter-spacing: 0.5-1px
//   - Margin: 16px page padding
//   - 60-30-10 color rule: primary + secondary + accent
//   - Images: border-radius + proper spacing + optional border
//   - All styles inline, <section> container, WeChat-safe
// ============================================================

export interface Theme {
  id: string
  name: string
  description: string
  previewBg: string
  category: string
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

const S = "-apple-system,BlinkMacSystemFont,'PingFang SC','Noto Sans SC',sans-serif"
const R = "'Noto Serif SC','Songti SC','STSong',Georgia,serif"
const WB = "word-break:break-word;"

// ═══════════════════════════════════════════════════════════
//  01 极简留白 — 冷淡克制，细线，黄标高亮
// ═══════════════════════════════════════════════════════════
const t01: Theme = {
  id: "minimal-white",
  name: "极简留白",
  description: "冷淡克制",
  previewBg: "#ffffff",
  category: "简约",
  styles: {
    container: `max-width:720px;margin:0 auto;padding:20px 16px 40px;background:#ffffff;font-family:${S};color:#3f3f3f;font-size:15px;line-height:1.75;letter-spacing:0.5px;${WB}`,
    title: "font-size:20px;font-weight:700;color:#1a1a1a;line-height:1.3;margin-bottom:4px;letter-spacing:-0.3px;",
    subtitle: "font-size:12px;color:#999999;margin-bottom:32px;padding-bottom:12px;border-bottom:1px solid #eeeeee;",
    h1: "font-size:18px;font-weight:700;color:#1a1a1a;margin:36px 0 12px;padding-bottom:8px;border-bottom:1.5px solid #1a1a1a;",
    h2: "font-size:16px;font-weight:700;color:#333333;margin:28px 0 10px;padding-left:10px;border-left:2px solid #999999;",
    h3: "font-size:15px;font-weight:700;color:#555555;margin:20px 0 8px;",
    paragraph: "margin:12px 0;color:#3f3f3f;line-height:1.75;font-size:15px;",
    blockquote: "margin:20px 0;padding:14px 16px;background:#fafafa;border-left:2px solid #dddddd;color:#777777;font-size:14px;line-height:1.8;font-style:italic;",
    code: "background:#f5f5f5;padding:1px 5px;border-radius:3px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#d4380d;border:1px solid #eeeeee;",
    codeBlock: "background:#1a1a1a;color:#f0f0f0;padding:16px;border-radius:6px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.7;margin:20px 0;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:6px;",
    ul: "margin:12px 0;padding-left:20px;list-style:disc;",
    ol: "margin:12px 0;padding-left:20px;",
    li: "margin:6px 0;color:#3f3f3f;line-height:1.75;font-size:15px;",
    strong: "font-weight:700;color:#1a1a1a;background:#fff3b0;padding:0 2px;",
    em: "font-style:italic;color:#888888;",
    a: "color:#1890ff;text-decoration:none;border-bottom:1px solid #1890ff;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:4px;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;border-top:1px solid #000000;border-bottom:1px solid #000000;",
    th: "padding:10px 12px;border-bottom:1px solid #000000;text-align:left;font-weight:600;font-size:12px;",
    td: "padding:10px 12px;border-bottom:1px solid #eeeeee;color:#3f3f3f;",
    hr: "border:none;height:1px;background:#e0e0e0;margin:32px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  02 灰调雅致 — 更宽、更疏朗，蓝灰渐变高亮
// ═══════════════════════════════════════════════════════════
const t02: Theme = {
  id: "gray-elegant",
  name: "灰调雅致",
  description: "专业沉稳",
  previewBg: "#f7f8fa",
  category: "简约",
  styles: {
    container: `max-width:760px;margin:0 auto;padding:32px 24px 48px;background:#f7f8fa;font-family:${S};color:#3f3f3f;font-size:15px;line-height:1.85;letter-spacing:0.5px;${WB}`,
    title: "font-size:22px;font-weight:800;color:#1a202c;line-height:1.25;margin-bottom:6px;letter-spacing:-0.3px;",
    subtitle: "font-size:13px;color:#718096;margin-bottom:44px;padding-bottom:16px;border-bottom:2px solid #cbd5e0;",
    h1: "font-size:18px;font-weight:700;color:#1a202c;margin:40px 0 14px;padding-bottom:10px;border-bottom:3px solid #4a5568;",
    h2: "font-size:16px;font-weight:700;color:#2d3748;margin:32px 0 12px;padding-left:14px;border-left:4px solid #4a5568;",
    h3: "font-size:15px;font-weight:700;color:#4a5568;margin:24px 0 10px;background:#edf2f7;padding:6px 12px;border-radius:4px;",
    paragraph: "margin:14px 0;color:#3f3f3f;line-height:1.85;font-size:15px;",
    blockquote: "margin:24px 0;padding:16px 18px;background:#edf2f7;border-left:4px solid #4a5568;color:#2d3748;font-size:14px;line-height:1.85;border-radius:0 6px 6px 0;",
    code: "background:#edf2f7;padding:2px 6px;border-radius:4px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#c53030;border:1px solid #d0dce8;",
    codeBlock: "background:#1a202c;color:#e2e8f0;padding:18px;border-radius:8px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.75;margin:20px 0;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:8px;",
    ul: "margin:14px 0;padding-left:22px;list-style:disc;",
    ol: "margin:14px 0;padding-left:22px;",
    li: "margin:8px 0;color:#3f3f3f;line-height:1.85;font-size:15px;",
    strong: "font-weight:700;color:#1a202c;background:linear-gradient(transparent 60%,#bee3f8 60%);padding:0 2px;",
    em: "font-style:italic;color:#718096;",
    a: "color:#2980b9;text-decoration:none;border-bottom:2px solid #2980b9;font-weight:600;",
    img: "max-width:100%;height:auto;display:block;margin:24px auto;border-radius:6px;border:1px solid #d0dce8;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;border:1px solid #d0dce8;background:#ffffff;",
    th: "padding:12px 14px;background:#edf2f7;border-bottom:2px solid #4a5568;text-align:left;font-weight:700;font-size:12px;",
    td: "padding:12px 14px;border-bottom:1px solid #e2e8f0;color:#3f3f3f;",
    hr: "border:none;height:2px;background:repeating-linear-gradient(90deg,#cbd5e0,#cbd5e0 8px,transparent 8px,transparent 16px);margin:36px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  03 新中式 — 最窄、首行缩进、居中标题、宣纸感
// ═══════════════════════════════════════════════════════════
const t03: Theme = {
  id: "neo-chinese",
  name: "新中式",
  description: "东方气韵",
  previewBg: "#f9f6f1",
  category: "文艺",
  styles: {
    container: `max-width:600px;margin:0 auto;padding:32px 20px 48px;background:#f9f6f1;font-family:${R};color:#3f3f3f;font-size:16px;line-height:2.0;letter-spacing:1px;${WB}`,
    title: "font-size:24px;font-weight:700;color:#2c1810;line-height:1.4;margin-bottom:12px;text-align:center;letter-spacing:4px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:13px;color:#a08b76;text-align:center;margin-bottom:44px;letter-spacing:3px;font-family:'PingFang SC',sans-serif;",
    h1: "font-size:20px;font-weight:700;color:#5c3d2e;margin:44px 0 16px;padding-bottom:10px;border-bottom:2px solid #a67c52;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:17px;font-weight:700;color:#6b4423;margin:32px 0 14px;padding:10px 16px;background:#f0ebe3;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    h3: "font-size:16px;font-weight:700;color:#7a5c3c;margin:22px 0 10px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    paragraph: "margin:16px 0;color:#4a3728;line-height:2.0;font-size:16px;text-align:justify;text-indent:2em;",
    blockquote: "margin:28px 0;padding:18px 20px;background:#f0ebe3;border-left:4px solid #a67c52;color:#5c3d2e;font-size:15px;line-height:2.0;border-radius:0 4px 4px 0;font-style:italic;font-family:'Noto Serif SC',serif;",
    code: "background:#f0ebe3;padding:2px 8px;border-radius:2px;font-family:'SF Mono',Monaco,monospace;font-size:14px;color:#8b4513;border:1px solid #e0d5c7;",
    codeBlock: "background:#3d2b1f;color:#efebe9;padding:18px;border-radius:4px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:13px;line-height:1.75;margin:20px 0;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:4px;",
    ul: "margin:14px 0;padding-left:24px;list-style:circle;",
    ol: "margin:14px 0;padding-left:24px;",
    li: "margin:10px 0;color:#4a3728;line-height:1.95;font-size:16px;",
    strong: "font-weight:700;color:#2c1810;background:linear-gradient(transparent 70%,#d4c5b0 70%);padding:0 3px;",
    em: "font-style:italic;color:#8b6914;font-family:'Noto Serif SC',serif;",
    a: "color:#8b4513;text-decoration:none;border-bottom:1px dashed #8b4513;",
    img: "max-width:100%;height:auto;display:block;margin:24px auto;border:8px solid #f0ebe3;background:#f0ebe3;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;border:1px solid #d4c5a0;background:#fdfbf7;",
    th: "padding:14px 16px;background:#f0ebe3;border-bottom:2px solid #a67c52;text-align:center;font-weight:700;color:#5c3d2e;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:1px;",
    td: "padding:14px 16px;border-bottom:1px solid #e8ddd0;color:#4a3728;text-align:center;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 10px,#c4b5a5 10px,#c4b5a5 20px,transparent 20px,transparent 30px);margin:40px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  04 莫兰迪文艺 — 斜体标题、大圆角、低饱和
// ═══════════════════════════════════════════════════════════
const t04: Theme = {
  id: "morandi-art",
  name: "莫兰迪文艺",
  description: "低饱和温柔",
  previewBg: "#f0ece6",
  category: "文艺",
  styles: {
    container: `max-width:680px;margin:0 auto;padding:28px 20px 44px;background:#f0ece6;font-family:${R};color:#3f3f3f;font-size:15px;line-height:1.9;letter-spacing:0.5px;${WB}`,
    title: "font-size:24px;font-weight:400;color:#4a4038;line-height:1.3;margin-bottom:10px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;font-style:italic;",
    subtitle: "font-size:12px;color:#9a8b7e;text-align:center;margin-bottom:40px;letter-spacing:2px;font-family:'PingFang SC',sans-serif;border-top:1px solid #d4c8ba;border-bottom:1px solid #d4c8ba;padding:10px 0;",
    h1: "font-size:18px;font-weight:400;color:#5a4038;margin:40px 0 14px;padding-bottom:10px;border-bottom:1px solid #a89080;text-align:center;font-style:italic;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:600;color:#6a5040;margin:28px 0 12px;padding:10px 18px;background:#e4dbd0;border-radius:12px;letter-spacing:0.5px;font-family:'Noto Serif SC','Songti SC',serif;text-align:center;",
    h3: "font-size:15px;font-weight:600;color:#7a6050;margin:20px 0 8px;padding:6px 14px;background:#e4dbd0;display:inline-block;border-radius:8px;letter-spacing:0.3px;font-family:'Noto Serif SC','Songti SC',serif;",
    paragraph: "margin:14px 0;color:#3f3f3f;line-height:1.9;font-size:15px;text-align:justify;",
    blockquote: "margin:24px 0;padding:16px 20px;background:#e4dbd0;border-left:4px solid #a89080;color:#5a4038;font-size:14px;line-height:1.9;border-radius:0 12px 12px 0;font-style:italic;font-family:'Noto Serif SC',serif;",
    code: "background:#e4dbd0;padding:2px 8px;border-radius:6px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#8b5e3c;border:1px solid #d0c4b8;",
    codeBlock: "background:#3d3530;color:#efebe9;padding:16px;border-radius:12px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.75;margin:20px 0;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:12px;",
    ul: "margin:14px 0;padding-left:22px;list-style:disc;",
    ol: "margin:14px 0;padding-left:22px;",
    li: "margin:8px 0;color:#3f3f3f;line-height:1.85;font-size:15px;",
    strong: "font-weight:700;color:#4a4038;background:#d8c8b8;padding:1px 6px;border-radius:4px;",
    em: "font-style:italic;color:#8b7d6e;font-family:'Noto Serif SC',serif;",
    a: "color:#8b5e3c;text-decoration:none;border-bottom:1px dashed #8b5e3c;",
    img: "max-width:100%;height:auto;display:block;margin:24px auto;border-radius:12px;border:6px solid #e4dbd0;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;border:1px solid #d0c4b8;background:#faf8f5;border-radius:8px;overflow:hidden;",
    th: "padding:12px 16px;background:#e4dbd0;border-bottom:2px solid #a89080;text-align:center;font-weight:600;color:#4a4038;font-family:'Noto Serif SC',serif;font-size:13px;",
    td: "padding:12px 16px;border-bottom:1px solid #d8c8b8;color:#3f3f3f;text-align:center;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,#c4b0a0 8px,#c4b0a0 16px,transparent 16px,transparent 24px);margin:36px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  05 潮流先锋 — 最紧凑、全大写、红色冲击
// ═══════════════════════════════════════════════════════════
const t05: Theme = {
  id: "street-hype",
  name: "潮流先锋",
  description: "街头态度",
  previewBg: "#0a0a0a",
  category: "潮流",
  styles: {
    container: `max-width:720px;margin:0 auto;padding:24px 16px 40px;background:#0a0a0a;font-family:${S};color:#d0d0d0;font-size:14px;line-height:1.7;letter-spacing:0.3px;${WB}`,
    title: "font-size:26px;font-weight:900;color:#ffffff;line-height:1.15;margin-bottom:6px;text-transform:uppercase;font-style:italic;letter-spacing:-0.5px;",
    subtitle: "font-size:11px;color:#666666;margin-bottom:36px;font-weight:500;letter-spacing:2px;text-transform:uppercase;border-left:3px solid #ff3333;padding-left:10px;",
    h1: "font-size:20px;font-weight:900;color:#ffffff;margin:36px 0 12px;padding-bottom:8px;border-bottom:3px solid #ff3333;text-transform:uppercase;letter-spacing:1px;",
    h2: "font-size:15px;font-weight:800;color:#ffffff;margin:24px 0 10px;padding-left:10px;border-left:4px solid #ff3333;text-transform:uppercase;letter-spacing:0.5px;",
    h3: "font-size:13px;font-weight:800;color:#ff3333;margin:16px 0 6px;text-transform:uppercase;letter-spacing:1px;",
    paragraph: "margin:10px 0;color:#bbbbbb;line-height:1.7;font-size:14px;",
    blockquote: "margin:20px 0;padding:12px 14px;background:#141414;border-left:4px solid #ff3333;color:#dddddd;font-size:13px;line-height:1.8;font-weight:600;",
    code: "background:#141414;padding:2px 6px;border-radius:3px;font-family:'SF Mono',Monaco,monospace;font-size:12px;color:#ff3333;font-weight:700;border:1px solid #333333;",
    codeBlock: "background:#141414;color:#e8e8e8;padding:14px;border-radius:6px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:11px;line-height:1.65;margin:16px 0;border:1px solid #333333;",
    pre: "margin:16px 0;overflow-x:auto;border-radius:6px;",
    ul: "margin:10px 0;padding-left:16px;list-style:square;",
    ol: "margin:10px 0;padding-left:16px;",
    li: "margin:6px 0;color:#bbbbbb;line-height:1.7;font-size:14px;",
    strong: "font-weight:900;color:#ffffff;background:#ff3333;padding:2px 6px;border-radius:2px;font-style:italic;",
    em: "font-style:italic;color:#888888;",
    a: "color:#ff3333;text-decoration:none;border-bottom:2px solid #ff3333;font-weight:700;",
    img: "max-width:100%;height:auto;display:block;margin:16px auto;border-radius:2px;border:1px solid #222222;",
    table: "width:100%;border-collapse:collapse;margin:16px 0;font-size:12px;border:1px solid #333333;background:#111111;",
    th: "padding:10px 12px;background:#000000;border-bottom:2px solid #ff3333;text-align:left;font-weight:800;color:#ffffff;font-size:11px;text-transform:uppercase;letter-spacing:1px;",
    td: "padding:10px 12px;border-bottom:1px solid #333333;color:#bbbbbb;",
    hr: "border:none;height:3px;background:#ff3333;margin:28px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  06 赛博霓虹 — 等宽标题、最大字间距、绿色
// ═══════════════════════════════════════════════════════════
const t06: Theme = {
  id: "cyber-neon",
  name: "赛博霓虹",
  description: "未来科技",
  previewBg: "#060a10",
  category: "潮流",
  styles: {
    container: `max-width:720px;margin:0 auto;padding:32px 20px 48px;background:#060a10;font-family:${S};color:#b0c4de;font-size:15px;line-height:1.85;letter-spacing:0.8px;${WB}`,
    title: "font-size:24px;font-weight:800;color:#00ff88;line-height:1.2;margin-bottom:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;background:#0a1a12;padding:10px 16px;display:inline-block;",
    subtitle: "font-size:12px;color:#5a7a6a;margin-bottom:40px;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;border-left:2px solid #00ff88;padding-left:12px;",
    h1: "font-size:18px;font-weight:800;color:#00ff88;margin:40px 0 14px;padding:10px 0;border-bottom:1px solid #00ff88;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;background:#0a1a12;padding-left:12px;",
    h2: "font-size:15px;font-weight:700;color:#e0f0e8;margin:28px 0 10px;padding:8px 12px;border-left:3px solid #00ff88;background:#0a1a12;font-family:'SF Mono',Monaco,monospace;letter-spacing:1px;",
    h3: "font-size:13px;font-weight:700;color:#00ff88;margin:18px 0 6px;text-transform:uppercase;font-family:'SF Mono',Monaco,monospace;letter-spacing:3px;",
    paragraph: "margin:14px 0;color:#8899aa;line-height:1.85;font-size:15px;",
    blockquote: "margin:24px 0;padding:14px 16px;background:#0a1a12;border:1px solid #00ff88;border-left:3px solid #00ff88;color:#c0d0c8;font-size:14px;line-height:1.85;border-radius:0 6px 6px 0;",
    code: "background:#0a1a12;padding:2px 8px;border-radius:4px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#00ff88;font-weight:700;border:1px solid #1e3a28;",
    codeBlock: "background:#0c1418;color:#b0c4de;padding:16px;border-radius:6px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.75;margin:20px 0;border:1px solid #1e2830;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:6px;",
    ul: "margin:14px 0;padding-left:20px;list-style:none;",
    ol: "margin:14px 0;padding-left:20px;",
    li: "margin:8px 0;color:#8899aa;line-height:1.85;font-size:15px;position:relative;padding-left:8px;",
    strong: "font-weight:800;color:#00ff88;background:#0a1a12;padding:2px 6px;border-radius:2px;font-family:'SF Mono',Monaco,monospace;font-size:14px;",
    em: "font-style:italic;color:#5a7a6a;",
    a: "color:#00ff88;text-decoration:none;border-bottom:1px solid #00ff88;font-weight:700;font-family:'SF Mono',Monaco,monospace;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:2px;border:1px solid #1e2830;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;border:1px solid #1e2830;background:#0c1418;",
    th: "padding:10px 12px;background:#060a10;border-bottom:1px solid #00ff88;text-align:left;font-weight:800;color:#00ff88;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-family:'SF Mono',Monaco,monospace;",
    td: "padding:10px 12px;border-bottom:1px solid #1e2830;color:#8899aa;",
    hr: "border:none;height:1px;background:#00ff88;margin:32px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  07 杂志画报 — 最窄、最大标题差异、通栏图片
// ═══════════════════════════════════════════════════════════
const t07: Theme = {
  id: "magazine-editorial",
  name: "杂志画报",
  description: "高级时尚",
  previewBg: "#ffffff",
  category: "时尚",
  styles: {
    container: `max-width:580px;margin:0 auto;padding:40px 24px 52px;background:#ffffff;font-family:${R};color:#3f3f3f;font-size:15px;line-height:2.0;letter-spacing:0.4px;${WB}`,
    title: "font-size:30px;font-weight:400;color:#000000;line-height:1.15;margin-bottom:14px;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;font-style:italic;",
    subtitle: "font-size:10px;color:#aaaaaa;text-align:center;margin-bottom:48px;letter-spacing:4px;text-transform:uppercase;font-family:'PingFang SC',sans-serif;border-top:1px solid #dddddd;border-bottom:1px solid #dddddd;padding:12px 0;",
    h1: "font-size:20px;font-weight:400;color:#000000;margin:44px 0 16px;padding-bottom:14px;border-bottom:1px solid #000000;text-align:center;font-style:italic;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:600;color:#1a1a1a;margin:32px 0 14px;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;padding:0 16px;",
    h3: "font-size:11px;font-weight:600;color:#888888;margin:22px 0 10px;text-transform:uppercase;letter-spacing:3px;font-family:'PingFang SC',sans-serif;text-align:center;",
    paragraph: "margin:16px 0;color:#3f3f3f;line-height:2.0;font-size:15px;text-align:justify;",
    blockquote: "margin:32px 0;padding:28px 32px;background:#faf9f6;color:#1a1a1a;font-size:15px;line-height:2.0;text-align:center;font-family:'Noto Serif SC','Songti SC',serif;font-style:italic;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;",
    code: "background:#f5f5f7;padding:2px 8px;border-radius:2px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#8b008b;",
    codeBlock: "background:#1c1c1e;color:#f5f5f7;padding:20px;border-radius:0;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.75;margin:24px 0;",
    pre: "margin:24px 0;overflow-x:auto;",
    ul: "margin:16px 0;padding-left:0;list-style:none;",
    ol: "margin:16px 0;padding-left:0;list-style:none;",
    li: "margin:12px 0;color:#3f3f3f;line-height:1.85;font-size:15px;padding-left:20px;",
    strong: "font-weight:700;color:#000000;font-family:'Noto Serif SC','Songti SC',serif;",
    em: "font-style:italic;color:#666666;font-family:'Noto Serif SC','Songti SC',serif;",
    a: "color:#000000;text-decoration:none;border-bottom:1px solid #000000;",
    img: "max-width:none;width:calc(100% + 48px);margin:28px -24px;height:auto;display:block;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;border-top:2px solid #000;border-bottom:2px solid #000;",
    th: "padding:14px 12px;border-bottom:1px solid #000;text-align:center;font-weight:600;font-family:'Noto Serif SC',serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;",
    td: "padding:14px 12px;border-bottom:1px solid #e0e0e0;text-align:center;",
    hr: "border:none;height:1px;background:#e0e0e0;margin:40px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  08 法式浪漫 — 虚线边框、松散、装饰感
// ═══════════════════════════════════════════════════════════
const t08: Theme = {
  id: "french-romance",
  name: "法式浪漫",
  description: "优雅轻奢",
  previewBg: "#fdf8f5",
  category: "时尚",
  styles: {
    container: `max-width:640px;margin:0 auto;padding:36px 24px 48px;background:#fdf8f5;font-family:${R};color:#3f3f3f;font-size:15px;line-height:2.0;letter-spacing:0.5px;${WB}`,
    title: "font-size:26px;font-weight:400;color:#3d2b1f;line-height:1.35;margin-bottom:12px;text-align:center;letter-spacing:3px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:12px;color:#b08d7a;text-align:center;margin-bottom:44px;font-style:italic;letter-spacing:2px;",
    h1: "font-size:19px;font-weight:600;color:#5a3d2b;margin:40px 0 14px;padding:14px 0;border-bottom:1px dashed #c4956a;border-top:1px dashed #c4956a;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:16px;font-weight:600;color:#6a4d3b;margin:28px 0 12px;padding:12px 20px;background:#f5ebe0;border:1px dashed #d4b896;text-align:center;letter-spacing:1px;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    h3: "font-size:14px;font-weight:600;color:#8b6d4f;margin:20px 0 8px;padding:6px 16px;background:#f5ebe0;display:inline-block;border:1px dashed #d4b896;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    paragraph: "margin:14px 0;color:#3f3f3f;line-height:2.0;font-size:15px;text-align:justify;",
    blockquote: "margin:28px 0;padding:18px 24px;background:#f5ebe0;border:1px dashed #c4956a;color:#6a4d3b;font-size:14px;line-height:2.0;border-radius:2px;font-style:italic;font-family:'Noto Serif SC',serif;text-align:center;",
    code: "background:#f5ebe0;padding:2px 8px;border-radius:2px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#a0522d;border:1px dashed #d0c0a8;",
    codeBlock: "background:#3d2b1f;color:#f5ebe0;padding:16px;border-radius:2px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.75;margin:20px 0;border:1px dashed #c4956a;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:2px;",
    ul: "margin:14px 0;padding-left:22px;list-style:circle;",
    ol: "margin:14px 0;padding-left:22px;",
    li: "margin:8px 0;color:#3f3f3f;line-height:1.9;font-size:15px;",
    strong: "font-weight:700;color:#3d2b1f;background:#e8c8a0;padding:1px 6px;border-radius:2px;",
    em: "font-style:italic;color:#8b6d4f;font-family:'Noto Serif SC',serif;",
    a: "color:#a0522d;text-decoration:none;border-bottom:1px dashed #a0522d;",
    img: "max-width:100%;height:auto;display:block;margin:24px auto;border:1px dashed #d4b896;padding:6px;background:#f5ebe0;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;border:1px dashed #d4b896;background:#ffffff;",
    th: "padding:12px 16px;background:#f5ebe0;border-bottom:1px dashed #c4956a;text-align:center;font-weight:600;color:#3d2b1f;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:1px;",
    td: "padding:12px 16px;border-bottom:1px dashed #e0d0c0;color:#3f3f3f;text-align:center;",
    hr: "border:none;height:1px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,#c4956a 8px,#c4956a 16px,transparent 16px,transparent 24px);margin:36px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  09 温暖治愈 — 最大圆角、最松散、奶油色
// ═══════════════════════════════════════════════════════════
const t09: Theme = {
  id: "warm-healing",
  name: "温暖治愈",
  description: "奶油暖调",
  previewBg: "#faf6f0",
  category: "治愈",
  styles: {
    container: `max-width:680px;margin:0 auto;padding:32px 20px 44px;background:#faf6f0;font-family:${S};color:#3f3f3f;font-size:15px;line-height:1.95;letter-spacing:0.6px;${WB}`,
    title: "font-size:22px;font-weight:700;color:#3d3229;line-height:1.45;margin-bottom:10px;text-align:center;letter-spacing:1px;background:#f0e8da;padding:12px 20px;border-radius:16px;",
    subtitle: "font-size:12px;color:#a69f97;text-align:center;margin-bottom:36px;font-style:italic;letter-spacing:1px;",
    h1: "font-size:17px;font-weight:700;color:#5c4b37;margin:36px 0 14px;padding:14px 18px;background:#f0e8da;line-height:1.45;border-radius:16px;text-align:center;",
    h2: "font-size:15px;font-weight:700;color:#7a6b5d;margin:26px 0 10px;padding:10px 14px;background:#f0e8da;border-radius:12px;text-align:center;border-bottom:2px dashed #e0d4c4;",
    h3: "font-size:14px;font-weight:700;color:#8b7d6b;margin:18px 0 6px;padding:6px 14px;background:#f0e8da;display:inline-block;border-radius:20px;",
    paragraph: "margin:14px 0;color:#3f3f3f;line-height:1.95;font-size:15px;",
    blockquote: "margin:24px 0;padding:16px 18px;background:#f0e8da;color:#7a6b5d;font-size:14px;line-height:1.9;border-radius:20px;font-style:italic;",
    code: "background:#f0e8da;padding:2px 8px;border-radius:8px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#c75c2e;",
    codeBlock: "background:#3d3229;color:#faf6f0;padding:16px;border-radius:16px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.75;margin:20px 0;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:16px;",
    ul: "margin:14px 0;padding-left:20px;list-style:disc;",
    ol: "margin:14px 0;padding-left:20px;",
    li: "margin:8px 0;color:#3f3f3f;line-height:1.85;font-size:15px;",
    strong: "font-weight:700;color:#3d3229;background:#f0e8da;padding:3px 10px;border-radius:8px;",
    em: "font-style:italic;color:#8b7d6b;",
    a: "color:#c75c2e;text-decoration:none;border-bottom:2px solid #e0d4c4;font-weight:600;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:16px;border:2px solid #e0d4c4;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;border:1px solid #e0d4c4;background:#ffffff;border-radius:12px;overflow:hidden;",
    th: "padding:12px 14px;background:#f0e8da;border-bottom:2px solid #e0d4c4;text-align:left;font-weight:700;color:#3d3229;font-size:13px;",
    td: "padding:12px 14px;border-bottom:1px solid #f0e8da;color:#3f3f3f;",
    hr: "border:none;height:2px;background:repeating-linear-gradient(90deg,#e0d4c4,#e0d4c4 8px,transparent 8px,transparent 16px);margin:32px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  10 清新自然 — 绿色系、叶子感、呼吸感
// ═══════════════════════════════════════════════════════════
const t10: Theme = {
  id: "fresh-nature",
  name: "清新自然",
  description: "绿意盎然",
  previewBg: "#f2f7f0",
  category: "治愈",
  styles: {
    container: `max-width:700px;margin:0 auto;padding:32px 20px 44px;background:#f2f7f0;font-family:${S};color:#3f3f3f;font-size:15px;line-height:1.9;letter-spacing:0.5px;${WB}`,
    title: "font-size:22px;font-weight:700;color:#1a3c2a;line-height:1.45;margin-bottom:10px;text-align:center;letter-spacing:1px;background:#d8e8d4;padding:12px 20px;border-radius:8px;",
    subtitle: "font-size:12px;color:#6a8a6a;text-align:center;margin-bottom:36px;font-style:italic;letter-spacing:1px;",
    h1: "font-size:17px;font-weight:700;color:#2d4a35;margin:36px 0 14px;padding:14px 18px;background:#d8e8d4;line-height:1.45;border-radius:8px;text-align:center;",
    h2: "font-size:15px;font-weight:700;color:#3d6a45;margin:26px 0 10px;padding:10px 14px;background:#d8e8d4;border-radius:8px;text-align:center;border-bottom:2px dashed #a0c8a0;",
    h3: "font-size:14px;font-weight:700;color:#4d7a55;margin:18px 0 6px;padding:6px 14px;background:#d8e8d4;display:inline-block;border-radius:8px;",
    paragraph: "margin:14px 0;color:#3f3f3f;line-height:1.9;font-size:15px;",
    blockquote: "margin:24px 0;padding:16px 18px;background:#d8e8d4;border-left:4px solid #4a8a4a;color:#3d6a45;font-size:14px;line-height:1.9;border-radius:0 12px 12px 0;font-style:italic;",
    code: "background:#d8e8d4;padding:2px 8px;border-radius:6px;font-family:'SF Mono',Monaco,monospace;font-size:13px;color:#2d6a32;",
    codeBlock: "background:#1a3c2a;color:#d8e8d4;padding:16px;border-radius:12px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:12px;line-height:1.75;margin:20px 0;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:12px;",
    ul: "margin:14px 0;padding-left:20px;list-style:disc;",
    ol: "margin:14px 0;padding-left:20px;",
    li: "margin:8px 0;color:#3f3f3f;line-height:1.85;font-size:15px;position:relative;padding-left:12px;",
    strong: "font-weight:700;color:#1a3c2a;background:#d8e8d4;padding:3px 10px;border-radius:6px;",
    em: "font-style:italic;color:#5a8a5a;",
    a: "color:#2d8a4a;text-decoration:none;border-bottom:2px solid #a0c8a0;font-weight:600;",
    img: "max-width:100%;height:auto;display:block;margin:20px auto;border-radius:12px;border:2px solid #c0d8c0;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;border:1px solid #c0d8c0;background:#ffffff;border-radius:12px;overflow:hidden;",
    th: "padding:12px 14px;background:#d8e8d4;border-bottom:2px solid #a0c8a0;text-align:left;font-weight:700;color:#1a3c2a;font-size:13px;",
    td: "padding:12px 14px;border-bottom:1px solid #d8e8d4;color:#3f3f3f;",
    hr: "border:none;height:2px;background:repeating-linear-gradient(90deg,#a0c8a0,#a0c8a0 8px,transparent 8px,transparent 16px);margin:32px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  11 商务蓝调 — 最紧凑、严格网格、professional
// ═══════════════════════════════════════════════════════════
const t11: Theme = {
  id: "business-blue",
  name: "商务蓝调",
  description: "专业可靠",
  previewBg: "#f0f4f8",
  category: "商务",
  styles: {
    container: `max-width:760px;margin:0 auto;padding:24px 20px 40px;background:#f0f4f8;font-family:${S};color:#3f3f3f;font-size:15px;line-height:1.75;letter-spacing:0.3px;${WB}`,
    title: "font-size:20px;font-weight:800;color:#0d2137;line-height:1.3;margin-bottom:6px;letter-spacing:-0.3px;",
    subtitle: "font-size:12px;color:#6b7f99;margin-bottom:32px;padding-bottom:10px;border-bottom:2px solid #c0cee0;",
    h1: "font-size:17px;font-weight:800;color:#0d2137;margin:32px 0 12px;padding-bottom:8px;border-bottom:2px solid #2b6cb0;",
    h2: "font-size:15px;font-weight:700;color:#1e3a5f;margin:24px 0 10px;padding-left:10px;border-left:4px solid #2b6cb0;",
    h3: "font-size:14px;font-weight:700;color:#2b6cb0;margin:16px 0 6px;background:#dbe4f0;padding:5px 10px;border-radius:3px;display:inline-block;",
    paragraph: "margin:10px 0;color:#3f3f3f;line-height:1.75;font-size:15px;",
    blockquote: "margin:16px 0;padding:10px 14px;background:#dbe4f0;border-left:4px solid #2b6cb0;color:#1e3a5f;font-size:13px;line-height:1.8;border-radius:0 4px 4px 0;",
    code: "background:#dbe4f0;padding:1px 6px;border-radius:3px;font-family:'SF Mono',Monaco,monospace;font-size:12px;color:#c53030;border:1px solid #c0cee0;",
    codeBlock: "background:#0d2137;color:#dbe4f0;padding:12px;border-radius:4px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:11px;line-height:1.65;margin:16px 0;",
    pre: "margin:16px 0;overflow-x:auto;border-radius:4px;",
    ul: "margin:10px 0;padding-left:18px;list-style:disc;",
    ol: "margin:10px 0;padding-left:18px;",
    li: "margin:6px 0;color:#3f3f3f;line-height:1.75;font-size:15px;",
    strong: "font-weight:800;color:#0d2137;background:linear-gradient(transparent 60%,#a8c4e8 60%);padding:0 2px;",
    em: "font-style:italic;color:#6b7f99;",
    a: "color:#2b6cb0;text-decoration:none;border-bottom:2px solid #2b6cb0;font-weight:700;",
    img: "max-width:100%;height:auto;display:block;margin:16px auto;border-radius:3px;border:1px solid #c0cee0;",
    table: "width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;border:1px solid #c0cee0;background:#ffffff;",
    th: "padding:10px 12px;background:#dbe4f0;border-bottom:2px solid #2b6cb0;text-align:left;font-weight:800;color:#0d2137;font-size:12px;",
    td: "padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#3f3f3f;",
    hr: "border:none;height:2px;background:#c0cee0;margin:28px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  12 党政红金 — 最庄重、居中对称、红金配色
// ═══════════════════════════════════════════════════════════
const t12: Theme = {
  id: "red-gold",
  name: "党政红金",
  description: "庄重大气",
  previewBg: "#fdf6f0",
  category: "国风",
  styles: {
    container: `max-width:620px;margin:0 auto;padding:36px 20px 48px;background:#fdf6f0;font-family:${R};color:#3f3f3f;font-size:16px;line-height:2.0;letter-spacing:1px;${WB}`,
    title: "font-size:26px;font-weight:700;color:#b22222;line-height:1.4;margin-bottom:14px;text-align:center;letter-spacing:4px;font-family:'Noto Serif SC','Songti SC',serif;",
    subtitle: "font-size:13px;color:#c4956a;text-align:center;margin-bottom:44px;letter-spacing:3px;font-family:'PingFang SC',sans-serif;",
    h1: "font-size:22px;font-weight:700;color:#b22222;margin:44px 0 16px;padding:14px 0;border-bottom:2px solid #c4956a;border-top:2px solid #c4956a;text-align:center;letter-spacing:3px;font-family:'Noto Serif SC','Songti SC',serif;",
    h2: "font-size:18px;font-weight:700;color:#8b1a1a;margin:32px 0 12px;padding:12px 20px;background:#f5e6d3;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;border-radius:2px;",
    h3: "font-size:16px;font-weight:700;color:#a63d3d;margin:20px 0 8px;text-align:center;letter-spacing:2px;font-family:'Noto Serif SC','Songti SC',serif;",
    paragraph: "margin:14px 0;color:#5c1a1a;line-height:2.0;font-size:16px;text-align:justify;text-indent:2em;",
    blockquote: "margin:28px 0;padding:18px 24px;background:#f5e6d3;border:1px solid #c4956a;color:#6a1a1a;font-size:15px;line-height:2.0;border-radius:2px;font-style:italic;font-family:'Noto Serif SC',serif;text-align:center;",
    code: "background:#f5e6d3;padding:2px 8px;border-radius:2px;font-family:'SF Mono',Monaco,monospace;font-size:14px;color:#b22222;border:1px solid #e0c8a0;",
    codeBlock: "background:#5c1a1a;color:#f5e6d3;padding:18px;border-radius:2px;overflow-x:auto;font-family:'SF Mono',Monaco,monospace;font-size:13px;line-height:1.75;margin:20px 0;",
    pre: "margin:20px 0;overflow-x:auto;border-radius:2px;",
    ul: "margin:14px 0;padding-left:24px;list-style:disc;",
    ol: "margin:14px 0;padding-left:24px;",
    li: "margin:10px 0;color:#5c1a1a;line-height:1.95;font-size:16px;",
    strong: "font-weight:700;color:#b22222;background:linear-gradient(transparent 70%,#e8c8a0 70%);padding:0 3px;",
    em: "font-style:italic;color:#8b1a1a;font-family:'Noto Serif SC',serif;",
    a: "color:#b22222;text-decoration:none;border-bottom:1px solid #b22222;font-weight:600;",
    img: "max-width:100%;height:auto;display:block;margin:24px auto;border:6px solid #f5e6d3;background:#f5e6d3;",
    table: "width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;border:1px solid #e0c8a0;background:#ffffff;",
    th: "padding:14px 18px;background:#f5e6d3;border-bottom:2px solid #c4956a;text-align:center;font-weight:700;color:#b22222;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:1px;",
    td: "padding:14px 18px;border-bottom:1px solid #f0dcc8;color:#5c1a1a;text-align:center;",
    hr: "border:none;height:2px;background:repeating-linear-gradient(90deg,#c4956a,#c4956a 10px,transparent 10px,transparent 20px);margin:36px 0;",
  },
}

// ═══════════════════════════════════════════════════════════
//  EXPORT
// ═══════════════════════════════════════════════════════════

export const themes: Theme[] = [
  t01, t02, t03, t04, t05, t06,
  t07, t08, t09, t10, t11, t12,
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
]