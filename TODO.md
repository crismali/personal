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

- [ ] Darken `--color-accent` in light mode (`#a46220` on `#f9f7f4` is ~4.52:1, right at the AA floor for body links + active nav text — needs real headroom)
- [ ] Drop the redundant `<figcaption>` on the avatar image in `src/index.html` (duplicates the `alt` text exactly, can cause double-announce in screen readers)
- [ ] Add a `<noscript>` fallback message near `#contact-link` for the case where JS is blocked/fails after load (e.g. CSP block, network error) rather than only no-JS
