import { Navigate, Outlet, useLocation } from 'react-router-dom'
import FullPageLoader from '@/shared/components/FullPageLoader'
import { useAuth } from '../useAuth'

function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from?.pathname ?? '/projects'} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
