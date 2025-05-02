# ------------------------
# 基础阶段
# ------------------------
FROM node:20-alpine AS base

# 全局复制根目录的 yarn.lock 和包管理器配置
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./

# ------------------------
# 前端构建阶段
# ------------------------
FROM base AS web-builder
RUN apk add --no-cache python3 make g++

# 安装前端依赖
WORKDIR /app/apps/web
COPY apps/web/package.json .
RUN yarn workspace web install --frozen-lockfile

# 构建前端
COPY apps/web .
RUN yarn workspace web build

# ------------------------
# 后端构建阶段
# ------------------------
FROM base AS server-builder
RUN apk add --no-cache python3 make g++

# 安装后端依赖
WORKDIR /app/apps/server
COPY apps/server/package.json .
RUN yarn workspace server install --frozen-lockfile

# 构建后端
COPY apps/server .
RUN yarn workspace server build

# ------------------------
# 生产镜像阶段
# ------------------------
FROM base AS production
RUN apk add --no-cache curl && curl -fsS https://dotenvx.sh | sh

# 仅安装后端生产依赖
WORKDIR /app/apps/server
COPY apps/server/package.json .
RUN yarn workspace server install --production --frozen-lockfile

# 复制构建产物
COPY --from=web-builder /app/apps/web/dist ./public
COPY --from=server-builder /app/apps/server/dist .
COPY apps/server/.env .

# 清理
RUN apk del curl

EXPOSE 3000
CMD ["yarn", "workspace", "server", "start"]# ------------------------
# 基础阶段
# ------------------------
FROM node:20-alpine AS base

# 全局复制根目录的 yarn.lock 和包管理器配置
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./

# ------------------------
# 前端构建阶段
# ------------------------
FROM base AS web-builder
RUN apk add --no-cache python3 make g++

# 安装前端依赖
WORKDIR /app/apps/web
COPY apps/web/package.json .
RUN yarn workspace web install --frozen-lockfile

# 构建前端
COPY apps/web .
RUN yarn workspace web build

# ------------------------
# 后端构建阶段
# ------------------------
FROM base AS server-builder
RUN apk add --no-cache python3 make g++

# 安装后端依赖
WORKDIR /app/apps/server
COPY apps/server/package.json .
RUN yarn workspace server install --frozen-lockfile

# 构建后端
COPY apps/server .
RUN yarn workspace server build

# ------------------------
# 生产镜像阶段
# ------------------------
FROM base AS production
RUN apk add --no-cache curl && curl -fsS https://dotenvx.sh | sh

# 仅安装后端生产依赖
WORKDIR /app/apps/server
COPY apps/server/package.json .
RUN yarn workspace server install --production --frozen-lockfile

# 复制构建产物
COPY --from=web-builder /app/apps/web/dist ./public
COPY --from=server-builder /app/apps/server/dist .
COPY apps/server/.env .

# 清理
RUN apk del curl

EXPOSE 3000
CMD ["yarn", "workspace", "server", "start"]
