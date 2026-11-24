import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProjectPermanently } from '../api.js'
import { projectKeys } from '../queryKeys.js'

export function usePurgeProject() {
  const queryClient = useQueryClient()
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: projectKeys.deletedLists })

  return useMutation({
    mutationFn: deleteProjectPermanently,
    onSuccess: refresh,
    onError: refresh,
  })
}