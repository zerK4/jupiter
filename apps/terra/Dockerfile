FROM oven/bun:alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb .

COPY src src
COPY tsconfig.json .

RUN bun install
RUN bun run build

COPY . .

RUN bun start

EXPOSE 3001
