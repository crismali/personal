# Personal Site

Static website built with Bun. Styles are written in SCSS and compiled via [sass](https://sass-lang.com).

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

Starts a dev server at `http://localhost:3000`. TypeScript and SCSS files are rebuilt automatically on change.

## CI Check

```bash
bun run ci
```

Runs type checking, format check, and production build in sequence.

## Formatting

```bash
bun run format        # format all files
bun run format:check  # check formatting without writing
```

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
  styles.scss        # Global styles + normalize
  _breakpoints.scss  # Responsive design mixins
  main.ts            # TypeScript entry point
dist/          # Production output (git-ignored)
dev.ts         # Dev server
build.ts       # Build script
```
