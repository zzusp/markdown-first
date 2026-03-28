import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MDF_DIR = path.join(PROJECT_ROOT, 'docs/mdf');
const CHANGES_FILE = path.join(MDF_DIR, 'changes.md');
const COUNT_FILE = path.join(MDF_DIR, '.count');

const CONFIG = {
  TRIGGER_COUNT: 10,
  TRIGGER_LINES: 2000,
};

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
}

async function getCount() {
  try {
    const content = await fs.readFile(COUNT_FILE, 'utf-8');
    return parseInt(content.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

async function setCount(count) {
  await ensureDir(MDF_DIR);
  await fs.writeFile(COUNT_FILE, String(count), 'utf-8');
}

async function getGitCommit() {
  try {
    const { stdout } = await execAsync('git', ['rev-parse', 'HEAD']);
    return stdout.trim().slice(0, 7);
  } catch {
    return 'unknown';
  }
}

function execAsync(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd: PROJECT_ROOT });
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    proc.on('close', code => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(stderr)));
  });
}

async function appendChange(content) {
  await ensureDir(MDF_DIR);
  
  const time = new Date().toISOString();
  const commit = await getGitCommit();
  const record = `\n---\n## ${time}\n\n**Commit:** ${commit}\n\n${content}\n`;
  
  try {
    await fs.appendFile(CHANGES_FILE, record, 'utf-8');
  } catch {
    await fs.writeFile(CHANGES_FILE, record, 'utf-8');
  }
  
  // 检查触发条件（仅提示，不自动汇总）
  await checkTrigger();
}

async function checkTrigger() {
  const count = await getCount() + 1;
  await setCount(count);
  
  let lineCount = 0;
  try {
    const content = await fs.readFile(CHANGES_FILE, 'utf-8');
    lineCount = content.split('\n').length;
  } catch {}
  
  console.log(`[mdf] Record ${count}, lines ${lineCount}`);
  console.log(`[mdf]已达 ${count} 条或 ${lineCount} 行，请运行 /mdf-summarize 汇总`);
}

async function main() {
  const cmd = process.argv[2];
  
  if (cmd === 'record') {
    const content = process.argv[3] || '';
    await appendChange(content);
  } else {
    console.log('Usage: node src/index.js record [content]');
  }
}

main().catch(console.error);
