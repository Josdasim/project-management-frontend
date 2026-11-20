import { useState } from 'react'
import { Alert, Button, Group, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { ApiError } from '@/shared/api/client'
import { fieldErrorsFromApiError } from '@/shared/api/errors'
import { useCreateProject } from '../hooks/useCreateProject'

function CreateProjectForm({ onSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const createProject = useCreateProject()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '', description: '' },
    validate: {
      name: (value) => {
        const v = value.trim()
        if (!v) return 'Ingresa un nombre'
        if (v.length > 100) return 'Maximo 100 caracteres'
        return null
      },
      description: (value) =>
        value.trim().length > 5000 ? 'Maximo 5000 caracteres' : null,
    },
  })

  const handleSubmit = async (values) => {
    setError(null)
    try {
      const project = await createProject.mutateAsync({
        name: values.name.trim(),
        description: values.description.trim(),
      })
      notifications.show({
        color: 'green',
        title: 'Proyecto creado',
        message: `«${project.name}» ya está en tu lista.`,
      })
      onSuccess()
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        form.setFieldError(
          'name',
          'Ya tienes un proyecto con ese nombre. Los proyectos eliminados tambien lo reservan.',
        )
      } else if (e instanceof ApiError && e.status === 422) {
        const fieldErrors = fieldErrorsFromApiError(e)
        if (Object.keys(fieldErrors).length > 0) form.setErrors(fieldErrors)
        else setError('Revisa los datos del formulario')
      } else if (e instanceof ApiError && e.status === 0) {
        setError(e.message)
      } else {
        setError('Ocurrio un error inesperado. Intentelo de nuevo')
      }
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}

        <TextInput
          label="Nombre"
          description="Hasta 100 caracteres."
          data-autofocus
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Descripción (opcional)"
          autosize
          minRows={3}
          maxRows={8}
          key={form.key('description')}
          {...form.getInputProps('description')}
        />

        <Group justify="flex-end">
          <Button type="button" variant="subtle" color="gray" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={createProject.isPending}>
            Crear proyecto
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default CreateProjectForm