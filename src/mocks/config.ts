// src/mocks/config.ts
import { supabase } from '@shared/config/supabase'
import { MOCK_PERSONS, type MockPerson, MOCK_PERSONS_IDS } from './data/persons'
import { HttpResponse } from 'msw'

// ─── Fallback: nếu không có session Supabase (demo mode trên Vercel) ─────────
// → đọc role từ URL param `?role=` để chọn mock person tương ứng.
function getFallbackPersonFromUrl(): MockPerson | null {
  if (typeof window === 'undefined') return null
  const role = new URLSearchParams(window.location.search).get('role') ?? 'design_leader'
  const id =
    role === 'designer'   ? MOCK_PERSONS_IDS.designer_01 :
    role === 'orderer'    ? MOCK_PERSONS_IDS.orderer_01  :
    role === 'co_leader'  ? MOCK_PERSONS_IDS.co_leader   :
                            MOCK_PERSONS_IDS.design_leader
  return MOCK_PERSONS.find(p => p.id === id) ?? null
}

export async function getCurrentMockUserId(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.email) {
      const found = MOCK_PERSONS.find(p => p.email === session.user!.email)
      if (found) return found.id
    }
  } catch {
    // Supabase config thiếu / network error → fallback
  }
  return getFallbackPersonFromUrl()?.id ?? null
}

export async function getCurrentMockPerson(): Promise<MockPerson | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.email) {
      const found = MOCK_PERSONS.find(p => p.email === session.user!.email)
      if (found) return found
    }
  } catch {
    // Supabase config thiếu / network error → fallback
  }
  return getFallbackPersonFromUrl()
}

export const unauthorized = () => HttpResponse.json(
  { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 }
)

export const forbidden = (msg = 'Forbidden') => HttpResponse.json(
  { statusCode: 403, message: msg, error: 'Forbidden' }, { status: 403 }
)

export const notFound = (msg = 'Not found') => HttpResponse.json(
  { statusCode: 404, message: msg, error: 'Not Found' }, { status: 404 }
)

export const badRequest = (errors: string[]) => HttpResponse.json(
  { statusCode: 400, message: errors, error: 'Bad Request' }, { status: 400 }
)
