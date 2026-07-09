// 暖墨主题 —— 温柔克制，暖白底 + 陶土红，衬线标题营造个人手记感。

import { escapeHtml, isConclusionTitle } from "../shared"

export const DESIGN_TOKENS = {
  primary: "#B85C50",
  primaryLight: "#D97B6D",
  accent: "#E8A598",
  bg: "#FDFBF7",
  paper: "#F7F2EC",
  text: "#4A403A",
  title: "#2E2622",
  secondary: "#7A6E65",
  muted: "#A89B91",
  divider: "#E0D5CC",
  highlightBg: "#FCE8E4",
  codeBg: "#2E2622",
  codeText: "#F7F2EC",
  codeTitleBg: "#1E1916",
  fontStack:
    "-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",
  titleFont: "'Noto Serif SC',Georgia,'Times New Roman',serif",
  monoStack: "'SF Mono',Consolas,Monaco,monospace",
  maxWidth: 677,
  bodySize: 15,
  lineHeight: 1.9,
  letterSpacing: 0.3,
}

function span(text: string): string {
  return `<span leaf="">${text}</span>`
}

export function container(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;background:${t.bg};font-family:${t.fontStack};color:${t.text};line-height:${t.lineHeight};letter-spacing:${t.letterSpacing}px;word-break:normal;overflow-wrap:break-word;overflow-x:hidden;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;">${children}</section>`
}

export function chapterMeta(
  index: number,
  total: number,
  title: string
): { number: string; label: string } {
  const isLast = index === total - 1
  if (isLast && isConclusionTitle(title)) {
    return { number: "∞", label: "FINALE" }
  }
  return { number: String(index + 1).padStart(2, "0"), label: "CHAPTER" }
}

export function chapterTitle(
  number: string,
  title: string,
  label: string,
  isFirst: boolean
): string {
  const t = DESIGN_TOKENS
  const marginTop = isFirst ? "28px" : "52px"
  const chapterLabel = number === "∞" ? label : `${label} ${number}`
  return `
<section style="margin-top:${marginTop};margin-bottom:32px;padding:0 20px;box-sizing:border-box;">
  <p style="font-size:10px;font-weight:600;color:${t.primary};letter-spacing:2.5px;margin:0 0 6px;text-transform:uppercase;opacity:0.85;">${span(chapterLabel)}</p>
  <h2 style="font-family:${t.titleFont};font-size:23px;font-weight:700;color:${t.title};margin:0;line-height:1.4;letter-spacing:0.6px;">${span(title)}</h2>
  <section style="width:36px;height:2px;background:${t.primary};margin-top:12px;border-radius:1px;opacity:0.35;">${span("<br>")}</section>
</section>`
}

export function paragraph(children: string): string {
  const t = DESIGN_TOKENS
  return `<p style="margin:0 0 28px;font-size:16px;line-height:${t.lineHeight};color:${t.text};font-family:${t.fontStack};text-align:left;text-indent:2em;word-break:normal;overflow-wrap:break-word;">${children}</p>`
}

export function strong(text: string): string {
  const t = DESIGN_TOKENS
  return `<strong style="color:${t.title};font-weight:700;letter-spacing:0.2px;">${span(text)}</strong>`
}

export function inlineCode(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.paper};color:${t.primary};padding:1px 5px;border-radius:4px;font-family:${t.monoStack};font-size:0.86em;font-weight:500;border:1px solid rgba(184,92,80,0.15);letter-spacing:0.2px;word-break:break-all;line-height:1.4;">${span(text)}</span>`
}

export function underline(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="border-bottom:1px solid ${t.primaryLight};padding-bottom:2px;color:${t.title};">${span(text)}</span>`
}

export function highlight(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.highlightBg};color:${t.title};padding:1px 4px;border-radius:3px;font-weight:600;">${span(text)}</span>`
}

