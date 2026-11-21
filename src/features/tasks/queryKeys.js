export const taskKeys = {
  all: (projectId) => ['tasks', projectId],
  list: (projectId, params) => ['tasks', projectId, 'list', params],
}