import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import {
  Upload,
  FileText,
  Trash2,
  Copy,
  Check,
  ImageIcon,
  Maximize2,
  Minimize2,
  ChevronDown,
  Eye,
  Code2,
} from "lucide-react"
import { themes, themeCategories } from "../utils/themes"
import {
  renderMarkdownToHtml,
  wrapArticle,
  copyToClipboard,
  demoMarkdown,
} from "../utils/markdownParser"

/**
 * Count meaningful content length.
 * - CJK characters count individually.
 * - Non-CJK words count as groups of letters/numbers.
 */
function countContent(text: string): number {
  const cjk = (text.match(/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || []).length
  const words = (text.match(/[a-zA-Z0-9_]+/g) || []).length
  return cjk + words
}

// ─── Vertical divider component ───
function VDiv() {
  return (
    <div
      style={{
        width: "1px",
        height: "20px",
        background: "rgba(255,255,255,0.08)",
        margin: "0 2px",
      }}
    />
  )
}

// ─── Tooltip component ───
function TooltipBtn({
  children,
  label,
  onClick,
  danger,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
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
        padding: "6px 8px",
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      {children}
      <span style={{ fontFamily: "var(--font-sans)" }}>{label}</span>
    </button>
  )
}

export default function EditorWorkspace() {
  const [markdown, setMarkdown] = useState(demoMarkdown)
  const [title, setTitle] = useState("欢迎使用墨排")
  const [activeTheme, setActiveTheme] = useState("minimal-white")
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")
  const [themeOpen, setThemeOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const markdownRef = useRef(markdown)

  // Keep ref in sync without triggering lint "update during render"
  useEffect(() => {
    markdownRef.current = markdown
  }, [markdown])

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Close theme dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(e.target as Node)
      ) {
        setThemeOpen(false)
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const activeThemeData =
    themes.find((t) => t.id === activeTheme) || themes[0]

  const previewHtml = useMemo(
    () =>
      wrapArticle(
        renderMarkdownToHtml(markdown, activeTheme),
        title,
        "",
        activeTheme
      ),
    [markdown, title, activeTheme]
  )

  const wordCount = useMemo(() => countContent(markdown), [markdown])

  // ─── File Handlers ───
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        if (content) {
          setMarkdown(content)
          const titleMatch = content.match(/^#\s+(.+)$/m)
          if (titleMatch) setTitle(titleMatch[1])
        }
      }
      reader.readAsText(file)
      e.target.value = ""
    },
    []
  )

  const insertImage = useCallback(
    (base64: string, alt: string = "image") => {
      const textarea = textareaRef.current
      const currentMarkdown = markdownRef.current
      const imageMarkdown = `\n![${alt}](${base64})\n`
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue =
          currentMarkdown.substring(0, start) +
          imageMarkdown +
          currentMarkdown.substring(end)
        setMarkdown(newValue)
        setTimeout(() => {
          textarea.focus()
          const newPos = start + imageMarkdown.length
          textarea.setSelectionRange(newPos, newPos)
        }, 0)
      } else {
        setMarkdown((prev) => prev + imageMarkdown)
      }
    },
    []
  )

  const processImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        if (base64) insertImage(base64, file.name)
      }
      reader.readAsDataURL(file)
    },
    [insertImage]
  )

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return
      Array.from(files).forEach((file) => processImageFile(file))
      e.target.value = ""
    },
    [processImageFile]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items
      let hasImage = false
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          if (!hasImage) e.preventDefault()
          hasImage = true
          const file = items[i].getAsFile()
          if (file) processImageFile(file)
        }
      }
    },
    [processImageFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = e.dataTransfer.files
      if (!files) return
      const mdExtensions = /\.(md|markdown|txt)$/i

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith("image/")) processImageFile(file)
        else if (mdExtensions.test(file.name)) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const content = event.target?.result as string
            if (content) {
              setMarkdown(content)
              const titleMatch = content.match(/^#\s+(.+)$/m)
              if (titleMatch) setTitle(titleMatch[1])
            }
          }
          reader.readAsText(file)
        }
      }
    },
    [processImageFile]
  )

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(previewHtml)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [previewHtml])

  // Keyboard shortcut: Ctrl/Cmd + Shift + C to copy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault()
        handleCopy()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleCopy])

  const handleClear = useCallback(() => {
    setMarkdown("")
    setTitle("")
  }, [])

  const handleLoadDemo = useCallback(() => {
    setMarkdown(demoMarkdown)
    setTitle("欢迎使用墨排")
  }, [])

  return (
    <section
      className="editor-section"
      style={{
        background: "#0a0a0b",
        height: isFullscreen ? "100dvh" : "calc(100dvh - 44px)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ═══ Hidden file inputs ═══ */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        aria-label="导入 Markdown 文件"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        aria-label="插入图片"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {/* ═══ Top Bar ═══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "4px" : "8px",
          padding: isMobile ? "6px 10px" : "8px 16px",
          background: "#111113",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          minHeight: isMobile ? "40px" : "48px",
        }}
      >
        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: "var(--font-serif)",
            fontSize: isMobile ? "14px" : "15px",
            fontWeight: 600,
            color: "#ffffff",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            padding: isMobile ? "5px 10px" : "6px 12px",
            outline: "none",
            transition: "border-color 0.2s",
            letterSpacing: "0.3px",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(242,91,41,0.4)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
          }}
        />

        {/* Divider */}
        <VDiv />

        {/* Action buttons — icon + label for clarity */}
        <TooltipBtn
          label={isMobile ? "" : "导入"}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={15} />
        </TooltipBtn>

        <TooltipBtn
          label={isMobile ? "" : "图片"}
          onClick={() => imageInputRef.current?.click()}
        >
          <ImageIcon size={15} />
        </TooltipBtn>

        {!isMobile && (
          <>
            <TooltipBtn label="示例" onClick={handleLoadDemo}>
              <FileText size={15} />
            </TooltipBtn>
            <TooltipBtn label="清空" onClick={handleClear} danger>
              <Trash2 size={15} />
            </TooltipBtn>
          </>
        )}

        <VDiv />

        {/* Theme selector */}
        <div
          ref={themeDropdownRef}
          style={{ position: "relative", flexShrink: 0 }}
        >
          <button
            onClick={() => setThemeOpen(!themeOpen)}
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
                transform: themeOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.15s",
                opacity: 0.6,
              }}
            />
          </button>
          {themeOpen && (
            <div
              id="theme-dropdown"
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
                      onClick={() => {
                        setActiveTheme(theme.id)
                        setThemeOpen(false)
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

        <VDiv />

        {/* Fullscreen toggle */}
        <button
          aria-label={isFullscreen ? "退出全屏" : "全屏编辑"}
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.45)",
            background: "transparent",
            border: "none",
            borderRadius: "6px",
            padding: "6px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)"
            e.currentTarget.style.color = "#fff"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "rgba(255,255,255,0.45)"
          }}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>

        {/* Copy CTA */}
        <button
          aria-label="复制排版后的 HTML"
          onClick={handleCopy}
          className={copied ? "copy-success" : ""}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: isMobile ? "12px" : "13px",
            fontWeight: 600,
            color: "#ffffff",
            background: copied ? "#238636" : "#f25b29",
            border: "none",
            borderRadius: "6px",
            padding: isMobile ? "6px 12px" : "7px 16px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: copied
              ? "none"
              : "0 2px 8px rgba(242,91,41,0.25)",
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>

      {/* ═══ Editor + Preview Grid ═══ */}
      <div
        className="editor-main-grid"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Left: Editor ── */}
        <div
          className="mobile-edit-panel"
          data-active={mobileTab === "edit" ? "true" : "false"}
          style={{
            borderRight: isMobile
              ? "none"
              : "1px solid rgba(255,255,255,0.06)",
            flexDirection: "column",
            background: "#0d0d0f",
            height: "100%",
            minHeight: 0,
          }}
        >
          {/* Editor sub-header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "6px 12px" : "8px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "#0d0d0f",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                color: "var(--color-metal-dark)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Markdown
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "var(--color-metal-dark)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {wordCount}
              <span style={{ marginLeft: "2px" }}>字</span>
            </span>
          </div>

          {/* Drag overlay */}
          {isDragging && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(242,91,41,0.06)",
                border: "2px dashed #f25b29",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                color: "#f25b29",
                flexDirection: "column",
                gap: "12px",
                animation: "dragPulse 1.5s ease infinite",
              }}
            >
              <Upload size={32} />
              <span>拖放文件到此处</span>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onPaste={handlePaste}
            placeholder={
              "输入 Markdown...\n\n支持：标题、列表、表格、代码块、图片\n\n粘贴或拖拽图片可直接插入"
            }
            style={{
              flex: 1,
              padding: isMobile ? "12px" : "16px 20px",
              fontFamily:
                "'SF Mono',Monaco,'Source Code Pro',Consolas,monospace",
              fontSize: isMobile ? "16px" : "14px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.8)",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              minHeight: 0,
              WebkitOverflowScrolling: "touch",
            }}
            spellCheck={false}
          />
        </div>

        {/* ── Right: Preview ── */}
        <div
          className="mobile-preview-panel"
          data-active={mobileTab === "preview" ? "true" : "false"}
          style={{
            background: activeThemeData.previewBg,
            overflow: "auto",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
          }}
        >
          {/* Preview sub-header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "6px 12px" : "8px 16px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              background: activeThemeData.previewBg,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                color: "var(--color-metal-dark)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              预览 · {activeThemeData.name}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>

      {/* ═══ Mobile Tab Bar ═══ */}
      {isMobile && (
        <div
          className="mobile-tab-bar"
          style={{
            display: "flex",
            background: "#141416",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
            height: "48px",
            zIndex: 50,
          }}
        >
          {(["edit", "preview"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: mobileTab === tab ? 600 : 400,
                color:
                  mobileTab === tab
                    ? "#f25b29"
                    : "rgba(255,255,255,0.35)",
                background:
                  mobileTab === tab
                    ? "rgba(242,91,41,0.06)"
                    : "transparent",
                border: "none",
                borderBottom:
                  mobileTab === tab
                    ? "2px solid #f25b29"
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab === "edit" ? (
                <>
                  <Code2 size={14} />
                  编辑
                </>
              ) : (
                <>
                  <Eye size={14} />
                  预览
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
