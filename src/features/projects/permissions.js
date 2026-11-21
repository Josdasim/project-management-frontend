export const canEditProjectName = (role) => role === 'owner'
export const canEditProjectDescription = (role) => role === 'owner' || role === 'admin'
export const canDeleteProject = (role) => role === 'owner'