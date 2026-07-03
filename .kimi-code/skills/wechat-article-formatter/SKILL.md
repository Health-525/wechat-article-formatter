# WeChat Article Formatter Skill

This skill describes how to work with the **墨排 (Mopai)** project — a Markdown to WeChat article formatter built with React, TypeScript, and Vite.

## Project Overview

- **Live site**: https://health-525.github.io/wechat-article-formatter/
- **Repo**: https://github.com/Health-525/wechat-article-formatter
- **Purpose**: Convert Markdown into inline-styled HTML that can be pasted directly into the WeChat MP editor.
- **Branches**:
  - `source`: React + TypeScript source code.
  - `main`: GitHub Pages deployment branch, contains only built artifacts.

## Quick Commands

All development happens on the `source` branch.

```bash
git checkout source
npm install
npm run dev      # start local dev server at http://localhost:3000
npm run build    # production build into dist/
npm run lint     # eslint check
```

## Architecture

```
src/
  App.tsx                    # root layout (Navigation + EditorWorkspace)
  main.tsx                   # React entry
  index.css                  # global styles + editor responsive styles
  config.ts                  # site config, navigation, unused gallery sections
  components/
    Navigation.tsx           # top nav bar
    EditorWorkspace.tsx      # main editor (markdown input, preview, toolbar)
    FullScreenMenu.tsx       # fullscreen navigation menu
  utils/
    markdownParser.ts        # marked config + inline style injection + clipboard
    themes.ts                # 12 WeChat article themes
  sections/                  # legacy 3D gallery sections (unused by App.tsx)
  hooks/
    useLenis.ts              # smooth scroll hook (legacy)
public/
  images/                    # demo and gallery images
  videos/                    # placeholder video directory
```

## Key Conventions

### WeChat Compatibility

- **Never use `<div>`** as a content container in the rendered HTML. WeChat filters `<div>` completely. Use `<section>` instead.
- **All styles must be inline** (`style="..."`). `<style>` tags are stripped by WeChat.
- Copy to clipboard uses `text/html` MIME type so formatted content survives the paste.
- Image paths should be **relative** (`images/...`) so they work when deployed under a GitHub Pages subpath.

### Adding or Modifying Themes

1. Open `src/utils/themes.ts`.
2. Add or edit a `Theme` object. Each theme needs an `id`, `name`, `previewBg`, `category`, and a complete `styles` object.
3. Add the theme to the `themes` array and to the appropriate `themeCategories` group.
4. Keep styles as inline CSS strings. Test in the preview panel and by pasting into WeChat.

### Modifying Markdown Parsing

- `src/utils/markdownParser.ts` is the single source of truth.
- `renderMarkdownToHtml(markdown, themeId)` parses Markdown and applies inline styles via DOM parsing.
- `wrapArticle(html, title, subtitle, themeId)` prepends the article title/subtitle.
- `copyToClipboard(html)` writes rich text to the clipboard for WeChat.
- `demoMarkdown` provides the default sample content shown on first load.

### Editor UI Changes

- `src/components/EditorWorkspace.tsx` contains the editor layout, toolbar, file/image handlers, theme selector, modals, and keyboard shortcuts.
- Prefer adding reusable small components at the top of the file or in new files under `src/components/`.
- Run `npm run lint` after UI changes; the project uses strict React hooks rules.

## Deployment Workflow

The `main` branch is the GitHub Pages deployment branch and must only contain built artifacts.

```bash
git checkout source
npm install
npm run build

git checkout main
# Replace root contents with dist/ contents (keep README.md/robots.txt/sitemap.xml if desired)
cp -r dist/* .
git add -A
git commit -m "deploy: update site"
git push origin main
```

GitHub Pages source is configured to `main` branch root.

## Common Gotchas

1. **Dependencies**: If `npm install` fails with "Exit handler never called!", check `package-lock.json` for broken registry mirrors. Replace any `npm.mirrors.msh.team` entries with `registry.npmjs.org`.
2. **Image paths**: Absolute paths like `/images/...` break under GitHub Pages subpaths. Use relative paths like `images/...`.
3. **Branch state**: After switching to `main`, `node_modules` is removed because it is untracked. Reinstall when returning to `source`.
4. **Lint errors**: Avoid defining components inside render, avoid accessing refs during render, and avoid accessing callbacks before their declaration.

## Testing Checklist

Before declaring a change complete:

- [ ] `npm run lint` passes with no errors.
- [ ] `npm run build` completes successfully.
- [ ] Local dev server (`npm run dev`) shows the editor and preview correctly.
- [ ] Demo image loads in the preview panel.
- [ ] Copy to clipboard works and pasted HTML retains styles.
- [ ] Theme switching updates the preview.
- [ ] Toolbar buttons insert correct Markdown syntax.
- [ ] Auto-save restores content after page refresh.
- [ ] Exported `.html` file contains inline styles.
- [ ] Deployed site at GitHub Pages loads and images are visible.

## Useful URLs

- Local dev: http://localhost:3000/
- Production: https://health-525.github.io/wechat-article-formatter/
- Source branch: `source`
- Deploy branch: `main`
