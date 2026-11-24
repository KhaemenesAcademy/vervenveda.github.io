# Wave 06 — Ecosystem registry source forensic audit

**Disposition:** Audit only. No public registry shard is installed in the new simplified gateway.

## Canonical source topology

The live `vervenveda/vervenveda.github.io` gateway first fetches `/ecosystem/master-ecosystem-directory.json`. Its `pageCatalog.parts` field is the authoritative list of shard paths for the Complete Ecosystem Index. The current pinned source lists `/registry/ecosystem-pages-a.json` and `/registry/ecosystem-pages-b.json`. Both are required as one generation.

| Component | Pinned Git blob | Size |
| --- | --- | ---: |
| Master curated directory | `239d87575b9019741efb77eb44455e3494c2af2d` | 84,882 bytes |
| Registry part A | `d1b976966ff2819c6d6307e719cbd8ae54c21156` | 1,994,786 bytes |
| Registry part B | `0b9ef34f43c5909d4b90eee1b4d9674068d1a1d0` | 2,023,042 bytes |

Pinned full source: `836bdb78769f70b255e5c0bc7773b6f6de61a28d`.

The master declares 11,024 public-page entries across 35 repositories. This is current source metadata, *not* a live-link validation.

## Independent audit gates

The manually executable workflow checks out the pinned public source in a temporary GitHub Actions workspace (no writes to the source repository), compares the canonical Git hashes, validates JSON decoding, ensures shard paths exactly match the master, verifies shard generation agreement, expected page count, HTTPS URLs and duplicate public URLs. It flags suspicious-looking public paths for manual privacy/security review rather than silently marking them approved. The evidence artifact is summary JSON only, not the full registry.

## Deferred work

1. Validate access restrictions and verify each public destination against the relevant repository/page access policy; never expose private, account, admin, student, vault or dormant STOS assets based on a pathname alone.
2. Verify the generator/authority for `pageCatalog.autoSync`, update cadence, source provenance and new-repository approval. The existing source metadata says the catalog is generated from approved public repositories; that does not prove external runtime sync.
3. Design a **two-shard atomic promotion** with rollback/previous-generation retention, ensuring a partial upload never produces a mixed index. Use staging paths plus an approved manifest revision.
4. Add real browser tests for the complete index (counts, filters, keyboard navigation and offline fallback) *after* both shards are safely staged.
5. Preserve original domain, source visibility, Wave 05 PR draft state and native STOS boundaries until independent cutover acceptance.

**This branch adds only audit scripts, a manually auditable workflow and documentation. No registry data is published to the simplified repository by this PR.**

## Stage B — Atomic candidate evidence and privacy review

The candidate builder temporarily copies **all three files** from the pinned public original into an immutable generation folder `registry/releases/2026-11-08T17-21-17Z/` on a GitHub Actions runner. It retains a complete candidate as an Actions artifact, **not** as GitHub Pages files on this branch, and a separate summary report with SHA-256 hashes. The manifest explicitly records publication and STOS approval as `false`.

The release is a **single logical unit**: a master directory and its two public-page shards (5,512 records each). Neither `registry/ecosystem-pages-a.json` nor `registry/ecosystem-pages-b.json` may be independently promoted; one active immutable version pointer must be advanced only after both have been validated and a previously working generation is retained for rollback. **The current live domain is a fallback, not an immutable local rollback artifact.** No previous-generation copy has yet been commissioned in the simplified gateway.

### Review-required source paths

The broader keyword screen flagged exactly three catalog entries for manual review:

| Source repository | Path | Why held |
| --- | --- | --- |
| `vervenveda/Khaemenes_Academy.github.io` | `teacher-admin/index.html` | Teacher-facing administrative surface; public discoverability requires authorization review |
| `vervenveda/Khaemenes_High.github.io` | `courses/mathematics/evidence-vault/index.html` | Educational evidence vault; distinguish public reference UI from protected student evidence |
| `vervenveda/Khaemenes_Higher_Learning.github.io` | `courses/mathematics/evidence-vault/index.html` | Parallel evidence-vault surface; same access-policy concern |

