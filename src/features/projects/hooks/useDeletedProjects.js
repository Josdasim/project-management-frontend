import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listDeletedProjects } from "../api";
import { projectKeys } from "../queryKeys";

export function useDeletedProjects({ page, pageSize }) {
    return useQuery({
        queryKey: projectKeys.deleted({page, pageSize}),
        queryFn: () => listDeletedProjects({ page, pageSize}),
        placeholderData: keepPreviousData
    })
}