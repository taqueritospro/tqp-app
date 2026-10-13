# Local cloud-like environment

[Versión en español](README.md)

This directory brings up on your computer the same topology the cloud will have (RNF-29, HU-002): Caddy with HTTPS, the `tqp-app.localhost` and `api.tqp-app.localhost` subdomains, PostgreSQL 18 on its own network, S3-compatible storage with SeaweedFS, mail with Mailpit, and PlantUML.

## Requirements

- Docker Engine with Docker Compose v2, running rootful so Caddy can bind ports 80 and 443. Tested with Docker 29.8.2 and Compose v5.6.0 on Fedora 44.
- Node.js 24.21.0, as pinned in `.nvmrc`, to run the `npm run env:*` scripts.
- Ports 80, 443 and 8025 free on `127.0.0.1`, plus 5433 in development mode.

## First run

```bash
npm install                  # monorepo dependencies
cp .env.example .env         # local variables with placeholder values
npm run env:dev              # start development mode
npm run env:ca               # export Caddy's local CA and show how to trust it
sudo trust anchor --store docker/.local/caddy-root.crt
npm run env:verify           # check the acceptance criteria
```

After trusting the CA, fully restart Chrome (`chrome://restart`) and open <https://tqp-app.localhost> and <https://api.tqp-app.localhost>.

If `.env` is missing, every `env:*` script stops with `Missing .env — run: cp .env.example .env`.

## Modes

| Mode            | Command             | What runs                                                                                                                                                                                                                                 |
| --------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development     | `npm run env:dev`   | Bind-mounts the repository into the containers. Vite hot-reloads the frontend in the browser and `tooling/dev-runner.mjs` restarts the API process without restarting the container. Publishes PostgreSQL on `127.0.0.1:5433` for DBeaver |
| Simulated cloud | `npm run env:cloud` | Builds the images as in the cloud: the compiled API with production dependencies and the static frontend served by Caddy, both without root privileges. Does not publish PostgreSQL                                                       |

You can switch modes without stopping the environment: the command recreates the containers and keeps the volumes.

## Commands

| Command              | What it does                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run env:dev`    | Builds and starts development mode; recreates the containers' internal `node_modules`                          |
| `npm run env:cloud`  | Builds and starts simulated cloud mode                                                                         |
| `npm run env:down`   | Stops and removes the containers; keeps the data volumes                                                       |
| `npm run env:logs`   | Follows the logs of every service; `npm run env:logs -- api` shows only the API                                |
| `npm run env:ca`     | Exports Caddy's local CA to `docker/.local/caddy-root.crt` and prints the commands to trust or remove it       |
| `npm run env:verify` | Checks services, published ports, network isolation, HTTPS, and that the page loads all its JavaScript modules |

## Topology

| Service          | Networks                               | Host ports                                       |
| ---------------- | -------------------------------------- | ------------------------------------------------ |
| Caddy            | `edge`                                 | `127.0.0.1` and `[::1]`: 80, 443/tcp and 443/udp |
| Frontend (`web`) | `edge`                                 | None                                             |
| API              | `edge`, `data`, `services`, `mail`     | None                                             |
| PostgreSQL 18    | `data`, plus `db-admin` in development | `127.0.0.1:5433`, development only               |
| SeaweedFS        | `services`                             | None                                             |
| Mailpit          | `mail`                                 | `127.0.0.1:8025` (web UI)                        |
| PlantUML         | `services`                             | None                                             |

The `data` and `services` networks are internal: they have no internet access, and only the API can reach PostgreSQL, SeaweedFS and PlantUML. PlantUML is limited to 512 MB and its JVM heap uses at most 75 % of it.

### Isolation scope

The HU-002 criterion is met as follows: PostgreSQL and PlantUML publish no ports, except PostgreSQL on `127.0.0.1:5433` in development; every published port listens only on `127.0.0.1` or `[::1]`; and no container on another Docker network can reach them. On Linux, the host itself can reach containers' internal IPs on bridge networks. That access is out of scope by the product owner's decision, and no firewall rules are added.

## HTTPS certificates

Caddy creates a local certificate authority, "Caddy Local Authority", stored in the `caddy_data` volume.

- **Trust:** `npm run env:ca`, then `sudo trust anchor --store docker/.local/caddy-root.crt`. On Fedora, Chrome uses the system store through p11-kit.
- **Remove:** `sudo trust anchor --remove docker/.local/caddy-root.crt`. If that file was already regenerated, find the old entry with `trust list --filter=ca-anchors | grep -B2 -A2 Caddy` and remove it by its `pkcs11:` URI.
- **Verify in Chrome:** restart Chrome (`chrome://restart`) and open <https://tqp-app.localhost>; no warning should appear. In the site information icon, open "Connection is secure", then "Certificate is valid": the root is "Caddy Local Authority".
- If you delete the `caddy_data` volume, the CA changes and you must repeat these steps.

## DBeaver and Mailpit

- **DBeaver** (development only): host `127.0.0.1`, port `5433` or the value of `DB_HOST_PORT`; database, user and password from `POSTGRES_DB`, `POSTGRES_USER` and `POSTGRES_PASSWORD` in your `.env`.
- **Mailpit:** <http://127.0.0.1:8025>, in both modes. The API sends mail to `mailpit:1025`, which is not published on the host.

## Hot reload

- **Frontend:** Vite reloads the changed module in the browser through Caddy (`wss://tqp-app.localhost`).
- **API:** `tooling/dev-runner.mjs` watches `apps/api/src` and `packages/shared/src` and restarts the Node process when a `.ts` file changes. It watches directories instead of files, so it also detects saves that replace the file (atomic writes, `git switch`, `git pull`). `node --watch` stops detecting a file once it is replaced, and nodemon was discarded because of vulnerability GHSA-vfj7-8cjw-p6xm in its `braces` dependency. The runner is used only in development and never enters the production image.
- **Dependencies:** after adding or updating packages, run `npm run env:dev` again; it rebuilds the images and recreates the internal `node_modules`.
- **New workspaces:** every new workspace must be added in two places: the `RUN mkdir -p … node_modules` line in the `deps` stage of `api.Dockerfile` and `web.Dockerfile`, and the `x-source-volumes` list in `compose.dev.yaml`. If it is missing from the Dockerfiles, Docker creates its anonymous volume owned by `root` and tools that write there fail with `EACCES`; for example, Vite cannot prepare its dependencies and the page stays blank.

## Troubleshooting

| Symptom                                                                  | Likely cause and fix                                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `Missing .env — run: cp .env.example .env`                               | The `.env` file is missing; copy it from the template                                             |
| Caddy does not start: port 80 or 443 in use                              | Another service holds the port; stop it or free the port                                          |
| PostgreSQL does not start in development: port 5433 in use               | Change `DB_HOST_PORT` in `.env`                                                                   |
| Chrome shows "Your connection is not private"                            | The CA is not trusted or has changed; repeat the certificates section and restart Chrome          |
| The API cannot see a newly installed package                             | Run `npm run env:dev` to rebuild the images                                                       |
| The page is blank and the web logs show `EACCES` in `node_modules/.vite` | A workspace is missing from the `mkdir` line in the Dockerfiles; add it and run `npm run env:dev` |
