interface ShortcutsModalProps {
  onClose: () => void
}

const SHORTCUTS: [string, string][] = [
  ["复制 HTML", "Ctrl / Cmd + Shift + C"],
  ["加粗", "Ctrl / Cmd + B"],
  ["斜体", "Ctrl / Cmd + I"],
  ["全屏编辑", "点击右上角按钮"],
]

// Keyboard shortcuts reference dialog. Closes on backdrop click or Escape.
export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10,10,11,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1c1c1f",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          maxWidth: "420px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          padding: "28px",
          color: "#fff",
        }}
      >
        <h2 id="shortcuts-title" style={{ margin: "0 0 16px", fontSize: "20px" }}>快捷键</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {SHORTCUTS.map(([action, key]) => (
            <div key={action} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{action}</span>
              <kbd
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                }}
              >
                {key}
              </kbd>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: "24px",
            padding: "8px 20px",
            background: "#f25b29",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          关闭
        </button>
      </div>
    </div>
  )
}
