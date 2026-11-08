# Wave 06 — Public HTTPS staging acceptance and no-cutover contract

**State: HOLD.** This file is an operator handoff specification, not a deployment authorization or evidence of a publicly reachable site.

## What is already verified

- Original public source commit: `836bdb78769f70b255e5c0bc7773b6f6de61a28d`.
- Original canonical directory: 11,024 public pages from 35 source repositories, split into two generated shards.
- Restricted preview: 11,021 pages; only three held deep-search entries excluded. The original source remains byte-for-byte intact.
- A preview-only master directory points to both immutable restricted shards under `/registry/previews/2026-11-08-restricted/`.
- Browser tests have exercised isolated localhost routing, directory search, filters, keyboard menu and missing-shard fail-closed behavior.
- The curated master navigation contains no matches for the three sensitive teacher/evidence-vault paths, so they require no curated-entry deletions.
- Separate source-owner reviews for the three held entries are pending. An unapproved source page may still exist at its old direct URL even when it is absent from this proposed searchable index.

## Independent staging deployment requirements (not yet satisfied)

1. Use a *separate staging origin* with a valid publicly trusted HTTPS certificate. Do **not** change `vervenveda.com`, its DNS, GitHub Pages production settings or the original full source repository.
2. Do not connect the staging origin to real student, teacher, parent, administrative or STOS systems. Use synthetic records and never copy browser storage or source secrets.
3. Serve the unchanged original homepage at staging root `/`, with only the restricted preview master directory mapped at `/ecosystem/master-ecosystem-directory.json` and both restricted shards at their exact immutable `/registry/previews/2026-11-08-restricted/registry/` paths. Other public-only assets must resolve safely; the server must prevent directory traversal, serve proper JSON/MIME types and not expose source control or build internals.
4. Confirm all three staged assets match the SHA-256 values in `restricted-preview-manifest.json`, including the preview master pointer. A correct artifact build alone does not certify the hosting server.
5. Require a private-release review of the three held routes and confirm no link or in-page search result resurrects them. **Do not assume a search-index exclusion revokes any old direct link.**
6. Test on desktop, small/mobile viewport and Chromium/Firefox/WebKit; test search, category filter, all 35 repository filters, keyboard menu close/focus, no-results, 503 for either shard, generation mismatch and hash-corruption handling. Existing homepage validates matching generation and count; an HTTP host may require external manifest/checksum enforcement.
7. Record WCAG 2.1 AA accessibility findings, categorize known baseline defects versus changes introduced by staging and fix any release-blocking regressions.
8. Preserve a verified previous immutable *deployed* generation and exercise an actual pointer rollback over staging HTTPS. A temporary local file swap is insufficient.
9. Release requires signed source-owner review, repository approval, tested staging URL, evidence links, and a separate go/no-go authorization. A green source or browser test does not itself grant permission to merge Waves 05/06.

## Available controls and limitations

The connected GitHub capability can create and test PR/branch files and inspect Actions runs, but does not currently expose a supported GitHub Pages administration or independent staging-host deployment operation. Accordingly, our workflow only spins up ephemeral **self-signed localhost HTTPS**, and `ignoreHTTPSErrors=true` is limited to that test. This is *not* a real public CA certificate, an internet-reachable staging deployment, or a staging roll-forward/rollback acceptance.

**Boundaries:** No main-branch merge, no live domain cutover, no remote public staging claim, no student account cloud import, no T01/T02/T03 modifications, no source repository privatization.

## Next audited milestone — Quarantined site closure (2026-11-08)

