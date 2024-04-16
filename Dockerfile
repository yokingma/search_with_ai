FROM node:18 AS build

COPY . /app

# RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

WORKDIR /app
RUN yarn install && yarn run build

WORKDIR /app/web
RUN yarn install && yarn run build

FROM node:18-alpine
WORKDIR /app

# Install dotenvx
RUN curl -fsS https://dotenvx.sh/ | sh

COPY .env /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/web/build ./web/build
COPY --from=build /app/package.json ./

RUN yarn install --production && yarn cache clean

EXPOSE 3000
CMD yarn run start
