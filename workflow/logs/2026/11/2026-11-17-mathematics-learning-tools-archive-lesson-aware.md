# Mathematics Learning Tools Archive · Lesson-Aware Toolbar — 2026-11-17

## Purpose

Make the Verve N Veda Learning Tools toolbar resolve exact mathematics lesson companions from one canonical archive instead of requiring learners to browse a full game library.

## Canonical archive

`ecosystem/learning-tools/mathematics.json`

Current source:
- `vervenveda/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/game-registry.json`

Current archive snapshot:
- 83 canonical mathematics games
- 344 wired lesson placements
- shared calculator, CAD and enrichment tools

The archive is mirrored at:
- KhaemenesAcademy gateway
- current Verve N Veda deployed gateway

It is registered in `ecosystem/master-ecosystem-directory.json` as an active, non-directory-visible data archive.

## Toolbar behavior

`assets/vnv-class-tools-toolbar.js` v1.3.0 adds a `lesson-games` tool type.

When the page is a supported mathematics lesson, the toolbar resolves:
1. course
2. unit
3. lesson
4. exact canonical game placement
5. mode/query parameters

The Games control then shows only games matched to that lesson.

When there is no active mathematics lesson context, the Games control falls back to its normal Student Profile games destination.

## High School rollout

The High School preset now recognizes:
- Grade 09–12 Student Profile pages
- Pre-Algebra lesson routes
- Algebra I lesson routes
- Geometry lesson routes
- Algebra II lesson routes

The Algebra I shared lesson bridge now mounts the canonical Learning Tools toolbar once for all Algebra I lessons.

## Grade 9 verification

Algebra I:
- 87 total lessons
- 87 lessons with one or more archive-resolved game companions
- 0 unmatched lessons
- 7 lessons intentionally have more than one game companion

Recent gap closures:
- U03-L05 → Equation Balance Lab · literal-formulas
- U03-L07 → Model Forge · equation-models
- U13-L01 → Model Forge · frame
- U13-L02 → Model Forge · design
- U13-L03 → Model Forge · validate
- U13-L04 → Model Forge · sensitivity

## Governance

- Lesson games are practice/support tools only.
- They do not write official mastery.
- They do not unlock course progression.
- Assessment restrictions remain authoritative.
- Do not create a competing lesson-toolbar implementation inside individual courses.
- Future subjects should publish archive metadata and let the shared toolbar resolve context.

## Next

After live-device verification on Grade 9:
1. extend the same mount pattern to the remaining mathematics courses;
2. add archive metadata for videos, printables and subject-specific tools;
3. preserve one-word toolbar labels and equal responsive controls.
