import { useState, useEffect } from "react"

/**
 * Debounce a value by `delay` milliseconds.
 * Useful for deferring expensive computations (e.g. preview rendering)
 * while the user is actively typing.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
