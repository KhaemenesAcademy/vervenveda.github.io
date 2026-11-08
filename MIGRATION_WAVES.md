# Verve N Veda · Progressive migration while the live gateway remains online

**Mode: STAGED, AUDIT ONLY — no cutover.**

## Why we are not doing a full sweep

The public `vervenveda.com` home remains served by the original repository while the entire full source (385 tracked files at the pinned baseline commit) is accounted for in a source manifest. The simplified site is tested independently. Native STOS import is an authenticated, fail-closed, off-controller process, **not an automatic GitHub Actions push into a terminal**.

## Wave-by-wave validation plan

0. **Full-source inventory:** preserve pinned complete source and history, SHA-256 manifest, origin URL map, all public routes, asset links and browser behaviour; create verified rollback assets. No STOS write.
1. **Homepage (this PR):** compare public gateway `index.html` against the pinned original Git blob and enumerate direct missing resources. The test only reads the local repository and writes an Actions artifact. No public asset or JS changes.
2. **Static presentation layer:** add approved, verified stylesheet/icon/manifest dependencies individually; compare browser layout, typography, contrast and interactive elements after each.
3. **Global navigation:** test header, two tickers, hamburger, toolbar, translator individually, with duplicate-script and CSS checks.
4. **Directory and public route map:** stage the directory JSON and preserve correct external links. Verify link destinations and public deep paths anonymously.
5. **Public applications:** source review and independent functional test per route; no student/account admin state moved via static hosting.
6. **Sovereign intake:** STOS-authorized pull of a pinned complete repository bundle, content verification and quarantine; reconcile any native-only changes. Until off-controller durable storage is commissioned, no canonical object import or auto promotion.
7. **Shadow and canary:** run parallel staging and test one approved component at a time, retain previous releases and receipts. Never replace T01/T02/T03 state on a frontend audit result.
8. **Domain/visibility cutover:** only after complete public route/asset parity, HTTPS/domain verification, external smoke tests, rollback rehearsal, and human owner authorization. Then move apex CNAME to the simplified public site; privatize full development source *after* independent assets work.

## Wave 01 audit

Run workflow `VNV Incremental Migration — Wave 01 Source Audit` manually on this PR branch. The resulting `wave-01-report.json` records the pinned homepage Git blob, a SHA-256 digest and local dependencies missing from the new public repo. A green Actions run **does not assert cutover readiness**; `cutoverReady` stays false until later gates pass.

**HOLD:** never move `vervenveda.com`, change GitHub visibility, redirect production traffic, delete the original code or write to STOS based on this report.
