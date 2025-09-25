import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@replit/guide-form": path.resolve(__dirname, "./packages/guide-form/src/index.ts"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          ui: ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-checkbox']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "https://ahhh-yaotu.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  }
})
