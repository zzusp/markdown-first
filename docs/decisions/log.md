# Decision Log

> 按时间升序排列（旧在前，新在后），新 entry 追加到文件末尾。

## 2026-03-30 — Clarify "Markdown-First" meaning
澄清 "Markdown-First" 的含义：Markdown 是首要依据（primary artifact），而不是强制"先写文档后写代码"的顺序约束。已更新 `README.md` 与 `CLAUDE.md` 中的表述以避免误读。

## 2026-03-30 — Remove `.claude/whylog-enabled` opt-in gate
`whylog-record` 不再检查 `.claude/whylog-enabled` 是否存在；复制 `skills/` 到 `.claude/skills/` 并触发 `/whylog-record` 即可。是否真的写入日志仍取决于本次会话是否产生文件改动/技术决策。
同时更新了 `README.md` / `CLAUDE.md`，移除“创建该文件才能启用”的说明，避免误解。

## 2026-03-30 — Reconsider log rotation granularity
把 `whylog-record` 的日志轮转从“按季度 `log-YYYY-QN.md`”调整为“按月 `log-YYYY-MM-N.md`”（超过 2000 行才轮转，且同月内用序号避免冲突）。原因：季度颗粒度下单个归档文件往往内容过大，检索/浏览成本更高。

## 2026-03-30 — Merge rotations within a month
将轮转归档从 `log-YYYY-MM-N.md` 调整为当月单文件 `log-YYYY-MM.md`：如果当月归档已存在，就把本次 `log.md` 内容追加进去再清空 `log.md`。原因：高频轮转时，按序号会导致当月产生过多归档文件，不利于管理与检索。

## 2026-03-30 — Split large monthly archives
在“按月合并”的基础上增加分卷：当月归档文件过大时，使用 `log-YYYY-MM-NN.md`（如 `log-2026-03-01.md`）分卷，避免单文件膨胀导致浏览/检索性能下降，同时仍保持每月文件数可控。

## 2026-03-30 — Rotate by entry count (>= 150)
将 `whylog-record` 的主要轮转触发从”`log.md` 行数 > 2000”改为”日志 entry 标题数量 >= 150”。原因：entry 标题结构更稳定，能减少换行/编辑器换行策略带来的噪音，降低轮转触发抖动。
涉及: `skills/whylog-record/SKILL.md`, `README.md`, `requirements.md`

## 2026-03-31 — 移除 Markdown-First 品牌，统一为 WhyLog
项目名称从 “Markdown-First” 统一为 “WhyLog”。移除了 `CLAUDE.md` 标题中的 “Markdown-First Development Guide” 和对应的 “Markdown First” 理念条目，删除 `README.md` 中 “Markdown-First means...” 说明段落。决策点：该理念描述对项目本身无实质指导价值，且会造成品牌混淆。涉及: `CLAUDE.md`, `README.md`

## 2026-03-31 — 规定 Decision Log 按时间升序排列
明确规定 `log.md` 采用升序（旧在前，新在后），即每次在文件末尾追加。选择升序的原因：与 skill 已有的 append 模式一致，实现最简单；`whylog-review` 顺序阅读时脉络更自然。已在 `whylog-record` skill 的”写入记录”一节标注。涉及: `.claude/skills/whylog-record/SKILL.md`

## 2026-03-31 — 修复文档路径过时、补充 Cursor 支持、修复轮转月份逻辑
集中修复了几处积累的问题：①`README.md`、`requirements.md`、`CLAUDE.md` 中的 skill 路径从旧的单文件格式（`whylog-record.md`）更新为子目录格式（`whylog-record/SKILL.md`）；②`README.md` 新增 Supported Editors 章节，明确 Claude Code（`.claude/skills/`）和 Cursor（`.cursor/skills/`）两种安装路径；③`CLAUDE.md` 新增 sync 命令提示，避免更新 `skills/` 后漏同步副本；④`whylog-record` 轮转逻辑改为取第一条 entry 的月份作为归档文件名，避免跨月内容被归入当前月；⑤三处副本（`skills/`、`.claude/skills/`、`.cursor/skills/`）全部同步至最新。

## 2026-03-31 — 文档细节二轮修复
修复了上一轮遗留的几处细节：①`README.md` Quick Start 的 `cp` 命令补加 `-r` 标志（子目录格式需要递归复制）；②"Trigger Methods / Method A" 简化为 "Trigger Method"（只剩一种方式，原标题冗余）；③`requirements.md` 轮转描述同步为"以第一条 entry 的月份命名"；④`requirements.md` 安装说明补充 Cursor；⑤`CLAUDE.md` Repository Structure 补充 Cursor 说明。涉及: `README.md`, `requirements.md`, `CLAUDE.md`

## 2026-03-31 — 修复 whylog-record skill 两处逻辑问题
①Step 0 判断为"跳过"后缺少显式结束指令，补充"输出说明后直接结束，不执行后续步骤"，防止模型继续往下走；②Step 4.4 "当月归档"措辞与已改为"取第一条 entry 月份"的逻辑不一致，改为"该归档文件"。三处副本（`skills/`、`.claude/skills/`、`.cursor/skills/`）同步更新。

## 2026-03-31 19:45 — 修复排序约束、升级时间精度、完善文件头说明

强化追加约束：Step 2 新增着重警告禁止插入已有 entry 之间，并要求写入后自检；去掉 emoji 改用加粗；格式从 `YYYY-MM-DD` 升级为 `YYYY-MM-DD HH:MM`，支持同天多条；`log.md` 头部和 skill 轮转中统一加上排序说明。三处副本同步更新。
