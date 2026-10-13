// Copies the root certificate of Caddy's local CA to docker/.local/ and prints how to
// trust it on Fedora (system store, also used by Google Chrome) and how to remove it.
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const CA_SOURCE = 'caddy:/data/caddy/pki/authorities/local/root.crt';
const CA_TARGET = 'docker/.local/caddy-root.crt';

mkdirSync(path.join(ROOT_DIR, 'docker/.local'), { recursive: true });

const result = spawnSync(
  'docker',
  ['compose', '--env-file', '.env', '-f', 'docker/compose.yaml', 'cp', CA_SOURCE, CA_TARGET],
  { cwd: ROOT_DIR, stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('Could not copy the CA. Start the environment first: npm run env:dev');
  process.exit(1);
}

console.info(`
Caddy root certificate exported to ${CA_TARGET}

Trust it (system store, used by Google Chrome on Fedora through p11-kit):
  sudo trust anchor --store ${CA_TARGET}

Remove it later:
  sudo trust anchor --remove ${CA_TARGET}
  If that file was regenerated, find the old entry with
  "trust list --filter=ca-anchors | grep -B2 -A2 Caddy" and remove it by its pkcs11: URI.

Verify in Google Chrome:
  1. Restart Chrome completely (open chrome://restart).
  2. Open https://tqp-app.localhost and https://api.tqp-app.localhost: no warning appears.
  3. Click the site information icon > "Connection is secure" > "Certificate is valid":
     the root is "Caddy Local Authority".
`);
