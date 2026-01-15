FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Native deps for better-sqlite3
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 \
      build-essential \
      g++ \
      make \
      libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-bullseye-slim
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8000

CMD ["node", "dist/index.js"]