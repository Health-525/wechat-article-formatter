# 贡献指南

感谢你对 **墨排（Mopai）** 的兴趣！我们欢迎 Issue、Pull Request 和各种建议。

## 分支说明

- `source`：开发分支，所有代码变更请提交到这里。
- `main`：部署分支，内容由 GitHub Actions 自动从 `source` 构建并推送，**请勿直接修改**。

## 开发流程

1. Fork 本仓库并克隆到本地。
2. 切换到 `source` 分支：
   ```bash
   git checkout source
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```
5. 修改代码，确保通过 lint 和测试：
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
6. 提交 PR 到 `source` 分支。

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)：

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整（不影响逻辑）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：

```bash
git commit -m "feat: add dark mode toggle"
```

## 代码风格

- TypeScript 严格模式已开启，请保持类型安全。
- 组件使用函数式组件 + Hooks。
- 样式优先使用 Tailwind CSS，少量自定义样式请写入 `src/index.css`。
- 所有用户可见文本使用中文。

## 报告问题

如果发现 bug，请尽量提供：

- 复现步骤
- 浏览器版本
- 截图或录屏
- 控制台报错信息

## 许可证

通过提交代码，你同意你的贡献将在 [MIT 许可证](./LICENSE) 下发布。