export function quoteBox(children: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:0 0 32px;padding:24px;background:linear-gradient(135deg,${t.paper} 0%,${t.bg} 100%);border:1px solid ${t.divider};border-radius:12px;box-shadow:0 6px 18px -10px rgba(74,64,58,0.12);box-sizing:border-box;">
  <p style="font-family:${t.titleFont};font-size:15px;color:${t.title};margin:0;line-height:1.85;letter-spacing:0.4px;font-style:italic;">
    <span style="color:${t.primary};font-size:20px;font-family:${t.titleFont};line-height:0;vertical-align:-5px;margin-right:5px;opacity:0.5;">${span("“")}</span>${children}
  </p>
</section>`
}

export function codeBlock(language: string, code: string): string {
  const t = DESIGN_TOKENS

  const rawLines = code.split("\n")
  if (rawLines[rawLines.length - 1] === "") rawLines.pop()

  const lines = rawLines
    .map((line) => {
      const normalized = line.replace(/\t/g, "  ")

      if (normalized.trim() === "") {
        return `<p style="margin:0;font-family:${t.monoStack};font-size:13.5px;line-height:1.75;color:${t.codeText};overflow-wrap:break-word;">${span("\u00A0")}</p>`
      }

      let indent = 0
      while (indent < normalized.length && normalized[indent] === " ") indent++
      const content = normalized.slice(indent)
      const indentLevel = Math.min(indent, 8)

      return `<p style="margin:0;padding-left:${indentLevel}ch;font-family:${t.monoStack};font-size:13.5px;line-height:1.75;color:${t.codeText};overflow-wrap:break-word;">${span(escapeHtml(content))}</p>`
    })
    .join("")

  const langTag = language
    ? `<span style="margin-left:auto;font-size:11px;color:${t.muted};font-family:${t.fontStack};letter-spacing:1.5px;text-transform:uppercase;flex-shrink:0;">${span(language)}</span>`
    : ""

  return `
<section style="margin:0 0 32px;border-radius:12px;overflow:hidden;background:${t.codeBg};border:1px solid rgba(247,242,236,0.08);box-shadow:0 8px 24px -10px rgba(46,38,34,0.22);-webkit-font-smoothing:antialiased;">
  <section style="display:flex;align-items:center;padding:9px 16px;background:${t.codeTitleBg};border-bottom:1px solid rgba(247,242,236,0.06);">
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#7A6E65;margin-right:6px;font-size:0;line-height:0;overflow:hidden;">${span("")}</span>
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#A89B91;margin-right:6px;font-size:0;line-height:0;overflow:hidden;">${span("")}</span>
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${t.codeText};opacity:0.35;font-size:0;line-height:0;overflow:hidden;">${span("")}</span>
    ${langTag}
  </section>
  <section style="padding:16px 16px 18px;">
    ${lines}
  </section>
</section>`
}

export function imageCard(src: string, alt: string): string {
  const t = DESIGN_TOKENS
  const caption = alt
    ? `<p style="font-family:${t.titleFont};font-size:12px;font-style:italic;color:${t.muted};text-align:center;line-height:1.6;letter-spacing:0.8px;margin:16px 0 0;word-break:break-word;">${span(`— ${alt}`)}</p>`
    : ""
  const img = `<img src="${src}" alt="${alt || ""}" style="width:100%;max-width:100%;height:auto;display:block;border-radius:12px;border:1px solid ${t.divider};box-shadow:0 8px 22px -10px rgba(46,38,34,0.14);">`
  return `
<section style="margin:32px 0;border-radius:12px;overflow:hidden;">
  ${img}
  ${caption}
</section>`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:48px 20px 36px;padding:32px 28px;background:${t.paper};border-radius:12px;text-align:center;border:1px solid ${t.divider};box-shadow:0 6px 18px -10px rgba(74,64,58,0.1);box-sizing:border-box;">
  <section style="width:32px;height:2px;background:${t.primary};margin:0 auto 18px;border-radius:1px;opacity:0.4;">${span("<br>")}</section>
  <p style="font-family:${t.titleFont};font-size:17px;color:${t.title};margin:0 0 10px;line-height:1.7;letter-spacing:0.5px;">${span("若这篇文字曾让你有所停留")}</p>
  <p style="font-size:14px;color:${t.secondary};margin:0 0 18px;line-height:1.7;">${span("欢迎点赞、在看，或分享给同频的人")}</p>
  <p style="font-family:${t.titleFont};font-size:12px;color:${t.muted};letter-spacing:2px;margin:0;">${span("— 感谢阅读 —")}</p>
</section>`
}

