# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install           # install dependencies
bun run dev           # dev server at localhost:3000 (override with PORT=XXXX bun run dev)
bun run build         # production build → dist/
bun run preview       # production build + serve dist/ locally at :3000 (override with PORT=XXXX bun run preview)
bun run typecheck     # type check (tsc --noEmit)
bun run format        # format all files with prettier
bun run format:check  # check formatting without writing
bun run test          # run tests with Bun
bun run ci            # typecheck + format:check + test + build
bun run clean         # remove src/_dist and dist/
bun run clean:dev     # remove src/_dist (compiled dev output)
bun run clean:build   # remove dist/ (production output)
```

When running `dev` or `preview` yourself, use non-default ports to avoid conflicting with the user's running instances:

```bash
PORT=3001 bun run dev      # use when you need to run the dev server
PORT=3002 bun run preview  # use when you need to run the preview server
```

## Architecture

Single-page static site. Source lives in `src/`, scripts are at the project root.

- `dev.ts` — Bun HTTP server that serves `src/` directly. On startup and on file changes via `fs.watch`, compiles `src/ts/main.ts` → `src/_dist/main.js` and `src/styles/styles.scss` → `src/_dist/styles.css`. Rewrites `/ts/main.ts` → `/_dist/main.js` and `/styles.css` → `/_dist/styles.css` at request time.
- `build.ts` — Orchestrates the production build in three phases: (1) JS bundle, CSS compile, static asset copy, and image processing in parallel; (2) HTML minification with CSS inlined; (3) font subsetting. Injects the current git commit SHA via `Bun.build`'s `define` option (logged to the console at runtime).
- `build-images.ts` — Image processing module used by `build.ts`. Resizes `luna_napping` to 400w and 800w WebP and `avatar` to 300w WebP via `sharp`; generates a 1200×627 `og.png` for social sharing (SVG base + circular avatar composite).
- `src/ts/main.ts` is the JS/TS entry point. Add additional TS modules as imports from there.
- `src/ts/init.ts` — DOM initialization helpers: sets years of experience, current year, and contact link (assembled at runtime to avoid scraping).
- `src/ts/theme.ts` — dark/light mode logic and theme toggle.
- `src/ts/nav.ts` — active nav highlighting via IntersectionObserver.
- `src/ts/__tests__/` — Bun test files; uses `happy-dom` via preload in `bunfig.toml` for DOM testing.
- `src/styles/styles.scss` is the SCSS entry point (imports only). In dev, the compiled CSS is served as `styles.css`; in production it is inlined into the HTML.
- `src/fonts/` — source woff2 font files. In production, subsetted copies are written to `dist/fonts/`.
- `src/styles/_theme.scss` — CSS custom properties for colors and typography; dark mode via `@mixin dark-theme`.
- `src/styles/_normalize.scss` — CSS reset and base styles (box-sizing, typography, reduced-motion, smooth scroll). Imported by `styles.scss`.
- `src/styles/_breakpoints.scss` — SCSS partial with `$breakpoints` map and `from()`, `until()`, `between()` mixins for responsive design. Import with `@use 'breakpoints' as *`.
- `src/styles/_fonts.scss` — `@font-face` declarations for self-hosted DM Sans and Nunito woff2 fonts.
- `src/styles/_header.scss` — sticky header, nav, and theme toggle styles.
- `src/styles/_layout.scss` — main container, section spacing, and footer layout.
- `src/styles/_intro.scss` — intro/hero section styles.
- `src/styles/_professional.scss` — professional section styles (skills, experience).
- `src/styles/_personal.scss` — personal section styles (figures, images).
- `src/styles/_content.scss` — shared typography, aside cards, and cross-section content styles.
- `src/styles/_utilities.scss` — accessibility and utility classes (skip link, visually-hidden, focus-visible).
- `src/llms.txt` — machine-readable markdown profile for LLM/agent consumption; referenced via `<link rel="llms">` in the HTML head; copied to `dist/` at build time.
- `src/sitemap.xml` — XML sitemap for search engine indexing; referenced in `robots.txt`; copied to `dist/` at build time.
- `src/404.html` — Cloudflare Pages custom 404 page; redirects any unmatched path back to `/` via `<meta http-equiv="refresh">`; copied to `dist/` at build time.
- No framework, no bundler config file — all build logic is inline in `dev.ts` and `build.ts`.

## Code Style

- Prefer full names over abbreviations in variable and parameter names (e.g. `button` not `btn`, `element` not `el`, `attribute` not `attr`).
- Prefer files under 100 lines; split into smaller files when approaching that limit. HTML files are exempt.
- Use absolute paths (leading `/`) for all asset references in HTML (`src`, `srcset`, `href`).
