// 橄榄手记主题组件库 —— 内刊/编辑部手记质感
// https://github.com/isjiamu/gzh-design-skill/blob/main/references/theme-olive-journal.md

import { isConclusionTitle } from "../shared"

export const DESIGN_TOKENS = {
  primary: "#1e1f23",
  secondary: "#d4c9b8",
  secondaryBorder: "#b17816",
  bg: "#fdfdf8",
  bgOlive: "#eeefe9",
  labelBg: "#e5e7e0",
  text: "#4d4f46",
  title: "#23251d",
  muted: "#65675e",
  helper: "#9ea096",
  divider: "#bfc1b7",
  codeBorder: "#b6b7af",
  accent: "#ed7b2f",
  codeBg: "#1e1f23",
  codeText: "#E2E8F0",
  codeTitleBg: "#0F172A",
  fontStack:
    "'IBM Plex Sans',-apple-system,system-ui,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",
  monoStack: "ui-monospace,Menlo,Monaco,Consolas,monospace",
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
    return { number: "///", label: "END" }
  }
  return { number: String(index + 1).padStart(2, "0"), label: "CHAPTER" }
}

export function container(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;padding:12px;box-sizing:border-box;background:${t.bg};color:${t.text};font-family:${t.fontStack};line-height:1.75;">${children}</section>`
}

export function chapterTitle(
  number: string,
  title: string,
  label: string,
  isFirst: boolean
): string {
  const t = DESIGN_TOKENS
  const marginTop = isFirst ? "0" : "32px"
  return `
<section style="margin-top:${marginTop};margin-bottom:24px;">
  <p style="margin:0 0 6px;font-size:10px;font-weight:800;color:${t.muted};letter-spacing:2px;">${span(`${label} ${number}`)}</p>
  <h3 style="margin:0;font-size:18px;font-weight:800;color:${t.title};letter-spacing:0.2px;line-height:1.4;padding-bottom:12px;border-bottom:1px solid ${t.divider};">${span(title)}</h3>
</section>`
}

export function paragraph(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="margin-top:24px;"><p style="margin:0;font-size:${t.bodySize}px;line-height:${t.lineHeight};text-align:left;color:${t.text};">${children}</p></section>`
}

export function strong(text: string): string {
  return `<strong style="color:${DESIGN_TOKENS.title};">${span(text)}</strong>`
}

export function inlineCode(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.bgOlive};color:${t.title};padding:2px 6px;border-radius:4px;font-family:${t.monoStack};font-size:13px;border:1px solid ${t.codeBorder};">${span(text)}</span>`
}

export function underline(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="border-bottom:2px solid ${t.accent};font-weight:600;color:${t.title};">${span(text)}</span>`
}

export function highlight(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.bgOlive};padding:1px 5px;border-radius:4px;font-weight:600;color:${t.title};border:1px solid ${t.divider};">${span(text)}</span>`
}

export function quoteBox(children: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-top:24px;">
  <section style="background:${t.bg};border:1px solid ${t.divider};border-radius:6px;overflow:hidden;">
    <section style="padding:10px 16px;background:${t.primary};display:flex;align-items:center;justify-content:space-between;gap:10px;">
      <p style="margin:0;font-size:10px;font-weight:800;letter-spacing:2px;color:#ffffff;">${span("EDITOR'S NOTE")}</p>
    </section>
    <section style="padding:16px 18px 18px;background:${t.bgOlive};">
      <p style="margin:0;font-size:14px;line-height:${t.lineHeight};color:${t.text};text-align:left;">${children}</p>
    </section>
  </section>
</section>`
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
<section style="margin:24px 0 20px;border-radius:8px;overflow:hidden;background:${t.codeBg};border-left:3px solid ${t.primary};box-shadow:0 4px 16px -8px rgba(15,23,42,0.4);">
  <section style="display:flex;align-items:center;padding:9px 14px;background:${t.codeTitleBg};">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1e1f23;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ed7b2f;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#d4c9b8;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
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
    ? `<p style="font-size:13px;line-height:1.7;color:${t.muted};text-align:center;margin:10px 0 0;">${span(alt)}</p>`
    : ""
  return `
<section style="margin-top:24px;">
  <figure style="margin:0;">
    <section style="border-radius:6px;overflow:hidden;border:1px solid ${t.divider};display:block;">
      <img src="${src}" alt="${alt || "图片"}" style="max-width:100%;height:auto;display:block;margin:0 auto;">
    </section>
    ${caption}
  </figure>
</section>`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-top:32px;">
  <section style="border-top:1px solid ${t.divider};padding-top:22px;text-align:center;">
    <p style="font-size:13px;font-weight:700;color:${t.title};line-height:1.6;margin:0 0 8px;">${span("本期手记就到这里，下期继续。")}</p>
    <p style="font-size:10px;color:${t.helper};letter-spacing:2px;margin:0;font-weight:500;">${span("— 30 —")}</p>
  </section>
</section>`
}

