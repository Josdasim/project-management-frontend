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

export function transferErrorText(e){
  if (e instanceof ApiError) {
    if ( e.status === 0 ) return e.message
    if (e.status === 403) {
      return 'Solo el Propietario puede transferir el proyecto.'
    }
    if (e.status === 404){
      return 'La persona o el proyecto ya no estan disponibles'
    }
    if (e.status === 409) {
      return 'Esa persona ya tiene un proyecto con ese nombre. Cambia el nombre del proyecto en la pestaña de Resumen antes de transferir'
    }
    if (e.status === 422) {
      return 'Esa persona no puede recibir la propiedad: debe ser miembro activo del proyecto.'
    }

  }
}
