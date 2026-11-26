import { useState } from 'react'
import { Alert, Button, Group, Paper, Stack, Text, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { ApiError } from '@/shared/api/client'
import { fieldErrorsFromApiError } from '@/shared/api/errors'
import { formatDate } from '@/shared/format'
import { useUpdateProject } from '../hooks/useUpdateProject'
import { canEditProjectDescription, canEditProjectName } from '../permissions'

function ProjectInfoView({ project, onEdit }) {
  const canEdit = canEditProjectName(project.role) || canEditProjectDescription(project.role)

  return (
    <Stack>
      <TextInput label="Nombre" value={project.name} readOnly variant="filled" />
      <Textarea
        label="Descripción"
        value={project.description ?? ''}
        placeholder="Sin descripción"
        readOnly
        variant="filled"
        autosize
        minRows={3}
        maxRows={10}
      />
      {project.created_at && (
        <Text size="xs" c="dimmed">
          Creado el {formatDate(project.created_at)}
        </Text>
      )}

      {canEdit ? (
        <Group justify="flex-end">
          <Button variant="light" onClick={onEdit}>
            Editar
          </Button>
        </Group>
      ) : (
        <Text size="sm" c="dimmed">
          Solo el Propietario y los Administradores pueden editar este proyecto.
        </Text>
      )}
    </Stack>
  )
}

function ProjectEditForm({ project, onDone }) {
  const updateProject = useUpdateProject(project.id)
  const [error, setError] = useState(null)
  const nameEditable = canEditProjectName(project.role)

  const form = useForm({
    initialValues: {
      name: project.name ?? '',
      description: project.description ?? '',
    },
    validate: {
      name: (value) => {
        const v = value.trim()
        if (!v) return 'Ingresa un nombre'
        if (v.length > 100) return 'Máximo 100 caracteres'
        return null
      },
      description: (value) => (value.trim().length > 5000 ? 'Máximo 5000 caracteres' : null),
    },
  })

  const handleSubmit = async (values) => {
    const changes = {}
    const name = values.name.trim()
    const description = values.description.trim()

    if (nameEditable && name !== project.name) changes.name = name
    if (description !== (project.description ?? '')) {
      changes.description = description || null
    }

    if (Object.keys(changes).length === 0) {
      onDone()
      return
    }

    setError(null)
    try {
      await updateProject.mutateAsync(changes)
      notifications.show({
        color: 'green',
        title: 'Proyecto actualizado',
        message: 'Se han guardado los cambios.',
      })
      onDone()
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        form.setFieldError(
          'name',
          'Ya tienes un proyecto con ese nombre. Los proyectos eliminados también lo reservan.',
        )
      } else if (e instanceof ApiError && e.status === 403) {
        setError('No tienes permiso para hacer este cambio.')
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

        <TextInput
          label="Nombre"
          description={nameEditable ? 'Hasta 100 caracteres.' : 'Solo el Propietario puede cambiar el nombre.'}
          disabled={!nameEditable}
          data-autofocus={nameEditable || undefined}
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Descripción"
          autosize
          minRows={3}
          maxRows={10}
          data-autofocus={!nameEditable || undefined}
          {...form.getInputProps('description')}
        />

        <Group justify="flex-end">
          <Button type="button" variant="subtle" color="gray" onClick={onDone} disabled={updateProject.isPending}>
            Cancelar
          </Button>
          <Button type="submit" loading={updateProject.isPending} disabled={!form.isDirty()}>
            Guardar cambios
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

function ProjectInfoCard({ project }) {
  const [editing, setEditing] = useState(false)

  return (
    <Paper withBorder p="lg" radius="md" w="100%">
      <Stack>
        <Title order={4}>Información del proyecto</Title>
        {editing ? (
          <ProjectEditForm project={project} onDone={() => setEditing(false)} />
        ) : (
          <ProjectInfoView project={project} onEdit={() => setEditing(true)} />
        )}
      </Stack>
    </Paper>
  )
}

export default ProjectInfoCard
