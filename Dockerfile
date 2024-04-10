FROM node:18

COPY package*.json /app
COPY ./web/package.json /app/web
RUN npm i yarn -g

WORKDIR /app/web
RUN yarn install && yarn run build

WORKDIR /app
RUN yarn install && yarn run build

EXPOSE 3000
CMD ["yarn", "start"]
