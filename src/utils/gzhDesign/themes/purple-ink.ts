// 紫墨主题 —— 温柔克制，淡紫底 + 烟紫强调，衬线标题营造静谧手记感。

import { escapeHtml, isConclusionTitle } from "../shared"

export const DESIGN_TOKENS = {
  primary: "#7C4D9E",
  primaryLight: "#9B6BBF",
  accent: "#C9A8D9",
  bg: "#FAF8FB",
  paper: "#F2EDF5",
  text: "#4A3F4A",
  title: "#2E2333",
  secondary: "#7D6E80",
  muted: "#A99AAC",
  divider: "#DDD5E1",
  highlightBg: "#F0E3F7",
  codeBg: "#2E2333",
  codeText: "#F2EDF5",
  codeTitleBg: "#211829",
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
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;background:${t.bg};font-family:${t.fontStack};color:${t.text};line-height:${t.lineHeight};letter-spacing:${t.letterSpacing}px;overflow-x:hidden;">${children}</section>`
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
  const marginTop = isFirst ? "16px" : "52px"
  const chapterLabel = number === "∞" ? label : `${label} ${number}`
  return `
<section style="margin-top:${marginTop};margin-bottom:32px;padding:0 20px;">
  <p style="font-size:10px;font-weight:600;color:${t.primary};letter-spacing:2.5px;margin:0 0 6px;text-transform:uppercase;opacity:0.85;">${span(chapterLabel)}</p>
  <h2 style="font-family:${t.titleFont};font-size:23px;font-weight:700;color:${t.title};margin:0;line-height:1.4;letter-spacing:0.6px;">${span(title)}</h2>
  <section style="width:28px;height:1px;background:${t.primary};margin-top:12px;border-radius:1px;opacity:0.4;">${span("<br>")}</section>
</section>`
}

export function paragraph(children: string): string {
  const t = DESIGN_TOKENS
  return `<p style="margin:0 0 28px;font-size:${t.bodySize}px;line-height:${t.lineHeight};color:${t.text};font-family:${t.fontStack};text-align:left;text-indent:2em;word-break:normal;overflow-wrap:break-word;">${children}</p>`
}

export function strong(text: string): string {
  const t = DESIGN_TOKENS
  return `<strong style="color:${t.title};font-weight:700;letter-spacing:0.2px;">${span(text)}</strong>`
}

export function inlineCode(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.paper};color:${t.primary};padding:1px 5px;border-radius:4px;font-family:${t.monoStack};font-size:0.86em;font-weight:500;border:1px solid rgba(124,77,158,0.15);letter-spacing:0.2px;">${span(text)}</span>`
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
<section style="margin:0 0 32px;padding:24px;background:linear-gradient(135deg,${t.paper} 0%,${t.bg} 100%);border:1px solid ${t.divider};border-radius:12px;">
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
        return `<p style="margin:0;font-family:${t.monoStack};font-size:13.5px;line-height:1.75;color:${t.codeText};">${span("\u00A0")}</p>`
      }

      let indent = 0
      while (indent < normalized.length && normalized[indent] === " ") indent++
      const content = normalized.slice(indent)
      const indentLevel = Math.min(indent, 8)

      return `<p style="margin:0;padding-left:${indentLevel}ch;font-family:${t.monoStack};font-size:13.5px;line-height:1.75;color:${t.codeText};">${span(escapeHtml(content))}</p>`
    })
    .join("")

  const langTag = language
    ? `<span style="margin-left:auto;font-size:11px;color:${t.muted};font-family:${t.fontStack};letter-spacing:1.5px;text-transform:uppercase;">${span(language)}</span>`
    : ""

  return `
<section style="margin:0 0 28px;border-radius:10px;overflow:hidden;background:${t.codeBg};border:1px solid rgba(247,242,236,0.08);box-shadow:0 8px 24px -10px rgba(46,38,34,0.22);">
  <section style="display:flex;align-items:center;padding:9px 16px;background:${t.codeTitleBg};border-bottom:1px solid rgba(247,242,236,0.06);">
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#7D6E80;margin-right:6px;font-size:0;line-height:0;overflow:hidden;">${span("")}</span>
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#A99AAC;margin-right:6px;font-size:0;line-height:0;overflow:hidden;">${span("")}</span>
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
  return `
