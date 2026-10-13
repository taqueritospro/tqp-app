// Entry point for the npm env:* scripts. Requires a .env file before running anything.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const BASE_COMPOSE = ['compose', '--env-file', '.env', '-f', 'docker/compose.yaml'];
const DEV_COMPOSE = [...BASE_COMPOSE, '-f', 'docker/compose.dev.yaml'];

const COMMANDS = {
  dev: ['docker', [...DEV_COMPOSE, 'up', '-d', '--build', '--renew-anon-volumes']],
  cloud: ['docker', [...BASE_COMPOSE, 'up', '-d', '--build']],
  down: ['docker', [...DEV_COMPOSE, 'down']],
  logs: ['docker', [...DEV_COMPOSE, 'logs', '-f']],
  ca: [process.execPath, ['docker/scripts/export-ca.mjs']],
  verify: [process.execPath, ['--use-system-ca', 'docker/scripts/verify-env.mjs']],
};

const [mode, ...extraArgs] = process.argv.slice(2);
const command = mode === undefined ? undefined : COMMANDS[mode];

if (!command) {
  console.error(`Usage: node docker/scripts/env.mjs <${Object.keys(COMMANDS).join('|')}>`);
  process.exit(1);
}

if (!existsSync(path.join(ROOT_DIR, '.env'))) {
  console.error('Missing .env — run: cp .env.example .env');
  process.exit(1);
}

const [executable, args] = command;
const result = spawnSync(executable, [...args, ...extraArgs], { cwd: ROOT_DIR, stdio: 'inherit' });

process.exit(result.status ?? 1);
