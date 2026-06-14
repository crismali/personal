# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install        # install dependencies
bun run dev        # dev server at localhost:3000
bun run build      # production build → dist/
bun run typecheck     # type check (tsc --noEmit)
bun run format        # format all files with prettier
bun run format:check  # check formatting without writing
bun run ci            # typecheck + format:check + build
```

## Architecture

Single-page static site. Source lives in `src/`, scripts are at the project root.

- `dev.ts` — Bun HTTP server that serves `src/` directly. On startup and on file changes via `fs.watch`, compiles `src/ts/main.ts` → `src/_dist/main.js` and `src/styles/styles.scss` → `src/_dist/styles.css`. Rewrites `/ts/main.ts` → `/_dist/main.js` and `/styles.css` → `/_dist/styles.css` at request time.
- `build.ts` — Bundles and minifies `src/ts/main.ts` via `Bun.build` (target: browser), compiles `src/styles/styles.scss` via `sass` (compressed), minifies HTML via `html-minifier-terser`, inlines CSS into the HTML, subsets fonts via `subset-font` to only characters used in the output, copies non-TS/non-SCSS/non-font static assets to `dist/`.
- `src/ts/main.ts` is the sole JS/TS entry point. Add additional TS modules as imports from there.
- `src/styles/styles.scss` is the SCSS entry point (imports only). In dev, the compiled CSS is served as `styles.css`; in production it is inlined into the HTML.
- `src/fonts/` — source woff2 font files. In production, subsetted copies are written to `dist/fonts/`.
- `src/styles/_breakpoints.scss` — SCSS partial with `$breakpoints` map and `from()`, `until()`, `between()` mixins for responsive design. Import with `@use 'breakpoints' as *`.
- `src/styles/_normalize.scss` — CSS reset and base styles (box-sizing, typography, reduced-motion, smooth scroll). Imported by `styles.scss`.
- No framework, no bundler config file — all build logic is inline in `dev.ts` and `build.ts`.

## Code Style

- Prefer full names over abbreviations in variable and parameter names (e.g. `button` not `btn`, `element` not `el`, `attribute` not `attr`).
- Prefer files under 100 lines; split into smaller files when approaching that limit. HTML files are exempt.
