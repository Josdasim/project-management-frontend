import { Navigate, Outlet, useLocation } from "react-router-dom"
import FullPageLoader from "@/shared/components/FullPageLoader"
import { useAuth } from "../useAuth"

function ProtectedRoute(){
    const { status } = useAuth()
    const location = useLocation()

    if(status === 'loading') return <FullPageLoader/>
    if(status !== 'authenticated') {
        return <Navigate to="/login" replace state={{ from: location}}/>
    }
    return <Outlet/>
}

export default ProtectedRoute