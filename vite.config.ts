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
        manualChunks(id) {
          // 不要单独分离 React，否则某些懒加载模块会找不到它
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui')) return 'ui';
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) return 'utils';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'ui';
            return 'vendor';
          }
        },
      },
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "https://replit-localguide.pages.dev",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📤 Sending Request to Target:', req.method, req.url, '→', proxyReq.getHeader('host'));
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 Received Response from Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  }
})
