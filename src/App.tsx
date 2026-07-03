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
      <EditorWorkspace />
    </div>
  )
}

export default App
