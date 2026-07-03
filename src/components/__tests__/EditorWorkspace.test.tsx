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
})
