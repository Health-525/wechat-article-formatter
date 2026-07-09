import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { themes, themeCategories } from "../../utils/themes"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"

interface ThemeDropdownProps {
  activeTheme: string
  onSelect: (id: string) => void
  isMobile?: boolean
}

// Controlled-by-internal-state theme picker. Renders the current theme chip
// plus a categorized dropdown list. Click-outside is handled by useOnClickOutside.
export default function ThemeDropdown({ activeTheme, onSelect, isMobile }: ThemeDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setOpen(false), open)

  const activeThemeData = themes.find((t) => t.id === activeTheme) || themes[0]

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        aria-label="选择排版主题"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-sans)",
          fontSize: "12px",
          color: "rgba(255,255,255,0.7)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px",
          padding: isMobile ? "5px 8px" : "6px 10px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: activeThemeData.previewBg,
            border: "1px solid rgba(255,255,255,0.2)",
            display: "inline-block",
          }}
        />
        <span>{activeThemeData.name}</span>
        <ChevronDown
          size={12}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.15s",
            opacity: 0.6,
          }}
        />
      </button>
      {open && (
        <div
          id="theme-dropdown"
          role="listbox"
          aria-label="排版主题"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "#1c1c1f",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "6px 0",
            minWidth: "170px",
            zIndex: 100,
            maxHeight: "380px",
            overflow: "auto",
          }}
        >
          {themeCategories.map((cat) => (
            <div key={cat.label}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  color: "var(--color-metal-dark)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "6px 14px 3px",
                  fontWeight: 500,
                }}
              >
                {cat.label}
              </div>
              {cat.themes.map((theme) => (
                <button
                  key={theme.id}
                  role="option"
                  aria-selected={activeTheme === theme.id}
                  onClick={() => {
                    onSelect(theme.id)
                    setOpen(false)
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "6px 14px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color:
                      activeTheme === theme.id
                        ? "#f25b29"
                        : "rgba(255,255,255,0.75)",
                    background:
                      activeTheme === theme.id
                        ? "rgba(242,91,41,0.08)"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTheme !== theme.id)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)"
                  }}
                  onMouseLeave={(e) => {
                    if (activeTheme !== theme.id)
                      e.currentTarget.style.background = "transparent"
                  }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "4px",
                      background: theme.previewBg,
                      border:
                        activeTheme === theme.id
                          ? "2px solid #f25b29"
                          : "1px solid rgba(255,255,255,0.15)",
                      flexShrink: 0,
                    }}
                  />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
