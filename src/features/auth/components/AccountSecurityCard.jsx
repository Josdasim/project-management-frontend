import { Button, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core'
import { useAuth } from '../useAuth.js'
import { useDisclosure } from '@mantine/hooks'
import ChangePasswordModal from './ChangePasswordModal.jsx'
import ChangeEmailModal from './ChangeEmailModal.jsx'


function AccountSecurityCard() {
  const { user } = useAuth()
  const [emailOpened, emailModal] = useDisclosure(false)
  const [passwordOpened, passwordModal] = useDisclosure(false)

  return (
    <Paper withBorder p="lg" radius="md" maw={560}>
      <Stack>
        <div>
          <Title order={4}>Cuenta y seguridad</Title>
          <Text c="dimmed" size="sm">Tu correo y tu contraseña.</Text>
        </div>

        <TextInput label="Correo" value={user?.email ?? ''} readOnly variant="filled" />

        <Group justify="flex-end">
          <Button variant="light" onClick={emailModal.open}>Cambiar correo</Button>
          <Button variant="light" onClick={passwordModal.open}>Cambiar contraseña</Button>
        </Group>
      </Stack>
      <>
        <ChangeEmailModal opened={emailOpened} onClose={emailModal.close} />
        <ChangePasswordModal opened={passwordOpened} onClose={passwordModal.close}/>
      </>
    </Paper>
  )
}

export default AccountSecurityCard