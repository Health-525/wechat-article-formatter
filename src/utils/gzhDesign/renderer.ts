import { render as renderMoyuGreen } from "./renderers/moyu-green"
import { render as renderRedWhite } from "./renderers/red-white"
import { render as renderGraphiteMinimal } from "./renderers/graphite-minimal"
import { render as renderZenWhitespace } from "./renderers/zen-whitespace"
import { render as renderMoyuTicket } from "./renderers/moyu-ticket"
import { render as renderOliveJournal } from "./renderers/olive-journal"
import { render as renderWarmInk } from "./renderers/warm-ink"
import { render as renderPurpleInk } from "./renderers/purple-ink"
import { render as renderAiNotebook } from "./renderers/ai-notebook"

const RENDERERS: Record<string, (markdown: string) => string> = {
  "moyu-green": renderMoyuGreen,
  "red-white": renderRedWhite,
  "graphite-minimal": renderGraphiteMinimal,
  "zen-whitespace": renderZenWhitespace,
  "moyu-ticket": renderMoyuTicket,
  "olive-journal": renderOliveJournal,
  "warm-ink": renderWarmInk,
  "purple-ink": renderPurpleInk,
  "ai-notebook": renderAiNotebook,
}

const DEFAULT_THEME = "moyu-green"

export function renderGzhDesignMarkdown(markdown: string, themeId: string): string {
  const render = RENDERERS[themeId] || RENDERERS[DEFAULT_THEME]
  return render(markdown)
}
