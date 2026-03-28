# markdown-first

Claude Code Skill - 自动记录项目改动

## 功能

- **自动记录**：每次 Claude Code 任务结束后自动记录对话摘要
- **自动汇总**：达到 10 次或 2000 行时自动触发分类

## 安装

```bash
# 复制 skills 到项目
cp -r .claude/ {你的项目}/
```

## 使用

- **自动触发**：安装后，每次任务结束自动追加到 `docs/mdf/changes.md`
- **手动汇总**：输入 `/mdf-summarize` 手动触发分类

## 文件结构

```
.claude/
├── settings.json       # Stop Hook 配置
└── skills/
    ├── mdf-record.md      # 自动记录
    └── mdf-summarize.md  # 分类汇总
docs/mdf/
├── changes.md         # 累积记录
└── .count            # 计数
```

## 分类

- `architecture.md` - 架构设计
- `decisions.md` - 技术决策
- `preferences.md` - 用户偏好
- `progress.md` - 项目进展
