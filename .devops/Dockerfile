FROM node:20-alpine AS base

FROM base AS build

RUN apk add --no-cache python3 make g++

WORKDIR /apps

# 复制 web 应用依赖并安装
WORKDIR /apps/web
COPY ../../apps/web/package.json ./
COPY ../../yarn.lock ./
RUN yarn install

# 复制 server 应用依赖并安装
WORKDIR /apps/server
COPY ../../apps/server/package.json ./
COPY ../../yarn.lock ./
RUN yarn install

# 构建 web 应用
WORKDIR /apps/web
COPY ../../apps/web ./
RUN yarn run build

# 构建 server 应用
WORKDIR /apps/server
COPY ../../apps/server ./
RUN yarn run build


FROM base AS production

RUN apk add --no-cache curl && curl -fsS https://dotenvx.sh/ | sh

WORKDIR /app

# 复制 server 应用的必要文件
COPY --from=build /apps/server/package.json ./
COPY --from=build /../../yarn.lock ./ # 注意这里也需要调整
COPY --from=build /apps/server/dist ./dist
COPY --from=build /apps/server/.env ./

# 安装 server 应用的生产依赖并清理构建工具
RUN yarn install --production --frozen-lockfile && \
  yarn cache clean && \
  apk del curl

# 复制 web 应用的构建产物
COPY --from=build /apps/web/dist ./web/dist

EXPOSE 3000
CMD ["yarn", "run", "start"]
