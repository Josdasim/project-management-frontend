import { Button, Center, Stack, Text, Title } from '@mantine/core'

function ServerUnreachable({ onRetry }) {
  return (
    <Center h="100vh" bg="var(--app-bg)">
      <Stack align="center" gap="xs">
        <Title order={3}>No se pudo conectar con el servidor</Title>
        <Text c="dimmed" size="sm" ta="center">
          Intentelo de nuevo mas tarde.
        </Text>
        <Button mt="sm" onClick={onRetry}>
          Reintentar
        </Button>
      </Stack>
    </Center>
  )
}

export default ServerUnreachable
