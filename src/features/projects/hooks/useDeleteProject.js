import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProject } from '../api'
import { projectKeys } from '../queryKeys'

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.removeQueries({ queryKey: projectKeys.lists }),
  })
}