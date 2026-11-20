import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject } from "../api"
import { projectKeys } from "../queryKeys"

export function useCreateProject(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createProject,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: projectKeys.all })
    })
}