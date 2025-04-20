import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    force: true,
    include: ['react', 'react-dom'],
  },
  server: {
    host: process.env.VITE_HOST || '0.0.0.0',  // Prend la valeur de VITE_HOST ou 0.0.0.0 pour déploiement externe
    port: process.env.VITE_PORT || 5173,       // Prend la valeur de VITE_PORT ou 5173
    strictPort: true,
    open: process.env.VITE_ENV !== 'local',  // N'ouvre pas automatiquement en local
  },
});
