import { existsSync, mkdirSync, cpSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function getClaudeConfigDir() {
  if (process.env.CLAUDE_CONFIG_DIR) return process.env.CLAUDE_CONFIG_DIR;

  const home = homedir();
  if (!home) throw new Error('Cannot determine home directory');

  if (process.platform === 'win32') {
    return join(home, '.local', 'share', 'claude');
  }

  return join(home, '.claude');
}

function main() {
  const skillsSrc = join(ROOT, 'skills');

  if (!existsSync(skillsSrc)) {
    console.log('No skills/ directory found, skipping skill installation.');
    return;
  }

  const configDir = getClaudeConfigDir();
  const skillsDst = join(configDir, 'skills');

  mkdirSync(skillsDst, { recursive: true });

  const entries = readdirSync(skillsSrc, { withFileTypes: true })
    .filter(e => e.isDirectory() && existsSync(join(skillsSrc, e.name, 'SKILL.md')));

  for (const entry of entries) {
    const src = join(skillsSrc, entry.name);
    const dst = join(skillsDst, entry.name);
    try {
      rmSync(dst, { recursive: true, force: true });
      cpSync(src, dst, { recursive: true });
      console.log(`Installed skill: ${entry.name}`);
    } catch (e) {
      console.warn(`Warning: could not install skill "${entry.name}": ${e.message}`);
    }
  }

  console.log(`Skills installed to ${skillsDst}`);
}

main();
