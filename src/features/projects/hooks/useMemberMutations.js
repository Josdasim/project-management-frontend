import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMember, changeMemberRole, leaveProject, removeMember } from '../api'
import { projectKeys } from '../queryKeys'

function useRefreshMembers(projectId) {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
}

export function useAddMember(projectId) {
  const refresh = useRefreshMembers(projectId)
  return useMutation({
    mutationFn: (data) => addMember(projectId, data),
    onSuccess: refresh,
  })
}

export function useChangeMemberRole(projectId) {
  const refresh = useRefreshMembers(projectId)
  return useMutation({
    mutationFn: ({ username, role }) => changeMemberRole(projectId, username, role),
    onSuccess: refresh,
  })
}

export function useRemoveMember(projectId) {
  const refresh = useRefreshMembers(projectId)
  return useMutation({
    mutationFn: (username) => removeMember(projectId, username),
    onSuccess: refresh,
  })
}

export function useLeaveProject(projectId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => leaveProject(projectId),
    onSuccess: () => queryClient.removeQueries({ queryKey: projectKeys.lists }),
  })
}
