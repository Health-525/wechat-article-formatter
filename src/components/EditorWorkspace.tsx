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
  MoreVertical,
  Eye,
  Code2,
  Bold,
  Italic,
  Heading,
  Quote,
  Code,
  Link,
  List,
  ListOrdered,
  Table,
  Minus,
  HelpCircle,
  Download,
  Keyboard,
} from "lucide-react"
import { themes, themeCategories } from "../utils/themes"
import {
  renderMarkdownToHtml,
  wrapArticle,
  copyToClipboard,
  demoMarkdown,
} from "../utils/markdownParser"
import { useDebounce } from "../hooks/useDebounce"

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
  hideLabel = false,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
  hideLabel?: boolean
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

// ─── Markdown toolbar component ───
interface ToolbarProps {
  onWrap: (before: string, after: string, defaultText?: string) => void
  onInsert: (text: string) => void
  compact?: boolean
}

function MarkdownToolbar({ onWrap, onInsert, compact }: ToolbarProps) {
  const tools = [
    { icon: Heading, label: "标题", action: () => onWrap("## ", "") },
    { icon: Bold, label: "粗体", action: () => onWrap("**", "**") },
    { icon: Italic, label: "斜体", action: () => onWrap("*", "*") },
    { icon: Quote, label: "引用", action: () => onWrap("> ", "") },
    { icon: Code, label: "代码", action: () => onWrap("`", "`") },
    { icon: Link, label: "链接", action: () => onWrap("[", "](https://)", "链接文字") },
    { icon: List, label: "列表", action: () => onWrap("- ", "") },
    { icon: ListOrdered, label: "序号", action: () => onWrap("1. ", "") },
    { icon: Table, label: "表格", action: () => onInsert("\n| 表头1 | 表头2 |\n|------|------|\n| 内容1 | 内容2 |\n") },
    { icon: Minus, label: "分隔线", action: () => onInsert("\n---\n") },
  ]

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? "4px" : "2px",
        padding: compact ? "6px 12px" : "4px 8px",
        background: "#0d0d0f",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexWrap: compact ? "nowrap" : "wrap",
        flexShrink: 0,
        overflowX: compact ? "auto" : undefined,
        scrollbarWidth: compact ? "none" : undefined,
      }}
    >
      {tools.map((tool) => (
        <button
          key={tool.label}
          aria-label={tool.label}
          onClick={tool.action}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: compact ? "36px" : "28px",
            height: compact ? "36px" : "28px",
            flexShrink: 0,
            color: "rgba(255,255,255,0.55)",
            background: "transparent",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)"
            e.currentTarget.style.color = "#fff"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "rgba(255,255,255,0.55)"
          }}
          title={tool.label}
        >
          <tool.icon size={compact ? 18 : 15} />
        </button>
      ))}
    </div>
  )
}

