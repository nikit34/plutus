import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Set VITE_BASE=/plutus/ for GitHub Pages, leave unset for subdomain root deploy
    base: env.VITE_BASE || '/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:4000',
          changeOrigin: true,
        },
        '/files': {
          target: env.VITE_API_BASE_URL || 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      globals: true,
    },
  }
})
