import { useState } from 'react'
import { Alert, Button, Group, Modal, PasswordInput, Stack } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/client.js'
import { fieldErrorsFromApiError } from '@/shared/api/errors.js'
import { changePassword } from '../api.js'
import { useAuth } from '../useAuth.js'

function ChangePasswordForm({ onClose }) {
  const { endSession } = useAuth()
  const [error, setError] = useState(null)
  const change = useMutation({ mutationFn: changePassword })

  const form = useForm({
    initialValues: { current_password: '', new_password: '', confirm: '' },
    validate: {
      current_password: (v) => (v ? null : 'Ingresa tu contraseña actual'),
      new_password: hasLength({ min: 12, max: 128 }, 'Debe tener entre 12 y 128 caracteres'),
      confirm: (v, values) => (v === values.new_password ? null : 'Las contraseñas no coinciden'),
    },
  })

  const handleSubmit = async (values) => {
    setError(null)
    try {
      await change.mutateAsync({
        currentPassword: values.current_password,
        newPassword: values.new_password,
      })
      notifications.show({
        color: 'green',
        title: 'Contraseña actualizada',
        message: 'Por seguridad se cerraron tus sesiones. Inicia sesión con tu nueva contraseña.',
        autoClose: 8000,
      })
      endSession()
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
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
        <PasswordInput
          label="Contraseña actual"
          autoComplete="current-password"
          data-autofocus
          {...form.getInputProps('current_password')}
        />
        <PasswordInput
          label="Contraseña nueva"
          description="Entre 12 y 128 caracteres"
          autoComplete="new-password"
          {...form.getInputProps('new_password')}
        />
        <PasswordInput
          label="Confirmar contraseña nueva"
          autoComplete="new-password"
          {...form.getInputProps('confirm')}
        />
        <Group justify="flex-end">
          <Button type="button" variant="subtle" color="gray" onClick={onClose} disabled={change.isPending}>
            Cancelar
          </Button>
          <Button type="submit" loading={change.isPending}>Cambiar contraseña</Button>
        </Group>
      </Stack>
    </form>
  )
}

function ChangePasswordModal({ opened, onClose }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Cambiar contraseña" centered>
      <ChangePasswordForm onClose={onClose} />
    </Modal>
  )
}

export default ChangePasswordModal