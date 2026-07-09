// 摸鱼票据风主题组件库 —— 从 gzh-design-skill 移植
// https://github.com/isjiamu/gzh-design-skill/blob/main/references/theme-moyu-ticket.md

export const DESIGN_TOKENS = {
  primary: "#B45309",
  secondary: "#666666",
  bg: "#ffffff",
  paper: "#fffbf0",
  text: "#555555",
  title: "#1a1a1a",
  muted: "#888888",
  helper: "#999999",
  accent: "#FCD34D",
  lightGreenBg: "#FFFBEB",
  dark: "#1a1a1a",
  lightBorder: "#eeeeee",
  codeBg: "#F3F4F6",
  codeText: "#1F2937",
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
  return `<section style="max-width:${t.maxWidth}px;margin:0 auto;background:${t.bg};font-family:${t.fontStack};color:#374151;line-height:1.75;letter-spacing:${t.letterSpacing}px;overflow-x:hidden;">${children}</section>`
}

export function chapterMeta(
  index: number,
  total: number,
  title: string
): { number: string; label: string } {
  void total
  void title
  return {
    number: String(index + 1).padStart(2, "0"),
    label: "CHAPTER",
  }
}

export function chapterTitle(
  number: string,
  title: string,
  label: string,
  isFirst: boolean
): string {
  const t = DESIGN_TOKENS
  const marginTop = isFirst ? "16px" : "48px"
  return `
<section style="margin-top:${marginTop};margin-bottom:32px;padding:0 20px;">
  <section style="display:flex;align-items:center;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid ${t.dark};">
    <section style="background:${t.primary};color:#ffffff;font-size:12px;font-weight:800;padding:6px 12px;letter-spacing:2px;flex-shrink:0;margin-right:12px;">${span(number)}</section>
    <section style="font-size:18px;font-weight:800;color:${t.title};letter-spacing:1px;margin-right:12px;">${span(title)}</section>
    <section style="font-size:12px;color:${t.muted};flex-shrink:0;">${span(`/ ${label}`)}</section>
  </section>
</section>`
}

export function paragraph(children: string): string {
  const t = DESIGN_TOKENS
  return `<section style="margin-bottom:32px;padding:0 20px;"><p style="font-size:${t.bodySize}px;color:${t.text};line-height:${t.lineHeight};margin-bottom:16px;text-align:left;">${children}</p></section>`
}

export function strong(text: string): string {
  return `<span style="color:${DESIGN_TOKENS.primary};font-weight:700;">${span(text)}</span>`
}

export function inlineCode(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:${t.codeBg};color:${t.codeText};padding:2px 6px;border-radius:4px;font-size:13px;font-weight:600;">${span(text)}</span>`
}

