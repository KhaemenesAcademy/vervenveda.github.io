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
