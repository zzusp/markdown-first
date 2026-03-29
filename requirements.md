# markdown-first 项目需求

## 项目背景

创建一个 Claude Code Skill，用于在每次 Claude Code 任务执行结束后自动从对话中总结记录项目改动。

## 核心功能需求

1. **Skill 安装**：手动将 `skills/` 目录复制到目标项目的 `.claude/skills/`，并合并 `.claude/settings.json` 中的 Stop Hook 配置
2. **自动触发**：每次 Claude Code 任务执行结束后自动触发
3. **从对话总结**：
   - 从当前对话中提炼关键信息
   - 改动原因、决策过程、用户偏好、项目进展等语义信息
   - **不记录 git diff**（代码本身在仓库里，无需重复存储）
   - 写入 `{项目目录}/docs/mdf/changes.md`
4. **触发汇总条件**（满足任一即触发）：
   - 记录次数达到 10 次
   - OR changes.md 文件超过 2000 行
5. **汇总分析**：
   - 调用 Claude API 分析 changes.md 内容
   - 判断内容归属：追加到已有文件 OR 新建分类文件
   - 写入 `docs/mdf/` 目录下对应文件
6. **清理机制**：汇总完成后清空 changes.md 中的变更内容

## 预期文件结构

```
{目标项目}/
├── .claude/
│   ├── settings.json     # Hook 配置
│   └── mdf-enabled      # 标识文件（存在即启用）
├── docs/
│   └── mdf/
│       ├── changes.md    # 累积变更记录
│       └── *.md         # 分类汇总文件
└── ...
```

## 触发条件（任一满足）

- 记录次数 >= 10 次
- OR changes.md 行数 >= 2000 行

## 记录内容要求

每条记录包含（从对话中提炼）：
- 改动时间
- 改动原因/背景
- 决策过程和选择
- 用户偏好/反馈
- 项目进展状态
- 关键架构选择
