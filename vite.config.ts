import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate chunk for Framer Motion
          'framer-motion': ['framer-motion'],
          // Separate chunk for Google AI
          'google-ai': ['@google/genai'],
          // Separate chunk for Discord SDK
          'discord-sdk': ['@discord/embedded-app-sdk'],
          // Vendor chunk for other large libraries
          vendor: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb to remove warning
  },
});