export function onelinerCard(text: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-top:24px;">
  <section style="background:${t.bg};border:1px solid ${t.divider};border-radius:6px;padding:16px 18px;text-align:center;">
    <p style="font-size:14px;color:${t.text};margin:0;line-height:1.8;">
      <span style="font-size:15px;color:${t.title};font-weight:700;border-bottom:3px solid ${t.accent};padding-bottom:2px;">${span(text)}</span>
    </p>
  </section>
</section>`
}

export function cover(
  title: string,
  subtitle: string,
  image?: string,
  tag?: string,
  date?: string,
  titleHighlight?: string,
  _titleLine2?: string,
  oldBelief?: string,
  summary?: string,
  tag1?: string,
  tag2?: string
): string {
  const t = DESIGN_TOKENS
  const coverTag = tag || "内刊"
  const coverDate = date || ""

  const visualSection = image
    ? `<section style="flex-shrink:0;width:112px;display:flex;align-items:center;justify-content:center;background:${t.bgOlive};border:1px dashed ${t.divider};border-radius:6px;padding:8px;overflow:hidden;">
        <img src="${image}" alt="封面图" style="max-width:100%;height:auto;display:block;border-radius:4px;">
      </section>`
    : `<section style="flex-shrink:0;width:112px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${t.bgOlive};border:1px dashed ${t.divider};border-radius:6px;padding:8px;">
        <svg width="72" height="72" viewBox="0 0 64 64" aria-hidden="true" style="display:block;">
          <ellipse cx="32" cy="36" rx="22" ry="18" fill="none" stroke="${t.text}" stroke-width="2"></ellipse>
          <circle cx="26" cy="30" r="3" fill="${t.text}"></circle>
          <circle cx="38" cy="30" r="3" fill="${t.text}"></circle>
          <path d="M28 40 Q32 44 36 40" fill="none" stroke="${t.text}" stroke-width="1.5"></path>
          <path d="M12 34 L8 28 M52 34 L56 28" stroke="${t.divider}" stroke-width="2" stroke-linecap="round"></path>
        </svg>
        <span style="font-size:8px;font-weight:700;color:${t.helper};letter-spacing:1px;margin-top:4px;">${span("DOODLE")}</span>
      </section>`

  const oldBeliefLine = oldBelief
    ? `<p style="font-size:14px;color:${t.helper};margin:0 0 8px;letter-spacing:0.3px;text-decoration:line-through;">${span(oldBelief)}</p>`
    : ""

  const titleLine = titleHighlight
    ? `${span(title)}<span style="color:${t.text};">${span("\u00a0·\u00a0")}</span><span style="border-bottom:3px solid ${t.labelBg};">${span(titleHighlight)}</span>`
    : span(title)

  const summaryBar = summary
    ? `<section style="background:${t.primary};padding:11px 24px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
    <p style="font-size:12px;color:rgba(255,255,255,0.92);margin:0;font-weight:600;">${span(summary)}</p>
    <section style="display:flex;gap:6px;flex-wrap:wrap;">
      ${tag1 ? `<span style="background:${t.labelBg};color:${t.title};padding:3px 8px;border-radius:4px;font-size:8px;font-weight:700;border:1px solid ${t.divider};">${span(tag1)}</span>` : ""}
      ${tag2 ? `<span style="background:${t.labelBg};color:${t.title};padding:3px 8px;border-radius:4px;font-size:8px;font-weight:700;border:1px solid ${t.divider};">${span(tag2)}</span>` : ""}
    </section>
  </section>`
    : ""

  return `
<section style="background:${t.bg};border:1px solid ${t.divider};border-radius:6px;overflow:hidden;font-family:${t.fontStack};">
  <section style="padding:28px 24px 22px;">
    <section style="display:flex;align-items:center;gap:8px;margin-bottom:22px;">
      <span style="width:8px;height:8px;background:${t.primary};border-radius:50%;display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
      <span style="font-size:10px;font-weight:700;letter-spacing:3px;color:${t.muted};">${span(coverTag)}</span>
      <span style="flex:1;height:1px;background:${t.divider};display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
      <span style="font-size:10px;color:${t.helper};font-weight:500;font-variant-numeric:tabular-nums;">${span(coverDate)}</span>
    </section>
    <section style="display:flex;align-items:stretch;gap:18px;">
      <section style="flex:1;min-width:0;">
        ${oldBeliefLine}
        <p style="font-size:24px;font-weight:800;color:${t.title};margin:0 0 10px;line-height:1.15;letter-spacing:-0.75px;">${titleLine}</p>
        <section style="display:flex;align-items:center;gap:4px;margin-bottom:12px;">
          <span style="width:22px;height:3px;background:${t.primary};border-radius:2px;display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
          <span style="width:8px;height:3px;background:${t.divider};border-radius:2px;display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
        </section>
        <p style="font-size:13px;color:${t.muted};margin:0;line-height:1.7;">${span(subtitle)}</p>
      </section>
      ${visualSection}
    </section>
  </section>
  ${summaryBar}
</section>`
}

export function toc(chapters: Array<{ number: string; title: string }>): string {
  const t = DESIGN_TOKENS
  const lastIndex = chapters.length - 1

  const items = chapters
    .map((chapter, index) => {
      const isLast = index === lastIndex
      const isConc = isLast && isConclusionTitle(chapter.title)
      const badge = isConc ? "///" : chapter.number
      const partLabel = isConc ? "END" : "CHAPTER"
      return `
      <section style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:${isLast ? "none" : `1px solid ${t.divider}`};">
        <section style="text-align:center;flex-shrink:0;width:46px;">
          <p style="margin:0;font-size:18px;font-weight:800;color:${t.title};line-height:1;letter-spacing:-1px;">${span(badge)}</p>
          <p style="margin:2px 0 0;font-size:7px;font-weight:700;color:${t.helper};letter-spacing:1.5px;">${span(partLabel)}</p>
        </section>
        <span style="width:1px;height:28px;background:${t.divider};flex-shrink:0;display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
        <p style="margin:0;font-size:14px;font-weight:600;color:${t.text};line-height:1.5;">${span(chapter.title)}</p>
      </section>`
    })
    .join("")

  return `
<section style="margin-top:24px;">
  <section style="background:${t.bg};border:1px solid ${t.divider};border-radius:6px;padding:18px 20px;font-family:${t.fontStack};">
    <section style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <span style="width:6px;height:6px;background:${t.primary};border-radius:50%;display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
      <p style="margin:0;font-size:10px;font-weight:800;letter-spacing:3px;color:${t.muted};">${span("本期目录")}</p>
    </section>
    ${items}
  </section>
</section>`
}

export function subheading(title: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-top:24px;">
  <section style="display:flex;align-items:flex-start;gap:12px;border-bottom:1px solid ${t.divider};padding-bottom:10px;font-family:${t.fontStack};">
    <span style="width:3px;height:22px;background:${t.accent};border-radius:2px;flex-shrink:0;display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
    <section style="flex:1;min-width:0;">
      <span style="font-size:10px;font-weight:800;letter-spacing:3px;color:${t.accent};text-transform:uppercase;">${span("SUB")}</span>
      <h3 style="font-size:18px;font-weight:800;color:${t.title};margin:4px 0 0;line-height:1.2;">${span(title)}</h3>
    </section>
  </section>
</section>`
}

