import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://play-jo4f.onrender.com',  // Target backend server
        changeOrigin: true,
      }
    }
  }
})
