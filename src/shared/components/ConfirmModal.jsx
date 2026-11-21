import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'

function ConfirmModal({
  opened,
  onClose,
  title,
  message,
  confirmLabel = 'Confirmar',
  color = 'red',
  loading = false,
  error = null,
  onConfirm,
}) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}
        <Text size="sm">{message}</Text>
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button color={color} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ConfirmModal
