# VNV full-index receiver — review and cutover boundaries

Status: DRAFT ONLY. No domain migration or live synchronization approved.

## Master/target
- GitHub Master: `vervenveda/vervenveda.github.io` / `main`
- Lightweight public Gateway: `KhaemenesAcademy/vervenveda.github.io` / `main`
- The Gateway receives only the complete `index.html` bytes. Gateway-specific `assets/`, `scripts/`, `.github/`, and documentation are never pulled from Master.
- The Gateway workflow has only its **own repository's** token and no master write credential.

## Receiver decisions
- MATCH — identical complete homepage; no write.
- RECEIVE_MASTER — master has advanced, Gateway is provably still at last common file revision.
- HOLD_GATEWAY_EDITED — Gateway has distinct edits; preserve them; ask owner to promote/reconcile.
- HOLD_NO_COMMON_BASELINE — no matching file revision found; prohibit overwrite.
- HOLD_MASTER_NOT_AHEAD — master is at common baseline; no action.

The receiver verifies complete file-byte identity and limits staging to exactly `index.html`; it rejects dirty worktrees and non-fast-forward races. Scheduled workflow runs are best effort and NOT active while this file remains only on a review branch.

## Historic migration-wave hash pins

Existing Wave 02, Wave 03, and Wave 04 workflows intentionally attest the earlier migration baseline `a883f035329a89e55d526160c54ffdac3c7af2f9`. **Do not rewrite historical evidence hashes.** These jobs are not a dynamic homepage-release check. They may fail if manually rerun against a later intended homepage, which is not necessarily a sync failure.

Instead, future index synchronization must use the separate VNV receiver regression tests and its per-run Git blob comparison. Historical wave reports should continue to be evaluated against their original pinned revision.

## Still required before enabling

1. Owner approval of one-way master-to-gateway authority; never merge superseded peer-to-peer sync branches.
2. Decide branch-protection and workflow-token behavior; independently test the first change on a safe preview.
3. Ensure Gateway has every *runtime dependency* required by the new HTML; copying only index.html does not supply missing scripts, JSON page catalogue, manifest, icons, or same-origin routes.
4. Verify the published custom-domain mapping and all Vervenveda project-subpath routing before DNS changes.
5. Capture revision receipts and preserve a manual revert procedure; do not infer successful deployment from a GitHub commit.

## STOS is separate

Do not conflate a successful Gateway index sync with a sovereign STOS source intake. STOS separately verifies authorized full-tree manifests and issues native acceptance receipts.
