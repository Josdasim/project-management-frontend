import { request } from "@/shared/api/client"
import { tokenStorage } from "@/shared/api/tokenStorage"

export async function login(identifier, password){
    const tokens = await request('/auth/login',{
        method: 'POST',
        body: { identifier, password },
        auth: false
    })
    tokenStorage.set(tokens)
    return tokens
}

export async function register({ username, email, password, first_name, last_name }){
    const body = { username, email, password, first_name }

    if(last_name) body.last_name = last_name
    return request('/auth/register', {method: 'POST', body, auth: false})
}