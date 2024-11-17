FROM node:20 AS build

WORKDIR /apps

COPY ../apps .

# RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /apps/server
RUN yarn install && yarn run build

WORKDIR /apps/web
RUN yarn install && yarn run build

FROM node:20-alpine AS production

WORKDIR /app

# 安装 curl，下载并安装 dotenvx，然后删除 curl
RUN apk add --no-cache curl && \
    curl -fsS https://dotenvx.sh/ | sh

RUN apk add --no-cache python3 make g++

COPY --from=build /apps/server/dist ./dist
COPY --from=build /apps/server/.env ./
COPY --from=build /apps/server/package.json ./
COPY --from=build /apps/web/dist ./web/dist

# RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/
RUN yarn install --production --frozen-lockfile && \
  yarn cache clean && \
  apk del curl python3 make g++

EXPOSE 3000
CMD ["yarn", "run", "start"]
