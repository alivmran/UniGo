import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     
    strictPort: true,
    port: 5173,
    proxy: {  
      '/api': {
        target: 'http://backend:5000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
})