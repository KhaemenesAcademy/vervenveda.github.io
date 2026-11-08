# Wave 05 · Khaemenes Interlingual Core — Forensic Integration Hold

This branch stages the **exact byte-for-byte legacy public module**, without inserting or changing any script tag in `index.html`. The original VNV source SHA is pinned; the Linguistics canonical loader is copied to `tests/fixtures/` **for isolated tests only**. Neither artifact is an authorization source or an STOS runtime component.

## Provenance

- Full VNV baseline: `vervenveda/vervenveda.github.io@836bdb78769f70b255e5c0bc7773b6f6de61a28d`
- Legacy core Git blob: `13955ca419bcdb785ba1289137553f67306b0d77`.
- Linguistics loader fixture Git blob: `1ebfa3c7e427cc416695cb45f935ba56a456c9b8` (snapshot only, not a live dependency).
- Campus seed: `2a7c6c8030df3d62df7312cb9111acfe7a5534f6`.

## Testing scope

The Node VM suite exercises isolated legacy-core behaviors and simulated canonical loader behavior:
- source hashes and preserved prior assets;
- draft phrase lookup, unknown phrases, and unsupported pivot translations;
- malformed browser-library inputs, plus a **known trust issue**: a `verified:true` bit from localStorage is surfaced as `verified:true` in the returned object, despite no independent identity or editorial review;
- dependency load order and absence of late dependency rebinding;
- canonical loader replacement when dependencies succeed, safe legacy fallback on unavailable canonical resources, and repeated `ensure()` calls.

The tests prove these code paths only. They do not certify all user input, live-browser behavior, third-party translation, Linguistics review quality, storage integrity, or any STOS service.

## Subsequent hardening (distinct, reviewed change)

1. Preserve the legacy core and user library unchanged as evidence.
2. Introduce separate, origin-local presentation trust metadata: `user-reviewed-local` is **not** `publisher-reviewed` nor `sovereign-approved`. Avoid changing the library key/schema or deleting its contents.
3. Test full newer Linguistics core and optional resources, plus load failure, using a live-browser staging test.
4. Do not activate the copied script in a second `index.html` until each integration scenario passes.
5. Only sovereign-side authenticated import/release policy can grant STOS data authority.

**HOLD:** No automatic STOS import, source repository privatization, domain transfer, or privileged account sync is allowed through this PR.
