// 公众号排版组件库 —— 红白色系（经典编辑风）
// 参考: .kimi-code/skills/gzh-design/references/theme-red-white.md

import { isConclusionTitle } from "../shared"

export const DESIGN_TOKENS = {
  primary: "#DC2626",
  primaryDark: "#991B1B",
  primaryLight: "#FCA5A5",
  lightestRed: "#FEE2E2",
  bg: "#FEF2F2",
  accent: "#FECACA",
  title: "#1C1917",
  text: "#374151",
  secondary: "#4B5563",
  muted: "#9CA3AF",
  divider: "#E5E7EB",
  grayBar: "#D6D3D1",
  grayBg: "#FAFAFA",
  white: "#FFFFFF",
  codeBg: "#1C1917",
  codeText: "#E2E8F0",
  codeTitleBg: "#0F0E0E",
  fontStack:
    "-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",
  monoStack: "'SF Mono',Consolas,Monaco,monospace",
  maxWidth: 677,
  bodySize: 15,
  lineHeight: 1.8,
  letterSpacing: 0.5,
}

function span(text: string): string {
  return `<span leaf="">${text}</span>`
}

export function container(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;background:${t.white};font-family:${t.fontStack};color:${t.text};line-height:1.75;letter-spacing:${t.letterSpacing}px;overflow-x:hidden;">${children}</section>`
}

export function chapterMeta(
  index: number,
  total: number,
  title: string
): { number: string; label: string } {
  const isLast = index === total - 1
  if (isLast && isConclusionTitle(title)) {
    return { number: "∞", label: "THE END" }
  }
  return { number: String(index + 1).padStart(2, "0"), label: "SECTION" }
}

export function chapterTitle(
  number: string,
  title: string,
  label: string,
  isFirst: boolean
): string {
  const t = DESIGN_TOKENS
  const isLast = number === "∞"
  const englishTag = isLast ? "THE END" : label
  const marginTop = isFirst ? "16px" : "48px"

  return `
<section style="margin-top:${marginTop};margin-bottom:28px;padding:0 10px;">
  <section style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid ${t.primary};">
    <section style="display:flex;align-items:center;">
      <span style="display:inline-block;background:${t.primary};color:${t.white};font-size:18px;font-weight:900;padding:4px 14px;border-radius:6px;margin-right:14px;line-height:1.3;">${span(number)}</span>
      <section>
        <p style="font-size:10px;color:${t.primary};font-weight:700;letter-spacing:3px;margin:0 0 2px;text-transform:uppercase;">${span(englishTag)}</p>
        <h3 style="font-size:18px;font-weight:800;color:${t.title};margin:0;letter-spacing:${t.letterSpacing}px;">${span(title)}</h3>
      </section>
    </section>
  </section>
</section>`
}

export function paragraph(children: string): string {
  const t = DESIGN_TOKENS
  return `<p style="margin-bottom:20px;font-size:${t.bodySize}px;line-height:${t.lineHeight};text-align:left;">${children}</p>`
}

export function strong(text: string): string {
  return `<strong style="color:${DESIGN_TOKENS.primary};">${span(text)}</strong>`
}

export function inlineCode(text: string): string {
  return `<span style="background:#F3F4F6;color:#1F2937;padding:2px 6px;border-radius:4px;font-size:14px;font-weight:600;">${span(text)}</span>`
}

export function underline(text: string): string {
  return `<span style="border-bottom:2px solid ${DESIGN_TOKENS.accent};font-weight:600;">${span(text)}</span>`
}

export function highlight(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.lightestRed};color:${t.primaryDark};padding:2px 6px;border-radius:3px;font-weight:700;">${span(text)}</span>`
}

