FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Install system build deps required by native modules (better-sqlite3)
RUN apt-get update && \
		apt-get install -y --no-install-recommends \
			python3 \
			build-essential \
			g++ \
			make \
			libsqlite3-dev && \
		rm -rf /var/lib/apt/lists/*

# Install node deps (use npm install to regenerate lock file if it's missing)
COPY package.json package-lock.json* ./
RUN npm install

# Copy sources and build
COPY . .
RUN npm run build

FROM node:18-bullseye-slim
WORKDIR /app

# Copy built files and node_modules from builder (avoids re-compiling native modules)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000
CMD ["node", "dist/index.js"]
