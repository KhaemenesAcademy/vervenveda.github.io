# 2026-11-18 · Single-button Academy welcome front door

## User decision
The secondary `KhaemenesAcademy/vervenveda.github.io` front door should no longer duplicate the complete `vervenveda/vervenveda.github.io` index. It is now intentionally a simple Khaemenes Academy landing with **one public button to Academy Home**.

## Source evidence
Before replacement the front-door index was 269,805 characters and nearly duplicated the full VNV gateway; only a small set of root-path and one route differences existed. This created confusion when Chrome DevTools was attached to the gateway versus High School landing.

## Implemented
- Replaced `index.html` with a self-contained 2,703-character public welcome page.
- One and only one clickable action: `Enter Khaemenes Academy` linking to `https://vervenveda.com/KhaemenesAcademy_Home.github.io/`.
- Page includes centered title, elegant parchment/charcoal/gold styling, minimum 16px text, focus-visible treatment, and footer.
- No external JavaScript, duplicate school components, browser storage, account access, assessment changes, background synchronization, or redirect.
- Replaced previous `tests/front-door-synchronization.test.mjs` legacy parity assertions with tests enforcing one published link and absence of duplicated VNV or Academy application code.
- Original index remains recoverable through Git commit history; full VNV repository and Full Academy were not modified by this front-door migration.

## Publication boundary
- The Academy Home URL was previously unverified in a live browser despite passing build workflows; confirm the hosted route renders from this front door before declaring the complete click journey working.
- No changes to DNS, custom-domain routing, Family Account Cloud, T03 or STOS were made.

## Acceptance
1. Load the front-door published GitHub Pages URL and verify a centered Academy welcome.
2. Verify **one** button opens Academy Home URL.
3. From Academy Home verify Student/Family/Teacher/Adult links reach the Full Academy.
4. In the High School tab separately confirm High School canonical chrome and DevTools topology; the one-button gateway intentionally does **not** mount shared High School components.
