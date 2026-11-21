import { API_URL } from '../config'
import { tokenStorage } from './tokenStorage'

export class ApiError extends Error {
  constructor(status, detail) {
    super(typeof detail === 'string' ? detail : 'Error de validacion')
    this.status = status
    this.detail = detail
  }
}

let onSessionExpired = () => {}
export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler ?? (() => {})
}

async function send(path, { method = 'GET', body } = {}, token = null) {
  const headers = {}

  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }
}

async function refreshTokens() {
  const refreshToken = tokenStorage.getRefresh()

  if (!refreshToken) throw new ApiError(401, 'Sesión expirada')

  const response = await send('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  })

  if (response.ok) {
    tokenStorage.set(await response.json())
    return
  }

  if (response.status === 401 && tokenStorage.getRefresh() !== refreshToken) return

  throw new ApiError(response.status, 'Sesión expirada')
}

let refreshPromise = null
function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export async function request(path, options = {}) {
  const { auth = true } = options

  const sentToken = auth ? tokenStorage.getAccess() : null
  let response = await send(path, options, sentToken)

  if (response.status === 401 && auth && tokenStorage.getRefresh()) {
    if (tokenStorage.getAccess() === sentToken) {
      try {
        await refreshOnce()
      } catch (e) {
        if (e.status === 0) throw e
        tokenStorage.clear()
        onSessionExpired()
        throw new ApiError(401, 'Sessión expirada')
      }
    }
    response = await send(path, options, tokenStorage.getAccess())
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, data?.detail ?? 'Error inesperado')
  }
  return data
}
