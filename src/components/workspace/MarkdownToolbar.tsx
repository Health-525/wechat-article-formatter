import {
  Heading,
  Bold,
  Italic,
  Quote,
  Code,
  Link,
  List,
  ListOrdered,
  Table,
  Minus,
  CheckSquare,
} from "lucide-react"

interface MarkdownToolbarProps {
  onWrap: (before: string, after: string, defaultText?: string) => void
  onInsert: (text: string) => void
  compact?: boolean
}

// Formatting toolbar above the Markdown editor. Each tool either wraps the
// current selection or inserts a block at the caret position.
export function MarkdownToolbar({ onWrap, onInsert, compact }: MarkdownToolbarProps) {
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
    { icon: CheckSquare, label: "任务", action: () => onInsert("\n:::task\n- [ ] 待办任务一\n- [x] 已完成任务\n:::\n") },
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
