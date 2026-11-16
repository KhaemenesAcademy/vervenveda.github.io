# 2026-11-16 · Verve N Veda Front Door — Canonical Gateway Synchronization

- **Repository:** `KhaemenesAcademy/vervenveda.github.io`
- **Source:** `vervenveda/vervenveda.github.io`, canonical `index.html` blob `2a168b2aa4c0e476d0beb1c1bc0feead82a936b7`
- **Date/timezone:** November 16, 2026 · America/New_York
- **Kinds:** forensic audit · synchronization · button repair · dependency verification · future domain migration HOLD
- **State:** GitHub source commits verified; public deployment and actual browser testing not confirmed

## Decision and scope

The KhaemenesAcademy repository is the new public **front-door mirror** of the canonical Verve N Veda gateway. It is a GitHub Pages project site until a later, explicitly approved custom-domain cutover. **Do not add or change `CNAME`, DNS, or `vervenveda.com` ownership during this session.** The canonical main gateway is kept intact.

The front-door `index.html` mirrors the exact source contents apart from 13 confirmed GitHub Pages project-path adaptations (relative scripts, CSS, manifest, privacy link, directory fetch, catalog shard fetch, home menu and local admin route). Exact in-memory source-to-target comparison was **PASS** after applying only these adaptations.

## Repaired public controls inherited from main gateway

- The hamburger click handler opens normal menu folders instead of receiving a PointerEvent object as search text.
- The four Hall Browse buttons navigate to appropriate drawer branches, rather than searching mismatched category text.
- Civic header link opens the published One Nation for All civic hall rather than nonexistent `#campaign`.
- Readable navigation controls receive a minimum 16px typography rule.
- Previous public buttons must not lead directly to `github.com/owner/repository`, source, tree, blob or editor URLs. **Published `*.github.io` websites are permitted** as web app destinations.

## Mirrored support assets and dependencies

- JavaScript: `assets/khaemenes-interlingual-core.js`, `assets/vnv-language.js`, `assets/vnv-ticker-autopopulate.js`, `assets/vnv-gateway-chrome-forensic-probe.js`, `assets/vnv-beta-link.js`
- CSS: `assets/vnv-ecosystem-menu.css`; existing `assets/vervenveda-global-standard.css` and `assets/vnv-global-standard.css` already matched the canonical source
- Existing `assets/khaemenes-campus-phrases.js` already matched the source
- Navigation: `ecosystem/master-ecosystem-directory.json`, `registry/ecosystem-pages-a.json`, `registry/ecosystem-pages-b.json`
- Pages: `privacy-policy.html`, `admin/index.html` (relative resources; still a convenience route, **not** an authentication guarantee)
- PWA: `site.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`; manifest uses project-relative `start_url`, `scope`, icon paths

Previous front-door index content is preserved in Git history (pre-sync blob `a883f035329a89e55d526160c54ffdac3c7af2f9`). New mirror commit: [4f5cbcb](https://github.com/KhaemenesAcademy/vervenveda.github.io/commit/4f5cbcb7c05a32db47fb92b941ade0c732963dd1).

## Verifications

| Check | Result | Evidence |
| --- | --- | --- |
| Full HTML matches canonical source after project-path-only transformations | **PASS** | In-memory exact string comparison of fetched files, blob `b9b5c11b7a14125408ae12dfa04fd81669db7d93` |
| Inline homepage JavaScript compilation | **PASS** | Ten inline scripts compiled with V8 syntax validation during sync |
| Static hamburger and Hall routing source checks | **PASS** | Fetched front door source |
| Public master registry | **PASS** | 195 entries; no `github.com` repository destinations |
| Catalog-shard generation and counts | **PASS** | 5,561 + 5,560 = 11,121 public pages, same `generatedAt`; no direct GitHub repository URLs |
| Source and mirrored JS/CSS support files | **PASS** | GitHub commits and content checks |
| Manifest and icons physically mirrored | **PASS** | GitHub binary blob SHAs match canonical images |
| `node --test tests/front-door-synchronization.test.mjs` | **NOT RUN in this session** | Read-only CI workflow added |
| Live GitHub Pages, mobile layout, real click-through and external destinations | **HOLD** | Public fetch unavailable, real browser verification outstanding |
| Domain migration | **NOT AUTHORIZED / NOT ATTEMPTED** | No `CNAME` or DNS change |

## Change boundaries

This mirror does not grant student/admin authorization; the gateway's local admin shortcut remains a convenience only. Do not record learner data, passwords, or tokens in the workflow archive. A public destination passing URL-format/host validation is **not proof** that its target responds successfully.

## Follow-up checklist

- [ ] Check the site's published GitHub Pages URL once Pages publication is confirmed.
- [ ] Test menu, four Hall buttons, Civic, search, category toggles, ticker pause, feature preview, close and print, translator, and utility dock on desktop and tablet.
- [ ] Inspect GitHub Actions `Front Door Synchronization Audit` results.
- [ ] Confirm all advertised external `github.io` Pages destinations resolve to actual published applications.
- [ ] Plan the separate `vervenveda.com` cutover only after live/browser, canonical URL, TLS, SEO, privacy and rollback checks pass.
