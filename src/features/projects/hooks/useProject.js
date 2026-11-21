import { useQuery } from '@tanstack/react-query'
import { getProject } from '../api'
import { projectKeys } from '../queryKeys'

export function useProject(projectId) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProject(projectId),
  })
}