import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const RUNNER = path.join(import.meta.dirname, 'dev-runner.mjs');
const WAIT_TIMEOUT_MS = 5000;
const IDLE_WAIT_MS = 600;
const ENTRY_SOURCE = [
  "import { VALUE } from './value.ts';",
  'console.log(`started ${VALUE}`);',
  'setInterval(() => {}, 1000);',
  '',
].join('\n');

const valueSource = (value) => `export const VALUE = '${value}';\n`;
const countOf = (text, needle) => text.split(needle).length - 1;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const git = (cwd, ...args) =>
  execFileSync(
    'git',
    [
      '-c',
      'user.name=test',
      '-c',
      'user.email=test@example.com',
      '-c',
      'commit.gpgsign=false',
      ...args,
    ],
    { cwd, stdio: 'ignore' },
  );

describe('dev-runner', () => {
  let projectDir;
  let valuePath;
  let runner;
  let output;

  const waitForCount = async (needle, count) => {
    const deadline = Date.now() + WAIT_TIMEOUT_MS;
    while (countOf(output, needle) < count) {
      if (Date.now() > deadline)
        throw new Error(`Timed out waiting for "${needle}" x${String(count)}:\n${output}`);
      await sleep(50);
    }
  };

  const startRunner = async () => {
    runner = spawn(process.execPath, [RUNNER, 'src/main.ts', 'src'], { cwd: projectDir });
    runner.stdout.on('data', (chunk) => {
      output += chunk;
    });
    await waitForCount('started v1', 1);
  };

  beforeEach(() => {
    output = '';
    projectDir = mkdtempSync(path.join(tmpdir(), 'dev-runner-'));
    mkdirSync(path.join(projectDir, 'src'));
    writeFileSync(path.join(projectDir, 'src/main.ts'), ENTRY_SOURCE);
    valuePath = path.join(projectDir, 'src/value.ts');
    writeFileSync(valuePath, valueSource('v1'));
  });

  afterEach(async () => {
    const exited = new Promise((resolve) => runner.once('exit', resolve));
    runner.kill('SIGTERM');
    await exited;
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('restarts after an in-place save, as VS Code does by default', async () => {
    await startRunner();
    writeFileSync(valuePath, valueSource('v2'));
    await waitForCount('started v2', 1);
  });

  it('keeps restarting after saves that replace the file, as atomic editors do', async () => {
    await startRunner();
    for (const value of ['v2', 'v3']) {
      const tempPath = `${valuePath}.tmp`;
      writeFileSync(tempPath, valueSource(value));
      renameSync(tempPath, valuePath);
      await waitForCount(`started ${value}`, 1);
    }
  });

  it('restarts after a file is deleted and created again', async () => {
    await startRunner();
    unlinkSync(valuePath);
    writeFileSync(valuePath, valueSource('v2'));
    await waitForCount('started v2', 1);
  });

  it('restarts after git switch, in both directions', { timeout: 15000 }, async () => {
    git(projectDir, 'init', '-q', '-b', 'main');
    git(projectDir, 'add', '.');
    git(projectDir, 'commit', '-qm', 'v1');
    git(projectDir, 'switch', '-qc', 'other');
    writeFileSync(valuePath, valueSource('v2'));
    git(projectDir, 'commit', '-qam', 'v2');
    git(projectDir, 'switch', '-q', 'main');
    await startRunner();

    git(projectDir, 'switch', '-q', 'other');
    await waitForCount('started v2', 1);
    git(projectDir, 'switch', '-q', 'main');
    await waitForCount('started v1', 2);
  });

  it('watches directories created after start', async () => {
    await startRunner();
    const featureDir = path.join(projectDir, 'src/feature');
    mkdirSync(featureDir);
    await waitForCount('started v1', 2);
    writeFileSync(path.join(featureDir, 'feature.ts'), 'export {};\n');
    await waitForCount('started v1', 3);
  });

  it('ignores changes to files that are not TypeScript', async () => {
    await startRunner();
    writeFileSync(path.join(projectDir, 'src/notes.md'), '# notes\n');
    await sleep(IDLE_WAIT_MS);
    expect(countOf(output, 'started v1')).toBe(1);
  });
});
