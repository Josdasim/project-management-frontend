import { useQuery } from "@tanstack/react-query"
import { getTask } from "../api"
import { taskKeys } from "../queryKeys"

export function useTask(projectId, taskId){
    return useQuery({
        queryKey: taskKeys.detail(projectId, taskId),
        queryFn: () => getTask(projectId, taskId),
        enabled: Boolean(taskId)
    })
}