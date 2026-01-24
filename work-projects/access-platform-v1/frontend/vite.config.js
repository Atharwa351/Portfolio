import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  server: { 
    port: 5173,
    host: true
  },
  build: {
    target: 'esnext'
  }
})