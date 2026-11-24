import { useState } from 'react'
import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { usePurgeProject } from '../hooks/usePurgeProject.js'
import { trashErrorText } from '../utils.js'

function PurgeForm({ project, onDone, onClose }) {
  const purge = usePurgeProject()
  const [typed, setTyped] = useState('')
  const [error, setError] = useState(null)
  const matches = typed.trim() === project.name.trim()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!matches) return
    setError(null)
    try {
      await purge.mutateAsync(project.id)
      notifications.show({
        color: 'green',
        title: 'Proyecto eliminado definitivamente',
        message: `«${project.name}» ya no existe.`,
      })
      onDone()
    } catch (e) {
      setError(trashErrorText(e))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}
        <Text size="sm">
          Se borrarán definitivamente el proyecto, sus miembros y sus tareas, y el
          nombre quedará libre. 
          Esta acción no se puede deshacer.
        </Text>
        <TextInput
          label={`Escribe «${project.name}» para confirmar`}
          value={typed}
          onChange={(event) => setTyped(event.currentTarget.value)}
          data-autofocus
        />
        <Group justify="flex-end">
          <Button
            type="button"
            variant="subtle"
            color="gray"
            onClick={onClose}
            disabled={purge.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" color="red" disabled={!matches} loading={purge.isPending}>
            Eliminar definitivamente
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

function PurgeProjectModal({ project, onClose, onDone }) {
  return (
    <Modal opened={Boolean(project)} onClose={onClose} title="Eliminar definitivamente" centered>
      {project && <PurgeForm project={project} onDone={onDone} onClose={onClose} />}
    </Modal>
  )
}

export default PurgeProjectModal