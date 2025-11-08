import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths"
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,          // 0.0.0.0
    port: 5173,
    strictPort: true,    // не перескакивать на другой порт
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
})
