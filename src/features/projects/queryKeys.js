export const projectKeys = {
  all: ['projects'],
  lists: ['projects', 'list'],
  list: (params) => ['projects', 'list', params],
  detail: (id) => ['projects', 'detail', id]
}