Initial read-only GitHub source previews show static public HTML and browser-local storage references, but they **do not establish whether the full pages or reachable child routes expose privileged state or account data**. Do not auto-approve or automatically delete these entries. A later source-owner classification must explicitly say whether they are appropriate public discovery links. A listing is not proof of server-side access control.

### Functional gates

The candidate data test checks combined generation, unique URLs, complete page count, a sample search, category and repository filtering, and refusal to adopt a missing/corrupted shard. The test uses a simulated active-pointer value; **it does not install a production atomic publisher** or test live user-interface behavior. Even a fully green run is a staging result, not authorization to publish.

**Wave 05 and Wave 06 remain draft and unmerged.** No DNS, repository visibility, original website, STOS or student data changes.

### Verified candidate acceptance (2026-11-08)

- [GitHub Actions candidate build and data acceptance](https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42524584520): **PASS**.
- Created archived immutable candidate with `candidate-manifest.json`, one master directory and both shards under `registry/releases/2026-11-08T17-21-17Z/` — **artifact only**, not the live `/registry` path.
- Independent post-download ZIP inspection confirmed all four archive entries, total 11,024 pages, all three SHA-256 values and the manifest's `publicPublicationApproved=false`.
- Candidate acceptance: search/filter smoke tests **PASS**; simulated missing-shard and hash-corruption checks **FAIL CLOSED**; simulated active pointer unchanged.
- Initial automated review flagged exactly three paths listed above. Source previews show browser-local storage in each and administrative/evidence-oriented presentation; **no authorization finding or permission to expose data was established**.
- Remaining HOLD: manual owner approval of the three destination classifications; full browser directory interaction test with actual shards, URL/access review and an immutable previous-release rollback target.
- Neither Wave 06 nor Wave 05 may be merged just because this archive built successfully. The existing live site remains canonical.

## Stage C — Versioned pointer browser acceptance + simulated rollback (2026-11-08)

Evidence:
- [Versioned full directory Chromium test](https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42526524939) — **PASS**, three scenarios. Desktop and mobile: 11,024 pages, mathematics search, education-category filter, 35-repository dropdown/filter, empty-search fallback, keyboard-operated hamburger. Simulated single-shard 503: full index remains unavailable, not partially loaded.
- [Atomic candidate and rollback rehearsal](https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42526726032) — **PASS**, source hash checks, missing/corrupt shard rejected, candidate `atomic-pointer-preview.json`, simulation of master pointer advance and rollback in an ephemeral local directory.
- Existing production `/ecosystem/master-ecosystem-directory.json` was **not** replaced. The preview master changes `pageCatalog.parts` to an immutable `/registry/releases/2026-11-08T17-21-17Z/registry/` two-part generation, compatible with the existing homepage's validated path format.
- The old/master bytes are retained in the source pinned checkout and in the candidate archive. The simulation does **not** prove production release authorizations, service durability, deployment operations, or a live rollback.
- Browser warnings: origin-specific service-worker sandbox warning present; external requests intercepted. Actual production HTTPS, real linked page behavior and cross-browser accessibility still unverified.

### Source-level classification of three keyword flags

1. `Khaemenes_Academy.github.io/teacher-admin/index.html`: publicly stored HTML; teacher-facing hub that imports family registry, mentor and continuity scripts. Requires source-owner approval for search indexing, permission/access review and confirmation no learner data leaks in the public application. **HOLD**.
2. `Khaemenes_High.github.io/courses/mathematics/evidence-vault/index.html`: public HTML with local browser storage calls, but source inspection alone cannot establish records as publicly safe. **HOLD**.
3. `Khaemenes_Higher_Learning.github.io/courses/mathematics/evidence-vault/index.html`: public HTML with local browser storage and student/evidence references. Do not infer that its public code authorizes disclosure of user evidence. **HOLD**.

The code preview showed no explicit network `fetch()` call in these page sources, but that alone cannot attest to dynamically loaded scripts or linked routes. All three entries were already indexed in the original public directory; the staged candidate must not broaden that exposure, and classification remains pending.

### Remaining promotion gates

