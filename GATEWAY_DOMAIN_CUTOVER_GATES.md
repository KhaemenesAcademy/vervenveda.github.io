# VNV Gateway: dependency and domain migration acceptance gates

Status: REVIEW / DOMAIN CUTOVER HOLD. This document is not an authorization.

## Intent

- GitHub master: `vervenveda/vervenveda.github.io` stays authoritative for the entire `index.html`.
- Proposed public Gateway: `KhaemenesAcademy/vervenveda.github.io` receives `index.html` only.
- Gateway-specific support files stay owned by the Gateway; do not bulk-mirror master folders.
- STOS full-source acceptance is a different sovereign process; not activated by this checklist.

## Source-backed current risks

At the verified common index blob `a883f035329a89e55d526160c54ffdac3c7af2f9`, the Gateway requires but does not contain:

1. `site.webmanifest`
2. `icon-192.png`
3. `apple-touch-icon.png`
4. `privacy-policy.html`
5. `assets/khaemenes-interlingual-core.js`
6. `assets/vnv-language.js`
7. `assets/vnv-ticker-autopopulate.js`
8. `assets/vnv-gateway-chrome-forensic-probe.js`
9. `ecosystem/master-ecosystem-directory.json`
10. `registry/ecosystem-pages-a.json`
11. `registry/ecosystem-pages-b.json`

The two declared local CSS assets and staged campus phrase file exist.

These are verified **source-tree differences**, not a claim that browser network requests currently fail. Query strings do not create separate source files.

## Authority and routing concerns

The index contains absolute destinations under `vervenveda.com/<project>.github.io/...`; these currently depend on how the existing domain serves other repositories. Hosting the domain on a different GitHub account does not automatically preserve their project-site paths. Test each exact Academy student, family, and enrollment route, plus the 333 Network, search, Archives, civic, news, and mentor entrances before cutover.

The canonical master JSON and page shard paths are same-origin absolute paths. If they remain in the original repository, using an alternative host/path requires an explicit, tested, read-only source bridge. Do not assume browser CORS or cross-account domain routing will work.

## Release acceptance gates (all required)

- **G1 — Exact homepage:** Master and gateway full-index Git blob match the approved source revision; gateway unique files unchanged.
- **G2 — Direct resources:** Every required local resource exists at the actual published URL, or an approved explicit mapping is verified by HTTP and browser fetch.
- **G3 — Directory:** Canonical JSON and both generated shards load; generation and expected page counts agree; source policy filters remain in force.
- **G4 — Interactivity:** Two tickers, header, hamburger, toolbar, translator, search, and fallback work on desktop and mobile without duplicates or console errors.
- **G5 — Cross-account routes:** Existing `vervenveda.com/<project>.github.io/` destinations continue to work or have tested redirects with stable HTTPS.
- **G6 — Security and recovery:** No student/account data exposed in static hosting; original live site and DNS rollback plan retained; owner grants explicit release approval.

The source-only script `scripts/vnv-gateway-cutover-audit.py` intentionally returns `cutoverReady=false` even if all static dependencies are accounted for. Only independent browser, HTTP, DNS and owner approval can clear cutover.

## Provenance and non-authority

The read-only pull request workflow records observed repository paths and risk counts. It does not modify files, activate STOS, issue runtime authority, merge branches, or move DNS. Historical migration-wave checks remain pinned to their original baseline and are not rewritten.
