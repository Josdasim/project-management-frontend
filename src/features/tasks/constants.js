export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
]

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
]

const toMap = (options) => Object.fromEntries(options.map((o) => [o.value, o.label]))
export const STATUS_LABELS = toMap(STATUS_OPTIONS)
export const PRIORITY_LABELS = toMap(PRIORITY_OPTIONS)

export const STATUS_COLORS = {
  pending: 'gray',
  in_progress: 'blue',
  completed: 'green',
  cancelled: 'red',
}

export const PRIORITY_COLORS = { low: 'gray', medium: 'blue', high: 'orange', urgent: 'red' }

export const STATUS_TRANSITIONS = {
    pending: [
        { to: 'in_progress', label: 'Iniciar'},
        { to: 'cancelled', label: 'Cancelar tarea', color: 'red'}
    ],
    in_progress: [
        { to: 'completed', label: 'Completar', color: 'green'},
        { to: 'pending', label: 'Volver a pendiente'},
        { to: 'cancelled', label: 'Cancelar tarea', color: 'red'}
    ],
    completed: [{ to: 'in_progress', label: 'Reabrir'}],
    cancelled: [{ to: 'pending', label: 'Reabrir'}]
}