- Source-closure preflight: https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42531415963 — four direct local scripts, zero missing directly referenced original source files, **two external script tags** pointing at the original production domain.
- Pinned original source `836bdb78769f70b255e5c0bc7773b6f6de61a28d`, pinned Linguistics `ebd5e8053a9fa07c3a3ca0865501ced339621916`. The Linguistics loader uses six optional resources; all were present and hash-verified.
- Quarantined bundle artifact: https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42532300412 — **PASS**, 21 files, exact asset source checks, restricted 11,021-page catalog, and both external executable tags rewritten only in the artifact's staging homepage. An artifact-only CSP limits script/data connections to `'self'`; existing inline scripts remain allowed, so this is **not** a production CSP hardening claim.
- The assembled bundle itself passed desktop 1440×900 and mobile 390×844 Chromium over temporary local HTTPS. One native ticker, one auto-ticker, one hamburger, one toolbar, one language selector, 13 language choices, one directory; **zero external browser executable or data requests** and zero missing local asset responses.
- Explicit canonical Linguistics `ensure({full:true,upgradeLegacyCore:true})` passed. Campus phrases were available; dictionary, lexicon, transliteration, canonical core and review policy all loaded from local bundle URLs, without contacting production.
- One previously documented sandbox-only service-worker console warning appeared. This is an isolation limitation; no production service worker was registered.
- **The quarantined bundle has not been published** or tested as a publicly reachable, CA-trusted HTTPS site. Its external navigation links remain part of the original homepage and are not treated as proof of standalone ecosystem-route availability. This is a self-contained *gateway asset preview*, not all 11,021 destination applications.
- **Actual HTTPS staging hosting, CA certificate, external source-owner access approval, full bundle multi-engine UI test, actual deployed-generation rollback and explicit release signoff remain outstanding.** No main merge, no domain/DNS/STOS/student data modifications.

## Phase F — Independent staging workflow prepared (2026-11-08)

A new **read-only manual audit** now exists at `.github/workflows/vnv-wave-06-public-https-stage.yml`; its syntax is validated on every Wave 06 PR change. The workflow's manual `staging_url` input deliberately requires an entirely separate root-level, publicly resolvable `https://` staging/preview/sandbox/canary hostname. Known production and GitHub source hosts are disallowed. Its manual job **does not deploy**.

A hosting operator must first establish and explicitly authorize a separate static host (dedicated domain/origin, valid publicly trusted certificate, no site data/credentials/production binding), then upload the exact checked `vnv-wave-06-quarantined-site-NOT-PUBLISHED` artifact **to that isolated staging root only**. The artifact contains the generated manifest, `index.html`, 21 pinned gateway/translator/icon/registry assets, and the restricted 11,021-entry catalog; verify its contents against manifest hashes. Set `Cache-Control: no-store` for the active pointer and use immutable caching only for versioned shard routes. Keep old generations until rollback validation finishes.

After the host is reachable, run the manual workflow with the staged root URL; it will verify:
- valid system-verified HTTPS certificate (no `ignoreHTTPSErrors`), no redirects, complete versioned 21-file SHA-256 integrity and required MIME types;
- original source homepage's exact **staging** hash, and full restricted 11,021-entry catalog with two matching shard generations and no held teacher/evidence-vault routes;
- desktop/mobile Chromium, Firefox and WebKit chrome/translation navigation and search behavior;
- no unexpected external executable/data requests, and scoped WCAG 2.1 AA `axe-core` accessibility findings with violations recorded instead of silently suppressed.

**Deployment blocking facts:** No independent root-hosting service with matching deploy permissions is currently connected; the Academy GitHub connector can edit PRs and run checks but cannot create/configure a separate Pages host. A default *project* GitHub Pages site at a `/repository/` subpath is **not compatible** with the current bundle's absolute-root URLs without a separately audited path-rewrite and browser gate. Do not upload this archive to the current `KhaemenesAcademy/vervenveda.github.io` Pages deployment or its `main` branch; doing so could activate live functionality.

### Release and rollback authority

The remote manual audit is **non-mutating** and is only one acceptance gate. No user, teacher, administrative, student or STOS data may be copied to stage. The three sensitive source routes stay on owner-review HOLD and must not become new searchable entries. Passing remote checks does not authorize public production release: preserve and validate the previous *deployed* staging generation, run a real pointer rollback, review accessibility findings (including gold eyebrow contrast) and obtain explicit source-owner approval before any main branch merge or production cutover. Live `vervenveda.com` and STOS remain unchanged.

**GitHub Actions limitation:** The `workflow_dispatch` button is not reliably available for a workflow that exists **only on this unmerged PR branch**. It must be copied into a separately authorized staging repository's default branch (preferred), or otherwise installed by a separately approved workflow administration change; do **not** merge Wave 06 into this public gateway just to make the button appear. As an alternative, an authorized staging operator can run `VNV_STAGING_URL=https://<dedicated-staging-host> node tests/wave-06-public-https-staging.mjs` from an isolated checkout with the pinned Playwright and axe dependencies. Neither action is authorized by this document alone.
