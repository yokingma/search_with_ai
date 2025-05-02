# 更简洁的基础镜像，只包含生产环境所需
FROM node:20-alpine AS base

# 构建阶段
FROM base AS build

# 安装构建所需的依赖
RUN apk add --no-cache python3 make g++

WORKDIR /apps

# 复制 web 应用的 package.json 和 yarn.lock 并安装依赖
WORKDIR /apps/web
COPY ../apps/web/package.json ./
RUN yarn install

# 复制 server 应用的 package.json 和 yarn.lock 并安装依赖
WORKDIR /apps/server
COPY ../apps/server/package.json ./
RUN yarn install

# 复制 web 应用源码并构建
WORKDIR /apps/web
COPY ../apps/web ./
RUN yarn run build

# 复制 server 应用源码并构建
WORKDIR /apps/server
COPY ../apps/server ./
RUN yarn run build


# 生产环境阶段
FROM base AS production

# 安装生产环境所需的依赖
RUN apk add --no-cache curl

# 安装 dotenvx (如果需要)
RUN curl -fsS https://dotenvx.sh/ | sh

WORKDIR /app

# 只复制 server 应用的构建产物和必要文件
COPY --from=build /apps/server/package.json ./
COPY --from=build /apps/server/yarn.lock ./
COPY --from=build /apps/server/dist ./dist
COPY --from=build /apps/server/.env ./

# 复制 web 应用的构建产物 (假设 server 需要提供静态资源服务)
COPY --from=build /apps/web/dist ./web/dist

# 安装生产环境依赖
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean && \
    apk del curl

EXPOSE 3000
CMD ["yarn", "run", "start"]
