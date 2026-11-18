import { request } from '@/shared/api/client'

export function listProjects({ page = 1, pageSize = 20, search = ''} = {}){
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize)
    })

    if(search) params.set('search', search)
    return request(`/projects?${params}`)
}