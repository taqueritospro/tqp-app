import { configDefaults, defineConfig } from 'vitest/config';

// Vite's default server conditions, plus the workspace condition that resolves
// @tqp-app/* packages to their TypeScript sources instead of their build output.
const SERVER_CONDITIONS = ['@tqp-app/source', 'module', 'node', 'development|production'];

export default defineConfig({
  ssr: { resolve: { conditions: SERVER_CONDITIONS } },
  test: { exclude: [...configDefaults.exclude, '**/dist/**', '**/build/**'] },
});
