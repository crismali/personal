# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install        # install dependencies
bun run dev        # dev server at localhost:3000
bun run build      # production build → dist/
bun run typecheck  # type check (tsc --noEmit)
```

## Architecture

Single-page static site. Source lives in `src/`, scripts are at the project root.

- `dev.ts` — Bun HTTP server that serves `src/` directly. Compiles `main.ts` to `src/_dist/main.js` on startup and re-compiles on file changes via `fs.watch`. Rewrites `/main.ts` requests to `/_dist/main.js`.
- `build.ts` — Bundles and minifies `main.ts` via `Bun.build`, copies all non-TS static assets to `dist/`, rewrites the `<script src>` in `index.html` from `main.ts` → `main.js`.
- `src/main.ts` is the sole JS/TS entry point. Add additional TS modules as imports from there.
- No framework, no bundler config file — all build logic is inline in `dev.ts` and `build.ts`.
