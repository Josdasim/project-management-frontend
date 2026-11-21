import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listProjects } from '../api'
import { projectKeys } from '../queryKeys'

export function useProjects({ page, pageSize, search }) {
  return useQuery({
    queryKey: projectKeys.list({ page, pageSize, search }),
    queryFn: () => listProjects({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })
}
