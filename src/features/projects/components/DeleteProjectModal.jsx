import { useState } from 'react'
import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/shared/api/client'
import { useDeleteProject } from '../hooks/useDeleteProject'

function DeleteProjectModal({ project, opened, onClose }) {
  const navigate = useNavigate()
  const deleteProject = useDeleteProject()
  const [error, setError] = useState(null)

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteProject.mutateAsync(project.id)
      notifications.show({
        color: 'green',
        title: 'Proyecto eliminado',
        message: `«${project.name}» ya no aparece en tu lista.`,
      })
      navigate('/projects', { replace: true })
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setError('Solo el Propietario puede eliminar el proyecto.')
      } else if (e instanceof ApiError && e.status === 404) {
        setError('Este proyecto ya no está disponible.')
      } else if (e instanceof ApiError && e.status === 0) {
        setError(e.message)
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
      }
    }
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Eliminar proyecto" centered>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}
        <Text size="sm">
          ¿Seguro que quieres eliminar «{project.name}»? Dejará de estar disponible para ti y para todos sus miembros.
          Sus datos se conservan y el nombre seguirá reservado.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={handleClose} disabled={deleteProject.isPending}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleDelete} loading={deleteProject.isPending}>
            Eliminar
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default DeleteProjectModal
