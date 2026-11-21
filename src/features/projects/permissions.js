export const canEditProjectName = (role) => role === 'owner'
export const canEditProjectDescription = (role) => role === 'owner' || role === 'admin'
export const canDeleteProject = (role) => role === 'owner'

export const canAddMembers = (role) => role === 'owner' || role === 'admin'

export function assignableRoles(actorRole){
    if(actorRole === 'owner') return ['admin', 'member', 'viewer']
    if(actorRole == 'admin') return ['member', 'viewer']
    return [] 
}

export function roleChangeOptions(actorRole, target){
    if(target.role === 'owner') return []
    if(actorRole === 'owner'){
        return ['admin', 'member', 'viewer'].filter((role) => role !== target.role)
    }
    if(actorRole == 'admin'){
        return ['member', 'viewer']
    }
    return []
}


export function canRemoveMember(actorRole, target, isSelf){
    if(isSelf || target.role === 'owner') return false
    if(actorRole === 'owner') return true
    return actorRole === 'admin' && (target.role === 'member' || target.role === 'viewer')
}

export const canLeaveProject = (role) => role !== 'owner'