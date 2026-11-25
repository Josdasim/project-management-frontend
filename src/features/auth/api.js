import { request } from '@/shared/api/client'
import { tokenStorage } from '@/shared/api/tokenStorage'

export async function login(identifier, password) {
  const tokens = await request('/auth/login', {
    method: 'POST',
    body: { identifier, password },
    auth: false,
  })
  tokenStorage.set(tokens)
  return tokens
}

export async function register({ username, email, password, first_name, last_name }) {
  const body = { username, email, password, first_name }

  if (last_name) body.last_name = last_name
  return request('/auth/register', { method: 'POST', body, auth: false })
}

export function getMe() {
  return request('/auth/me')
}

export function logout(refreshToken) {
  return request('/auth/logout', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    auth: false,
  })
}

export function changePassword({ currentPassword, newPassword }) {
  return request('/auth/password', {
    method: 'PUT',
    body: { current_password: currentPassword, new_password: newPassword}
  })
}

export function changeEmail({ newEmail, currentPassword }) {
  return request('/auth/email' , {
    method: 'PATCH',
    body: { new_email: newEmail, current_password: currentPassword}
  })
}

export function deactivateAccount({ currentPassword }) {
  return request('/auth/deactivate',{
    method: 'POST',
    body: { current_password: currentPassword }
  }) 
}