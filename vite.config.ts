import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://codereview-backend-pau3.onrender.com',
      '/health-proxy': {
        target: 'https://codereview-backend-pau3.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/health-proxy/, '/health'),
      },
    }
  }
})
