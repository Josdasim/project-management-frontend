import { API_URL } from "../config"
import { tokenStorage } from "./tokenStorage"

export class ApiError extends Error {
    constructor(status, detail){
        super(typeof detail === 'string' ? detail : 'Error de validacion')
        this.status = status
        this.detail = detail
    }
}

export async function request(path, { method = 'GET', body, auth = true } = {}){
    const headers = {}

    if(body !== undefined) headers['Content-Type'] = 'application/json'

    const token = tokenStorage.getAccess()
    if (auth && token) headers.Authorization = `Bearer ${token}`

    let response
    try{
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined 
        })
    } catch {
        throw new ApiError(0, "No se pudo conectar con el servidor")  
    }
    
    if(response.status === 204) return null

    const data = await response.json().catch(() => null)
    if(!response.ok){
        throw new ApiError(response.status, data?.detail ?? 'Error inesperado')
    }
    return data
}