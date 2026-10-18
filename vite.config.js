import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // Relative base for GitHub Pages support
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('canvas-confetti')) return 'vendor-confetti';
            return 'vendor-vue';
          }
          if (id.includes('src/data/decksData.js')) {
            return 'decks-database';
          }
          if (id.includes('src/data/rulesKnowledge.js')) {
            return 'rules-knowledge';
          }
        }
      }
    }
  }
})
