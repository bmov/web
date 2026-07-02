import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
  },
});
