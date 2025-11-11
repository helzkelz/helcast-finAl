# Dockerfile for Helcast Word Game
# Note: Railway.app can auto-detect and deploy Node.js applications without Docker
# This Dockerfile is provided as an alternative deployment method

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy source
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY server.js ./

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server.js"]
