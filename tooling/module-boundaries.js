import { readdirSync } from 'node:fs';
import path from 'node:path';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';

const MODULE_IMPORT_MESSAGE = 'Import another module only through its index.ts.';
const CORE_IMPORT_MESSAGE = 'The platform (core) must not depend on any module.';

const listModuleNames = (modulesDir) =>
  readdirSync(modulesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

/**
 * Flat-config entry that enforces the module boundaries of the API (RNF-23):
 * a module may only import another module through its index.ts, and core may
 * not import any module. Zones are generated from the module directories, so
 * a new module is covered without editing this configuration.
 */
export function moduleBoundaries({ files, modulesDir, coreDir }) {
  const moduleZones = listModuleNames(modulesDir).map((name) => ({
    target: path.join(modulesDir, name, '**'),
    from: path.join(modulesDir, '*', '**'),
    except: [path.join(modulesDir, name, '**'), path.join(modulesDir, '*', 'index.ts')],
    message: MODULE_IMPORT_MESSAGE,
  }));
  const coreZone = {
    target: path.join(coreDir, '**'),
    from: modulesDir,
    message: CORE_IMPORT_MESSAGE,
  };

  return {
    files,
    plugins: { 'import-x': importX },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      'import-x/no-restricted-paths': ['error', { zones: [coreZone, ...moduleZones] }],
    },
  };
}
