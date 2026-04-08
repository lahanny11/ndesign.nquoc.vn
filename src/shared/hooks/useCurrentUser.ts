import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api-client'
import type { UserProfile } from '../types/auth.types'

export function useCurrentUser() {
  return useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => apiClient.get<UserProfile>('/api/v1/me'),
    staleTime: 1000 * 60 * 5, // 5 phút
  })
}
