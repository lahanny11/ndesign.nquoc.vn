import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Supabase client — CHỈ dùng cho Auth (login/logout/refresh)
// Không dùng để lấy data — mọi request đi qua api-client.ts → backend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
