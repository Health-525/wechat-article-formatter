// 留白禅意风主题组件库 —— 从 gzh-design-skill 移植
// https://github.com/isjiamu/gzh-design-skill/blob/main/references/theme-zen-whitespace.md

import { isConclusionTitle } from "../shared"

export const DESIGN_TOKENS = {
  primary: "#4A5D52",
  secondary: "#A3A3A3",
  bg: "#FFFFFF",
  text: "#525252",
  title: "#2B2B2B",
  muted: "#A3A3A3",
  accent: "#B5C8BC",
  codeBg: "#1E293B",
  codeText: "#E2E8F0",
  codeTitleBg: "#0F172A",
  divider: "#E8E8E8",
  underline: "#B5C8BC",
  highlight: "#D6E4DC",
  tagBg: "#EEF3F0",
  tagText: "#3D5046",
  titleFont: "'Noto Serif SC', Georgia, 'Times New Roman', serif",
  fontStack:
    "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  monoStack: "'SF Mono', Consolas, Monaco, monospace",
  maxWidth: 677,
  bodySize: 15,
  lineHeight: 1.9,
  letterSpacing: 0.3,
}

function span(text: string): string {
  return `<span leaf="">${text}</span>`
}

export function chapterMeta(
  index: number,
  total: number,
  title: string
): { number: string; label: string } {
  const isLast = index === total - 1
  if (isLast && isConclusionTitle(title)) {
    return { number: "∞", label: "POSTSCRIPT" }
  }
  return { number: String(index + 1).padStart(2, "0"), label: "CHAPTER" }
}

export function container(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;background:${t.bg};font-family:${t.fontStack};color:${t.text};line-height:${t.lineHeight};letter-spacing:${t.letterSpacing}px;overflow-x:hidden;">${children}</section>`
}

export function chapterTitle(
  number: string,
  title: string,
  label: string,
  isFirst: boolean
): string {
  const t = DESIGN_TOKENS
  const partLabel = label || "CHAPTER"
  const marginTop = isFirst ? "32px" : "64px"
  return `
<section style="margin-top:${marginTop};margin-bottom:32px;padding:0 16px;">
  <p style="font-size:10px;color:${t.primary};font-weight:600;letter-spacing:4px;margin:0 0 10px;text-transform:uppercase;">
    ${span(`${number} · ${partLabel}`)}
  </p>
  <p style="font-family:${t.titleFont};font-size:22px;font-weight:700;color:${t.title};margin:0 0 16px;letter-spacing:0.5px;line-height:1.4;">
    ${span(title)}
  </p>
  <section style="width:40px;height:2px;background:${t.primary};">
    ${span("<br>")}
  </section>
</section>`
}

export function paragraph(children: string): string {
  const t = DESIGN_TOKENS
  return `<p style="margin-bottom:26px;font-size:${t.bodySize}px;line-height:${t.lineHeight};text-align:left;color:${t.text};padding:0 16px;">${children}</p>`
}

export function strong(text: string): string {
  const t = DESIGN_TOKENS
  return `<strong style="color:${t.title};">${span(text)}</strong>`
}

export function inlineCode(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.tagBg};color:${t.tagText};padding:2px 6px;border-radius:2px;font-size:14px;font-weight:600;">${span(text)}</span>`
}

export function underline(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="border-bottom:1.5px solid ${t.underline};font-weight:500;">${span(text)}</span>`
}

export function highlight(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:linear-gradient(180deg, transparent 60%, ${t.highlight} 60%);font-weight:600;color:${t.title};">${span(text)}</span>`
}

