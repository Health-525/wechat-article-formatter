import Navigation from "./components/Navigation"
import EditorWorkspace from "./components/EditorWorkspace"

function App() {
  return (
    <div
      className="relative"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Navigation />
      <div style={{ flex: 1, minHeight: 0, marginTop: "44px" }}>
        <EditorWorkspace />
      </div>
    </div>
  )
}

export default App
