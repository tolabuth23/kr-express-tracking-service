FROM node:16.13-alpine as builder

RUN apk update

RUN apk add --no-cache git

WORKDIR /app

COPY package.json /app

RUN yarn

COPY . .

RUN yarn build

FROM node:16.13-alpine as runner

RUN apk add --no-cache git

WORKDIR /app

COPY --from=builder /app/package.json /app/package.json

RUN yarn --production

COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD [ "yarn", "start:prod"]
