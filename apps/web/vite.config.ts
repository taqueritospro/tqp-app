import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const DEV_HOST = 'tqp-app.localhost';
const DEV_PORT = 8080;
const PROXY_HTTPS_PORT = 443;

// Vite's default client conditions, plus the workspace condition that resolves
// @tqp-app/* packages to their TypeScript sources instead of their build output.
const CLIENT_CONDITIONS = ['@tqp-app/source', 'module', 'browser', 'development|production'];

export default defineConfig({
  plugins: [react()],
  resolve: { conditions: CLIENT_CONDITIONS },
  server: {
    host: true,
    port: DEV_PORT,
    strictPort: true,
    allowedHosts: [DEV_HOST],
    // The browser reaches the dev server through Caddy over HTTPS.
    hmr: { host: DEV_HOST, protocol: 'wss', clientPort: PROXY_HTTPS_PORT },
  },
  build: { outDir: 'build', emptyOutDir: true },
});
