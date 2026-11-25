import { useState } from 'react'
import { Alert, Button, Group, List, Modal, PasswordInput, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/client.js'
import { fieldErrorsFromApiError } from '@/shared/api/errors.js'
import { deactivateAccount } from '../api.js'
import { useAuth } from '../useAuth.js'

function DeactivateForm({ onClose }) {
  const { endSession } = useAuth()
  const [error, setError] = useState(null)
  const deactivate = useMutation({ mutationFn: deactivateAccount })

  const form = useForm({
    initialValues: { current_password: '' },
    validate: {
      current_password: (v) => (v ? null : 'Ingresa tu contraseña para confirmar'),
    },
  })

  const handleSubmit = async (values) => {
    setError(null)
    try {
      await deactivate.mutateAsync({ currentPassword: values.current_password })
      notifications.show({
        color: 'green',
        title: 'Cuenta desactivada',
        message: 'Se cerraron todas tus sesiones.',
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

        <Text size="sm">Antes de continuar, ten en cuenta que:</Text>
        <List size="sm" spacing="xs">
          <List.Item>Se cerrarán todas tus sesiones y no podrás volver a entrar con esta cuenta.</List.Item>
          <List.Item>La aplicación no incluye una opción para reactivarla.</List.Item>
          <List.Item>Tu usuario y tu correo quedan reservados: nadie podrá registrarlos de nuevo.</List.Item>
          <List.Item>
            Tus proyectos y sus datos se conservan, pero si eres Propietario de alguno, la
            propiedad no se transfiere sola. Si quieres que otra persona lo administre,
            transfiérela antes.
          </List.Item>
        </List>

        <PasswordInput
          label="Contraseña actual"
          autoComplete="current-password"
          data-autofocus
          {...form.getInputProps('current_password')}
        />

        <Group justify="flex-end">
          <Button
            type="button"
            variant="subtle"
            color="gray"
            onClick={onClose}
            disabled={deactivate.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" color="red" loading={deactivate.isPending}>
            Desactivar mi cuenta
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

function DeactivateAccountModal({ opened, onClose }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Desactivar cuenta" centered>
      <DeactivateForm onClose={onClose} />
    </Modal>
  )
}

export default DeactivateAccountModal