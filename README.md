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

## Maintenance Notes

- The `meta[name="description"]` and `og:description` tags in `src/index.html` hardcode the years of experience — update them manually each year.
- The `<lastmod>` date in `src/sitemap.xml` should be updated manually whenever the content changes.

## Production Build

```bash
bun run build
```

Outputs to `dist/`. CSS is inlined into the HTML, JS is minified, fonts are subsetted to only the characters used on the page, images are resized to responsive WebP sizes, a 1200×627 OG image (`og.png`) is generated for social sharing, and the current git commit SHA is embedded in the JS bundle (visible in the browser console). The inline `<script>` and `<style>` blocks are hashed (SHA-256) and the hashes are written into `dist/_headers`, so the deployed CSP can avoid `'unsafe-inline'` on `script-src`/`style-src`. Source maps (`main.js.map`, `styles.css.map`) are written to `dist/` for production debugging. Deploy the contents of `dist/` to any static host.

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
__tests__/             # Bun test files for the root build scripts
build-csp.ts           # CSP hashing (inline script/style hashes injected into dist/_headers)
build-images.ts        # Image processing (resize variants + OG image generation)
build.ts               # Build script (orchestrator)
dev.ts                 # Dev server
dist/                  # Production output (git-ignored)
src/
  404.html             # Custom 404 page — redirects unmatched paths to / (copied to dist/ at build time)
  _headers             # Cloudflare Pages HTTP response headers: CSP, X-Frame-Options, etc. (copied to dist/ at build time)
  favicon.svg          # Site favicon
  fonts/               # Source woff2 font files (subsetted at build time)
  images/              # Static images (avatar.webp, luna_napping source + resized variants)
  index.html           # HTML entry point
  humans.txt           # humans.txt attribution file (copied to dist/ at build time)
  llms.txt             # Machine-readable profile for LLM/agent consumption (copied to dist/ at build time)
  robots.txt           # Crawl directives (copied to dist/ at build time)
  sitemap.xml          # XML sitemap for search engine indexing (copied to dist/ at build time)
  styles/
    _breakpoints.scss  # Responsive design mixins
    _content.scss      # Shared typography, asides, and cross-section styles
    _fonts.scss        # @font-face declarations for self-hosted fonts
    _header.scss       # Header and nav styles
    _intro.scss        # Intro/hero section styles
    _layout.scss       # Main, section, and footer layout
    _normalize.scss    # CSS reset and base styles
    _personal.scss     # Personal section styles
    _professional.scss # Professional section styles
    _theme.scss        # CSS custom properties and dark mode
    _utilities.scss    # Accessibility and utility classes
    styles.scss        # Entry point (imports only)
  ts/
    __tests__/         # Bun test files
    init.ts            # DOM initialization helpers (years experience, year, contact link)
    main.ts            # TypeScript entry point
    nav.ts             # Active nav highlighting
    theme.ts           # Dark/light mode logic
```
