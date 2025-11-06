# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (Chinese/English) personal homepage built with Next.js, showcasing multimodal AI research, projects, and experience. The site is statically exported and deployed to GitHub Pages.

## Commands

### Development
```bash
npm run dev        # Start development server
npm run build      # Build static site (outputs to ./out)
npm run start      # Start production server
npm run lint       # Run ESLint
npm run export     # Build static export (alias for build)
```

## Architecture

### Bilingual Structure
The site supports Chinese (default) and English through a dual-route architecture:
- Chinese routes: `/` (root level)
- English routes: `/en/*` (under `/en` prefix)

Each page component receives a `locale` prop (`'zh' | 'en'`) to render appropriate content.

### Directory Structure
```
src/
├── app/              # Next.js app router pages
│   ├── layout.tsx    # Root layout (Chinese)
│   ├── page.tsx      # Chinese homepage
│   ├── en/           # English routes
│   │   ├── page.tsx  # English homepage
│   │   └── ...
│   ├── blog/         # Blog routes
│   └── projects/     # Projects routes
├── sections/         # Page sections (Hero, Research, Projects, etc.)
├── components/       # Reusable UI components
├── content/          # JSON content files (*.zh.json, *.en.json)
│   ├── blog/
│   ├── experience/
│   ├── projects/
│   └── research/
├── hooks/            # Custom React hooks
├── lib/              # Utilities (cn, analytics)
└── config/           # Site configuration
```

### Content Management
All content is stored in JSON files under `src/content/` with separate files for each locale:
- Pattern: `{section}/{section}.{locale}.json`
- Example: `projects/projects.zh.json`, `projects/projects.en.json`

Sections import and render content based on the locale prop.

### Path Aliases
TypeScript path aliases configured in `tsconfig.json`:
- `@/components/*` → `src/components/*`
- `@/sections/*` → `src/sections/*`
- `@/content/*` → `src/content/*`
- `@/hooks/*` → `src/hooks/*`
- `@/lib/*` → `src/lib/*`

### Static Export Configuration
The site uses `output: 'export'` in `next.config.js` to generate a static site in the `./out` directory. Images are set to `unoptimized: true` for static hosting compatibility.

### Styling
- Tailwind CSS with custom brand colors in `tailwind.config.ts`
- Dark mode support via `next-themes` (class-based)
- CSS custom properties for theme colors in `src/app/globals.css`
- Typography plugin for rich text content

### CI/CD
GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys to GitHub Pages on push to `main` branch.
