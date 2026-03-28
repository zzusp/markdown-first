# markdown-first

Claude Code Skill - 自动记录项目改动

## 功能

- **自动记录**：每次 Claude Code 任务结束后自动记录改动
- **手动汇总**：运行 `/mdf-summarize` 手动触发分类汇总

## 安装

```bash
npm install
node scripts/install.js
```

## 使用

1. **自动记录**：安装后，每次任务结束会自动追加到 `docs/mdf/changes.md`

2. **手动汇总**：输入 `/mdf-summarize` 手动触发分类，Claude 会：
   - 读取 changes.md 内容
   - 分析并分类到对应文件
   - 清空 changes.md

## 文件结构

```
{项目}/
├── .claude/
│   ├── settings.json    # Hook 配置
│   └── skills/
│       └── mdf-summarize.md
├── docs/
│   └── mdf/
│       ├── changes.md   # 累积记录
│       └── *.md         # 分类文档
└── scripts/
    └── install.js
```

## 分类建议

- `architecture.md` - 架构设计
- `decisions.md` - 技术决策
- `preferences.md` - 用户偏好
- `progress.md` - 项目进展
