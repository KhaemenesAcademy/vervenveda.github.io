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
