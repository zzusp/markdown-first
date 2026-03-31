# WhyLog

A Claude Code Skill suite that captures decision context from your conversations — the "why" behind code changes that git never records.

## Features

- **Auto-record**: After tasks that produce file changes or technical decisions, a summary is appended to `docs/decisions/log.md`
- **On-demand review**: Run `/whylog-review` to interactively query and analyze your decision history
- **Log rotation**: When the log reaches 150 entries, it rotates automatically to monthly archives `log-YYYY-MM.md` (and splits into `log-YYYY-MM-NN.md` if the month gets too large)

## Quick Start

Run the following in your project root:

```bash
# 1. Copy skills
mkdir -p .claude/skills
cp -r /path/to/WhyLog/skills/* .claude/skills/

# 2. Create the decisions log
mkdir -p docs/decisions
echo "# Decision Log" > docs/decisions/log.md
```

Then add the following to your project's `CLAUDE.md`:

```markdown
## Auto-record

At the end of every task that **produced file changes or technical decisions**, run `/whylog-record`. Skip for pure Q&A, read-only exploration, or whylog skill execution itself.
```

## Usage

### Manual record

Inside a Claude Code session:
```
/whylog-record
```

### Review decisions

```
/whylog-review
```

Reads `docs/decisions/log.md`, checks which referenced files still exist, then asks what you want to know. Example queries:

- "What decisions did we make about authentication?"
- "Summarize recent progress"
- "What's outdated in the log?"
- "Generate an onboarding summary for new team members"

## Supported Editors

| Editor | Skills path |
|---|---|
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |

Copy the contents of `skills/` into the corresponding path for your editor.

## Trigger Method

Add the Auto-record snippet from [Quick Start](#quick-start) to your project's `CLAUDE.md`.

## File Structure

| Path | Description |
|---|---|
| `skills/whylog-record/SKILL.md` | Skill: record decision context after each task |
| `skills/whylog-review/SKILL.md` | Skill: interactive decision log analysis |
| `docs/decisions/log.md` | Append-only decision log |
| `docs/decisions/log-YYYY-MM.md` | Rotated archives (auto-generated, may split to `log-YYYY-MM-NN.md`) |

## Example Entry

```markdown
## 2026-03-30 — JWT 替代 Session 方案

选择 JWT + httpOnly cookie 而非 server-side session。
原因：需要支持多实例部署，session 需要共享存储，增加运维复杂度。
考虑过 Redis session，但团队没有 Redis 运维经验。
涉及: src/auth/middleware.ts, src/auth/jwt.ts
```

No forced sections. One sentence when that's enough; more when context matters.
