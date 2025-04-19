import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 👉 permet d'importer avec "@/components/..." au lieu de chemins relatifs
    },
  },
  optimizeDeps: {
    force: true, // 👉 force la recompilation des modules quand ça bug
    include: ['react', 'react-dom'],
  },
  server: {
    port: 5173, // 👉 tu peux changer le port ici si besoin
    open: true, // 👉 ouvre le navigateur automatiquement
  },
});
