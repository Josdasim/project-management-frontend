import { request } from '@/shared/api/client'

const tasksPath = (projectId) => `/projects/${encodeURIComponent(projectId)}/tasks`

const usernameOf = (value) =>
  (value && typeof value === 'object' ? value.username : value) ?? null

function normalizeTask(task){
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    status: task.status,
    priority: task.priority,
    createdBy: usernameOf(task.created_by),
    assignedTo: usernameOf(task.assigned_to),
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  }
}

export async function listTasks(
  projectId,
  { page = 1, pageSize = 20, status = '', priority = '', search = '' } = {},
) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
  if (status) params.set('status', status)
  if (priority) params.set('priority', priority)
  if (search) params.set('search', search)
  const data = await request(`${tasksPath(projectId)}?${params}`)
  return { ...data, items: data.items.map(normalizeTask) }
}

export async function createTask(projectId, { title, description, priority }){
  const body = { title, priority }
  if(description) body.description = description
  const task = await request(tasksPath(projectId), { method: 'POST', body })
  return normalizeTask(task)
}

const taskPath = (projectId, taskId) =>
  `${tasksPath(projectId)}/${encodeURIComponent(taskId)}`

export async function getTask(projectId, taskId){
  return normalizeTask(await request(taskPath(projectId, taskId)))
}

export async function changeTaskStatus(projectId, taskId, status){
  const task = await request(`${taskPath(projectId, taskId)}/status`, {
    method: 'PATCH',
    body: { status },
  })
  return normalizeTask(task)
}

export async function assignTask(projectId, taskId, username){
  const task = await request(`${taskPath(projectId, taskId)}/assignee`, {
    method: 'PATCH',
    body: { assigned_to: username },
  })
  return normalizeTask(task)
}

export async function listAssignableMembers(projectId) {
  const params = new URLSearchParams({ page: '1', page_size: '100' })
  const data = await request(`/projects/${encodeURIComponent(projectId)}/members?${params}`)
  return data.items.filter((m) => m.role !== 'viewer')
}