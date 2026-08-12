import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const DEFAULT_DEV_PROXY_TARGET = 'https://ahhh-yaotu.onrender.com'

function requireProductionApiUrl(command: string, apiUrl?: string) {
  if (command === 'build' && !apiUrl?.trim()) {
    throw new Error(
      'VITE_API_URL must be set for production landing-page builds so static hosting never falls back to the landing origin for /api requests.'
    )
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  requireProductionApiUrl(command, env.VITE_API_URL)

  const devProxyTarget =
    env.YAOTU_DEV_PROXY_TARGET || env.VITE_API_URL || DEFAULT_DEV_PROXY_TARGET

  return {
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
    },
    server: {
      host: '127.0.0.1',
      port: 3200,
      open: true,
      proxy: {
        "/api": {
          target: devProxyTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (requestPath) => requestPath,
        },
      },
    },
  }
})
