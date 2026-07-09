// 石墨极简主题组件库 —— 从 gzh-design-skill 移植
// https://github.com/isjiamu/gzh-design-skill/blob/main/references/theme-graphite-minimal.md

import { isConclusionTitle } from "../shared"

export const DESIGN_TOKENS = {
  primary: "#52525B",
  secondary: "#71717A",
  bg: "#FFFFFF",
  text: "#52525B",
  title: "#27272A",
  muted: "#A1A1AA",
  accent: "#F97316",
  darkGray: "#3F3F46",
  line: "#E4E4E7",
  tagBg: "#F4F4F5",
  paleBg: "#FAFAFA",
  codeBg: "#1E293B",
  codeText: "#E2E8F0",
  codeTitleBg: "#0F172A",
  fontStack:
    "-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",
  monoStack: "'SF Mono',Consolas,Monaco,monospace",
  maxWidth: 677,
  bodySize: 15,
  lineHeight: 1.8,
  letterSpacing: 0.3,
}

function span(text: string): string {
  return `<span leaf="">${text}</span>`
}

export function container(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;background:${t.bg};font-family:${t.fontStack};color:${t.text};line-height:${t.lineHeight};letter-spacing:${t.letterSpacing}px;overflow-x:hidden;">${children}</section>`
}

function chapterLabelFromTitle(title: string): string {
  const map: Record<string, string> = {
    总结: "SUMMARY",
    结语: "EPILOGUE",
    写在最后: "LAST WORDS",
    前言: "INTRO",
    介绍: "INTRO",
    教程: "TUTORIAL",
    实战: "CASE STUDY",
    案例: "CASE STUDY",
    测试: "TEST",
    思考: "THOUGHTS",
  }
  for (const [key, value] of Object.entries(map)) {
    if (title.includes(key)) return value
  }
  return "CHAPTER"
}

export function chapterMeta(
  index: number,
  total: number,
  title: string
): { number: string; label: string } {
  const isLast = index === total - 1
  if (isLast && isConclusionTitle(title)) {
    return { number: "∞", label: "END" }
  }
  return {
    number: String(index + 1).padStart(2, "0"),
    label: chapterLabelFromTitle(title),
  }
}

export function chapterTitle(
  number: string,
  title: string,
  label: string,
  isFirst: boolean
): string {
  const t = DESIGN_TOKENS
  const isLast = number === "∞"
  const partLabel = isLast ? "END" : label
  const marginTop = isFirst ? "16px" : "56px"
  return `
<section style="margin-top:${marginTop};margin-bottom:32px;padding:0 10px;">
  <section style="padding-bottom:20px;border-bottom:1px solid ${t.line};">
    <p style="font-size:48px;font-weight:900;color:${t.line};margin:0;line-height:1;letter-spacing:-2px;">
      ${span(number)}
    </p>
    <section style="margin-top:-8px;">
      <p style="font-size:10px;color:${t.muted};font-weight:500;letter-spacing:3px;margin:0 0 6px;text-transform:uppercase;">
        ${span(partLabel)}
      </p>
      <h3 style="font-size:20px;font-weight:800;color:${t.title};margin:0;letter-spacing:0.5px;line-height:1.4;">
        ${span(title)}
      </h3>
    </section>
  </section>
</section>`
}

export function paragraph(children: string): string {
  const t = DESIGN_TOKENS
  return `<p style="margin-bottom:22px;font-size:${t.bodySize}px;line-height:${t.lineHeight};text-align:left;color:${t.text};letter-spacing:${t.letterSpacing}px;">${children}</p>`
}

export function strong(text: string): string {
  return `<strong style="color:${DESIGN_TOKENS.title};">${span(text)}</strong>`
}

export function inlineCode(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.tagBg};color:${t.title};padding:2px 6px;border-radius:4px;font-family:${t.monoStack};font-size:14px;">${span(text)}</span>`
}

export function underline(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="border-bottom:2px solid ${t.primary};font-weight:600;color:${t.title};">${span(text)}</span>`
}

export function highlight(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.tagBg};color:${t.title};padding:2px 7px;border-radius:3px;font-weight:700;font-size:14px;">${span(text)}</span>`
}

export function quoteBox(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="border-left:3px solid ${t.primary};padding:16px 0 16px 24px;margin:0 10px 28px;"><p style="font-size:16px;font-weight:700;color:${t.title};margin:0;line-height:1.7;letter-spacing:0.5px;">${children}</p></section>`
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
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#27272A;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#71717A;margin-right:7px;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#F97316;font-size:0;line-height:0;overflow:hidden;">${span(".")}</span>
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
    ? `<p style="font-size:12px;color:${t.muted};text-align:center;margin:0 10px 28px;letter-spacing:0.5px;">${span(`— ${alt}`)}</p>`
    : ""
  return `
<section style="border:1px solid ${t.line};padding:4px;margin:0 10px ${alt ? "8px" : "12px"};">
  <section style="margin:0;overflow:hidden;">
    <img src="${src}" style="max-width:100%;height:auto;display:block;margin:0 auto;">
  </section>
</section>
${caption}`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="padding:0 10px 24px;">
  <section style="border-top:1px solid ${t.line};padding-top:28px;">
    <p style="margin-bottom:16px;font-size:15px;line-height:1.8;color:${t.text};text-align:left;">
      ${span("如果这篇内容对你有用，欢迎")}
      <strong style="color:${t.title};">${span("收藏、转发、留言")}</strong>
      ${span("交流。")}
    </p>
  </section>
</section>`
}

