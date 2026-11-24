import { useState } from 'react'
import { Alert, Button, Group, Modal, PasswordInput, Stack, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/client.js'
import { fieldErrorsFromApiError } from '@/shared/api/errors.js'
import { changeEmail } from '../api.js'
import { useAuth } from '../useAuth.js'

function ChangeEmailForm({ onClose }) {
  const { refreshUser } = useAuth()
  const [error, setError] = useState(null)
  const change = useMutation({ mutationFn: changeEmail })

  const form = useForm({
    initialValues: { new_email: '', current_password: '' },
    validate: {
      new_email: isEmail('Correo no válido'),
      current_password: (v) => (v ? null : 'Ingresa tu contraseña actual'),
    },
  })

  const handleSubmit = async (values) => {
    setError(null)
    try {
      const result = await change.mutateAsync({
        newEmail: values.new_email.trim(),
        currentPassword: values.current_password,
      })
      notifications.show({
        color: 'green',
        title: 'Correo actualizado',
        message: `Tu correo ahora es ${result.email}.`,
      })
      refreshUser().catch(() => undefined)
      onClose()
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        form.setFieldError('new_email', 'Ese correo ya está en uso')
      } else if (e instanceof ApiError && e.status === 422) {
        if (Array.isArray(e.detail)) {
          const fieldErrors = fieldErrorsFromApiError(e)
          if (Object.keys(fieldErrors).length > 0) form.setErrors(fieldErrors)
          else setError('Revisa los datos del formulario')
        } else {
          setError(e.message)
        }
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
          label="Correo nuevo"
          autoComplete="email"
          data-autofocus
          {...form.getInputProps('new_email')}
        />
        <PasswordInput
          label="Contraseña actual"
          description="La pedimos para confirmar que eres tú."
          autoComplete="current-password"
          {...form.getInputProps('current_password')}
        />
        <Group justify="flex-end">
          <Button type="button" variant="subtle" color="gray" onClick={onClose} disabled={change.isPending}>
            Cancelar
          </Button>
          <Button type="submit" loading={change.isPending}>Cambiar correo</Button>
        </Group>
      </Stack>
    </form>
  )
}

function ChangeEmailModal({ opened, onClose }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Cambiar correo" centered>
      <ChangeEmailForm onClose={onClose} />
    </Modal>
  )
}

export default ChangeEmailModal