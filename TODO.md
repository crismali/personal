# TODO

- [x] Check Google Search Console security review status (requested 2026-06-21, cleared 2026-07-31 — no security issues reported)
- [x] Add CSP + security headers via Cloudflare Pages `_headers` file

## Lighthouse Best Practices

- [x] Improve CSP (eliminate `unsafe-inline` on `script-src` — requires solving inline theme script hash + minification)
- [x] Improve CSP (eliminate `unsafe-inline` on `style-src` — inlined CSS in `<style>` block needs hash, recomputed per build)
- [x] Set up HSTS policy
- [x] Ensure proper isolation with COOP
- [x] Mitigate DOM-based attacks with Trusted Types

## Accessibility

- [x] Darken `--color-accent` in light mode (now `#8a5219` — 5.95:1 on `--color-bg`, 5.41:1 on `--color-surface`, up from 4.52:1 / 4.11:1)
- [x] Drop the redundant `<figcaption>` on the avatar image in `src/index.html` (duplicates the `alt` text exactly, can cause double-announce in screen readers)
- [x] Handle JS blocked/failing after load (e.g. CSP block, network error) rather than only no-JS — `#contact-link`'s `<li>` now ships `hidden` with a visible `#contact-fallback`, and `setContactLink()` swaps them; both `<noscript>` blocks removed
