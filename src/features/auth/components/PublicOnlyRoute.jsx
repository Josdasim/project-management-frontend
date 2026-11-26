import { Navigate, Outlet} from 'react-router-dom'
import FullPageLoader from '@/shared/components/FullPageLoader'
import { useAuth } from '../useAuth'

function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') return <FullPageLoader />

  if (status === 'authenticated') return <Navigate to="/projects" replace />
  

  return <Outlet />
}

export default PublicOnlyRoute
