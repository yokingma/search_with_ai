FROM node:20-alpine AS base

FROM base AS build

RUN apk add --no-cache python3 make g++

WORKDIR /apps

# 复制 web 应用依赖并安装
WORKDIR /apps/web
COPY ../../apps/web/package.json ./
COPY ../../yarn.lock ./

# 将顶层 yarn.lock 复制到 /apps 目录
COPY ../../yarn.lock /apps/yarn.lock

RUN yarn install

# 复制 server 应用依赖并安装
WORKDIR /apps/server
COPY ../../apps/server/package.json ./
COPY ../../yarn.lock ./
RUN yarn install

WORKDIR /apps/web
COPY ../../apps/web ./
RUN yarn run build

WORKDIR /apps/server
COPY ../../apps/server ./
RUN yarn run build


FROM base AS production

RUN apk add --no-cache curl && curl -fsS https://dotenvx.sh/ | sh

WORKDIR /app

# 显式创建目标目录
RUN mkdir -p /app

# 调试 1: 查看 /app 目录内容
RUN echo "--- Listing /apps before COPY ---"
RUN ls -al /apps

# 复制 server 应用的必要文件 (使用绝对路径)
COPY --from=build /apps/server/package.json /app/package.json
RUN echo "--- Listing /app after package.json COPY ---"
RUN ls -al /app

COPY --from=build /apps/yarn.lock /app/yarn.lock # 从 /apps 目录复制
RUN echo "--- Listing /app after yarn.lock COPY ---"
RUN ls -al /apps

COPY --from=build /apps/server/dist /app/dist
RUN echo "--- Listing /app after dist COPY ---"
RUN ls -al /apps

COPY --from=build /apps/server/.env /app/.env
RUN echo "--- Listing /app after .env COPY ---"
RUN ls -al /apps

# 调试 2: 查看 /app 目录内容
RUN echo "--- Listing /app after all COPY ---"
RUN ls -al /apps

# 简化: 暂时注释掉 yarn install 和 web 应用复制
# 安装 server 应用的生产依赖并清理构建工具
# RUN yarn install --production --frozen-lockfile && \
#   yarn cache clean && \
#   apk del curl

# # 复制 web 应用的构建产物
# COPY --from=build /apps/web/dist ./web/dist

EXPOSE 3000
CMD ["yarn", "run", "start"]
