# Stage 1: Build the React application
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./ 

# Install all dependencies with retry logic
RUN npm install --verbose || npm install --verbose || npm install --verbose --legacy-peer-deps

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with a lightweight Node.js server
FROM node:20-slim

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js .
COPY --from=builder /app/package.json .

EXPOSE 8080

CMD ["node", "server.js"]
