# Web image. Build context: repository root.
ARG NODE_IMAGE=node:24.21.0-trixie-slim
ARG CADDY_IMAGE=caddy:2.11.7-alpine

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package.json package-lock.json .npmrc ./
COPY --chown=node:node apps/api/package.json apps/api/
COPY --chown=node:node apps/web/package.json apps/web/
COPY --chown=node:node packages/shared/package.json packages/shared/
# Runs as node: the development anonymous volumes copy these directories with their owner.
# Add every new workspace here (see docker/README.md).
RUN mkdir -p apps/api/node_modules apps/web/node_modules packages/shared/node_modules
RUN npm ci --ignore-scripts

# Development: the repository is bind-mounted at /app and Vite serves with hot module replacement.
FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 8080
CMD ["npm", "run", "dev", "--workspace", "@tqp-app/web"]

FROM deps AS build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY --chown=node:node tsconfig.base.json tsconfig.json ./
COPY --chown=node:node packages/shared packages/shared
COPY --chown=node:node apps/web apps/web
RUN npm run build --workspace @tqp-app/web

# Cloud: static files served by Caddy as an unprivileged user on port 8080.
FROM ${CADDY_IMAGE} AS prod
ENV XDG_CONFIG_HOME=/tmp/caddy/config \
    XDG_DATA_HOME=/tmp/caddy/data
COPY docker/web.Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/web/build /srv
USER nobody
EXPOSE 8080
