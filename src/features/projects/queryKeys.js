export const projectKeys = {
  all: ['projects'],
  lists: ['projects', 'list'],
  list: (params) => ['projects', 'list', params],
  detail: (id) => ['projects', 'detail', id],
  members: (id) => ['projects', 'members', id],
  membersList: (id, params) => ['projects', 'members', id, params],
  deletedLists: ['projects', 'deleted'],
  deleted: (params) => ['projects', 'deleted', params]
}
