---
name: whylog-review
description: On-demand analysis of the project's decision history (docs/decisions/log.md and rotated archives). Use to query past decisions, summarize recent progress, identify outdated records, or generate onboarding context.
---

# whylog-review

> 按需分析项目的决策日志，回答用户关于项目历史决策的问题。
> 用户主动调用 `/whylog-review`，不会自动触发。

## 执行步骤

### 1. 读取决策日志

- 读取 `docs/decisions/log.md`
- 若存在轮转的历史日志（`log-*.md`），一并列出，询问用户是否纳入分析

### 2. 读取项目当前状态

- 查看 `docs/decisions/` 目录下所有文件
- 运行 `git log --oneline -20` 了解近期提交历史
  - 若当前目录不是 git 仓库、未安装 git、或权限受限导致该命令失败：跳过该步骤，不要中断分析流程
- 对日志中引用的关键文件路径，检查这些文件是否仍存在于项目中

### 3. 展示概况并交互

向用户展示日志概况（条目数、时间跨度），然后询问想了解什么。

常见分析场景：

- "我们在 X 方面做过哪些决策？" → 按主题筛选相关条目
- "有哪些记录已经过时了？" → 对照项目文件，标注引用文件已不存在的条目
- "总结一下最近的进展" → 提炼最近 N 条的要点
- "帮我整理给新人看的上下文" → 生成项目决策概览文档

### 4. 输出结果

根据用户需求输出分析结果。

若用户要求持久化输出（如生成参考文档），写入 `docs/decisions/` 下的独立文件，并告知文件路径。

