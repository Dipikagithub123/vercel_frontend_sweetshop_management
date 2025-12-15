import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://vercel-backend-sweet-management.vercel.app',
        changeOrigin: true,
      },
    },
  },
});

