# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (Chinese/English) personal homepage built with Next.js, showcasing multimodal AI research, projects, and experience. The site is statically exported and deployed to GitHub Pages.

## Commands

### Development
```bash
npm run dev           # Start development server
npm run build         # Build static site (outputs to ./out)
npm run start         # Start production server
npm run lint          # Run ESLInt
npm run export        # Build static export (alias for build)
npm run create-post   # Create new blog post interactively
npm run import-paper  # Import paper from arXiv
npm run agent         # Run AI paper curation agent (requires OPENAI_API_KEY)
npm run agent:test    # Test arXiv fetcher
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

### Blog System
Blog posts are written in MDX (Markdown with JSX support) and organized by category in `src/content/blog/posts/`:

**Directory Structure**:
```
src/content/blog/posts/
├── papers/        # Research papers
├── notes/         # Learning notes
└── tutorials/     # Technical tutorials
```

**File Naming**: `{slug}.{locale}.md` (e.g., `videoarm-cvpr.zh.md`)

**Frontmatter Format** (with Zod validation):
```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
summary: "Brief description"
tags: ["tag1", "tag2"]
category: "papers"  # Auto-detected from directory

# Paper-specific fields (optional)
venue: "CVPR 2025"
status: "published"
authors:
  - name: "Author Name"
    affiliation: "Institution"
arxiv: "https://arxiv.org/abs/..."
pdf: "/papers/paper.pdf"
github: "https://github.com/..."
---
```

**Helper Functions in `src/lib/blog.ts`**:
- `getAllPosts(locale)`: Get all posts with metadata
- `getPostsByCategory(category, locale)`: Get posts by category
- `getFilteredPosts(locale, options)`: Get filtered and paginated posts
- `getPostBySlug(slug, locale)`: Get full post content
- `getAllPostSlugs()`: Get all unique slugs for static generation
- `getAllTags(locale)`: Get all unique tags
- `getAllYears(locale)`: Get all publication years
- `getAllVenues(locale)`: Get all conferences/journals
- `getRecentPosts(locale, limit)`: Get latest N posts
- `getRelatedPosts(slug, locale, limit)`: Get related posts by tags

MDX processing pipeline:
- **remark-gfm**: GitHub Flavored Markdown support (tables, task lists, etc.)
- **rehype-highlight**: Syntax highlighting using highlight.js (github-dark theme)
- **rehype-slug**: Auto-generate IDs for headings
- **rehype-autolink-headings**: Add anchor links to headings

Comments powered by Giscus (GitHub Discussions integration) via `@giscus/react`.

### Path Aliases
TypeScript path aliases configured in `tsconfig.json`:
- `@/components/*` → `src/components/*`
- `@/sections/*` → `src/sections/*`
- `@/content/*` → `src/content/*`
- `@/hooks/*` → `src/hooks/*`
- `@/lib/*` → `src/lib/*`
- `@/types/*` → `src/types/*`
- `@/config/*` → `src/config/*`

### Static Export Configuration
The site uses `output: 'export'` in `next.config.js` to generate a static site in the `./out` directory. Images are set to `unoptimized: true` for static hosting compatibility.

### Styling
- Tailwind CSS with custom brand colors in `tailwind.config.ts` (brand blue: `#2563eb`)
- Dark mode support via `next-themes` (class-based)
- CSS custom properties for theme colors in `src/app/globals.css`
- Typography plugin (`@tailwindcss/typography`) for rich text content with `prose` classes

### Public Assets
Static assets in `public/` directory:
- `public/images/avatars/` - Profile pictures
- `public/images/qrcodes/` - WeChat and email QR codes
- `public/papers/` - Research papers and thesis PDFs
- `public/resume.pdf` - Resume/CV file

### CI/CD
GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
- Builds static site on push to `main` branch
- Uses Node.js 20
- Outputs to `./out` directory
- Deploys to GitHub Pages with appropriate permissions

## Coding Conventions

### File Naming
- Component files: PascalCase (e.g., `SiteHeader.tsx`)
- Hooks: `use*` prefix (e.g., `useTheme.ts`)
- Locale data files: `*.zh.json` / `*.en.json`
- Route components: `page.tsx` (default exports allowed)
- Utility files: kebab-case (e.g., `file-meta.ts`)

### TypeScript
- Use TypeScript everywhere (`.ts` or `.tsx`)
- Prefer named exports over default exports (except for route components)
- 2-space indentation
- Strict mode enabled in `tsconfig.json`

### Commits
- Follow Conventional Commits format: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Use present-tense, succinct summaries
- Reference issue IDs in commit footers when applicable