An authorized source owner must approve the three access classifications (or regenerate the full two-shard catalog to exclude any denied entries); verify a real public staging URL including CSP, assets and application routing; run non-Chromium/mobile accessibility checks; preserve previous deployed-generation bytes and rehearse actual rollback; and approve a single-pointer release. Domain/visibility changes and any STOS import remain separate, later approvals. Wave 05 and Wave 06 are still drafts.

## Stage D — Explicit public-discovery access holds (2026-11-08)

- Policy: `policy/wave-06-directory-access-review.json`, which identifies the three review-required entries by exact canonical repository and relative path. Each begins in `HOLD`.
- Gate: `scripts/wave-06-access-classification-gate.mjs`, executed in the atomic candidate CI. It verifies all three entries exist exactly once in the *pinned full catalog*, refuses silent approval, and requires reviewer, date, scope and at least two HTTPS evidence references even for a proposed approval. This evidence shape is a prerequisite, not independent validation of an approver's authority.
- Passing source-only access gate: https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42527286442 — `ACCESS_CLASSIFICATION=HOLD`, three pending entries, public promotion prohibited.
- Source trace:
  - Teacher administration page loads family registry/mentor scripts, reads and writes a local evidence-review list, and supports a local JSON export. This is a teacher-facing workflow; no server authority has been verified.
  - High School math vault reads learner-scoped local progress and supports local export/verify of math evidence; protected student identity/access controls require review.
  - Higher Learning math vault includes learner-scoped local coursework references and exports; protected student evidence remains out of scope for public catalog authority.
- **Current decision is not deletion and not approval**. Existing public source pages stay in place, but no new directory publication may rely on these entries while classification is pending. A future `DENY` requires fresh generated shards and exact integrity/browser acceptance, not an ad hoc removal from the staged files.

### Authorization still missing

Manual owner review of all three destinations; authenticated privacy tests involving test-only accounts (never real students); complete route and linked script exposure audit; an independently reachable isolated HTTPS staging site; and an actual previous-deployment retention and rollback rehearsal. Only then may a separate promotion PR request authorization. STOS commissioning, domain transfer and repo privatization are independent future decisions.

## Stage E — Synthetic guest access and restricted browser preview (2026-11-08)

- Guest access run: https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42527956393 — **PASS**, six scenarios with purely synthetic browser-local identity or queue data and external scripts intercepted.
- Both High School and Higher Learning math evidence-vault pages correctly show no learner evidence and disable export without a selected browser learner. However, a synthetic local family-registry/learner selection enables the learner UI/export button **without verified server authentication**. This is a trust-boundary limitation, not evidence of external account access.
- Academy teacher-admin displays a synthetic browser-local evidence-review record without a verified teacher login. This is local state visibility under the same browser origin, not proof of server or cross-device disclosure. Browser tests blocked dependencies, and source traces found missing global ticker/header errors in the teacher page under that constraint; no production end-to-end assertion is made.
- Three `HOLD` classifications remain enforced through `policy/wave-06-directory-access-review.json`. No source-owner approval inferred.
- Restricted candidate build: https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42528190926 — **PASS**. Derived `registry/previews/2026-11-08-restricted/` with all three held deep-search links excluded: **11,021** pages. Source original **11,024** pages and source immutable commit unchanged. No automatic source modifications or live publication.
- Restricted Chromium test: https://github.com/KhaemenesAcademy/vervenveda.github.io/actions/runs/42528285284 — **PASS** for desktop, mobile, catalog count, search, education category and 35-repository filtering, absent held links, menu keyboard, and fail-closed missing shard.
- Browser recorded a sandbox-origin service worker warning; outbound network calls were blocked, so the gate is not proof of public HTTPS endpoint availability or cross-origin shared script behavior.
- A restricted deep-search index **does not revoke direct access** to any original public route and does not independently secure their underlying local-storage workflows.
- Next: independent HTTPS staging with no production DNS/Pages changes, complete accessible UI and link verification, then explicit owner decisions for sensitive routes, true deploy rollback retention and separate go/no-go approval.

**Release disposition:** source audit and isolated staging checks PASS. **PUBLIC_PROMOTION=HOLD**, Wave 05 and Wave 06 PRs remain DRAFT and UNMERGED, native STOS and student records untouched.