export function onelinerCard(children: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:0 0 32px;padding:24px;background:${t.paper};border:1px solid ${t.divider};border-radius:12px;box-shadow:0 6px 18px -10px rgba(74,64,58,0.1);box-sizing:border-box;">
  <section style="width:32px;height:2px;background:${t.primary};margin:0 auto 14px;border-radius:1px;opacity:0.4;">${span("<br>")}</section>
  <p style="font-family:${t.titleFont};font-size:17px;color:${t.title};margin:0;line-height:1.75;text-align:center;letter-spacing:0.4px;">${children}</p>
</section>`
}

export function cover(
  title: string,
  subtitle: string,
  image?: string,
  tag?: string,
  date?: string,
  titleHighlight?: string,
  titleLine2?: string,
  showTitle = true
): string {
  const t = DESIGN_TOKENS
  const metaParts = [tag, date].filter(Boolean)
  const meta =
    metaParts.length > 0
      ? `<p style="font-size:12px;color:${t.muted};margin:0 0 24px;letter-spacing:1px;text-align:center;">${span(metaParts.join(" · "))}</p>`
      : ""
  const line2Block = titleLine2
    ? `<p style="display:block;max-width:100%;font-family:${t.titleFont};font-size:19px;font-weight:500;color:${t.title};margin:10px auto 0;line-height:1.35;letter-spacing:0;word-break:break-all;">${span(titleLine2)}</p>`
    : ""
  const highlightBlock = titleHighlight
    ? `<p style="display:block;max-width:100%;font-family:${t.titleFont};font-size:15px;font-weight:500;color:${t.primary};margin:14px auto 0;line-height:1.5;word-break:break-all;">${span(titleHighlight)}</p>`
    : ""
  const subtitleBlock = subtitle
    ? `<p style="display:block;max-width:520px;font-size:16px;color:${t.secondary};margin:18px auto 0;line-height:1.8;letter-spacing:0.4px;">${span(subtitle)}</p>`
    : ""
  const imageBlock = image
    ? `<section style="margin:32px 0 0;width:100%;border-radius:12px;overflow:hidden;border:1px solid ${t.divider};box-shadow:0 10px 28px -12px rgba(74,64,58,0.18);background:${t.bg};"><img src="${image}" alt="" style="width:100%;height:auto;display:block;"></section>`
    : ""
  const titleBlock = showTitle
    ? `<h1 style="display:inline-block;max-width:100%;font-family:${t.titleFont};font-size:32px;font-weight:700;color:${t.title};margin:0;line-height:1.3;letter-spacing:0;word-break:break-all;vertical-align:top;">${span(title)}</h1>`
    : ""

  return `
<section style="margin:0 0 48px;padding:40px 20px 36px;background:${t.bg};text-align:center;box-sizing:border-box;">
  ${meta}
  ${titleBlock}
  ${line2Block}
  ${highlightBlock}
  ${subtitleBlock}
  <section style="width:40px;height:2px;background:${t.primary};margin:24px auto 0;border-radius:1px;opacity:0.8;">${span("<br>")}</section>
  ${imageBlock}
</section>`
}

export function toc(chapters: Array<{ number: string; title: string }>): string {
  const t = DESIGN_TOKENS
  if (chapters.length < 2) return ""

  const rows = chapters
    .map((chapter, index) => {
      const isLast = index === chapters.length - 1
      const isConc = isLast && isConclusionTitle(chapter.title)
      const num = isConc ? "∞" : chapter.number
      return `
<section style="display:flex;align-items:center;padding:11px 0;border-bottom:${isLast ? "none" : `1px solid ${t.divider}`};">
  <span style="font-family:${t.titleFont};font-size:13px;font-weight:600;color:${t.primaryLight};min-width:32px;text-align:right;letter-spacing:0.5px;margin-right:12px;">${span(num)}</span>
  <span style="width:4px;height:4px;border-radius:50%;background:${t.accent};flex-shrink:0;font-size:0;line-height:0;overflow:hidden;margin-right:12px;">${span(".")}</span>
  <span style="font-size:14px;font-weight:500;color:${t.title};line-height:1.5;flex:1;word-break:break-word;overflow-wrap:break-word;margin-right:12px;">${span(chapter.title)}</span>
  <span style="font-family:${t.titleFont};font-size:12px;color:${t.muted};">${span("→")}</span>
</section>`
    })
    .join("")

  return `
<section style="margin:0 20px 40px;padding:24px 22px;background:${t.paper};border-radius:12px;border-top:2px solid ${t.primary};box-shadow:0 6px 18px -10px rgba(74,64,58,0.1);box-sizing:border-box;">
  <section style="margin:0 0 14px;">
    <p style="font-size:10px;font-weight:700;color:${t.muted};letter-spacing:3px;margin:0;text-transform:uppercase;">${span("CONTENTS")}</p>
    <section style="margin-top:8px;height:1px;background:${t.divider};">${span("<br>")}</section>
  </section>
  ${rows}
</section>`
}

export function subheading(title: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:36px 0 20px;padding:0 0 8px;border-bottom:1px solid ${t.divider};">
  <h3 style="font-family:${t.titleFont};font-size:17px;font-weight:700;color:${t.title};margin:0;line-height:1.4;letter-spacing:0.5px;">${span(title)}</h3>
</section>`
}

