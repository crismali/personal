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

Starts a dev server at `http://localhost:3000`. TypeScript and SCSS files are rebuilt automatically on change. Override the port with `PORT=3001 bun run dev`.

## Testing

```bash
bun run test
```

## Cleaning Build Artifacts

```bash
bun run clean        # remove src/_dist and dist/
bun run clean:dev    # remove src/_dist only
bun run clean:build  # remove dist/ only
```

## CI Check

```bash
bun run ci
```

Runs type checking, format check, tests, and production build in sequence.

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

Outputs to `dist/`. CSS is inlined into the HTML, JS is minified, fonts are subsetted to only the characters used on the page, images are resized to responsive WebP sizes, and the current git commit SHA is embedded in the JS bundle (visible in the browser console). Deploy the contents of `dist/` to any static host.

```bash
bun run preview          # build + serve dist/ locally at :3000
PORT=3002 bun run preview  # override port
```

## Deployment

Deployed on [Cloudflare Pages](https://pages.cloudflare.com). Only the `production` and `staging` branches deploy; all other branches are disabled.

**Build settings:**

- Build command: `bun install && bun run build`
- Output directory: `dist`
- Environment variable: `BUN_VERSION=1.3.14`

**Subdomains:**

- `michaelcrismali.com` — production, mapped to `production` branch, open to all
- `michaelcrismali.pages.dev` — Cloudflare Pages default URL, publicly accessible, mirrors production branch
- `staging.michaelcrismali.com` — staging, mapped to `staging` branch, behind Cloudflare Access

**Staging access control:**
`staging.michaelcrismali.com` is protected by Cloudflare Access (Zero Trust → Access → Applications). Add or remove allowed emails there. Visitors authenticate via email OTP — no passwords required.

## Project Structure

```
src/
  index.html           # HTML entry point
  robots.txt           # Crawl directives (copied to dist/ at build time)
  favicon.svg          # Site favicon
  images/              # Static images (avatar.webp, luna_napping source + resized variants)
  fonts/               # Source woff2 font files (subsetted at build time)
  styles/
    styles.scss        # Entry point (imports only)
    _theme.scss        # CSS custom properties and dark mode
    _normalize.scss    # CSS reset and base styles
    _breakpoints.scss  # Responsive design mixins
    _fonts.scss        # @font-face declarations for self-hosted fonts
    _header.scss       # Header and nav styles
    _layout.scss       # Main, section, and footer layout
    _intro.scss        # Intro/hero section styles
    _professional.scss # Professional section styles
    _personal.scss     # Personal section styles
    _content.scss      # Shared typography, asides, and cross-section styles
    _utilities.scss    # Accessibility and utility classes
  ts/
    main.ts            # TypeScript entry point
    init.ts            # DOM initialization helpers (years experience, year, contact link)
    theme.ts           # Dark/light mode logic
    nav.ts             # Active nav highlighting
    __tests__/         # Bun test files
dist/                  # Production output (git-ignored)
dev.ts                 # Dev server
build.ts               # Build script
```