export function list(items: string[], ordered?: boolean): string {
  const t = DESIGN_TOKENS

  if (ordered) {
    const lastIndex = items.length - 1
    const rows = items
      .map((item, index) => {
        const num = String(index + 1).padStart(2, "0")
        const borderBottom = index === lastIndex ? `1px solid ${t.divider}` : "none"
        return `
      <section style="padding:10px 0;border-top:1px solid ${t.divider};border-bottom:${borderBottom};">
        <p style="margin:0;font-size:15px;line-height:1.8;color:${t.title};font-weight:800;">${span(`${num} / ${item}`)}</p>
      </section>`
      })
      .join("")

    return `
<section style="margin-top:24px;">
  <section style="background:${t.bg};border:1px solid ${t.divider};padding:18px;box-sizing:border-box;border-radius:6px;font-family:${t.fontStack};">
    ${rows}
  </section>
</section>`
  }

  const lis = items
    .map(
      (item) =>
        `
      <li style="margin-bottom:8px;font-size:15px;color:${t.text};list-style-type:disc;">
        <section>${span(item)}</section>
      </li>`
    )
    .join("")

  return `
<section style="margin-top:24px;">
  <section style="font-family:${t.fontStack};">
    <ul style="margin:0;padding-left:22px;line-height:1.8;list-style-position:outside;">
      ${lis}
    </ul>
  </section>
</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-top:24px;">
  <section style="display:flex;align-items:center;justify-content:center;gap:10px;font-family:${t.fontStack};">
    <span style="width:8px;height:8px;border-radius:50%;background:${t.text};display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
    <span style="width:8px;height:8px;border-radius:50%;background:${t.divider};display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
    <span style="width:8px;height:8px;border-radius:50%;background:${t.accent};display:inline-block;overflow:hidden;vertical-align:middle;font-size:0;line-height:0;">${span("<br>")}</span>
  </section>
</section>`
}

