import { useState } from 'react'
import { Alert, Button, Group, Modal, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { ApiError } from '@/shared/api/client'
import { fieldErrorsFromApiError } from '@/shared/api/errors'
import { PRIORITY_OPTIONS } from '../constants'
import { useCreateTask } from '../hooks/useCreateTask'

function CreateTaskForm({ projectId, onSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const createTask = useCreateTask(projectId)

  const form = useForm({
    initialValues: { title: '', description: '', priority: 'low' },
    validate: {
      title: (value) => {
        const v = value.trim()
        if (!v) return 'Ingresa un título'
        if (v.length > 200) return 'Máximo 200 caracteres'
        return null
      },
      description: (value) => (value.trim().length > 5000 ? 'Máximo 5000 caracteres' : null),
    },
  })

  const handleSubmit = async (values) => {
    setError(null)
    try {
      const task = await createTask.mutateAsync({
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority,
      })
      notifications.show({
        color: 'green',
        title: 'Tarea creada',
        message: `«${task.title}» se agregó al proyecto.`,
      })
      onSuccess()
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setError('No tienes permiso para crear tareas en este proyecto.')
      } else if (e instanceof ApiError && e.status === 404) {
        setError('Este proyecto ya no está disponible.')
      } else if (e instanceof ApiError && e.status === 422) {
        const fieldErrors = fieldErrorsFromApiError(e)
        if (Object.keys(fieldErrors).length > 0) form.setErrors(fieldErrors)
        else setError('Revisa los datos del formulario')
      } else if (e instanceof ApiError && e.status === 0) {
        setError(e.message)
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
      }
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}

        <TextInput label="Título" description="Hasta 200 caracteres." data-autofocus {...form.getInputProps('title')} />
        <Textarea
          label="Descripción (opcional)"
          autosize
          minRows={3}
          maxRows={8}
          {...form.getInputProps('description')}
        />
        <Select label="Prioridad" data={PRIORITY_OPTIONS} allowDeselect={false} {...form.getInputProps('priority')} />

        <Group justify="flex-end">
          <Button type="button" variant="subtle" color="gray" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={createTask.isPending}>
            Crear tarea
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

function CreateTaskModal({ projectId, opened, onClose, onCreated }) {
  const handleSuccess = () => {
    onCreated()
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Nueva tarea" centered>
      <CreateTaskForm projectId={projectId} onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  )
}

export default CreateTaskModal
