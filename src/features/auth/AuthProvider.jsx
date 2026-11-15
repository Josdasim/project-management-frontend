import { useEffect, useState } from "react"
import { ApiError } from "@/shared/api/client"
import { tokenStorage } from "@/shared/api/tokenStorage"
import { getMe, login, logout } from "./api"
import { AuthContext } from "./authContext"

export function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [status, setStatus] = useState(() => 
        tokenStorage.getAccess() ? 'loading' : 'anonymous'
    )

    useEffect(() => {
        if(!tokenStorage.getAccess()) return
        let cancelled = false 

        getMe().then((me) =>{
            if(cancelled) return
            setUser(me)
            setStatus('authenticated')
        })
        .catch((e) => {
            if(cancelled) return
            if(e instanceof ApiError && e.status === 401) tokenStorage.clear()
            setStatus('anonymous')
        })

        return () => {
            cancelled = true
        }
    }, [])

    const signIn = async(identifier, password) => {
        await login(identifier, password)
        const me = await getMe()
        setUser(me)
        setStatus('authenticated')
    }

    const signOut = async() => {
        const refresh = tokenStorage.getRefresh()
        try{
            if(refresh) await logout(refresh)
        } catch {}
        tokenStorage.clear()
        setUser(null)
        setStatus('anonymous')
    }

    const value = { user, status, signIn, signOut }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

