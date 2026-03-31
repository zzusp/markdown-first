# CLAUDE.md - WhyLog

## Project Philosophy

- **README as Spec**: README.md is the source of truth
- **Everything is Text**: Prefer Markdown for planning, specs

## Coding Conventions

- Keep code simple and readable
- Document as you go

## Repository Structure

`skills/` contains the canonical skill sources. Users copy these into their
project's `.claude/skills/` manually. This repo's `.claude/settings.json` is
a reference trigger configuration.

Key paths:
- `skills/whylog-record.md` — auto-record skill
- `skills/whylog-review.md` — on-demand review skill
- `docs/decisions/log.md` — append-only decision log (template)

## Local Development Testing

To test skills locally during development:

1. Copy `skills/` into `.claude/skills/`:
   ```bash
   cp -r skills/* .claude/skills/
   ```
No additional opt-in flag is needed; recording depends on how you trigger `/whylog-record` and whether the session produced file changes/decisions.

## Auto-record

At the end of every task that **produced file changes or technical decisions**, run `/whylog-record` to log the changes made in this session. Skip for pure Q&A, read-only exploration, or whylog skill execution itself.
