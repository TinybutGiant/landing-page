import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import {
  CANONICAL_PRODUCTION_API_ORIGIN,
  CANONICAL_PRODUCTION_WEB_ORIGIN,
  normalizeConfiguredOrigin,
} from './src/lib/publicOrigins'

const DEFAULT_DEV_PROXY_TARGET = 'http://127.0.0.1:5000'

function requireProductionOrigins(command: string, env: Record<string, string>) {
  if (command !== 'build') return

  const normalizedApiUrl = normalizeConfiguredOrigin(env.VITE_API_URL)
  if (normalizedApiUrl !== CANONICAL_PRODUCTION_API_ORIGIN) {
    throw new Error(
      `VITE_API_URL must be ${CANONICAL_PRODUCTION_API_ORIGIN} for production landing-page builds.`
    )
  }

  for (const name of ['VITE_AUTH_ORIGIN', 'VITE_MARKETPLACE_ORIGIN']) {
    const value = env[name]
    if (value && normalizeConfiguredOrigin(value) !== CANONICAL_PRODUCTION_WEB_ORIGIN) {
      throw new Error(
        `${name} must be ${CANONICAL_PRODUCTION_WEB_ORIGIN} for production landing-page builds.`
      )
    }
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  requireProductionOrigins(command, env)

  const devProxyTarget =
    env.YAOTU_DEV_PROXY_TARGET || env.VITE_API_URL || DEFAULT_DEV_PROXY_TARGET

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "src/components"),
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