export default function EditorWorkspace() {
  const [markdown, setMarkdown] = useState(() => {
    if (typeof window === "undefined") return demoMarkdown
    const saved = sessionStorage.getItem("mopai-markdown")
    return saved && saved !== demoMarkdown ? saved : demoMarkdown
  })
  const [title, setTitle] = useState(() => {
    if (typeof window === "undefined") return "欢迎使用墨排"
    return sessionStorage.getItem("mopai-title") || "欢迎使用墨排"
  })
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window === "undefined") return "minimal-white"
    const saved = sessionStorage.getItem("mopai-theme")
    return saved && themes.some((t) => t.id === saved) ? saved : "minimal-white"
  })
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")
  const [themeOpen, setThemeOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)
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
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false)
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Auto-save to sessionStorage so drafts are scoped to this tab/session
  // and are not visible to the next user on the same device.
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("mopai-markdown", markdown)
      sessionStorage.setItem("mopai-title", title)
      sessionStorage.setItem("mopai-theme", activeTheme)
      setSavedAt(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }))
    }, 800)
    return () => clearTimeout(timer)
  }, [markdown, title, activeTheme])



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

  // Debounce preview display so heavy rendering doesn't block typing.
  // Copy/export still use the live previewHtml.
  const displayHtml = useDebounce(previewHtml, 180)

  const wordCount = useMemo(() => countContent(markdown), [markdown])

  // ─── File Handlers ───
  const hasContent = Boolean(markdown || title)

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (
        hasContent &&
        !window.confirm("导入文件将覆盖当前内容，是否继续？")
      ) {
        e.target.value = ""
        return
      }
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
    [hasContent]
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
      let overwriteConfirmed = !hasContent

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith("image/")) processImageFile(file)
        else if (mdExtensions.test(file.name)) {
          if (!overwriteConfirmed) {
            if (!window.confirm("导入文件将覆盖当前内容，是否继续？")) {
              continue
            }
            overwriteConfirmed = true
          }
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
    [processImageFile, hasContent]
  )

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(previewHtml)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 2000)
    }
  }, [previewHtml])

  const handleClear = useCallback(() => {
    if (hasContent && !window.confirm("确定清空当前内容？")) return
    setMarkdown("")
    setTitle("")
  }, [hasContent])

  const handleLoadDemo = useCallback(() => {
    if (hasContent && !window.confirm("加载示例将覆盖当前内容，是否继续？")) return
    setMarkdown(demoMarkdown)
    setTitle("欢迎使用墨排")
  }, [hasContent])

  // ─── Toolbar actions ───
  const wrapSelection = useCallback(
    (before: string, after: string, defaultText: string = "") => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = markdown.substring(start, end) || defaultText
      const replacement = before + selected + after
      const newValue = markdown.substring(0, start) + replacement + markdown.substring(end)
      setMarkdown(newValue)
      setTimeout(() => {
        textarea.focus()
        const newPos = start + replacement.length - after.length
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    },
    [markdown]
  )

  const insertText = useCallback(
    (text: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const newValue = markdown.substring(0, start) + text + markdown.substring(start)
      setMarkdown(newValue)
      setTimeout(() => {
        textarea.focus()
        const newPos = start + text.length
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    },
    [markdown]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey && e.key.toLowerCase() === "c") {
          e.preventDefault()
          handleCopy()
        } else if (e.key.toLowerCase() === "b") {
          e.preventDefault()
          wrapSelection("**", "**")
        } else if (e.key.toLowerCase() === "i") {
          e.preventDefault()
          wrapSelection("*", "*")
        } else if (e.key === "?") {
          e.preventDefault()
          setShowShortcuts(true)
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleCopy, wrapSelection])

  // ─── Export HTML file ───
  const handleExportHtml = useCallback(() => {
    const blob = new Blob([previewHtml], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "untitled"}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [previewHtml, title])

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
          label="导入 Markdown"
          hideLabel={isMobile}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={15} />
        </TooltipBtn>

        <TooltipBtn
          label="插入图片"
          hideLabel={isMobile}
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
            <TooltipBtn label="导出 HTML" onClick={handleExportHtml}>
              <Download size={15} />
            </TooltipBtn>
          </>
        )}

        {isMobile && (
          <div ref={moreMenuRef} style={{ position: "relative", flexShrink: 0 }}>
            <TooltipBtn
              label="更多"
              hideLabel
              onClick={() => setMoreOpen((v) => !v)}
            >
              <MoreVertical size={15} />
            </TooltipBtn>
            {moreOpen && (
              <div
                role="menu"
                aria-label="更多操作"
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  background: "#1c1c1f",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "6px 0",
                  minWidth: "150px",
                  zIndex: 100,
                }}
              >
                {[
                  { label: "示例", icon: FileText, action: handleLoadDemo },
                  { label: "清空", icon: Trash2, action: handleClear, danger: true },
                  { label: "导出 HTML", icon: Download, action: handleExportHtml },
                  { label: "快捷键", icon: Keyboard, action: () => setShowShortcuts(true) },
                  { label: "帮助", icon: HelpCircle, action: () => setShowHelp(true) },
                ].map((item) => (
                  <button
                    key={item.label}
                    role="menuitem"
                    onClick={() => {
                      item.action()
                      setMoreOpen(false)
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "8px 14px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      color: item.danger ? "#ff6b6b" : "rgba(255,255,255,0.85)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <item.icon size={15} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <VDiv />

        {/* Theme selector */}
        <div
          ref={themeDropdownRef}
          style={{ position: "relative", flexShrink: 0 }}
        >
          <button
            aria-label="选择排版主题"
            aria-haspopup="listbox"
            aria-expanded={themeOpen}
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

        {/* Help & shortcuts */}
        {!isMobile && (
          <>
            <TooltipBtn label="快捷键" onClick={() => setShowShortcuts(true)}>
              <Keyboard size={15} />
            </TooltipBtn>
            <TooltipBtn label="帮助" onClick={() => setShowHelp(true)}>
              <HelpCircle size={15} />
            </TooltipBtn>
          </>
        )}

        <VDiv />

        {/* Fullscreen toggle */}
        <button
          aria-label={isFullscreen ? "退出聚焦模式" : "进入聚焦模式"}
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.45)",
            background: "transparent",
            border: "none",
            borderRadius: "6px",
            padding: "8px",
            cursor: "pointer",
            transition: "all 0.15s",
            minWidth: "36px",
            minHeight: "36px",
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
            background: copied ? "#238636" : copyError ? "#ff6b6b" : "#f25b29",
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
            boxShadow:
              copied || copyError
                ? "none"
                : "0 2px 8px rgba(242,91,41,0.25)",
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "已复制" : copyError ? "复制失败" : "复制"}
        </button>
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {copied
            ? "HTML 已复制到剪贴板"
            : copyError
              ? "复制失败，请尝试导出 HTML"
              : ""}
        </div>
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
          {/* Markdown toolbar */}
          <MarkdownToolbar
            onWrap={wrapSelection}
            onInsert={insertText}
            compact={isMobile}
          />

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
            <label
              htmlFor="mopai-editor"
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
            </label>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: savedAt ? "#5a8a5a" : "var(--color-metal-dark)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {savedAt ? `已自动备份 ${savedAt} · ${wordCount}` : wordCount}
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
            id="mopai-editor"
            className="editor-textarea"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onPaste={handlePaste}
            aria-label="Markdown 编辑区"
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
            <div
              role="region"
              aria-label="排版预览"
              dangerouslySetInnerHTML={{ __html: displayHtml }}
            />
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

      {/* Help Modal */}
      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowHelp(false)
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
          onClick={() => setShowHelp(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1c1c1f",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              padding: "28px",
              color: "#fff",
            }}
          >
            <h2 id="help-title" style={{ margin: "0 0 16px", fontSize: "20px" }}>欢迎使用墨排</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
              墨排是一款免费的 Markdown 转微信公众号排版工具。左侧编辑，右侧预览，一键复制即可粘贴到公众号编辑器。
            </p>
            <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>快速上手</h3>
            <ol style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, paddingLeft: "20px", marginBottom: "20px" }}>
              <li>在左侧输入或导入 Markdown 内容</li>
              <li>从顶部主题下拉框选择喜欢的排版风格</li>
              <li>点击右上角「复制」按钮，粘贴到公众号编辑器</li>
            </ol>
            <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>图片支持</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
              支持点击上传、粘贴截图、拖拽文件三种方式插入图片。图片会自动以 Base64 形式嵌入，无需额外图床。
            </p>
            <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>草稿说明</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
              内容会实时备份到当前浏览器标签页，刷新不丢失；关闭标签页或浏览器后草稿会自动清除，保护你的隐私。重要内容请及时导出 HTML。
            </p>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                marginTop: "8px",
                padding: "8px 20px",
                background: "#f25b29",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              知道了
            </button>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowShortcuts(false)
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
          onClick={() => setShowShortcuts(false)}
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
              {[
                ["复制 HTML", "Ctrl / Cmd + Shift + C"],
                ["加粗", "Ctrl / Cmd + B"],
                ["斜体", "Ctrl / Cmd + I"],
                ["全屏编辑", "点击右上角按钮"],
              ].map(([action, key]) => (
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
              onClick={() => setShowShortcuts(false)}
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
      )}
    </section>
  )
}