export function quoteBox(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="background:${t.bg};border-radius:0 10px 10px 0;border-left:4px solid ${t.primary};padding:18px 22px;margin-bottom:24px;"><p style="font-size:16px;font-weight:800;color:${t.primaryDark};margin:0;line-height:1.8;">${span("「")}${children}${span("」")}</p></section>`
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
    ? `<span style="margin-left:12px;font-size:12px;color:${t.muted};font-family:${t.monoStack};letter-spacing:1px;">${span(language)}</span>`
    : ""

  return `
<section style="margin:0 0 24px;border-radius:10px;overflow:hidden;background:${t.codeBg};box-shadow:0 4px 16px -8px rgba(28,25,23,0.35);border-left:4px solid ${t.primary};">
  <section style="display:flex;align-items:center;padding:10px 14px;background:${t.codeTitleBg};">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#DC2626;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#EF4444;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#FCA5A5;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    ${langTag}
  </section>
  <section style="padding:12px 14px;">
    ${lines.join("")}
  </section>
</section>`
}

export function imageCard(src: string, alt: string): string {
  const t = DESIGN_TOKENS
  const caption = alt
    ? `<p style="font-size:12px;color:${t.muted};text-align:center;margin:0 0 24px;">${span(`— ${alt}`)}</p>`
    : ""

  return `
<section style="background:${t.white};border-radius:12px;padding:6px;border:1px solid ${t.divider};box-shadow:0 4px 12px -2px rgba(0,0,0,0.08);margin-bottom:10px;">
  <section style="margin:0;border-radius:8px;overflow:hidden;">
    <img src="${src}" style="max-width:100%;height:auto;display:block;margin:0 auto;">
  </section>
</section>
${caption}`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin:0 10px 24px;background:${t.white};border-radius:12px;box-shadow:0 4px 24px -4px rgba(220,38,38,0.12);padding:28px 20px;text-align:center;overflow:hidden;">
  <p style="font-size:${t.bodySize}px;font-weight:800;color:${t.title};margin:0 0 20px;line-height:1.6;">${span("喜欢这种编辑风？点个关注，下一篇更精彩。")}</p>
  <section style="display:flex;justify-content:center;gap:24px;margin-bottom:16px;">
    <section style="text-align:center;color:${t.secondary};">
      <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:${t.bg};border-radius:12px;box-shadow:0 2px 4px rgba(220,38,38,0.08);border:1px solid ${t.lightestRed};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
      </section>
      <span style="font-size:10px;font-weight:600;">${span("点赞")}</span>
    </section>
    <section style="text-align:center;color:${t.secondary};">
      <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:${t.bg};border-radius:12px;box-shadow:0 2px 4px rgba(220,38,38,0.08);border:1px solid ${t.lightestRed};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"></circle><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg>
      </section>
      <span style="font-size:10px;font-weight:600;">${span("在看")}</span>
    </section>
    <section style="text-align:center;color:${t.primary};">
      <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:${t.lightestRed};border-radius:12px;box-shadow:0 2px 4px rgba(220,38,38,0.12);border:1px solid ${t.accent};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18v-4a8 8 0 0 1 8-8h8"></path><polyline points="16 2 20 6 16 10"></polyline></svg>
      </section>
      <span style="font-size:10px;font-weight:600;">${span("转发")}</span>
    </section>
  </section>
  <p style="font-size:10px;color:${t.muted};letter-spacing:1px;margin:0;">${span("RED & WHITE")}</p>
</section>`
}

