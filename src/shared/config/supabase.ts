import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Supabase client — CHỈ dùng cho Auth (login/logout/refresh)
// Không dùng để lấy data — mọi request đi qua api-client.ts → backend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
