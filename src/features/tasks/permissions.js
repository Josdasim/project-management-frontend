export const canCreateTask = (role) =>
  role === 'owner' || role === 'admin' || role === 'member'