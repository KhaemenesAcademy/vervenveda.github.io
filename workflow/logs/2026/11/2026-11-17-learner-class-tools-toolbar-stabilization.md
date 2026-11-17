# Learner Class Tools Toolbar Stabilization — 2026-11-17

## Purpose

Stabilize the lower-left learner/class-tools toolbar before extending it across Khaemenes Academy repositories.

## Canonical architecture

- Lower right: `assets/vnv-ecosystem-toolbar.js` — universal Verve N Veda navigation/support dock.
- Lower left: `assets/vnv-class-tools-toolbar.js` — learner/class tools dock.
- Directory authority: `ecosystem/master-ecosystem-directory.json`.
- School repositories should use thin loaders/configuration rather than fork the toolbar engine.

## Completed

1. Added `assets/vnv-class-tools-toolbar.js` to `KhaemenesAcademy/vervenveda.github.io`.
2. Hardened the engine to v1.1.0 with migration-safe directory resolution:
   - preferred: KhaemenesAcademy GitHub Pages gateway directory;
   - fallback: current `vervenveda.com` directory.
3. Synchronized the current `vervenveda/vervenveda.github.io` deployed engine to the same v1.1.0 blob.
4. Added `assets/vnv-class-tools-presets.js` with six-control mappings for:
   - Elementary
   - Middle School
   - Linguistics
   - High School
5. Preserved High School's approved 2 × 3 control layout:
   - Games · Materials · Notes
   - Parent Tools · Search · Instructions
6. Updated the High School compatibility shim documentation to record the new canonical mirror.
7. No assessment, grading, mastery, student-record, or STOS authority was added to the toolbar.

## Deployment rule

Do not mass-inject the learner toolbar into assessments, teacher resources, or every HTML file. Each school repository should first classify learner-facing surfaces and define an explicit mount policy.

Elementary and Middle use different page topology from High School, so their rollout should begin with grade/subject learner landing pages and then expand only after coverage validation.

## Next audit

1. Elementary grades 1–5: identify canonical learner landing/profile surfaces and existing grade-local tools.
2. Middle grades 6–8: reconcile `assets/khaemenes-middle-resource-toolbar.js` with the universal learner toolbar to avoid duplicate docks.
3. Linguistics: inventory language-course landing/lesson topology before mounting.
4. Add coverage tests ensuring exactly one lower-left learner toolbar and one lower-right ecosystem toolbar on approved pages.
