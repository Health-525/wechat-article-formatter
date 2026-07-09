interface HelpModalProps {
  onClose: () => void
}

// "Welcome / how to use" dialog. Closes on backdrop click or Escape.
export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
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
          onClick={onClose}
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
  )
}
