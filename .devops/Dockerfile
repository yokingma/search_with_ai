FROM node:20-alpine AS base

RUN corepack enable && corepack prepare yarn@3.5.1 --activate

FROM base AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy root workspace configuration
COPY package.json turbo.json yarn.lock .yarnrc.yml ./

# Copy package.json files for all workspaces
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY packages/deepresearch/package.json ./packages/deepresearch/

# Install dependencies
RUN yarn install

# Copy source code
COPY apps/web ./apps/web
COPY apps/server ./apps/server
COPY packages/deepresearch ./packages/deepresearch

# Build packages first
WORKDIR /app/packages/deepresearch
RUN yarn run build

# Build apps
WORKDIR /app/apps/web
RUN yarn run build

WORKDIR /app/apps/server
RUN yarn run build


FROM base AS production

RUN apk add --no-cache python3 make g++
RUN apk add --no-cache curl && curl -fsS https://dotenvx.sh/ | sh

WORKDIR /app

# Copy built artifacts and necessary files for runtime
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/.yarnrc.yml ./

COPY --from=build /app/apps/server/package.json ./apps/server/
COPY --from=build /app/packages/deepresearch/package.json ./packages/deepresearch/

# Copy node_modules from build stage (Yarn Berry hoists all deps to root)
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/.env ./apps/server/
COPY --from=build /app/apps/web/dist ./apps/server/web/dist
COPY --from=build /app/packages/deepresearch/dist ./packages/deepresearch/dist

# Clean up build dependencies to reduce image size
RUN apk del curl python3 make g++

WORKDIR /app/apps/server

EXPOSE 3000
CMD ["yarn", "run", "start"]