export function list(items: string[], ordered?: boolean): string {
  const t = DESIGN_TOKENS
  const rowSpacing = "16px"
  const orderedMarkerTop = "4px"
  const unorderedMarkerTop = "10px"

  if (ordered) {
    const rows = items
      .map(
        (item, index) => `
<section style="display:flex;align-items:flex-start;margin-bottom:${rowSpacing};">
  <span style="flex-shrink:0;width:22px;height:22px;line-height:22px;text-align:center;background:${t.paper};border:1px solid ${t.divider};border-radius:50%;font-family:${t.titleFont};font-size:11px;font-weight:700;color:${t.primary};margin-top:${orderedMarkerTop};margin-right:14px;">${span(String(index + 1))}</span>
  <p style="margin:0;font-size:16px;color:${t.text};line-height:${t.lineHeight};flex:1;word-break:break-word;overflow-wrap:break-word;">${item}</p>
</section>`
      )
      .join("")
    return `<section style="margin:6px 0 28px;">${rows}</section>`
  }

  const rows = items
    .map(
      (item) => `
<section style="display:flex;align-items:flex-start;margin-bottom:${rowSpacing};">
  <span style="flex-shrink:0;width:5px;height:5px;border-radius:50%;background:${t.primaryLight};margin-top:${unorderedMarkerTop};margin-right:12px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
  <p style="margin:0;font-size:16px;color:${t.text};line-height:${t.lineHeight};flex:1;word-break:break-word;overflow-wrap:break-word;">${item}</p>
</section>`
    )
    .join("")
  return `<section style="margin:6px 0 28px;">${rows}</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:48px 20px;display:flex;align-items:center;justify-content:center;">
  <span style="display:inline-block;width:48px;height:1px;background:${t.divider};font-size:0;line-height:0;overflow:hidden;margin:0 7px;">${span("—")}</span>
  <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${t.primaryLight};font-size:0;line-height:0;overflow:hidden;opacity:0.6;margin:0 7px;">${span("·")}</span>
  <span style="display:inline-block;width:48px;height:1px;background:${t.divider};font-size:0;line-height:0;overflow:hidden;margin:0 7px;">${span("—")}</span>
</section>`
}




