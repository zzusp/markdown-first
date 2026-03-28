/**
 * 格式化单条记录
 */

export function formatRecord(data) {
  const { time, commit, task, reason, decisions, preferences, progress, architecture } = data;
  
  let content = `\n## ${time}\n`;
  content += `\n**Commit:** ${commit}\n`;
  
  if (task) content += `\n### 任务\n${task}\n`;
  if (reason) content += `\n### 改动原因\n${reason}\n`;
  if (decisions) content += `\n### 决策过程\n${decisions}\n`;
  if (preferences) content += `\n### 用户偏好\n${preferences}\n`;
  if (progress) content += `\n### 项目进展\n${progress}\n`;
  if (architecture) content += `\n### 架构选择\n${architecture}\n`;
  
  return content;
}
