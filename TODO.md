# TODO

- [ ] Check Google Search Console security review status (requested 2026-06-21)
- [x] Add CSP + security headers via Cloudflare Pages `_headers` file

## Lighthouse Best Practices

- [x] Improve CSP (eliminate `unsafe-inline` on `script-src` — requires solving inline theme script hash + minification)
- [x] Improve CSP (eliminate `unsafe-inline` on `style-src` — inlined CSS in `<style>` block needs hash, recomputed per build)
- [x] Set up HSTS policy
- [x] Ensure proper isolation with COOP
- [x] Mitigate DOM-based attacks with Trusted Types

## Accessibility

- [x] Darken `--color-accent` in light mode (now `#8a5219` — 5.95:1 on `--color-bg`, 5.41:1 on `--color-surface`, up from 4.52:1 / 4.11:1)
- [ ] Drop the redundant `<figcaption>` on the avatar image in `src/index.html` (duplicates the `alt` text exactly, can cause double-announce in screen readers)
- [ ] Add a `<noscript>` fallback message near `#contact-link` for the case where JS is blocked/fails after load (e.g. CSP block, network error) rather than only no-JS
