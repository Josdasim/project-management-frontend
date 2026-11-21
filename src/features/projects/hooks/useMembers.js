import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listMembers } from "../api"
import { projectKeys } from "../queryKeys"


export function useMembers(projectId, {page, pageSize, search, role}){
    return useQuery({
        queryKey: projectKeys.membersList(projectId, {page, pageSize, search, role}),
        queryFn: () => listMembers(projectId, {page, pageSize, search, role}),
        placeholderData: keepPreviousData
    })
}