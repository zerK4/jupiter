FROM oven/bun:alpine

WORKDIR /usr/src/app

RUN mkdir -p dbs

COPY package.json ./
COPY bun.lockb .

COPY src src
COPY tsconfig.json .

RUN bun install

COPY . .

RUN bun start

EXPOSE 3002
