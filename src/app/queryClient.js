import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => (error.status === 0 || error.status >= 500) && failureCount < 1,
      refetchOnWindowFocus: false,
    },
  },
})