export function underline(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="border-bottom:2px solid ${t.accent};font-weight:600;">${span(text)}</span>`
}

export function highlight(text: string): string {
  const t = DESIGN_TOKENS
  return `<span style="background:linear-gradient(120deg,${t.accent} 0%,rgba(167,243,208,0) 100%);padding:0 4px;font-weight:600;color:${t.title};">${span(text)}</span>`
}

export function quoteBox(children: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-bottom:32px;padding:0 20px;">
  <section style="background:${t.lightGreenBg};border-left:4px solid ${t.primary};padding:14px 16px;">
    <p style="font-size:${t.bodySize}px;color:${t.title};font-weight:600;line-height:1.7;margin:0;text-align:left;">${children}</p>
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

  const header = language
    ? `<section style="padding:7px 14px;border-bottom:1px solid #E5E7EB;"><span style="font-size:12px;color:#9CA3AF;font-family:${t.monoStack};letter-spacing:1px;">${span(language)}</span></section>`
    : ""

  return `
<section style="margin:0 0 20px;border-radius:8px;overflow:hidden;background:${t.codeBg};border:1px solid #E5E7EB;border-left:3px solid ${t.primary};">
  ${header}
  <section style="padding:11px 14px;">
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
<section style="margin-bottom:32px;padding:0 20px;">
  <section style="background:${t.paper};border:1px solid ${t.lightBorder};padding:6px;">
    <figure style="margin:0;">
      <img src="${src}" alt="${alt}" style="max-width:100%;height:auto;display:block;margin:0 auto;">
    </figure>
  </section>
</section>
${caption}`
}

export function footerCta(): string {
  const t = DESIGN_TOKENS
  return `
<section style="padding:0 0 32px;">
  <section style="background:${t.paper};border:2px solid ${t.dark};box-shadow:4px 4px 0 ${t.dark};padding:24px 20px;text-align:center;">
    <p style="font-size:13px;font-weight:700;color:${t.title};margin:0 0 20px;line-height:1.6;">${span("觉得这张‘票据’值得留存？欢迎点赞、在看、星标三连。")}</p>
    <section style="display:flex;justify-content:center;margin-bottom:16px;">
      <section style="text-align:center;margin:0 12px;color:${t.text};">
        <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:#ffffff;border:1px solid ${t.dark};">
          <span style="font-size:20px;line-height:1;">${span("👍")}</span>
        </section>
        <span style="font-size:10px;font-weight:600;">${span("点赞")}</span>
      </section>
      <section style="text-align:center;margin:0 12px;color:${t.text};">
        <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:#ffffff;border:1px solid ${t.dark};">
          <span style="font-size:20px;line-height:1;">${span("👁")}</span>
        </section>
        <span style="font-size:10px;font-weight:600;">${span("在看")}</span>
      </section>
      <section style="text-align:center;margin:0 12px;color:${t.primary};">
        <section style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;background:${t.lightGreenBg};border:2px solid ${t.primary};">
          <span style="font-size:20px;line-height:1;">${span("⭐")}</span>
        </section>
        <span style="font-size:10px;font-weight:600;">${span("星标")}</span>
      </section>
    </section>
    <section style="border-top:1px dashed #cccccc;padding-top:12px;">
      <p style="font-size:10px;color:${t.helper};letter-spacing:2px;margin:0;">${span("ADMIT ONE ✂")}</p>
    </section>
  </section>
</section>`
}

export function onelinerCard(text: string): string {
  const t = DESIGN_TOKENS
  return `<section style="margin-bottom:32px;padding:0 20px;"><section style="background:${t.paper};border:2px solid ${t.dark};box-shadow:3px 3px 0 ${t.dark};padding:20px;text-align:center;"><p style="margin:0;font-size:15px;font-weight:700;color:${t.title};line-height:1.8;">${span(text)}</p></section></section>`
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
  const headerTag = tag ?? ""
  const footerDate = date ?? "VALID FOR ONE READ"

  const header = `
  <section style="background:${t.primary};padding:12px 20px;display:flex;justify-content:space-between;align-items:center;">
    <section style="color:${t.paper};font-size:11px;letter-spacing:4px;font-weight:600;">${span(headerTag)}</section>
    <section style="color:${t.paper};font-size:11px;letter-spacing:2px;">${span("★★★★★")}</section>
  </section>`

  const tearLine = `
  <section style="display:flex;justify-content:space-between;align-items:center;padding:0 8px;">
    <section style="flex:1;border-top:2px dashed ${t.accent};"><span leaf=""><br></span></section>
    <section style="padding:0 8px;font-size:10px;color:${t.accent};">${span("✂")}</section>
    <section style="flex:1;border-top:2px dashed ${t.accent};"><span leaf=""><br></span></section>
  </section>`

  const footer = `
  <section style="padding:10px 20px;display:flex;justify-content:space-between;align-items:center;">
    <section style="font-size:10px;color:${t.helper};letter-spacing:1px;">${span(footerDate)}</section>
    <section style="font-size:10px;color:${t.helper};letter-spacing:1px;">${span("ADMIT ONE")}</section>
  </section>`

  if (!image) {
    return `
<section style="background:${t.paper};border:2px solid ${t.dark};box-shadow:4px 4px 0 ${t.dark};margin-bottom:32px;">
  ${header}
  <section style="padding:24px 20px;">
    <section style="font-size:24px;font-weight:900;color:${t.title};letter-spacing:0.5px;margin-bottom:4px;text-shadow:0.5px 0 0 ${t.title};">${span(title)}</section>
    <section style="font-size:14px;color:${t.secondary};letter-spacing:1px;margin-bottom:20px;">${span(subtitle)}</section>
    <section style="border-top:1px dashed ${t.accent};"><span leaf=""><br></span></section>
  </section>
  ${tearLine}
  ${footer}
</section>`
  }

  return `
<section style="background:${t.paper};border:2px solid ${t.dark};box-shadow:4px 4px 0 ${t.dark};margin-bottom:32px;">
  ${header}
  <section style="display:flex;">
    <section style="flex:1;padding:24px 20px;">
      <section style="font-size:24px;font-weight:900;color:${t.title};letter-spacing:0.5px;margin-bottom:4px;text-shadow:0.5px 0 0 ${t.title};">${span(title)}</section>
      <section style="font-size:14px;color:${t.secondary};letter-spacing:1px;margin-bottom:20px;">${span(subtitle)}</section>
      <section style="border-top:1px dashed ${t.accent};"><span leaf=""><br></span></section>
    </section>
    <section style="width:120px;padding:14px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${t.lightGreenBg};border-left:2px dashed ${t.accent};">
      <section style="border:2px solid ${t.primary};overflow:hidden;">
        <img src="${image}" alt="" style="max-width:100%;height:auto;display:block;">
      </section>
    </section>
  </section>
  ${tearLine}
  ${footer}
</section>`
}

export function toc(chapters: Array<{ number: string; title: string }>): string {
  const t = DESIGN_TOKENS

  const items = chapters
    .map((chapter, index) => {
      const isLast = index === chapters.length - 1
      const borderBottom = isLast ? "0" : `1px dashed ${t.accent}`
      return `
    <section style="display:flex;align-items:center;padding:10px 0;border-bottom:${borderBottom};">
      <section style="min-width:64px;flex-shrink:0;text-align:left;margin-right:12px;">
        <section style="font-size:16px;font-weight:900;color:${t.primary};letter-spacing:0.5px;line-height:1;">${span(chapter.number)}</section>
      </section>
      <section style="flex:1;font-size:14px;font-weight:600;color:${t.title};line-height:1.4;">${span(chapter.title)}</section>
    </section>`
    })
    .join("")

  return `
<section style="margin-bottom:32px;padding:0 20px;">
  <section style="background:${t.paper};border:2px solid ${t.dark};box-shadow:3px 3px 0 ${t.dark};">
    <section style="background:${t.primary};padding:10px 16px;">
      <section style="color:${t.paper};font-size:12px;font-weight:800;letter-spacing:2px;">${span("目录")}</section>
    </section>
    <section style="padding:4px 16px 8px;">
      ${items}
    </section>
  </section>
</section>`
}

export function subheading(title: string): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-bottom:32px;padding:0 20px;">
  <section style="display:flex;align-items:center;margin-bottom:16px;">
    <section style="width:4px;height:16px;background:${t.primary};margin-right:8px;"><span leaf=""><br></span></section>
    <section style="font-size:15px;font-weight:700;color:${t.title};">${span(title)}</section>
  </section>
</section>`
}

