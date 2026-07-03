import "@testing-library/jest-dom"
import { beforeEach } from "vitest"

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
})
