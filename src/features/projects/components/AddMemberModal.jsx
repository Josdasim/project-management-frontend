import { useState } from 'react'
import { Alert, Button, Group, Modal, Paper, Select, Stack, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { searchUserByUsername } from '@/features/users'
import { ApiError } from '@/shared/api/client'
import { ROLE_LABELS } from '../constants'
import { useAddMember } from '../hooks/useMemberMutations'
import { assignableRoles } from '../permissions'
import { memberDisplayName } from '../utils'

function AddMemberForm({ projectId, actorRole, onAdded, onClose }) {
  const roles = assignableRoles(actorRole)
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState(null)
  const lookup = useMutation({ mutationFn: searchUserByUsername })
  const addMember = useAddMember(projectId)

  const found = lookup.data
  const notFound = lookup.error instanceof ApiError && lookup.error.status === 404
  const lookupError = lookup.isError && !notFound ? lookup.error.message : null

  const handleUsernameChange = (value) => {
    setUsername(value)
    setError(null)
    lookup.reset()
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const value = username.trim()
    if (!value) return
    setError(null)
    lookup.mutate(value)
  }

  const handleAdd = async () => {
    setError(null)
    try {
      await addMember.mutateAsync({ username: found.username, role })
      notifications.show({
        color: 'green',
        title: 'Miembro agregado',
        message: `${memberDisplayName(found)} se unió como ${ROLE_LABELS[role]}.`,
      })
      onAdded()
      onClose()
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        setError('Esa persona ya es miembro de este proyecto.')
      } else if (e instanceof ApiError && e.status === 403) {
        setError('No tienes permiso para agregar miembros con ese rol.')
      } else if (e instanceof ApiError && e.status === 404) {
        setError('Ese usuario ya no está disponible.')
      } else if (e instanceof ApiError && e.status === 0) {
        setError(e.message)
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
      }
    }
  }

  return (
    <Stack>
      <form onSubmit={handleSearch}>
        <Group align="flex-end" wrap="nowrap">
          <TextInput
            label="Nombre de usuario"
            placeholder="username"
            value={username}
            onChange={(event) => handleUsernameChange(event.currentTarget.value)}
            maxLength={30}
            data-autofocus
            style={{ flex: 1 }}
          />
          <Button type="submit" variant="light" loading={lookup.isPending}>
            Buscar
          </Button>
        </Group>
      </form>

      {notFound && <Alert color="yellow">No encontramos un usuario activo con ese nombre de usuario.</Alert>}
      {lookupError && <Alert color="red">{lookupError}</Alert>}

      {found && (
        <>
          <Paper withBorder p="sm" radius="md">
            <Text fw={500}>{memberDisplayName(found)}</Text>
            <Text size="xs" c="dimmed">
              @{found.username}
            </Text>
          </Paper>
          <Select
            label="Rol en el proyecto"
            data={roles.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
            value={role}
            onChange={(value) => setRole(value ?? 'viewer')}
            allowDeselect={false}
          />
        </>
      )}

      {error && <Alert color="red">{error}</Alert>}

      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose} disabled={addMember.isPending}>
          Cancelar
        </Button>
        <Button onClick={handleAdd} disabled={!found} loading={addMember.isPending}>
          Agregar
        </Button>
      </Group>
    </Stack>
  )
}

function AddMemberModal({ projectId, actorRole, opened, onClose, onAdded }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Agregar miembro" centered>
      <AddMemberForm projectId={projectId} actorRole={actorRole} onAdded={onAdded} onClose={onClose} />
    </Modal>
  )
}

export default AddMemberModal
