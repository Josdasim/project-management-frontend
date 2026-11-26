import { useEffect, useState } from 'react'
import { Alert, Button, Center, Loader, Stack, Title } from '@mantine/core'
import { getProfile } from '../api.js'
import ProfileForm from '../components/ProfileForm'
import { AccountSecurityCard } from '@/features/auth/index.js'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    getProfile()
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = () => {
    setError(null)
    setAttempt((n) => n + 1)
  }

  return (
    <Center>
      <Stack>
        <Title order={2}>Mi perfil</Title>
        {error && (
          <Alert color="red" title="No se pudo cargar tu perfil">
            {error}
            <Button mt="sm" size="xs" variant="light" onClick={retry}>
              Reintentar
            </Button>
          </Alert>
        )}

        {!profile && !error && (
          <Center py="xl">
            <Loader />
          </Center>
        )}
        {profile && 
          <>
            <ProfileForm profile={profile} />
            <AccountSecurityCard />
          </>
        }
      </Stack>
    </Center>
  )
}

export default ProfilePage