export function quoteBox(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="border-left:2px solid ${t.primary};padding:10px 20px 10px 20px;margin:0 16px 30px;background:${t.bg};"><p style="font-size:14px;color:${t.text};margin:0;line-height:1.9;text-align:left;">${children}</p></section>`
}

export function codeBlock(language: string, code: string): string {
  const t = DESIGN_TOKENS
  const lines = code
    .split("\n")
    .filter((line, idx, arr) => !(idx === arr.length - 1 && line === ""))
    .map((line) => {
      let indent = 0
      while (indent < line.length && line[indent] === " ") indent++
      const fullIndent = "　".repeat(Math.min(indent, 8))
      const content = line.slice(indent)
      return `<p style="margin:0;font-family:${t.monoStack};font-size:13px;line-height:1.6;color:${t.codeText};">${span(fullIndent + content)}</p>`
    })

  const langTag = language
    ? `<span style="margin-left:12px;font-size:12px;color:#64748B;font-family:${t.monoStack};letter-spacing:1px;">${span(language)}</span>`
    : ""

  return `
<section style="margin:0 16px 20px;border-radius:2px;overflow:hidden;background:${t.codeBg};">
  <section style="display:flex;align-items:center;padding:9px 14px;background:${t.codeTitleBg};">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#4A5D52;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#B5C8BC;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#D6E4DC;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    ${langTag}
  </section>
  <section style="padding:11px 14px;">
    ${lines.join("")}
  </section>
</section>`
}

export function imageCard(src: string, alt: string): string {
  const t = DESIGN_TOKENS
  const caption = alt
    ? `<p style="font-size:12px;color:${t.muted};text-align:center;margin:8px 16px 32px;letter-spacing:0.5px;">${span(`— ${alt}`)}</p>`
    : ""
  return `
<section style="margin:0 16px 8px;border:1px solid ${t.divider};">
  <section style="margin:0;overflow:hidden;">
    <img src="${src}" style="max-width:100%;display:block;">
  </section>
</section>
${caption}`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="padding:0 16px;">
  <section style="text-align:center;margin:48px 0 40px;">
    <section style="display:flex;align-items:center;justify-content:center;">
      <span style="height:1px;width:48px;background:${t.divider};margin-right:16px;">${span("<br>")}</span>
      <span style="font-family:${t.titleFont};font-size:12px;color:${t.primary};letter-spacing:4px;font-weight:400;">${span("完")}</span>
      <span style="height:1px;width:48px;background:${t.divider};margin-left:16px;">${span("<br>")}</span>
    </section>
  </section>
</section>
<section style="padding:0 16px 40px;">
  <p style="margin-bottom:26px;font-size:${t.bodySize}px;line-height:${t.lineHeight};text-align:left;color:${t.text};">
    ${span("若有所得，欢迎")}
    <strong style="color:${t.primary};">${span("点赞、在看、转发")}</strong>
    ${span("，下回再叙。")}
  </p>
</section>`
}

export function onelinerCard(text: string, author?: string): string {
  const t = DESIGN_TOKENS
  const authorHtml = author
    ? `<p style="font-size:12px;color:${t.muted};margin:28px 0 0;letter-spacing:1.5px;">${span(`—— ${author}`)}</p>`
    : ""
  return `
<section style="margin:32px 16px 48px;padding:40px 24px;border-top:1px solid ${t.divider};border-bottom:1px solid ${t.divider};text-align:center;">
  <p style="font-family:${t.titleFont};font-size:19px;font-weight:600;color:${t.title};margin:0;line-height:1.85;letter-spacing:0.8px;">
    ${span(text)}
  </p>
  ${authorHtml}
</section>`
}

export function centeredQuote(text: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:40px 16px;padding:36px 20px;border-top:1px solid ${t.divider};border-bottom:1px solid ${t.divider};text-align:center;">
  <p style="font-family:${t.titleFont};font-size:17px;font-weight:600;color:${t.title};margin:0;line-height:1.9;letter-spacing:0.8px;">
    ${span(text)}
  </p>
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
  void titleHighlight
  void titleLine2
  const t = DESIGN_TOKENS
  const tagHtml = tag
    ? `<p style="margin:0 0 16px;">
        <span style="display:inline-block;background:${t.tagBg};color:${t.tagText};font-size:11px;font-weight:600;padding:2px 10px;border-radius:2px;letter-spacing:0.5px;">${span(tag)}</span>
      </p>`
    : ""
  const subtitleHtml = subtitle
    ? `<p style="font-size:14px;color:${t.muted};margin:0 0 16px;letter-spacing:0.5px;line-height:1.6;">${span(subtitle)}</p>`
    : ""
  const dateHtml = date
    ? `<p style="font-size:11px;color:${t.muted};margin:0;letter-spacing:1.5px;">${span(date)}</p>`
    : ""
  const imageHtml = image
    ? `<section style="margin:0 16px 24px;border:1px solid ${t.divider};">
        <section style="margin:0;overflow:hidden;">
          <img src="${image}" style="max-width:100%;display:block;">
        </section>
      </section>`
    : ""
  const paddingTop = image ? "32px" : "72px"

  return `
<section style="padding:${paddingTop} 16px 40px;text-align:center;">
  ${imageHtml}
  ${tagHtml}
  <h1 style="font-family:${t.titleFont};font-size:24px;font-weight:700;color:${t.title};margin:0 0 12px;letter-spacing:1px;line-height:1.4;">
    ${span(title)}
  </h1>
  ${subtitleHtml}
  ${dateHtml}
</section>`
}

