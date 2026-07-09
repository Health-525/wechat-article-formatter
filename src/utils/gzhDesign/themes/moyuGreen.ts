// 摸鱼绿主题组件库 —— 从 gzh-design-skill 移植
// https://github.com/isjiamu/gzh-design-skill/blob/main/references/theme-moyu-green.md

import { isConclusionTitle } from "../shared"

export const DESIGN_TOKENS = {
  primary: "#059669",
  primaryLight: "#10B981",
  lightGreen: "#34D399",
  lighterGreen: "#6EE7B7",
  paleGreen: "#A7F3D0",
  borderGreen: "#BBF7D0",
  bgGreen: "#ECFDF5",
  bgGreen2: "#F0FDF4",
  yellowHighlight: "#FDE68A",
  yellowBg: "#FFFBEB",
  yellowText: "#92400E",
  redUnderline: "#FECACA",
  orangeWarning: "rgb(255,76,0)",
  grayWarning: "rgb(136,136,136)",
  title: "#111827",
  text: "#374151",
  secondary: "#4B5563",
  muted: "#6B7280",
  helper: "#9CA3AF",
  divider: "#D1D5DB",
  lightBorder: "#E5E7EB",
  lightGrayBg: "#F3F4F6",
  paleGray: "#F9FAFB",
  codeBg: "#1E293B",
  codeText: "#E2E8F0",
  codeTitleBg: "#0F172A",
  fontStack:
    "-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",
  monoStack: "'SF Mono',Consolas,Monaco,monospace",
  maxWidth: 677,
  bodySize: 15,
  lineHeight: 1.9,
  letterSpacing: 0.5,
}

function span(text: string): string {
  return `<span leaf="">${text}</span>`
}

export function container(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;background:#ffffff;font-family:${t.fontStack};color:${t.text};line-height:1.75;letter-spacing:${t.letterSpacing}px;overflow-x:hidden;">${children}</section>`
}

export function chapterMeta(
  index: number,
  total: number,
  title: string
): { number: string; label: string } {
  const isLast = index === total - 1
  if (isLast && isConclusionTitle(title)) {
    return { number: "///", label: "LAST" }
  }
  return { number: String(index + 1).padStart(2, "0"), label: "PART" }
}

export function chapterTitle(
  number: string | "///",
  title: string,
  label: string,
  isFirst: boolean
): string {
  const t = DESIGN_TOKENS
  const marginTop = isFirst ? "16px" : "48px"
  return `
<section style="margin-top:${marginTop};margin-bottom:32px;padding:0 20px;">
  <section style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
    <section style="text-align:center;flex-shrink:0;">
      <p style="margin:0;font-size:28px;font-weight:900;color:${t.primary};line-height:1;letter-spacing:-2px;">${span(number)}</p>
      <p style="margin:0;font-size:8px;font-weight:700;color:${t.divider};letter-spacing:2px;">${span(label)}</p>
    </section>
    <span style="width:1px;height:36px;background:${t.lightBorder};flex-shrink:0;">${span("<br>")}</span>
    <section>
      <p style="margin:0 0 1px;font-size:17px;font-weight:900;color:${t.title};letter-spacing:0.3px;">${span(title)}</p>
    </section>
  </section>
</section>`
}

export function paragraph(children: string): string {
  return `<p style="margin-bottom:16px;font-size:${DESIGN_TOKENS.bodySize}px;line-height:${DESIGN_TOKENS.lineHeight};text-align:left;">${children}</p>`
}

export function strongGreen(text: string): string {
  return `<strong style="color:${DESIGN_TOKENS.primary};">${span(text)}</strong>`
}

// Unified alias used by the generic renderer.
export const strong = strongGreen

export function inlineCode(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.lightGrayBg};color:${t.title};padding:2px 6px;border-radius:4px;font-size:13px;font-weight:600;">${span(text)}</span>`
}

