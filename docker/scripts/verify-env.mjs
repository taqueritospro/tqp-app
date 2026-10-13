// Checks the HU-002 acceptance criteria against the running local environment.
// Run through `npm run env:verify`, which enables the system CA store (--use-system-ca).
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
const PROJECT = 'tqp-app';
const EDGE_NETWORK = `${PROJECT}_edge`;
const PROBE_IMAGE = 'node:24.21.0-trixie-slim';
const PROBE_TIMEOUT_MS = 2000;
const SERVICES = ['caddy', 'web', 'api', 'postgres', 'seaweedfs', 'mailpit', 'plantuml'];
const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1']);
// Container ports each service may publish on the host; any other service publishes none.
const ALLOWED_TARGET_PORTS = { caddy: [80, 443], mailpit: [8025], postgres: [5432] };
const INTERNAL_TARGETS = [
  ['postgres', 5432],
  ['plantuml', 8080],
  ['seaweedfs', 8333],
];
const WEB_ORIGIN = 'https://tqp-app.localhost';
const SCRIPT_SRC_PATTERN = /<script[^>]+src="(\/[^"]+)"/g;
const MODULE_IMPORT_PATTERN = /(?:from|import)\s*["'](\/[^"']+)["']/g;
const MAX_MODULES = 50;
const FETCH_TIMEOUT_MS = 15000;

const outcomes = [];

const check = (name, passed, detail = '') => {
  outcomes.push(passed);
  console.info(`${passed ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const docker = (args) => spawnSync('docker', args, { cwd: ROOT_DIR, encoding: 'utf8' });

const listContainers = () => {
  const { stdout } = docker(['compose', '-p', PROJECT, 'ps', '--all', '--format', 'json']);
  return stdout
    .split('\n')
    .filter((line) => line.trim() !== '')
    .flatMap((line) => [JSON.parse(line)].flat());
};

const checkServices = (containers) => {
  for (const service of SERVICES) {
    const container = containers.find((candidate) => candidate.Service === service);
    check(`${service} is running`, container?.State === 'running', container?.State ?? 'missing');
  }
  const postgres = containers.find((candidate) => candidate.Service === 'postgres');
  check('postgres is healthy', postgres?.Health === 'healthy', postgres?.Health ?? 'missing');
};

const describePort = (publisher) =>
  `${publisher.URL}:${String(publisher.PublishedPort)}->${String(publisher.TargetPort)}`;

const checkPublishedPorts = (containers) => {
  for (const container of containers) {
    const published = (container.Publishers ?? []).filter(
      (publisher) => publisher.PublishedPort > 0,
    );
    const allowed = ALLOWED_TARGET_PORTS[container.Service] ?? [];
    const unexpected = published.filter(
      (publisher) =>
        !LOOPBACK_ADDRESSES.has(publisher.URL) || !allowed.includes(publisher.TargetPort),
    );
    const detail = published.length === 0 ? 'none' : published.map(describePort).join(', ');
    check(
      `${container.Service} publishes only allowed loopback ports`,
      unexpected.length === 0,
      detail,
    );
  }
};

const probeScript = (host, port) => `
const socket = require('node:net').connect({ host: '${host}', port: ${String(port)}, timeout: ${String(PROBE_TIMEOUT_MS)} });
socket.on('connect', () => process.exit(0));
socket.on('timeout', () => process.exit(1));
socket.on('error', () => process.exit(1));`;

const checkIsolation = () => {
  for (const [host, port] of INTERNAL_TARGETS) {
    const outside = docker([
      'run',
      '--rm',
      '--network',
      EDGE_NETWORK,
      PROBE_IMAGE,
      'node',
      '-e',
      probeScript(host, port),
    ]);
    check(`${host}:${String(port)} is unreachable from the edge network`, outside.status === 1);

    const inside = docker([
      'compose',
      '-p',
      PROJECT,
      'exec',
      '-T',
      'api',
      'node',
      '-e',
      probeScript(host, port),
    ]);
    check(`${host}:${String(port)} is reachable from the api container`, inside.status === 0);
  }
};

const fetchCheck = async (name, url, assertResponse) => {
  try {
    const response = await fetch(url, { redirect: 'manual' });
    const [passed, detail] = await assertResponse(response);
    check(name, passed, detail);
  } catch (error) {
    check(name, false, String(error.cause?.code ?? error.cause?.message ?? error.message));
  }
};

const checkHttps = async () => {
  await fetchCheck(
    'https://tqp-app.localhost serves the web app',
    'https://tqp-app.localhost/',
    async (response) => {
      const body = await response.text();
      return [
        response.status === 200 && body.includes('id="root"'),
        `HTTP ${String(response.status)}`,
      ];
    },
  );
  await fetchCheck(
    'https://api.tqp-app.localhost serves the API',
    'https://api.tqp-app.localhost/',
    async (response) => {
      const body = await response.json();
      return [response.status === 200 && body.service === 'TQP App API', JSON.stringify(body)];
    },
  );
  await fetchCheck(
    'http://tqp-app.localhost redirects to HTTPS',
    'http://tqp-app.localhost/',
    (response) => {
      const location = response.headers.get('location') ?? '';
      return [
        response.status === 308 && location.startsWith('https://'),
        `HTTP ${String(response.status)} ${location}`,
      ];
    },
  );
};

const collectPaths = (text, pattern) => [...text.matchAll(pattern)].map((match) => match[1]);

const fetchText = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  return { status: response.status, text: response.ok ? await response.text() : '' };
};

// Follows the page's JavaScript modules the way a browser does: the page can answer 200 while
// its modules fail (for example, Vite answering 504 for dependencies it cannot prepare).
// It does not detect runtime errors inside React; rendering is covered by the e2e tests.
const checkPageModules = async () => {
  const name = `${WEB_ORIGIN} loads every JavaScript module`;
  try {
    const pending = collectPaths((await fetchText(`${WEB_ORIGIN}/`)).text, SCRIPT_SRC_PATTERN);
    const visited = new Set();
    const failures = [];
    while (pending.length > 0 && visited.size < MAX_MODULES) {
      const modulePath = pending.shift();
      if (visited.has(modulePath)) continue;
      visited.add(modulePath);
      const { status, text } = await fetchText(`${WEB_ORIGIN}${modulePath}`);
      if (status !== 200) failures.push(`${modulePath} → HTTP ${String(status)}`);
      pending.push(...collectPaths(text, MODULE_IMPORT_PATTERN));
    }
    const passed = visited.size > 0 && failures.length === 0;
    check(
      name,
      passed,
      failures.length > 0 ? failures.join(', ') : `${String(visited.size)} module(s)`,
    );
  } catch (error) {
    check(name, false, String(error.cause?.code ?? error.name));
  }
};

const containers = listContainers();
checkServices(containers);
checkPublishedPorts(containers);
checkIsolation();
await checkHttps();
await checkPageModules();

const failures = outcomes.filter((passed) => !passed).length;
console.info(failures === 0 ? '\nAll checks passed.' : `\n${String(failures)} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
