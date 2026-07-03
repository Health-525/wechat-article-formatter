import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import EditorWorkspace from "../EditorWorkspace"

describe("EditorWorkspace", () => {
  it("renders the editor and preview panels", () => {
    render(<EditorWorkspace />)
    expect(screen.getByPlaceholderText(/输入 Markdown/i)).toBeInTheDocument()
    expect(screen.getByText(/预览 ·/i)).toBeInTheDocument()
  })

  it("renders toolbar actions", () => {
    render(<EditorWorkspace />)
    expect(screen.getByRole("button", { name: /导出 HTML/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /复制/i })).toBeInTheDocument()
  })

  it("restores the previous session draft from sessionStorage", () => {
    sessionStorage.setItem("mopai-markdown", "# Session draft")
    sessionStorage.setItem("mopai-title", "Session title")
    render(<EditorWorkspace />)
    expect(screen.getByDisplayValue("Session title")).toBeInTheDocument()
  })

  it("does not restore drafts left behind in localStorage", () => {
    localStorage.setItem("mopai-markdown", "# Old local draft")
    localStorage.setItem("mopai-title", "Old local title")
    render(<EditorWorkspace />)
    expect(screen.queryByDisplayValue("Old local title")).not.toBeInTheDocument()
  })
})
