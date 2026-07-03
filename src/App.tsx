import { ErrorBoundary } from "./components/ErrorBoundary"
import EditorWorkspace from "./components/EditorWorkspace"

function App() {
  return (
    <ErrorBoundary>
      <div
        className="relative"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <EditorWorkspace />
      </div>
    </ErrorBoundary>
  )
}

export default App
