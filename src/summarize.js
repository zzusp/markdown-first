/**
 * 汇总逻辑
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MDF_DIR = path.join(PROJECT_ROOT, 'docs/mdf');
const CHANGES_FILE = path.join(MDF_DIR, 'changes.md');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com'
});

async function getExistingFiles() {
  try {
    const files = await fs.readdir(MDF_DIR);
    return files.filter(f => f.endsWith('.md') && f !== 'changes.md');
  } catch {
    return [];
  }
}

async function readChanges() {
  return await fs.readFile(CHANGES_FILE, 'utf-8');
}

async function classifyWithClaude(changes, existingFiles) {
  const prompt = `你是一个文档分类助手。请分析以下变更记录，决定如何分类。

已有分类文件：
${existingFiles.map(f => `- ${f}`).join('\n') || '(无)'}

变更记录：
${changes}

请返回 JSON 格式的分类决策：
{
  "actions": [
    {
      "type": "append" | "new",
      "targetFile": "文件名.md",
      "content": "要写入的内容"
    }
  ]
}

规则：
- 如果内容适合已有文件，用 "append"
- 如果需要新分类，用 "new"，并给出合适的文件名
- 保持内容简洁`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return { actions: [] };
}

async function executeActions(actions) {
  for (const action of actions) {
    const filePath = path.join(MDF_DIR, action.targetFile);
    const content = action.content + '\n';
    
    if (action.type === 'append') {
      try {
        const existing = await fs.readFile(filePath, 'utf-8');
        await fs.writeFile(filePath, existing + '\n' + content, 'utf-8');
      } catch {
        await fs.writeFile(filePath, content, 'utf-8');
      }
    } else {
      await fs.writeFile(filePath, content, 'utf-8');
    }
    
    console.log(`[mdf] Written to ${action.targetFile}`);
  }
}

async function clearChanges() {
  await fs.writeFile(CHANGES_FILE, '# Changes\n\n', 'utf-8');
  console.log('[mdf] Changes cleared');
}

export async function summarize() {
  console.log('[mdf] Starting summarize...');
  
  const changes = await readChanges();
  const existingFiles = await getExistingFiles();
  
  console.log(`[mdf] Changes: ${changes.length} chars, Existing files: ${existingFiles.length}`);
  
  const decision = await classifyWithClaude(changes, existingFiles);
  console.log('[mdf] Classification:', decision);
  
  await executeActions(decision.actions || []);
  await clearChanges();
  
  console.log('[mdf] Summarize completed');
}
