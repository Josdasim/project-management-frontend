import { useState } from 'react'
import { Alert, Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { ApiError } from '@/shared/api/client'
import { fieldErrorsFromApiError } from '@/shared/api/errors'
import { updateProfile } from '../api'

const toFormValues = (p) => ({
  first_name: p.first_name ?? '',
  last_name: p.last_name ?? '',
})

function ProfileForm({ profile }) {
  const [saved, setSaved] = useState(profile)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const form = useForm({
    initialValues: toFormValues(profile),
    validate: {
      first_name: (value) => (value.trim() ? null : 'Ingresa tu nombre'),
    },
  })

  const showSaved = (p) => {
    const values = toFormValues(p)
    form.setValues(values)
    form.resetDirty(values)
    form.clearErrors()
  }

  const startEditing = () => {
    setError(null)
    setEditing(true)
  }

  const cancelEditing = () => {
    showSaved(saved)
    setError(null)
    setEditing(false)
  }

  const handleSubmit = async (values) => {
    const changes = {}
    const firstName = values.first_name.trim()
    const lastName = values.last_name.trim()

    if (firstName !== saved.first_name) changes.first_name = firstName
    if (lastName !== (saved.last_name ?? '')) changes.last_name = lastName || null

    if (Object.keys(changes).length === 0) {
      showSaved(saved)
      setEditing(false)
      return
    }

    setError(null)
    setSaving(true)
    try {
      const updated = await updateProfile(changes)
      setSaved(updated)
      showSaved(updated)
      setEditing(false)
      notifications.show({
        color: 'green',
        title: 'Perfil actualizado',
        message: 'Se han guardado los cambios.',
      })
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
        const fieldErrors = fieldErrorsFromApiError(e)
        if (Object.keys(fieldErrors).length > 0) form.setErrors(fieldErrors)
        else setError('Revisa los datos del formulario')
      } else if (e instanceof ApiError && e.status === 0) {
        setError(e.message)
      } else {
        setError('Ocurrió un error inesperado. Inténtelo de nuevamente.')
      }
    } finally {
      setSaving(false)
    }
  }

  const fieldProps = {
    readOnly: !editing,
    variant: editing ? 'default' : 'filled',
  }

  return (
    <Paper withBorder p="lg" radius="md" maw={560}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <div>
            <Title order={4}>Información personal</Title>
            <Text c="dimmed" size="sm">
              Tus datos de cuenta.
            </Text>
          </div>

          {error && <Alert color="red">{error}</Alert>}

          <TextInput
            label="Usuario"
            description="Es tu identificador público y no se puede cambiar."
            value={saved.username}
            readOnly
            variant="filled"
          />

          <Group grow align="flex-start">
            <TextInput label="Nombre" {...fieldProps} {...form.getInputProps('first_name')} />
            <TextInput label="Apellido (opcional)" {...fieldProps} {...form.getInputProps('last_name')} />
          </Group>

          <Group justify="flex-end">
            {editing ? (
              <>
                <Button
                  key="cancel"
                  type="button"
                  variant="subtle"
                  color="gray"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button key="save" type="submit" loading={saving} disabled={!form.isDirty()}>
                  Guardar cambios
                </Button>
              </>
            ) : (
              <Button key="edit" type="button" variant="light" onClick={startEditing}>
                Editar
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </Paper>
  )
}

export default ProfileForm