export function heroMascot(title?: string, githubUrl?: string): string {
  const t = DESIGN_TOKENS
  // No cover content → render nothing instead of an empty broken box.
  if (!title && !githubUrl) return ""

  const titleBlock = title
    ? `<h1 style="display:block;font-family:${t.titleFont};font-size:28px;font-weight:700;color:${t.title};margin:0 0 8px;line-height:1.3;letter-spacing:0;text-align:center;word-break:break-all;">${span(title)}</h1>`
    : ""

  const githubBlock = (() => {
    if (!githubUrl) return ""
    const github = githubUrl || "https://github.com/your-github"
    const username = github.replace(/^.*github\.com\//, "").replace(/\/+$/, "") || "your-github"
    const githubIcon = `<span style="margin-right:4px;">${span("⭐")}</span>`
    return `<p style="text-align:center;margin:10px 0 0;"><a href="${github}" target="_blank" rel="noopener noreferrer" title="${username} on GitHub" style="display:inline-flex;align-items:center;font-family:${t.fontStack};font-size:12px;color:${t.primary};text-decoration:none;background:${t.paper};border:1px solid ${t.divider};border-radius:20px;padding:7px 14px;font-weight:600;letter-spacing:0.5px;min-height:28px;box-sizing:border-box;">${githubIcon}<span leaf="" style="flex-shrink:0;">${username}</span></a></p>`
  })()

  // Normal-flow card — no position/fixed/absolute, no external background image
  // (WeChat strips position:* and cannot fetch local url() backgrounds).
  return `
<section style="margin:28px auto 24px;width:calc(100% - 40px);box-sizing:border-box;background:${t.paper};border:1px solid ${t.divider};border-radius:12px;padding:28px 24px;text-align:center;box-shadow:0 8px 22px -10px rgba(74,64,58,0.15);">
  ${titleBlock}
  ${githubBlock}
</section>`
}

export function mascotWatermark(): string {
  const t = DESIGN_TOKENS
  // Plain card — drops the local fox background image (WeChat can't fetch it)
  // and the empty aspect-ratio box.
  return `
<section style="margin:0 auto 32px;width:calc(100% - 40px);box-sizing:border-box;text-align:center;background:${t.paper};border:1px solid ${t.divider};border-radius:12px;padding:28px;box-shadow:0 8px 22px -10px rgba(74,64,58,0.15);">
  <span style="display:inline-block;font-family:${t.titleFont};font-size:16px;color:${t.secondary};letter-spacing:1.5px;line-height:1.4;">${span("谢谢观看")}</span>
</section>`
}

export function colorPalette(
  title: string,
  colors: Array<{ name: string; hex: string; description?: string }>
): string {
  const t = DESIGN_TOKENS

  const swatches = colors
    .map((c) => {
      const hex = c.hex.trim().toUpperCase()
      return `
<section style="background:${t.bg};border-radius:10px;overflow:hidden;border:1px solid ${t.divider};box-shadow:0 2px 8px -4px rgba(46,38,34,0.08);margin:0 6px 12px 6px;">
  <section style="height:72px;background:${hex};"></section>
  <section style="padding:12px;">
    <p style="margin:0;font-family:${t.titleFont};font-size:14px;font-weight:700;color:${t.title};line-height:1.4;">${span(c.name)}</p>
    <p style="margin:4px 0 0;font-family:${t.monoStack};font-size:12px;color:${t.primary};letter-spacing:0.5px;">${span(hex)}</p>
    ${c.description ? `<p style="margin:6px 0 0;font-size:12px;color:${t.secondary};line-height:1.5;">${span(c.description)}</p>` : ""}
  </section>
</section>`
    })
    .join("")

  return `
<section style="margin:0 0 32px;padding:20px;background:${t.paper};border-radius:12px;border:1px solid ${t.divider};box-shadow:0 6px 18px -10px rgba(74,64,58,0.1);box-sizing:border-box;">
  <p style="font-size:10px;font-weight:700;color:${t.muted};letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">${span("COLOR PALETTE")}</p>
  <h4 style="font-family:${t.titleFont};font-size:17px;font-weight:700;color:${t.title};margin:0 0 18px;line-height:1.4;">${span(title)}</h4>
  <section style="display:flex;flex-wrap:wrap;">
    ${swatches}
  </section>
</section>`
}
