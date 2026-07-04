import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "../useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the initial value immediately", () => {
    const { result } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: "hello" },
    })
    expect(result.current).toBe("hello")
  })

  it("updates the value only after the delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: "hello" },
    })

    rerender({ value: "world" })
    expect(result.current).toBe("hello")

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe("world")
  })

  it("resets the timer when the value changes rapidly", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: "a" },
    })

    rerender({ value: "ab" })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ value: "abc" })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe("a")

    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(result.current).toBe("abc")
  })
})