export function underlineGreen(text: string): string {
  return `<span style="border-bottom:2px solid ${DESIGN_TOKENS.paleGreen};font-weight:600;">${span(text)}</span>`
}

// Unified alias used by the generic renderer.
export const underline = underlineGreen

export function highlightYellow(text: string): string {
  return `<span style="background:linear-gradient(120deg,${DESIGN_TOKENS.yellowHighlight} 0%,rgba(255,255,255,0) 100%);padding:0 4px;border-radius:2px;font-weight:600;color:${DESIGN_TOKENS.title};">${span(text)}</span>`
}

// Unified alias used by the generic renderer.
export const highlight = highlightYellow

export function quoteBox(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="background:${t.paleGray};border:1px dashed ${t.divider};border-radius:8px;padding:12px 16px;margin-bottom:24px;text-align:left;"><p style="font-size:13px;color:${t.text};margin:0;line-height:1.6;">${children}</p></section>`
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
<section style="margin:0 0 20px;border-radius:8px;overflow:hidden;background:${t.codeBg};box-shadow:0 4px 16px -8px rgba(15,23,42,0.4);">
  <section style="display:flex;align-items:center;padding:9px 14px;background:${t.codeTitleBg};">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#059669;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#10B981;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#34D399;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
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
    ? `<p style="font-size:12px;color:${t.helper};text-align:center;margin:0 0 24px;">${span(`— ${alt}`)}</p>`
    : ""
  return `
<section style="text-align:center;margin-bottom:24px;border-radius:12px;overflow:hidden;">
  <img src="${src}" style="max-width:100%;height:auto;display:block;margin:0 auto;">
</section>
${caption}`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="background:radial-gradient(circle at center,${t.paleGray} 0%,#FFFFFF 100%);border:1px solid ${t.lightBorder};border-radius:16px;padding:32px 20px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.03);margin:0 0 24px;">
  <p style="font-size:13px;font-weight:bold;color:${t.title};margin-bottom:20px;line-height:1.6;">${span("觉得这篇文章对你有用？随手点个赞、在看、转发三连，下次见～")}</p>
  <section style="display:flex;justify-content:center;gap:24px;margin-bottom:16px;">
    <section style="text-align:center;cursor:pointer;color:${t.secondary};">
      <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:#fff;border-radius:12px;box-shadow:0 2px 4px rgba(0,0,0,0.05);border:1px solid ${t.lightGrayBg};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
      </section>
      <span style="font-size:10px;font-weight:600;">${span("点赞")}</span>
    </section>
    <section style="text-align:center;cursor:pointer;color:${t.secondary};">
      <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:#fff;border-radius:12px;box-shadow:0 2px 4px rgba(0,0,0,0.05);border:1px solid ${t.lightGrayBg};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"></circle><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg>
      </section>
      <span style="font-size:10px;font-weight:600;">${span("在看")}</span>
    </section>
    <section style="text-align:center;cursor:pointer;color:${t.primary};">
      <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:${t.bgGreen2};border-radius:12px;box-shadow:0 2px 4px rgba(5,150,105,0.15);border:1px solid ${t.paleGreen};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18v-4a8 8 0 0 1 8-8h8"></path><polyline points="16 2 20 6 16 10"></polyline></svg>
      </section>
      <span style="font-size:10px;font-weight:600;">${span("转发")}</span>
    </section>
  </section>
  <p style="font-size:10px;color:${t.helper};letter-spacing:1px;margin:0;">${span("HAVE A NICE DAY")}</p>
</section>`
}

