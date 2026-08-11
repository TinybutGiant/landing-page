/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL?: string
  readonly VITE_AUTH_ORIGIN?: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  glob: (pattern: string, options?: { eager?: boolean; as?: string }) => Record<string, any>
}
