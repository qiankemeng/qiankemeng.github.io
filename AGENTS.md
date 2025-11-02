# Repository Guidelines

## Project Structure & Module Organization
Runtime routes live in `src/app/` using the App Router: `page.tsx` for zh-CN, `en/page.tsx` for English. Shared UI sits in `src/components/`, page blocks in `src/sections/`, and copy/data in `src/content/` with locale-specific JSON. Long-form config lives in `src/config/`, helper logic under `src/lib/`, hooks in `src/hooks/`, and deployment helpers inside `scripts/`. Static assets are stored in `public/`.

## Build, Test, and Development Commands
Install dependencies via `npm install`. Start local development using `npm run dev`; the site serves at `http://localhost:3000` with hot reload. Run `npm run lint` before commits to apply ESLint + Next.js checks. Build the static export used by GitHub Pages with `npm run build`—the output ships to `out/` because `output: 'export'` is set in `next.config.js`.

## Coding Style & Naming Conventions
Use TypeScript everywhere (files end in `.ts` or `.tsx`). Component files are PascalCase, hooks use `use*`, and locale data files use `*.zh.json` / `*.en.json`. Keep indentation at two spaces, favor named exports, and avoid default exports except for route components. Rely on ESLint and Prettier (configured via project defaults) instead of manual formatting.

## Testing Guidelines
Automated testing is not yet wired; prefer adding Jest + Testing Library colocated under `tests/` mirroring `src/`. Name spec files `*.spec.ts(x)` and ensure critical flows (locale switch, theme toggle, navigation anchors) gain coverage above 80% once tests exist.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `docs:`, etc.) with succinct, present-tense summaries. Reference GitHub issue IDs in footers when relevant. PRs should outline context, screenshots/GIFs for visual updates, and checklists confirming lint/build/export. Request at least one reviewer before merging.

## Environment & Security Tips
Never commit `.env.local`; add new variables to `.env.example`. GitHub Pages deployment consumes the static `out/` folder—clear secrets before exporting. Monitor dependabot alerts weekly and upgrade high-severity packages promptly.