export function onelinerCard(text: string): string {
  const t = DESIGN_TOKENS
  return `<section style="background:#FFF;border:1px dashed ${t.borderGreen};border-radius:8px;padding:14px 16px;margin-bottom:24px;text-align:center;"><p style="margin:0;line-height:1.6;"><span style="font-size:15px;color:${t.primary};font-weight:bold;border-bottom:3px solid ${t.yellowHighlight};padding-bottom:2px;">${span(text)}</span></p></section>`
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
  const topTag = tag ?? ""
  const topDate = date ?? ""
  const mainTitle = title ?? ""
  const subTitle = subtitle ?? ""
  const highlight = titleHighlight ?? ""
  const line2 = titleLine2 ?? ""

  const titleContent = `
    <p style="font-size:15px;color:${t.divider};margin:0 0 6px;text-decoration:line-through;letter-spacing:0.5px;">
      ${span("")}
    </p>
    <p style="font-size:24px;font-weight:900;color:${t.title};margin:0;line-height:1.05;letter-spacing:-2px;">
      ${span(mainTitle)}
      <span style="color:${t.primary};">${span(highlight)}</span>
    </p>
    <p style="font-size:24px;font-weight:900;color:${t.primary};margin:0 0 16px;line-height:1.05;letter-spacing:-2px;">
      ${span(line2)}
    </p>
    <section style="width:48px;height:3px;background:linear-gradient(to right,${t.primary},${t.lightGreen});border-radius:2px;margin-bottom:12px;">
      ${span("<br>")}
    </section>
    <p style="font-size:13px;color:${t.helper};margin:0;line-height:1.7;letter-spacing:0.5px;">
      ${span(subTitle)}
    </p>
  `

  const bodyContent = image
    ? `<section style="display:flex;align-items:center;gap:20px;">
        <section style="flex:1;min-width:0;">
          ${titleContent}
        </section>
        <section style="flex-shrink:0;width:110px;height:110px;border-radius:16px;overflow:hidden;border:1px solid rgba(5,150,105,0.1);box-shadow:0 4px 12px rgba(0,0,0,0.06);">
          <img src="${image}" style="width:100%;height:100%;object-fit:cover;display:block;">
        </section>
      </section>`
    : `<section>${titleContent}</section>`

  return `
<section style="margin:0 0 32px;background:#fff;border:1.5px solid rgba(5,150,105,0.15);border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);width:100%;">
  <section style="padding:32px 28px 28px;">
    <section style="display:flex;align-items:center;gap:8px;margin-bottom:28px;">
      <span style="width:6px;height:6px;background:${t.primary};border-radius:50%;">${span("<br>")}</span>
      <span style="font-size:11px;font-weight:700;letter-spacing:3px;color:${t.primary};">${span(topTag)}</span>
      <section style="flex:1;height:1px;overflow:hidden;background:linear-gradient(to right,rgba(5,150,105,0.12),transparent);">${span("<br>")}</section>
      <span style="font-size:10px;color:${t.divider};font-weight:600;">${span(topDate)}</span>
    </section>
    ${bodyContent}
  </section>
  <section style="background:linear-gradient(135deg,${t.primary},${t.primaryLight});padding:12px 28px;display:flex;align-items:center;justify-content:space-between;">
    <p style="font-size:12px;color:rgba(255,255,255,0.9);margin:0;font-weight:600;letter-spacing:0.5px;">
      ${span("")}
    </p>
    <section style="display:flex;gap:4px;">
      <span style="background:rgba(255,255,255,0.2);padding:1px 6px;border-radius:3px;font-size:8px;color:#fff;font-weight:600;">${span("")}</span>
      <span style="background:rgba(255,255,255,0.2);padding:1px 6px;border-radius:3px;font-size:8px;color:#fff;font-weight:600;">${span("")}</span>
    </section>
  </section>
</section>`
}

function isConclusion(title: string): boolean {
  return /(总结|结语|写在最后|后记|番外|尾声)/.test(title)
}

