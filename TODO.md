# TODO

- [ ] Check Google Search Console security review status (requested 2026-06-21)
- [x] Add CSP + security headers via Cloudflare Pages `_headers` file

## Lighthouse Best Practices
- [x] Improve CSP (eliminate `unsafe-inline` on `script-src` — requires solving inline theme script hash + minification)
- [ ] Improve CSP (eliminate `unsafe-inline` on `style-src` — inlined CSS in `<style>` block needs hash, recomputed per build)
- [x] Set up HSTS policy
- [x] Ensure proper isolation with COOP
- [x] Mitigate DOM-based attacks with Trusted Types
