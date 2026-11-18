import { request } from "@/shared/api/client"


export function getProfile(){
    return request('/users/me')
}

export function updateProfile(changes){
    return request('/users/me', { method: 'PATCH', body: changes})
}