export function list(items: string[], ordered = false): string {
  const t = DESIGN_TOKENS
  if (ordered) {
    const itemsHtml = items
      .map((item, index) => `
  <section style="background:${t.paper};border:1px solid ${t.lightBorder};margin-bottom:12px;">
    <section style="display:flex;align-items:stretch;">
      <section style="width:36px;background:${t.primary};display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:12px;font-weight:800;">${span(String(index + 1))}</section>
      <section style="flex:1;padding:12px 16px;font-size:13px;color:${t.text};line-height:1.7;border-left:1px dashed ${t.accent};">${span(item)}</section>
    </section>
  </section>`)
      .join("")
    return `
<section style="margin-bottom:32px;padding:0 20px;">
  ${itemsHtml}
</section>`
  }

  const itemsHtml = items
    .map((item) => `
  <section style="display:flex;align-items:flex-start;margin-bottom:10px;">
    <section style="flex-shrink:0;width:6px;height:6px;background:${t.primary};margin-top:10px;margin-right:10px;"><span leaf=""><br></span></section>
    <section style="flex:1;font-size:${t.bodySize}px;color:${t.text};line-height:${t.lineHeight};">${span(item)}</section>
  </section>`)
    .join("")
  return `
<section style="margin-bottom:32px;padding:0 20px;">
  ${itemsHtml}
</section>`
}

export function divider(): string {
  const t = DESIGN_TOKENS
  return `
<section style="margin-bottom:32px;padding:0 20px;">
  <section style="display:flex;justify-content:space-between;align-items:center;">
    <section style="flex:1;border-top:2px dashed ${t.accent};"><span leaf=""><br></span></section>
    <section style="padding:0 12px;font-size:11px;color:${t.primary};font-weight:700;letter-spacing:2px;">${span("TEAR OFF")}</section>
    <section style="flex:1;border-top:2px dashed ${t.accent};"><span leaf=""><br></span></section>
  </section>
</section>`
}
