import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignTask, changeTaskStatus, deleteTask, updateTask } from '../api'
import { taskKeys } from '../queryKeys'

function useTaskMutation(projectId, mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(projectId, task.id), task)
      return queryClient.invalidateQueries({
        queryKey: taskKeys.lists(projectId),
      })
    },
    onError: () => queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) }),
  })
}

export const useChangeTaskStatus = (projectId) =>
  useTaskMutation(projectId, ({ taskId, status }) => changeTaskStatus(projectId, taskId, status))

export const useAssignTask = (projectId) =>
  useTaskMutation(projectId, ({ taskId, username }) => assignTask(projectId, taskId, username))

export const useUpdateTask = (projectId) =>
  useTaskMutation(projectId, ({ taskId, changes }) => updateTask(projectId, taskId, changes))

export function useDeleteTask(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId) => deleteTask(projectId, taskId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(projectId),
      }),
  })
}
