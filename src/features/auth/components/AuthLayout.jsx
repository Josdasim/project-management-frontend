import { Link } from 'react-router-dom'
import { Anchor, Box, Container, Paper, Stack, Title, Group } from '@mantine/core'
import { APP_NAME } from '@/shared/config.js'
import ColorSchemeToggle from '@/shared/components/ColorSchemeToggle'

function AuthLayout({ size = 420, subtitle, children }) {
  return (
    <Box mih="100vh" bg="var(--app-bg)" py={{ base: 32, sm: 56 }}>
      <Container size={size}>
        <Stack gap="lg">
            <Group justify="space-between">
                <Anchor component={Link} to="/" size="sm">← Volver al inicio</Anchor>
                <ColorSchemeToggle />
            </Group>

            <Stack gap={4} align="center" ta="center">
                <Title order={2} c="var(--mantine-primary-color-filled)">{APP_NAME}</Title>
                {subtitle}
            </Stack>
    
            <Paper withBorder shadow="sm" p={{ base: 'lg', sm: 30 }} radius="md">
              {children}
            </Paper>
    
          
        </Stack>
      </Container>
    </Box>
  )
}

export default AuthLayout