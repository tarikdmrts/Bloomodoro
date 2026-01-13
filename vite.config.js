import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "src/main.jsx"
      },
      output: {
        entryFileNames: "assets/main.js",
        assetFileNames: "assets/[name].[ext]",
      }
    }
  }
})
