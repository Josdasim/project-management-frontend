import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../api'
import { taskKeys } from '../queryKeys'

export function useCreateTask(projectId){
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => createTask(projectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) }),
  })
}