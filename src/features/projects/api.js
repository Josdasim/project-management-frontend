import { request } from '@/shared/api/client'

export function listProjects({ page = 1, pageSize = 20, search = ''} = {}){
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize)
    })

    if(search) params.set('search', search)
    return request(`/projects?${params}`)
}

export function createProject({ name, description}){
    const body = { name }
    
    if(description) body.description = description
    
    return request('/projects', { method: 'POST', body})
}

export function getProject(projectId) {
  return request(`/projects/${encodeURIComponent(projectId)}`)
}

export function updateProject(projectId, changes) {
  return request(`/projects/${encodeURIComponent(projectId)}`, {
    method: 'PATCH',
    body: changes,
  })
}

export function deleteProject(projectId) {
  return request(`/projects/${encodeURIComponent(projectId)}`, { method: 'DELETE' })
}



//Members

const membersPath = (projectId) => `/projects/${encodeURIComponent(projectId)}/members`

export function listMembers(projectId, { page = 1, pageSize = 20, search = '', role = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
  if (search) params.set('search', search)
  if (role) params.set('role', role)
  return request(`${membersPath(projectId)}?${params}`)
}

export function addMember(projectId, { username, role }) {
  return request(membersPath(projectId), { method: 'POST', body: { username, role } })
}

export function changeMemberRole(projectId, username, role) {
  return request(`${membersPath(projectId)}/${encodeURIComponent(username)}`, {
    method: 'PATCH',
    body: { role },
  })
}

export function removeMember(projectId, username) {
  return request(`${membersPath(projectId)}/${encodeURIComponent(username)}`, { method: 'DELETE' })
}

export function leaveProject(projectId) {
  return request(`${membersPath(projectId)}/me`, { method: 'DELETE' })
}

