# Personal Site

Static website built with Bun.

## Requirements

- [Bun](https://bun.sh) v1.0+

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

Starts a dev server at `http://localhost:3000`. TypeScript files are rebuilt automatically on change.

## Type Checking

```bash
bun run typecheck
```

## Production Build

```bash
bun run build
```

Outputs minified HTML, CSS, and JS to `dist/`. Deploy the contents of `dist/` to any static host.

## Project Structure

```
src/
  index.html   # HTML entry point
  styles.css   # Global styles
  main.ts      # TypeScript entry point
dist/          # Production output (git-ignored)
dev.ts         # Dev server
build.ts       # Build script
```
