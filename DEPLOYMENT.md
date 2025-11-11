# Helcast Deployment Guide

This document outlines the deployment process for the Helcast word game application.

## Prerequisites

- Node.js 20.x or higher
- npm or compatible package manager
- A Gemini API key (for word validation)

## Deployment Options

### Option 1: Railway (Recommended)

Railway automatically detects Node.js projects and builds them using Nixpacks.

1. **Connect your GitHub repository to Railway**
2. **Set environment variables:**
   - `API_KEY`: Your Google Gemini API key
   - `PORT`: Railway will set this automatically (defaults to 8080)

3. **Railway will automatically:**
   - Run `npm install` to install dependencies
   - Run `npm run build` to build the frontend
   - Start the server with `node server.js`

The `railway.json` configuration file is included for custom build settings.

### Option 2: Docker Deployment

A Dockerfile is provided for containerized deployment.

**Build the Docker image:**
```bash
docker build -t helcast .
```

**Run the container:**
```bash
docker run -p 8080:8080 -e API_KEY=your_gemini_api_key helcast
```

### Option 3: Manual Deployment

For any Node.js hosting platform:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

Or use the combined start script:
```bash
npm start
```

## Environment Variables

- `API_KEY` - **Required**: Google Gemini API key for word validation
- `PORT` - Optional: Server port (defaults to 8080)
- `NODE_ENV` - Optional: Set to `production` for production builds

## Build Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm start` - Build and start the production server
- `npm run lint` - Run ESLint

## CI/CD

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs linting
- Builds the application
- Deploys to Railway on push to master

## Troubleshooting

### Docker Build Issues
If you encounter npm timeout errors during Docker builds, use Railway's Nixpacks builder instead, which handles Node.js projects more reliably.

### Missing Dependencies
Ensure all dependencies are installed:
```bash
npm ci  # or npm install
```

### Build Failures
Check that you have the correct Node.js version:
```bash
node --version  # Should be 20.x or higher
```

## Production Considerations

1. **Environment Variables**: Never commit API keys to the repository
2. **CORS**: The server is configured to allow all origins (`*`) - adjust for production
3. **WebSocket Support**: The application uses Socket.IO for multiplayer features
4. **Static Assets**: Built files are served from the `dist` directory
5. **Security**: Keep dependencies updated and run `npm audit` regularly
