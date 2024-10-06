FROM node:20 AS build

COPY . /app

# RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app
RUN yarn install && yarn run build

WORKDIR /app/web
RUN yarn install && yarn run build

FROM node:20-alpine
WORKDIR /app

# 安装 curl，下载并安装 dotenvx，然后删除 curl
RUN apk add --no-cache curl && \
    curl -fsS https://dotenvx.sh/ | sh

RUN apk add --no-cache python3 make g++

# COPY .env /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/backend ./backend
COPY --from=build /app/web/build ./web/build
COPY --from=build /app/package.json ./

# RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/
RUN yarn install --production --frozen-lockfile && \
  yarn cache clean && \
  apk del curl python3 make g++

EXPOSE 3000
CMD ["yarn", "run", "start"]