export function stepHeading(title: string, step = "STEP 01"): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-top:24px;">
  <section style="display:flex;align-items:center;gap:10px;font-family:${t.fontStack};">
    <span style="background:${t.primary};color:#fff;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:700;">${span(step)}</span>
    <span style="font-size:14px;font-weight:600;color:${t.text};">${span(title)}</span>
  </section>
</section>`
}

export function kickerTitle(kicker: string, title: string, progress = ""): string {
  const t = DESIGN_TOKENS
  const progressHtml = progress
    ? `<span style="margin-left:auto;font-size:10px;color:${t.helper};font-variant-numeric:tabular-nums;">${span(progress)}</span>`
    : ""
  return `
<section style="margin-top:24px;">
  <section style="display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;border-bottom:1px solid ${t.divider};padding-bottom:10px;font-family:${t.fontStack};">
    <span style="font-size:10px;font-weight:800;letter-spacing:3px;color:${t.accent};text-transform:uppercase;">${span(kicker)}</span>
    <span style="font-size:18px;font-weight:800;color:${t.title};line-height:1.2;">${span(title)}</span>
    ${progressHtml}
  </section>
</section>`
}

export function highlightTitle(title: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-top:24px;">
  <section style="font-family:${t.fontStack};">
    <h3 style="font-size:18px;font-weight:700;color:${t.title};margin:0;padding:0 2px;display:block;width:fit-content;box-shadow:inset 0 -0.5em 0 rgba(245,78,0,0.18);">${span(title)}</h3>
  </section>
</section>`
}
