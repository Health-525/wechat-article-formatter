import { useEffect, type RefObject } from "react"

/**
 * Call `handler` when a click happens outside the element referenced by `ref`.
 * When `enabled` is false, the listener is detached (no-op). This replaces
 * the manual document click listener previously duplicated across components.
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return
    const listener = (event: MouseEvent) => {
      const el = ref.current
      if (!el || el.contains(event.target as Node)) return
      handler()
    }
    document.addEventListener("click", listener)
    return () => document.removeEventListener("click", listener)
  }, [ref, handler, enabled])
}
