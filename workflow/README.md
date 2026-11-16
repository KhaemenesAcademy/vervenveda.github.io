# Workflow · Dated Development & Conversation Journal

This repository's root-level `workflow/` folder records **audits, tests, repairs, upgrades, decisions, and miscellaneous Codex updates** with an auditable history.

## Structure
- `workflow/README.md` — rules and navigation.
- `workflow/INDEX.md` — chronological register of dated entries.
- `workflow/templates/SESSION_LOG_TEMPLATE.md` — reusable session template.
- `workflow/logs/YYYY/MM/YYYY-MM-DD-short-topic.md` — dated log files (create as sessions occur).

## Rules
1. Use ISO dates and descriptive filenames. Add a suffix for multiple unrelated sessions on the same day.
2. Keep each repository's history separate; cross-reference other repositories via links rather than copying unrelated logs.
3. Label entries with one or more types: **audit · test · repair · upgrade · codex · decision · follow-up**.
4. Distinguish observations from proposals, completed commits, verified tests, and open holds. Link exact file paths, commit SHAs, and tests when known.
5. A summary is **not** a verbatim conversation transcript. Store only authorized and suitably redacted full transcripts.
6. Never commit learner information, personal details, private keys, passwords, tokens, or production student records.
7. Do not overwrite historic logs. Record correction addenda and commit links instead.
8. Documentation commits must not modify product behavior. Record workflows before claiming deployments or tests.
9. Add each new log to `workflow/INDEX.md` and update its status as evidence becomes available.

This is documentation and process history, not a replacement for Git commits, CI output, or the Academy's student records.