<section style="margin:32px 0;">
  <img src="${src}" alt="${alt || ""}" style="width:100%;max-width:100%;height:auto;display:block;border-radius:10px;border:1px solid ${t.divider};box-shadow:0 10px 28px -12px rgba(46,38,34,0.16);">
  ${caption}
</section>`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:44px 20px 36px;padding:32px 24px;background:${t.paper};border-radius:10px;text-align:center;">
  <section style="width:32px;height:1px;background:${t.primary};margin:0 auto 18px;opacity:0.6;">${span("<br>")}</section>
  <p style="font-family:${t.titleFont};font-size:15px;color:${t.title};margin:0 0 10px;line-height:1.7;letter-spacing:0.5px;">${span("若这篇文字曾让你有所停留")}</p>
  <p style="font-size:13px;color:${t.secondary};margin:0 0 18px;line-height:1.7;">${span("欢迎点赞、在看，或分享给同频的人")}</p>
  <p style="font-family:${t.titleFont};font-size:11px;color:${t.muted};letter-spacing:2px;margin:0;">${span("— 感谢阅读 —")}</p>
</section>`
}

export function onelinerCard(children: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:0 0 32px;padding:20px;background:${t.paper};border:1px solid ${t.divider};border-radius:10px;">
  <p style="font-family:${t.titleFont};font-size:15px;color:${t.title};margin:0;line-height:1.7;text-align:center;">${children}</p>
</section>`
}

export function cover(
  title: string,
  subtitle: string,
  image?: string,
  tag?: string,
  date?: string,
  titleHighlight?: string,
  titleLine2?: string
): string {
  const t = DESIGN_TOKENS
  const metaParts = [tag, date].filter(Boolean)
  const meta =
    metaParts.length > 0
      ? `<p style="font-size:12px;color:${t.muted};margin:0 0 24px;letter-spacing:1px;text-align:center;">${span(metaParts.join(" · "))}</p>`
      : ""
  const line2Block = titleLine2
    ? `<p style="font-family:${t.titleFont};font-size:20px;font-weight:500;color:${t.title};margin:10px 0 0;line-height:1.35;letter-spacing:0.5px;">${span(titleLine2)}</p>`
    : ""
  const highlightBlock = titleHighlight
    ? `<p style="font-family:${t.titleFont};font-size:16px;font-weight:500;color:${t.primary};margin:14px 0 0;letter-spacing:0.5px;line-height:1.5;">${span(titleHighlight)}</p>`
    : ""
  const subtitleBlock = subtitle
    ? `<p style="font-size:15px;color:${t.secondary};margin:18px auto 0;line-height:1.8;max-width:520px;letter-spacing:0.4px;">${span(subtitle)}</p>`
    : ""
  const imageBlock = image
    ? `<section style="margin:32px 0 0;padding:0 4px;"><img src="${image}" alt="封面图" style="max-width:100%;height:auto;display:block;margin:0 auto;border-radius:12px;box-shadow:0 10px 28px -12px rgba(46,35,51,0.18);"></section>`
    : ""

  return `
<section style="margin:0 0 40px;padding:40px 20px 36px;background:${t.bg};text-align:center;">
  ${meta}
  <h1 style="font-family:${t.titleFont};font-size:34px;font-weight:700;color:${t.title};margin:0;line-height:1.25;letter-spacing:0.8px;">${span(title)}</h1>
  ${line2Block}
  ${highlightBlock}
  ${subtitleBlock}
  <section style="width:36px;height:1px;background:${t.primary};margin:24px auto 0;border-radius:1px;">${span("<br>")}</section>
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
<section style="display:flex;align-items:center;padding:10px 0;border-bottom:${isLast ? "none" : `1px solid ${t.divider}`};">
  <span style="font-family:${t.titleFont};font-size:13px;font-weight:600;color:${t.primaryLight};min-width:32px;text-align:right;letter-spacing:0.5px;margin-right:12px;">${span(num)}</span>
  <span style="width:4px;height:4px;border-radius:50%;background:${t.accent};flex-shrink:0;font-size:0;line-height:0;overflow:hidden;margin-right:12px;">${span(".")}</span>
  <span style="font-size:14px;font-weight:500;color:${t.title};line-height:1.5;flex:1;margin-right:12px;">${span(chapter.title)}</span>
  <span style="font-family:${t.titleFont};font-size:12px;color:${t.muted};">${span("→")}</span>
</section>`
    })
    .join("")

  return `
<section style="margin:0 20px 40px;padding:24px 22px;background:${t.paper};border-radius:12px;border-top:2px solid ${t.primary};">
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
  <h3 style="font-family:${t.titleFont};font-size:15px;font-weight:700;color:${t.title};margin:0;line-height:1.5;letter-spacing:0.5px;">${span(title)}</h3>
</section>`
}

export function list(items: string[], ordered?: boolean): string {
  const t = DESIGN_TOKENS
  const gap = ordered ? "14px" : "12px"
  const rowSpacing = "16px"
  const markerTop = ordered ? "3px" : "10px"

  if (ordered) {
    const rows = items
      .map(
        (item, index) => `
<section style="display:flex;align-items:flex-start;margin-bottom:${rowSpacing};">
  <span style="flex-shrink:0;width:22px;height:22px;line-height:22px;text-align:center;background:${t.paper};border:1px solid ${t.divider};border-radius:50%;font-family:${t.titleFont};font-size:11px;font-weight:700;color:${t.primary};margin-top:${markerTop};margin-right:${gap};">${span(String(index + 1))}</span>
  <p style="margin:0;font-size:${t.bodySize}px;color:${t.text};line-height:${t.lineHeight};flex:1;">${item}</p>
</section>`
      )
      .join("")
    return `<section style="margin:6px 0 28px;">${rows}</section>`
  }

  const rows = items
    .map(
      (item) => `
<section style="display:flex;align-items:flex-start;margin-bottom:${rowSpacing};">
  <span style="flex-shrink:0;width:5px;height:5px;border-radius:50%;background:${t.primaryLight};margin-top:${markerTop};margin-right:${gap};font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
  <p style="margin:0;font-size:${t.bodySize}px;color:${t.text};line-height:${t.lineHeight};flex:1;">${item}</p>
</section>`
    )
    .join("")
  return `<section style="margin:6px 0 28px;">${rows}</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:44px 20px;display:flex;align-items:center;justify-content:center;">
  <span style="display:inline-block;width:48px;height:1px;background:${t.divider};font-size:0;line-height:0;overflow:hidden;margin-right:14px;">${span("—")}</span>
  <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${t.primaryLight};font-size:0;line-height:0;overflow:hidden;opacity:0.6;margin-right:14px;">${span("·")}</span>
  <span style="display:inline-block;width:48px;height:1px;background:${t.divider};font-size:0;line-height:0;overflow:hidden;">${span("—")}</span>
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
<section style="background:${t.bg};border-radius:10px;overflow:hidden;border:1px solid ${t.divider};box-shadow:0 2px 8px -4px rgba(46,35,51,0.08);margin-right:12px;margin-bottom:12px;">
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
<section style="margin:0 0 28px;padding:20px;background:${t.paper};border-radius:12px;">
  <p style="font-size:10px;font-weight:700;color:${t.muted};letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">${span("COLOR PALETTE")}</p>
  <h4 style="font-family:${t.titleFont};font-size:16px;font-weight:700;color:${t.title};margin:0 0 18px;line-height:1.4;">${span(title)}</h4>
  <section style="display:flex;flex-wrap:wrap;">
    ${swatches}
  </section>
</section>`
}
