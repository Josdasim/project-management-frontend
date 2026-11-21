import { ApiError } from '@/shared/api/client'

export function memberDisplayName(member) {
  const name = [member.first_name, member.last_name].filter(Boolean).join(' ')
  return name || member.username
}

export function memberErrorText(e) {
  if (e instanceof ApiError) {
    if (e.status === 403) return 'No tienes permiso para hacer esto'
    if (e.status === 404) return 'La persona o el proyecto ya no estan disponibles'
    if (e.status == 0) return e.message
  }
  return 'Ocurrió un error inesperado. Intentelo de nuevo'
}
