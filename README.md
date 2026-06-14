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

Outputs to `dist/`. CSS is inlined into the HTML, JS is minified, and fonts are subsetted to only the characters used on the page. Deploy the contents of `dist/` to any static host.

## Project Structure

```
src/
  index.html           # HTML entry point
  favicon.svg          # Site favicon
  images/              # Static images
  fonts/               # Source woff2 font files (subsetted at build time)
  styles/
    styles.scss        # Entry point (imports only)
    _theme.scss        # CSS custom properties and dark mode
    _normalize.scss    # CSS reset and base styles
    _breakpoints.scss  # Responsive design mixins
    _header.scss       # Header and nav styles
    _layout.scss       # Main, section, and footer layout
    _content.scss      # Typography, asides, figures, and sections
    _utilities.scss    # Accessibility and utility classes
  ts/
    main.ts            # TypeScript entry point
    theme.ts           # Dark/light mode logic
    nav.ts             # Active nav highlighting
dist/                  # Production output (git-ignored)
dev.ts                 # Dev server
build.ts               # Build script
```
