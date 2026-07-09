import fs from "fs"
import path from "path"

const src = path.resolve("node_modules/katex/dist/katex.min.css")
const outDir = path.resolve("src/generated")
const outFile = path.join(outDir, "katexCss.ts")

const css = fs.readFileSync(src, "utf-8")
const escaped = css
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$/g, "\\$")

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  outFile,
  "// Auto-generated from node_modules/katex/dist/katex.min.css\n" +
    "// Do not edit manually. Run `npm run generate:katex-css` to update.\n\n" +
    "export const katexCss = `" +
    escaped +
    "`\n"
)

console.log(`Generated ${outFile} (${css.length} bytes)`)
