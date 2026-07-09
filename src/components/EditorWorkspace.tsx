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
  MoreVertical,
  Eye,
  Code2,
  HelpCircle,
  Download,
  Keyboard,
  Smartphone,
  Monitor,
} from "lucide-react"
import { themes } from "../utils/themes"
import {
  renderMarkdownToHtml,
  wrapArticle,
  copyToClipboard,
  demoMarkdown,
  getImageCompatibility,
  validateWeChatHtml,
} from "../utils/markdownParser"
import { useDebounce } from "../hooks/useDebounce"
import { VDiv } from "./workspace/VDiv"
import { TooltipBtn } from "./workspace/TooltipBtn"
import { MarkdownToolbar } from "./workspace/MarkdownToolbar"
import ThemeDropdown from "./workspace/ThemeDropdown"
import { HelpModal } from "./workspace/HelpModal"
import { ShortcutsModal } from "./workspace/ShortcutsModal"

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
  const [isMobile, setIsMobile] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
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

  // Live WeChat-compatibility checks so the author sees problems before copying.
  const wechatCheck = useMemo(() => {
    if (typeof document === "undefined") return { errors: [], warnings: [] }
    return validateWeChatHtml(previewHtml)
  }, [previewHtml])
  const imageCompat = useMemo(
    () => getImageCompatibility(previewHtml),
    [previewHtml]
  )
  const [imgWarnDismissedCount, setImgWarnDismissedCount] = useState(-1)

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
        <ThemeDropdown
          activeTheme={activeTheme}
          onSelect={setActiveTheme}
          isMobile={isMobile}
        />

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

      {/* WeChat compatibility warnings */}
      {wechatCheck.errors.length > 0 && (
        <div
          style={{
            margin: "10px 12px 0",
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#b91c1c",
            fontSize: "12.5px",
            lineHeight: 1.5,
          }}
        >
          ⛔ 当前排版存在公众号不兼容问题，粘贴后可能丢失样式：
          {wechatCheck.errors.join("；")}
        </div>
      )}
      {imageCompat.incompatible > 0 &&
        imgWarnDismissedCount !== imageCompat.incompatible && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              margin: "10px 12px 0",
              padding: "10px 14px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "8px",
              color: "#9a3412",
              fontSize: "12.5px",
              lineHeight: 1.5,
            }}
          >
            <span style={{ flex: 1 }}>
              ⚠️ 检测到 {imageCompat.incompatible} 张图片使用了 data:/blob:/相对路径，公众号无法自动上传，粘贴后将<strong>不显示</strong>。请改用公网 https 图片地址，或在公众号编辑器内单独粘贴图片。
            </span>
            <button
              onClick={() => setImgWarnDismissedCount(imageCompat.incompatible)}
              aria-label="关闭提示"
              style={{
                background: "transparent",
                border: "none",
                color: "#9a3412",
                cursor: "pointer",
                fontSize: "15px",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </div>
        )}

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
            <div style={{ display: "flex", gap: "4px" }}>
              {[
                { mode: "desktop" as const, icon: Monitor, label: "桌面" },
                { mode: "mobile" as const, icon: Smartphone, label: "手机" },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  aria-label={`${label}预览`}
                  aria-pressed={previewMode === mode}
                  onClick={() => setPreviewMode(mode)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    color:
                      previewMode === mode
                        ? "#f25b29"
                        : "rgba(0,0,0,0.45)",
                    background:
                      previewMode === mode
                        ? "rgba(242,91,41,0.08)"
                        : "transparent",
                    border:
                      previewMode === mode
                        ? "1px solid rgba(242,91,41,0.25)"
                        : "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
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
              style={{
                width: previewMode === "mobile" ? 375 : "100%",
                maxWidth: "100%",
                margin: "0 auto",
                minHeight: "100%",
                background: "#fff",
                boxShadow:
                  previewMode === "mobile"
                    ? "0 0 0 1px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.1)"
                    : "none",
                borderRadius: previewMode === "mobile" ? "12px" : 0,
                overflow: "hidden",
              }}
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
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Shortcuts Modal */}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </section>
  )
}
