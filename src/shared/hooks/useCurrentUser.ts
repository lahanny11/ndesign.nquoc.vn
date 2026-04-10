import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api-client'
import type { UserProfile } from '../types/auth.types'
import { useRoleStore } from '../stores/role.store'

export function useCurrentUser() {
  const role = useRoleStore(s => s.role)

  return useQuery<UserProfile>({
    queryKey: ['me', role],
    queryFn: () => apiClient.get<UserProfile>(`/api/v1/me?role=${role}`),
    staleTime: 1000 * 60 * 5, // 5 phút
  })
}