export function onelinerCard(text: string): string {
  const t = DESIGN_TOKENS
  return `<section style="margin:10px 10px 40px;"><p style="font-size:15px;margin:0;text-align:center;color:${t.title};font-weight:700;letter-spacing:1px;border-top:1px solid ${t.line};border-bottom:1px solid ${t.line};padding:14px 10px;">${span(text)}</p></section>`
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

  const metaParts: string[] = []
  if (tag) metaParts.push(span(tag))
  if (tag && date) metaParts.push(span(" · "))
  if (date) metaParts.push(span(date))
  const meta =
    metaParts.length > 0
      ? `<p style="font-size:11px;color:${t.muted};margin:0 0 24px;letter-spacing:2px;">${metaParts.join("")}</p>`
      : ""

  const imageBlock = image
    ? `<section style="border:1px solid ${t.line};padding:4px;margin-bottom:24px;">
        <section style="margin:0;overflow:hidden;">
          <img src="${image}" style="max-width:100%;height:auto;display:block;margin:0 auto;">
        </section>
      </section>`
    : ""

  return `
<section style="padding:0 10px 40px;">
  ${imageBlock}
  <section style="border-top:1px solid ${t.line};border-bottom:1px solid ${t.line};padding:${image ? "40px" : "48px"} 20px;text-align:center;">
    ${meta}
    <h1 style="font-size:24px;font-weight:800;color:${t.title};margin:0 0 14px;letter-spacing:0.5px;line-height:1.4;">
      ${span(title)}
    </h1>
    <p style="font-size:14px;color:${t.secondary};margin:0;line-height:1.6;">
      ${span(subtitle)}
    </p>
  </section>
</section>`
}

export function toc(chapters: Array<{ number: string; title: string }>): string {
  const t = DESIGN_TOKENS
  if (chapters.length === 0) return ""

  const items = chapters
    .map((chapter, index) => {
      const isLast = index === chapters.length - 1
      const isConc = isLast && isConclusionTitle(chapter.title)
      const number = isConc ? "∞" : chapter.number
      const marginRight = isLast ? "0" : "8px"
      return `<section style="flex:1;background:${t.paleBg};border-top:1px solid ${t.line};padding:18px 12px 16px;margin-right:${marginRight};">
      <p style="font-size:11px;color:${t.muted};font-weight:500;margin:0 0 8px;letter-spacing:1px;">
        ${span(number)}
      </p>
      <p style="font-size:13px;font-weight:700;color:${t.title};margin:0;line-height:1.5;">
        ${span(chapter.title)}
      </p>
    </section>`
    })
    .join("")

  return `
<section style="padding:0 10px 40px;">
  <p style="font-size:11px;color:${t.muted};margin:0 0 16px;letter-spacing:2px;">
    ${span("本文看点")}
  </p>
  <section style="display:flex;justify-content:space-between;">
    ${items}
  </section>
</section>`
}

export function subheading(title: string): string {
  const t = DESIGN_TOKENS
  return `<section style="margin:28px 0 14px;"><span style="display:inline-block;font-size:12px;font-weight:800;color:${t.title};background:${t.tagBg};padding:5px 12px;border-radius:4px;letter-spacing:0.5px;">${span(title)}</span></section>`
}

export function list(items: string[], ordered = false): string {
  const t = DESIGN_TOKENS

  if (ordered) {
    const rows = items
      .map((item, index) => {
        return `<section style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
  <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;background:${t.title};color:#fff;font-size:12px;font-weight:700;border-radius:50%;flex-shrink:0;margin-top:2px;">${span(String(index + 1))}</span>
  <p style="font-size:15px;color:${t.text};margin:0;line-height:1.8;flex:1;">${span(item)}</p>
</section>`
      })
      .join("")
    return `<section style="margin-bottom:24px;">${rows}</section>`
  }

  const rows = items
    .map((item) => {
      return `<section style="margin-bottom:14px;">
  <p style="margin:0 0 6px;">
    <span style="display:inline-block;font-size:14px;font-weight:700;color:${t.title};background:${t.tagBg};padding:3px 10px;border-radius:999px;">
      <span style="display:inline-block;width:6px;height:6px;background:${t.primary};border-radius:50%;margin-right:5px;vertical-align:middle;"><span leaf=""><br></span></span>
      ${span(item)}
    </span>
  </p>
</section>`
    })
    .join("")
  return `<section style="margin-bottom:24px;">${rows}</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="padding:0 10px;">
  <section style="text-align:center;margin:0 0 36px;">
    <section style="display:flex;align-items:center;justify-content:center;">
      <span style="height:1px;width:48px;background:${t.line};margin-right:16px;"><span leaf=""><br></span></span>
      <span style="font-size:10px;color:${t.muted};letter-spacing:4px;font-weight:500;">${span("THE END")}</span>
      <span style="height:1px;width:48px;background:${t.line};margin-left:16px;"><span leaf=""><br></span></span>
    </section>
  </section>
</section>`
}
