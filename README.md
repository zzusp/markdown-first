# markdown-first

A Claude Code Skill suite that automatically distills conversation summaries into `docs/mdf/changes.md` after every task, and categorizes them when a threshold is reached.

## Features

- **Auto-record**: After each Claude Code task, a summary is appended to `docs/mdf/changes.md` via Stop Hook
- **Auto-summarize**: When the log reaches 10 entries or 2000 lines, categorization runs automatically
- **Manual summarize**: Run `/mdf-summarize` at any time to categorize and clear the log
- **Opt-in**: Recording only activates when `.claude/mdf-enabled` exists in the project

## Installation

Copy the `skills/` directory into your project's `.claude/skills/`:

```bash
mkdir -p /path/to/your-project/.claude/skills
cp -r skills/* /path/to/your-project/.claude/skills/
```

Then merge the Stop Hook from `.claude/settings.json` into your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"require('child_process').execSync('claude -p /mdf-record', {stdio:'inherit'})\""
          }
        ]
      }
    ]
  }
}
```

Seed the changes log:

```bash
mkdir -p /path/to/your-project/docs/mdf
cp docs/mdf/changes.md /path/to/your-project/docs/mdf/changes.md
```

> **Important**: `changes.md` must keep the `<!-- MDF_HEADER_END -->` marker line intact. The skill uses this marker to locate where entries begin and to preserve the file header during cleanup.

## Usage

### Enable recording

```bash
touch .claude/mdf-enabled
```

Once enabled, every Claude Code task will automatically append a structured entry to `docs/mdf/changes.md`.

### Disable recording

```bash
rm .claude/mdf-enabled
```

### Manual summarize

Inside a Claude Code session:
```
/mdf-summarize
```

This reads `docs/mdf/changes.md`, categorizes each entry into topic files under `docs/mdf/`, and clears the log (preserving the file header).

## File Structure

| Path | Description |
|---|---|
| `skills/mdf-record.md` | Skill: auto-record after each task |
| `skills/mdf-summarize.md` | Skill: categorize and clear the log |
| `.claude/settings.json` | Stop Hook configuration (reference) |
| `.claude/mdf-enabled` | Opt-in flag (create to enable, delete to disable) |
| `docs/mdf/changes.md` | Accumulated change log |
| `docs/mdf/.count` | Entry counter (managed automatically) |

## Categorized Output Files

Entries in `changes.md` are sorted into topic files under `docs/mdf/`:

- `architecture.md` — Architecture, refactoring, module design
- `decisions.md` — Technical decisions, trade-offs, approach choices
- `preferences.md` — User preferences, code style, conventions
- `progress.md` — Project milestones, completed features
- *(new topics create new files automatically)*

## Example Entry

```markdown
---
## 2026-03-29T10:15:00Z

**任务**: Add user authentication

### 改动原因
App required login to protect user data.

### 决策
Used JWT with 24h expiry; stored in httpOnly cookie.

### 结果
Login and logout endpoints working; session persists across refreshes.
```
