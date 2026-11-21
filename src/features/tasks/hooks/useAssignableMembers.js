import { useQuery } from '@tanstack/react-query'
import { listAssignableMembers } from '../api'
import { taskKeys } from '../queryKeys'

export function useAssignableMembers(projectId, enabled) {
  return useQuery({
    queryKey: taskKeys.assignable(projectId),
    queryFn: () => listAssignableMembers(projectId),
    enabled,
  })
}
