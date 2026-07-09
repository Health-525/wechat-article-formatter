import type { ReactNode } from "react"

interface TooltipBtnProps {
  children: ReactNode
  label: string
  onClick: () => void
  danger?: boolean
  hideLabel?: boolean
}

// Icon button with an optional inline text label, used across the editor top bar.
export function TooltipBtn({
  children,
  label,
  onClick,
  danger,
  hideLabel = false,
}: TooltipBtnProps) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? "rgba(255,107,107,0.1)"
          : "rgba(255,255,255,0.08)"
        e.currentTarget.style.color = danger ? "#ff6b6b" : "#fff"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
        e.currentTarget.style.color = danger
          ? "#ff6b6b"
          : "rgba(255,255,255,0.55)"
      }}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        color: danger ? "#ff6b6b" : "rgba(255,255,255,0.55)",
        background: "transparent",
        border: "none",
        borderRadius: "6px",
        padding: hideLabel ? "8px" : "8px 10px",
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        minWidth: "36px",
        minHeight: "36px",
      }}
    >
      {children}
      {!hideLabel && <span style={{ fontFamily: "var(--font-sans)" }}>{label}</span>}
    </button>
  )
}
