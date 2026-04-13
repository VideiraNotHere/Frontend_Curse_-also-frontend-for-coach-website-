import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/Frontend_Curse_-also-frontend-for-coach-website-/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        offer: resolve(__dirname, 'offer.html'),
        refund: resolve(__dirname, 'refund.html'),
        consent: resolve(__dirname, 'consent.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
