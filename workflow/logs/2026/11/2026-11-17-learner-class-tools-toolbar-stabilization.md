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
   - Parent · Search · Instructions
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


## Canonical label and sizing rule

Toolbar controls use a strict visual-language standard:

> **One word · one line · fixed height**

### Launcher rule

The toolbar launcher/opener is not generically labeled `Tools`. It uses a **single-word context descriptor** identifying the kind of toolbar being opened:

- Elementary: **Learning**
- Middle School: **Class**
- High School: **Class**
- Linguistics: **Language**
- Higher Learning: **Scholar** or **Campus** — final choice should match the adult-campus implementation
- Preschool / Kindergarten: no generic launcher is required when the six child-safe learning controls are directly visible

The launcher must remain one word and must not wrap.

### Internal button rule

Each toolbar button uses one short, single-word functional descriptor.

Examples:
- Games
- Materials
- Explore
- Research
- Parent
- Search
- Instructions
- Notes
- Practice
- Reference
- Read
- Listen
- Words
- Translate

Do not use multi-word button labels such as:
- Parent Tools
- Learning Tools
- Class Tools
- Language Tools
- Open Lessons
- Scientific Calculator

Longer explanation belongs in:
- accessible labels
- hover/helper text
- modal/panel descriptions
- subtext where the design permits it

It does **not** belong in the visible one-word button label.

### Layout protection

The shared toolbar engine must enforce:
- `white-space: nowrap`
- equal grid cells
- fixed/equal button heights
- no label-driven vertical expansion
- symmetrical 3 × 2 layout where that toolbar pattern is used

## Age-band toolbar progression

### Preschool and Kindergarten

These repositories are explicit child-safety exceptions.

Their lower-left learning docks are directly visible and locally constrained rather than ecosystem-facing.

Preschool:
- ABC · Numbers · Shapes
- Stories · Art · Move

Kindergarten:
- Today · ABC · Math
- Reading · Science · Move

No Parent, Search, Ecosystem, Support, Instructions, or broad information controls appear in these child docks.

### Elementary

Context launcher: **Learning**

Six-button preset:
- Games · Materials · Explore
- Parent · Search · Instructions

### Middle School

Context launcher: **Class**

Six-button preset:
- Games · Materials · Research
- Parent · Search · Instructions

### High School

Context launcher: **Class**

Six-button preset:
- Games · Materials · Notes
- Parent · Search · Instructions

### Linguistics

Context launcher: **Language**

The Linguistics toolbar should become language-aware and course-aware as the cross-repository language-resource federation is implemented.

Current/foundation vocabulary should remain single-word labels. Candidate language-specific controls include:
- Practice
- Games
- Words
- Listen
- Read
- Translate

The final six may vary by course context, but every visible label remains one word.

### Higher Learning

Higher Learning is the broadest adult-facing academic environment.

Context launcher should be one word, with **Scholar** or **Campus** preferred.

Its internal controls should remain single-word labels even when they open broad adult ecosystem resources. Adult access may include research, civic/law, health, finance, creative, news, professional, and ecosystem discovery resources.

## Governance rule

The launcher identifies **context**.  
The six internal buttons identify **functions**.

Do not make every launcher say the same generic word, and do not use the launcher to repeat the name of an individual tool.

This rule is canonical for future learner-toolbar work unless a documented age/safety exception applies.
