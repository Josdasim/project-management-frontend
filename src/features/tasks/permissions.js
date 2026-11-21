const same = (a, b) => Boolean(a) && Boolean(b) && a.toLowerCase() === b.toLowerCase()
const isManager = (role) => role === 'owner' || role === 'admin'

export const canCreateTask = (role) => isManager(role) || role === 'member'

export const isClosed = (task) => task.status === 'completed' || task.status === 'cancelled'

export const canChangeStatus = (role, task, me) =>
  isManager(role) || (role === 'member' && same(task.assignedTo, me))

export const canAssignAnyone = (role) => isManager(role)
export const canSelfAssign = (role, task) => role === 'member' && !task.assignedTo
export const canSelfUnassign = (role, task, me) => role === 'member' && same(task.assignedTo, me)

export const canEditTask = (role, task, me) =>
  !isClosed(task) && (isManager(role) || (role === 'member' && (same(task.createdBy, me) || same(task.assignedTo, me))))

export const canDeleteTask = (role) => isManager(role)