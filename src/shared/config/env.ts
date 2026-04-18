// src/shared/config/env.ts
// Fail-fast nếu thiếu biến môi trường bắt buộc

function getEnv(key: string, fallback?: string): string {
  // Hỗ trợ cả VITE_ (Vite) và NEXT_PUBLIC_ (Next.js)
  const viteKey  = key
  const nextKey  = key.replace('VITE_', 'NEXT_PUBLIC_')

  const value =
    (typeof import.meta !== 'undefined' &&
      (import.meta as { env?: Record<string, string> }).env?.[viteKey]) ||
    process.env[viteKey] ||
    process.env[nextKey] ||
    fallback

  if (!value) {
    throw new Error(`[env] Missing required environment variable: ${viteKey} / ${nextKey}`)
  }
  return value
}

function getEnvOptional(key: string, fallback = ''): string {
  const nextKey = key.replace('VITE_', 'NEXT_PUBLIC_')
  return (
    (typeof import.meta !== 'undefined' &&
      (import.meta as { env?: Record<string, string> }).env?.[key]) ||
    process.env[key] ||
    process.env[nextKey] ||
    fallback
  )
}

export const ENV = {
  API_URL:          getEnv('VITE_API_URL',          'http://localhost:3000/api'),
  SUPABASE_URL:     getEnv('VITE_SUPABASE_URL',     'https://placeholder.supabase.co'),
  SUPABASE_ANON_KEY:getEnv('VITE_SUPABASE_ANON_KEY','placeholder-anon-key'),
  ENABLE_MOCKING:   getEnvOptional('VITE_ENABLE_MOCKING', 'false') === 'true',
}
