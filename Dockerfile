# Stage 1: Build the React application
FROM node:20-slim as builder

WORKDIR /app

COPY package*.json ./ 
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with a lightweight Node.js server
FROM node:20-slim

WORKDIR /app

# Copy only the necessary files from the builder stage
# Copy contents of dist to the root of /app
COPY --from=builder /app/dist/index.html ./index.html
COPY --from=builder /app/dist/assets ./assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js .
COPY --from=builder /app/package.json .

EXPOSE 8080

CMD ["node", "server.js"]
