// Development-only runner for the API: restarts the Node process when a .ts file changes.
// Unlike node --watch, it watches directories instead of files, so saves that replace the
// file (atomic writes, git switch, git pull) keep being detected. Never part of an image.
import { spawn } from 'node:child_process';
import { readdirSync, statSync, watch } from 'node:fs';
import path from 'node:path';

const DEBOUNCE_MS = 150;
const WATCHED_EXTENSION = '.ts';

const [entry, ...watchDirs] = process.argv.slice(2);

if (!entry || watchDirs.length === 0) {
  console.error('Usage: node tooling/dev-runner.mjs <entry.ts> <dir> [dir...]');
  process.exit(1);
}

const watchers = new Map();
let child;
let debounceTimer;

const start = () => {
  child = spawn(process.execPath, ['--conditions=@tqp-app/source', entry], { stdio: 'inherit' });
};

const isRunning = () => child.exitCode === null && child.signalCode === null;

const restart = (changedPath) => {
  console.info(`[dev-runner] ${changedPath} changed, restarting`);
  if (!isRunning()) {
    start();
    return;
  }
  child.once('exit', start);
  child.kill('SIGTERM');
};

const scheduleRestart = (changedPath) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    restart(changedPath);
  }, DEBOUNCE_MS);
};

const isDirectory = (target) => statSync(target, { throwIfNoEntry: false })?.isDirectory() === true;

const watchTree = (dir) => {
  if (watchers.has(dir)) return;
  const watcher = watch(dir, (_eventType, fileName) => {
    if (!fileName) return;
    const changedPath = path.join(dir, fileName);
    const isNewDirectory = !watchers.has(changedPath) && isDirectory(changedPath);
    if (isNewDirectory) watchTree(changedPath);
    if (isNewDirectory || fileName.endsWith(WATCHED_EXTENSION)) scheduleRestart(changedPath);
  });
  // A removed directory ends its watcher; it is watched again if it reappears.
  watcher.on('error', () => {
    watcher.close();
    watchers.delete(dir);
  });
  watchers.set(dir, watcher);
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    if (dirent.isDirectory()) watchTree(path.join(dir, dirent.name));
  }
};

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    child.kill(signal);
    process.exit(0);
  });
}

watchDirs.forEach(watchTree);
start();
