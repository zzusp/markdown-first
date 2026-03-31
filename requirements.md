# WhyLog 项目需求

## 项目背景

创建一个 Claude Code Skill 套件，用于在每次 Claude Code 任务执行结束后，自动从对话中提炼并记录决策上下文——即代码变更背后的"为什么"。

Git 记录"改了什么"，commit message 记录"做了什么"，而 whylog 记录"为什么这样做、考虑过什么替代方案、有什么约束和偏好"。这些信息在对话结束后会永久丢失。

## 核心功能需求

1. **Skill 安装**：手动将 `skills/` 目录复制到目标项目的 `.claude/skills/`（Claude Code）或 `.cursor/skills/`（Cursor）
2. **自动触发**：通过 CLAUDE.md 指令，在产生文件改动或技术决策的任务结束后触发
3. **从对话提炼**：
   - 从当前对话中提炼关键决策上下文
   - 内容自由格式，不强制固定 section，有多少写多少
   - **不记录 git diff**（代码本身在仓库里，无需重复存储）
   - 追加写入 `docs/decisions/log.md`
4. **用户反馈**：写入后向用户展示一行摘要，用户可当场要求修正
5. **日志轮转**：`log.md` 的 entry 标题数量达到 150 时，以**第一条 entry 的月份**命名归档文件 `log-YYYY-MM.md`（当月内追加合并，避免跨月内容错误归类）；若归档文件过大则分卷为 `log-YYYY-MM-NN.md`，并新建空日志
6. **按需分析**：用户执行 `/whylog-review` 时，读取日志 + 项目状态，交互式回答关于历史决策的问题

## 预期文件结构

```
{目标项目}/
├── .claude/                        # Claude Code
│   └── skills/
│       ├── whylog-record/
│       │   └── SKILL.md            # 记录 skill
│       └── whylog-review/
│           └── SKILL.md            # 分析 skill
├── .cursor/                        # Cursor（可选）
│   └── skills/
│       ├── whylog-record/
│       │   └── SKILL.md
│       └── whylog-review/
│           └── SKILL.md
└── docs/
    └── decisions/
        ├── log.md                  # 当前决策日志（append-only）
        ├── log-YYYY-MM.md          # 轮转归档（自动生成）
        └── log-YYYY-MM-NN.md       # 当月分卷（自动生成）
```

## 记录内容要求

每条记录包含（从对话中提炼，按需取舍）：
- 简短标题（作为二级标题）
- 做了什么、为什么
- 选了什么方案，考虑过哪些替代方案
- 涉及哪些关键文件

## 设计原则

- **捕获要可靠、要简单**：whylog-record 不做智能分类，只做 append
- **分析要交互**：whylog-review 在有用户参与的上下文中运行，结果可校验
- **单文件存储**：append-only log，比预分类的 N 个文件更易搜索、不易产生不一致
- **用户感知**：每次记录后展示摘要，形成反馈闭环
