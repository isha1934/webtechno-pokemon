FROM node:20-bookworm AS builder

WORKDIR /app

# Native deps for better-sqlite3
RUN apt-get update && apt-get install -y \
  python3 \
  build-essential \
  libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

FROM node:20-bookworm
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8000

CMD ["node", "dist/index.js"]