import { siteConfig } from "../config"

export default function Navigation() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center px-4 md:px-5"
      style={{
        height: "44px",
        background: "rgba(10,10,11,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        className="no-underline"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "17px",
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "0.1em",
        }}
      >
        {siteConfig.brandName}
      </a>

      <div style={{ flex: 1 }} />

      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          color: "var(--color-metal-dark)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Markdown → WeChat
      </span>
    </nav>
  )
}
