import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    strictPort: true, // API key is restricted to port 5173
  },
  preview: {
    port: 8080,
    strictPort: true, // API key is restricted to port 8080
  },
  plugins: [react()],
})
