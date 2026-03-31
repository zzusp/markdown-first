# WhyLog

记录对话中的决策上下文 —— git 从不记录的"为什么"。

## 功能

- **自动记录**：在产生文件改动或技术决策的任务完成后，自动追加摘要到 `docs/decisions/log.md`
- **按需回顾**：运行 `/whylog-review` 交互式查询和分析决策历史
- **日志轮转**：当日志达到 150 条时，自动按月归档为 `log-YYYY-MM.md`（当月内容过多时拆分为 `log-YYYY-MM-NN.md`）

## 快速开始

在项目根目录执行：

```bash
# 1. 复制 skills
mkdir -p .claude/skills
cp -r /path/to/WhyLog/skills/* .claude/skills/

# 2. 创建决策日志目录
mkdir -p docs/decisions
echo "# Decision Log" > docs/decisions/log.md
```

然后在项目的 `CLAUDE.md` 中添加以下内容：

```markdown
## Auto-record

At the end of every task that **produced file changes or technical decisions**, run `/whylog-record`. Skip for pure Q&A, read-only exploration, or whylog skill execution itself.
```

## 使用方式

### 手动记录

在 Claude Code 会话中执行：

```
/whylog-record
```

### 回顾决策

```
/whylog-review
```

读取 `docs/decisions/log.md`，检查所引用文件是否仍存在，然后回答你的问题。示例查询：

- "我们关于认证做了哪些决策？"
- "总结近期的进展"
- "日志中有哪些过时记录？"
- "为新成员生成一份入职摘要"

## 支持的编辑器

| 编辑器 | Skills 路径 |
|---|---|
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |

将 `skills/` 内容复制到对应编辑器的路径即可。

## 触发方式

将 [快速开始](#快速开始) 中的 Auto-record 代码片段添加到项目的 `CLAUDE.md` 中。

## 文件结构

| 路径 | 说明 |
|---|---|
| `skills/whylog-record/SKILL.md` | Skill：每次任务后记录决策上下文 |
| `skills/whylog-review/SKILL.md` | Skill：交互式决策日志分析 |
| `docs/decisions/log.md` | 仅追加的决策日志 |
| `docs/decisions/log-YYYY-MM.md` | 轮转归档（自动生成，可能拆分为 `log-YYYY-MM-NN.md`） |

## 示例条目

```markdown
## 2026-03-30 — JWT 替代 Session 方案

选择 JWT + httpOnly cookie 而非 server-side session。
原因：需要支持多实例部署，session 需要共享存储，增加运维复杂度。
考虑过 Redis session，但团队没有 Redis 运维经验。
涉及: src/auth/middleware.ts, src/auth/jwt.ts
```

没有强制格式要求。一句话足够就一句话；需要更多上下文就多写几句。
