FROM node:20-alpine AS base

FROM base AS build

RUN apk add --no-cache python3 make g++

# RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

WORKDIR /apps

COPY ../apps/web/package.json ./web/
COPY ../apps/server/package.json ./server/

WORKDIR /apps/web
RUN yarn install

WORKDIR /apps/server
RUN yarn install

WORKDIR /apps/web
COPY ../apps/web ./
RUN yarn run build

WORKDIR /apps/server
COPY ../apps/server ./
RUN yarn run build


FROM base AS production

RUN apk add --no-cache python3 make g++
RUN apk add --no-cache curl && curl -fsS https://dotenvx.sh/ | sh

# RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

WORKDIR /app

COPY --from=build /apps/server/package.json ./

RUN yarn install --production --frozen-lockfile && \
  yarn cache clean && \
  apk del curl python3 make g++

COPY --from=build /apps/server/dist ./dist
COPY --from=build /apps/server/.env ./
COPY --from=build /apps/web/dist ./web/dist

EXPOSE 3000
CMD ["yarn", "run", "start"]