export function toc(chapters: Array<{ number: string; title: string }>): string {
  const t = DESIGN_TOKENS
  if (chapters.length === 0) return ""

  const items = chapters.map((chapter, index) => {
    const isLast = index === chapters.length - 1
    const isConc = isLast && isConclusionTitle(chapter.title)
    const number = isConc ? "∞" : chapter.number
    const borderRight = isLast ? "" : `border-right:1px solid ${t.divider};`
    const marginRight = isLast ? "" : "margin-right:16px;"
    return `
      <section style="flex:1;padding:18px 12px 18px 0;border-bottom:1px solid ${t.divider};${borderRight}${marginRight}">
        <p style="font-size:11px;color:${t.primary};font-weight:600;margin:0 0 6px;letter-spacing:1px;">${span(number)}</p>
        <p style="font-size:13px;color:${t.title};margin:0;font-weight:500;line-height:1.5;">${span(chapter.title)}</p>
      </section>`
  })

  return `
<section style="padding:0 16px 48px;">
  <p style="font-size:11px;color:${t.muted};margin:0 0 20px;letter-spacing:2px;text-transform:uppercase;">
    ${span("本文脉络")}
  </p>
  <section style="border-top:1px solid ${t.divider};">
    <section style="display:flex;">
      ${items.join("")}
    </section>
  </section>
</section>`
}

export function subheading(title: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:40px 16px 24px;padding-left:14px;border-left:2px solid ${t.primary};">
  <p style="font-size:10px;color:${t.primary};font-weight:600;letter-spacing:3px;margin:0 0 6px;text-transform:uppercase;">
    ${span("SECTION")}
  </p>
  <h3 style="font-family:${t.titleFont};font-size:18px;font-weight:700;color:${t.title};margin:0;letter-spacing:0.5px;line-height:1.4;">
    ${span(title)}
  </h3>
</section>`
}

export function list(items: string[], ordered?: boolean): string {
  const t = DESIGN_TOKENS
  if (items.length === 0) return ""

  const rows = items.map((item, index) => {
    if (ordered) {
      const number = String(index + 1).padStart(2, "0")
      return `
      <section style="display:flex;align-items:baseline;padding:16px 0;border-bottom:1px solid ${t.divider};">
        <p style="font-size:11px;color:${t.primary};font-weight:600;letter-spacing:1px;margin:0;min-width:28px;">${span(number)}</p>
        <p style="font-size:14px;color:${t.title};margin:0;line-height:1.7;padding-left:12px;flex:1;">${span(item)}</p>
      </section>`
    }

    return `
      <section style="display:flex;align-items:baseline;padding:12px 0;border-bottom:1px solid ${t.divider};">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${t.primary};margin-right:12px;flex-shrink:0;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
        <p style="font-size:14px;color:${t.title};margin:0;line-height:1.7;flex:1;">${span(item)}</p>
      </section>`
  })

  return `
<section style="margin:0 16px 32px;border-top:1px solid ${t.divider};">
  ${rows.join("")}
</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="padding:0 16px;">
  <section style="height:1px;background:${t.divider};margin:64px 0 0;">
    ${span("<br>")}
  </section>
</section>`
}
