import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listTasks } from '../api'
import { taskKeys } from '../queryKeys'

export function useTasks(projectId, { page, pageSize, status, priority, search }) {
  return useQuery({
    queryKey: taskKeys.list(projectId, { page, pageSize, status, priority, search }),
    queryFn: () => listTasks(projectId, { page, pageSize, status, priority, search }),
    placeholderData: keepPreviousData,
  })
}