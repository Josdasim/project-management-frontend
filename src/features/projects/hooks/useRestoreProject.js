import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restoreProject } from '../api.js'
import { projectKeys } from '../queryKeys.js'

export function useRestoreProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: restoreProject,
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.lists })
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) })
      return queryClient.invalidateQueries({ queryKey: projectKeys.deletedLists })
    },
    onError: () => queryClient.invalidateQueries({ queryKey: projectKeys.deletedLists }),
  })
}