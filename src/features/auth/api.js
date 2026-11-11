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