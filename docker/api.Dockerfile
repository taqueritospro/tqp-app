# API image. Build context: repository root.
ARG NODE_IMAGE=node:24.21.0-trixie-slim

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

# Development: the repository is bind-mounted at /app and node --watch reloads on change.
FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace", "@tqp-app/api"]

FROM deps AS build
COPY --chown=node:node tsconfig.base.json tsconfig.json ./
COPY --chown=node:node packages/shared packages/shared
COPY --chown=node:node apps/api apps/api
RUN npm run build --workspace @tqp-app/api && rm -rf apps/api/dist/__tests__

# Cloud: compiled JavaScript and production dependencies only, owned by root and run as node.
FROM ${NODE_IMAGE} AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN npm ci --omit=dev --ignore-scripts --workspace @tqp-app/api && npm cache clean --force
COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/apps/api/dist apps/api/dist
USER node
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
