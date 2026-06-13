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

- `dev.ts` — Bun HTTP server that serves `src/` directly. On startup and on file changes via `fs.watch`, compiles `main.ts` → `src/_dist/main.js` and `styles.scss` → `src/_dist/styles.css`. Rewrites `/main.ts` → `/_dist/main.js` and `/styles.css` → `/_dist/styles.css` at request time.
- `build.ts` — Bundles and minifies `main.ts` via `Bun.build` (target: browser), compiles `styles.scss` via `sass` (compressed), copies non-TS/non-SCSS static assets to `dist/`, rewrites `<script src>` in `index.html` from `main.ts` → `main.js`.
- `src/main.ts` is the sole JS/TS entry point. Add additional TS modules as imports from there.
- `src/styles.scss` is the SCSS entry point. Import partials from here. The HTML references `styles.css`; both scripts compile and serve/output it.
- `src/_breakpoints.scss` — SCSS partial with `$breakpoints` map and `from()`, `until()`, `between()` mixins for responsive design. Import with `@use 'breakpoints' as *`.
- No framework, no bundler config file — all build logic is inline in `dev.ts` and `build.ts`.
