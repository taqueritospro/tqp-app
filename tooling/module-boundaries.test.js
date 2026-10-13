import path from 'node:path';
import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';
import { moduleBoundaries } from './module-boundaries.js';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const FIXTURES_DIR = path.join(import.meta.dirname, 'fixtures');

const boundaryLinter = new ESLint({
  cwd: ROOT_DIR,
  overrideConfigFile: true,
  ignore: false,
  overrideConfig: [
    { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser } },
    moduleBoundaries({
      files: ['tooling/fixtures/**/*.ts'],
      modulesDir: path.join(FIXTURES_DIR, 'modules'),
      coreDir: path.join(FIXTURES_DIR, 'core'),
    }),
  ],
});

const projectLinter = new ESLint({ cwd: ROOT_DIR });

const ruleIdsForFixture = async (relativePath) => {
  const [result] = await boundaryLinter.lintFiles([path.join(FIXTURES_DIR, relativePath)]);
  return result.messages.map((message) => message.ruleId);
};

const functionWithComplexity = (complexity) => {
  const branches = Array.from(
    { length: complexity - 1 },
    (_, index) => `  if (value === ${String(index)}) return ${String(index)};`,
  );
  return `export function pick(value) {\n${branches.join('\n')}\n  return -1;\n}\n`;
};

const ruleIdsForProjectCode = async (code) => {
  const filePath = path.join(ROOT_DIR, 'apps/api/src/core/complexity-sample.js');
  const [result] = await projectLinter.lintText(code, { filePath });
  return result.messages.map((message) => message.ruleId);
};

describe('module boundaries', () => {
  it('reports a module importing an internal file of another module', async () => {
    expect(await ruleIdsForFixture('modules/alpha/imports-internal-file.ts')).toEqual([
      'import-x/no-restricted-paths',
    ]);
  });

  it('allows a module to import another module through its index.ts', async () => {
    expect(await ruleIdsForFixture('modules/alpha/imports-public-index.ts')).toEqual([]);
  });

  it('reports core importing a module', async () => {
    expect(await ruleIdsForFixture('core/imports-module.ts')).toEqual([
      'import-x/no-restricted-paths',
    ]);
  });
});

describe('cyclomatic complexity', () => {
  it('reports a function with complexity 11', async () => {
    expect(await ruleIdsForProjectCode(functionWithComplexity(11))).toEqual(['complexity']);
  });

  it('allows a function with complexity 10', async () => {
    expect(await ruleIdsForProjectCode(functionWithComplexity(10))).toEqual([]);
  });
});
