# ------------------------
# 基础阶段
# ------------------------
FROM node:20-alpine AS base

# 全局工作目录
WORKDIR /app

# ------------------------
# 前端构建阶段
# ------------------------
FROM base AS web-builder

# 安装编译工具（直接使用 root 权限）
RUN apk add --no-cache python3 make g++

# 强制设置 npm/yarn registry (针对 ARM64)
RUN if [ "$(uname -m)" = "aarch64" ]; then \
    yarn config set registry https://registry.npmmirror.com; \
fi

# 复制前端配置和依赖
WORKDIR /app/apps/web
# 先移除项目级的 .yarnrc.yml (如果存在)
RUN rm -f .yarnrc.yml
COPY apps/web/package.json apps/web/yarn.lock ./

# 安装前端依赖 (带重试逻辑)
RUN attempt=1; \
    while [ $attempt -le 3 ]; do \
        echo "Attempt $attempt to install dependencies..."; \
        yarn install --frozen-lockfile && break || { \
            echo "Installation failed, retrying in 5 seconds..."; \
            sleep 5; \
            attempt=$((attempt+1)); \
        }; \
    done

# 复制前端代码并构建
COPY apps/web .
RUN yarn build

# ------------------------
# 后端构建阶段
# ------------------------
FROM base AS server-builder

# 安装编译工具（直接使用 root 权限）
RUN apk add --no-cache python3 make g++

# 复制后端配置和依赖
WORKDIR /app/apps/server
COPY apps/server/package.json apps/server/yarn.lock apps/server/.yarnrc.yml ./

# 安装后端依赖
RUN yarn install --frozen-lockfile

# 复制后端代码并构建
COPY apps/server .
RUN yarn build

# ------------------------
# 生产镜像阶段
# ------------------------
FROM base AS production

# 安装运行时依赖（直接使用 root 权限）
RUN apk add --no-cache curl && curl -fsS https://dotenvx.sh | sh

# 复制后端生产依赖
WORKDIR /app/apps/server
COPY apps/server/package.json apps/server/yarn.lock apps/server/.yarnrc.yml ./

# 安装生产依赖
RUN yarn install --production --frozen-lockfile

# 复制构建产物
COPY --from=web-builder /app/apps/web/dist ./public
COPY --from=server-builder /app/apps/server/dist .
COPY apps/server/.env .

# 创建非 root 用户并切换（安全增强）
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["yarn", "start"]
