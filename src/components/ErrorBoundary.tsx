import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("墨排渲染错误:", error, errorInfo)
  }

  handleReset = () => {
    sessionStorage.removeItem("mopai-markdown")
    sessionStorage.removeItem("mopai-title")
    sessionStorage.removeItem("mopai-theme")
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "#0a0a0b",
            color: "#ffffff",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
          }}
          role="alert"
          aria-live="assertive"
        >
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 24px",
                borderRadius: 16,
                background: "#f25b29",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              墨
            </div>
            <h1 style={{ fontSize: 22, marginBottom: 12 }}>出错了，但别担心</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 24 }}>
              编辑器遇到了一点小问题。你可以尝试重置本地草稿并刷新页面，或者稍后再试。
            </p>
            {this.state.error && (
              <pre
                style={{
                  textAlign: "left",
                  background: "rgba(255,255,255,0.05)",
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 24,
                  overflow: "auto",
                  maxHeight: 120,
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                background: "#f25b29",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              重置并刷新
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
