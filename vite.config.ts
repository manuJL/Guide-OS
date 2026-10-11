import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The assistant talks to a locally running Ollama instance. Proxying through
// Vite keeps the browser same-origin (no CORS) and hides the real port.
const ollamaProxy = {
  '/api/ollama': {
    target: 'http://localhost:11434',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api\/ollama/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: ollamaProxy,
  },
  preview: {
    proxy: ollamaProxy,
  },
});
