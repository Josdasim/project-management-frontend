import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '../api'
import { projectKeys } from '../queryKeys'

export function useUpdateProject(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (changes) => updateProject(projectId, changes),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: projectKeys.lists })
      return queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectId),
      })
    },
  })
}
