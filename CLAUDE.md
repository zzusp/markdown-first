# CLAUDE.md - Markdown-First Development Guide

## Project Philosophy

- **Docs First**: Write documentation before code
- **README as Spec**: README.md is the source of truth
- **Everything is Text**: Prefer Markdown for planning, specs

## Coding Conventions

- Keep code simple and readable
- Document as you go

## Repository Structure

`skills/` contains the canonical skill sources. Users copy these into their
project's `.claude/skills/` manually. This repo's `.claude/settings.json` is
a reference Stop Hook configuration.

## Local Development Testing

To test skills locally during development:

1. Copy `skills/` into `.claude/skills/`:
   ```bash
   cp -r skills/* .claude/skills/
   ```
2. Create `.claude/mdf-enabled` to enable recording (it is gitignored):
   ```bash
   touch .claude/mdf-enabled
   ```
3. After testing, remove both:
   ```bash
   rm -r .claude/skills .claude/mdf-enabled
   ```

The Stop Hook in `.claude/settings.json` fires during development too, but
`mdf-record` exits immediately when `.claude/mdf-enabled` does not exist,
so there are no side effects without the flag.

## Auto-record

At the end of every task, before finishing, run `/mdf-record` to log the changes made in this session.
