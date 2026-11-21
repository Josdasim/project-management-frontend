import { ApiError } from '@/shared/api/client'

export function personLabel(member){
  const name = [member.first_name, member.last_name].filter(Boolean).join(' ')
  return name ? `${name} (@${member.username})` : `@${member.username}`
}

export function taskErrorText(e, context){
  if (e instanceof ApiError){
    if (e.status === 0) return e.message
    if (e.status === 403) return 'No tienes permiso para hacer esto con esta tarea.'
    if (e.status === 404) return 'La tarea o el proyecto ya no están disponibles.'
    if (e.status === 409) {
      return context === 'status'
        ? 'Ese cambio de estado ya no es posible porque la tarea cambió. Ya se actualizó con su estado actual.'
        : 'Las tareas completadas o canceladas no se pueden reasignar. Reabrela primero.'
    }
    if (e.status === 422){
      return context === 'assign'
        ? 'El responsable debe ser un miembro activo que no sea Observador.'
        : 'Los datos enviados no son válidos.'
    }
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}