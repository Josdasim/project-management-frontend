import { useEffect, useState } from 'react'
import { ApiError, setSessionExpiredHandler } from '@/shared/api/client'
import { tokenStorage } from '@/shared/api/tokenStorage'
import { getMe, login, logout } from './api'
import { AuthContext } from './authContext'
import ServerUnreachable from './components/ServerUnreacheble'
import { useQueryClient } from '@tanstack/react-query'

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(() => (tokenStorage.getAccess() ? 'loading' : 'anonymous'))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.clear()
      setUser(null)
      setStatus('anonymous')
    })
    return () => setSessionExpiredHandler(null)
  }, [queryClient])

  useEffect(() => {
    if (!tokenStorage.getAccess()) return
    let cancelled = false

    getMe()
      .then((me) => {
        if (cancelled) return
        setUser(me)
        setStatus('authenticated')
      })
      .catch((e) => {
        if (cancelled) return
        if (e instanceof ApiError && (e.status === 0 || e.status >= 500)) {
          setStatus('unreachable')
          return
        }
        if (e instanceof ApiError && e.status === 401) tokenStorage.clear()
        setStatus('anonymous')
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const signIn = async (identifier, password) => {
    await login(identifier, password)
    const me = await getMe()
    setUser(me)
    setStatus('authenticated')
  }

  const signOut = async () => {
    const refresh = tokenStorage.getRefresh()
    try {
      if (refresh) await logout(refresh)
    } catch {}
    tokenStorage.clear()
    queryClient.clear()
    setUser(null)
    setStatus('anonymous')
  }

  const retry = () => {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }
  if (status === 'unreachable') return <ServerUnreachable onRetry={retry} />

  const value = { user, status, signIn, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
