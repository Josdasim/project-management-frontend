export const taskKeys = {
  all: (projectId) => ['tasks', projectId],
  list: (projectId, params) => ['tasks', projectId, 'list', params],
  lists: (projectId) => ['tasks', projectId, 'list'],
  detail: (projectId, taskId) => ['tasks', projectId, 'detail', taskId],
  assignable: (projectId) => ['tasks', projectId, 'assignable'],
}