export function toc(chapters: Array<{ number: string; title: string }>): string {
  const t = DESIGN_TOKENS
  if (chapters.length === 0) return ""

  const partsCount = chapters.length
  const cards = chapters
    .map((chapter, index) => {
      const isFirst = index === 0
      const isLast = index === chapters.length - 1
      const isConc = isLast && isConclusion(chapter.title)
      const number = isConc ? "///" : chapter.number
      const title = isConc ? "写在最后" : chapter.title
      const displayNumber = number.toUpperCase().startsWith("PART")
        ? number
        : `PART ${number}`

      const bg = isFirst
        ? `background:linear-gradient(135deg,${t.primary},${t.primaryLight});`
        : `background:#fff;border:1px solid ${t.lightBorder};box-shadow:0 2px 6px rgba(0,0,0,0.04);`
      const numberColor = isFirst
        ? "color:rgba(255,255,255,0.7);"
        : `color:${t.helper};`
      const titleColor = isFirst ? "color:#fff;" : `color:${t.title};`
      const subtitleColor = isFirst
        ? "color:rgba(255,255,255,0.7);"
        : `color:${t.helper};`

      return `<section style="flex:1;min-width:110px;max-width:100%;${bg}border-radius:12px;padding:12px;">
  <p style="font-size:9px;font-weight:700;${numberColor}letter-spacing:1px;margin:0 0 5px;">
    ${span(displayNumber)}
  </p>
  <p style="font-size:13px;font-weight:800;${titleColor}margin:0 0 3px;">
    ${span(title)}
  </p>
  <p style="font-size:10px;${subtitleColor}margin:0;">
    ${span("")}
  </p>
</section>`
    })
    .join("")

  return `
<section style="margin:0 20px 32px;">
  <section style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
    <p style="font-size:10px;color:${t.helper};margin:0;text-transform:uppercase;letter-spacing:2px;font-weight:600;">
      ${span(`CONTENTS · ${partsCount} Parts`)}
    </p>
  </section>
  <section style="display:flex;flex-wrap:wrap;gap:8px;">
    ${cards}
  </section>
</section>`
}

export function subheading(title: string): string {
  const t = DESIGN_TOKENS
  return `<p style="margin:28px 0 16px;padding-left:12px;border-left:4px solid ${t.primary};font-size:15px;font-weight:900;color:${t.title};line-height:1.5;">
  <span style="background:linear-gradient(180deg,transparent 65%,${t.yellowHighlight} 65%);padding:0 4px;">${span(title)}</span>
</p>`
}

export function list(items: string[], ordered?: boolean): string {
  const t = DESIGN_TOKENS
  if (ordered) {
    const rows = items
      .map((item, index) => {
        const num = String(index + 1)
        return `<section style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;background:${t.primary};color:#fff;font-size:11px;font-weight:700;border-radius:50%;flex-shrink:0;margin-top:2px;">${span(num)}</span>
    <p style="font-size:14px;color:${t.text};margin:0;line-height:1.9;flex:1;">${span(item)}</p>
  </section>`
      })
      .join("")
    return `<section style="margin-bottom:24px;">${rows}</section>`
  }

  const rows = items
    .map((item) => {
      return `<section style="margin-bottom:14px;">
  <p style="margin:0 0 6px;">
    <span style="display:inline-block;font-size:13px;font-weight:700;color:${t.primary};background:rgba(5,150,105,0.08);padding:3px 10px;border-radius:999px;"><span style="display:inline-block;width:6px;height:6px;background:${t.primary};border-radius:50%;margin-right:5px;vertical-align:middle;">${span("<br>")}</span>${span(item)}</span>
  </p>
</section>`
    })
    .join("")
  return `<section style="margin-bottom:24px;">${rows}</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="display:flex;align-items:center;gap:16px;margin:32px 0;">
  <section style="flex:1;height:1px;background:linear-gradient(to right,transparent,${t.primaryLight},transparent);">${span("<br>")}</section>
  <span style="font-size:11px;font-weight:700;color:${t.primary};letter-spacing:2px;">${span("FIN.")}</span>
  <section style="flex:1;height:1px;background:linear-gradient(to right,transparent,${t.primaryLight},transparent);">${span("<br>")}</section>
</section>`
}
