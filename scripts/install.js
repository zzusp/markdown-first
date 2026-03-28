#!/usr/bin/env node

/**
 * 安装脚本 - 自动配置 Claude Code Hook
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const SETTINGS_FILE = path.join(CLAUDE_DIR, 'settings.json');
const MDF_DIR = path.join(PROJECT_ROOT, 'docs/mdf');

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
}

async function main() {
  console.log('[mdf-install] Starting...');
  
  await ensureDir(CLAUDE_DIR);
  await ensureDir(MDF_DIR);
  
  await fs.writeFile(path.join(CLAUDE_DIR, 'mdf-enabled'), 'enabled\n', 'utf-8');
  await fs.writeFile(path.join(MDF_DIR, 'changes.md'), '# Changes\n\n', 'utf-8');
  
  const hookConfig = {
    hooks: {
      Stop: [{
        matcher: '',
        hooks: [{
          type: 'command',
          command: `cd ${PROJECT_ROOT} && node src/index.js record`
        }]
      }]
    }
  };
  
  try {
    const existing = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const config = JSON.parse(existing);
    if (!config.hooks) config.hooks = {};
    if (!config.hooks.Stop) config.hooks.Stop = [];
    
    const exists = config.hooks.Stop.some(h => 
      h.hooks && h.hooks.some(g => g.command && g.command.includes('mdf'))
    );
    
    if (!exists) {
      config.hooks.Stop.push(...hookConfig.hooks.Stop);
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(config, null, 2), 'utf-8');
    }
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(hookConfig, null, 2), 'utf-8');
  }
  
  console.log('[mdf-install] Done!');
}

main().catch(console.error);