export function onelinerCard(text: string): string {
  const t = DESIGN_TOKENS
  return `<section style="margin:0 0 24px;padding:0 10px;"><p style="font-size:${t.bodySize}px;margin:0;text-align:center;color:${t.primary};font-weight:700;letter-spacing:1px;border-top:1px solid ${t.lightestRed};border-bottom:1px solid ${t.lightestRed};padding:14px 10px;">${span(text)}</p></section>`
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
  const tagLine =
    tag || date
      ? `<section style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
    <span style="display:inline-block;width:4px;height:18px;background:${t.primary};border-radius:2px;overflow:hidden;">${span("<br>")}</span>
    <span style="font-size:12px;color:${t.muted};letter-spacing:2px;font-weight:700;">${span(tag ?? "")}</span>
    <span style="font-size:12px;color:${t.primary};font-weight:700;">${span(date ?? "")}</span>
  </section>`
      : ""

  const textBlock = `
    ${tagLine}
    <h1 style="font-size:24px;font-weight:900;color:${t.title};margin:0 0 12px;line-height:1.4;letter-spacing:${t.letterSpacing}px;">${span(title)}</h1>
    <p style="font-size:${t.bodySize}px;color:${t.secondary};margin:0;line-height:1.7;">${span(subtitle)}</p>
  `

  if (image) {
    return `
<section style="margin:0 10px 32px;background:${t.white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px -4px rgba(220,38,38,0.12);">
  <section style="margin:0;overflow:hidden;">
    <img src="${image}" alt="" style="max-width:100%;height:auto;display:block;margin:0 auto;">
  </section>
  <section style="padding:24px;">
    ${textBlock}
  </section>
</section>`
  }

  return `
<section style="margin:0 10px 32px;padding:28px 24px;background:${t.white};border-radius:12px;box-shadow:0 4px 24px -4px rgba(220,38,38,0.12);overflow:hidden;">
  ${textBlock}
</section>`
}

export function toc(chapters: Array<{ number: string; title: string }>): string {
  const t = DESIGN_TOKENS
  if (chapters.length === 0) return ""

  const items = chapters
    .map((chapter, index) => {
      const isLast = index === chapters.length - 1
      const isConc = isLast && isConclusionTitle(chapter.title)
      const badge = isConc ? "∞" : chapter.number
      const marginRight = isLast ? "0" : "8px"
      return `
    <section style="flex:1;background:${t.bg};border-radius:10px;padding:16px 12px;margin-right:${marginRight};text-align:center;border:1px solid ${t.lightestRed};">
      <p style="display:inline-block;background:${t.primary};color:${t.white};font-size:12px;font-weight:800;padding:2px 10px;border-radius:4px;margin:0 0 8px;">${span(badge)}</p>
      <p style="font-size:13px;font-weight:700;color:${t.title};margin:0;">${span(chapter.title)}</p>
    </section>`
    })
    .join("")

  return `
<section style="padding:0 10px 32px;">
  <p style="font-size:14px;color:${t.muted};margin:0 0 14px;letter-spacing:1px;">${span("本文看点")}</p>
  <section style="display:flex;justify-content:space-between;">
    ${items}
  </section>
</section>`
}

export function subheading(title: string): string {
  const t = DESIGN_TOKENS
  return `<p style="font-size:${t.bodySize}px;font-weight:800;color:${t.title};margin:28px 0 14px;padding-left:10px;border-left:3px solid ${t.primary};line-height:1.4;">${span(title)}</p>`
}

export function list(items: string[], ordered?: boolean): string {
  const t = DESIGN_TOKENS

  if (ordered) {
    const rows = items
      .map(
        (item, index) => `
  <section style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;background:${t.primary};color:${t.white};font-size:12px;font-weight:700;border-radius:50%;flex-shrink:0;margin-top:2px;">${span(String(index + 1))}</span>
    <p style="font-size:${t.bodySize}px;color:${t.text};margin:0;line-height:${t.lineHeight};flex:1;">${span(item)}</p>
  </section>`
      )
      .join("")

    return `<section style="margin-bottom:24px;">${rows}</section>`
  }

  const rows = items
    .map(
      (item) => `
  <section style="margin-bottom:14px;">
    <p style="margin:0 0 6px;">
      <span style="display:inline-block;font-size:14px;font-weight:700;color:${t.primaryDark};background:${t.lightestRed};padding:3px 10px;border-radius:999px;"><span style="display:inline-block;width:6px;height:6px;background:${t.primary};border-radius:50%;margin-right:5px;vertical-align:middle;"><span leaf=""><br></span></span>${span(item)}</span>
    </p>
  </section>`
    )
    .join("")

  return `<section style="margin-bottom:24px;">${rows}</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="padding:0 10px;">
  <section style="height:1px;background:linear-gradient(to right,transparent,${t.primaryLight},${t.primary},${t.primaryLight},transparent);margin:0;">
    <span leaf=""><br></span>
  </section>
</section>`
}
