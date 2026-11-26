import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Anchor, AppShell, Avatar, Button, Container, Group, Menu, Text, UnstyledButton,
} from '@mantine/core'
import { useAuth } from '@/features/auth'
import ColorSchemeToggle from '@/shared/components/ColorSchemeToggle.jsx'
import { APP_NAME } from '@/shared/config.js'

function AppLayout() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const inProjects = pathname.startsWith('/projects')

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        bg="var(--mantine-primary-color-filled)"
        c="white"
        style={{ border: 'none' }}
      >
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <Group wrap="nowrap">
              <Anchor component={Link} to="/projects" c="white" fw={700} fz="lg" underline="never">
                {APP_NAME}
              </Anchor>
              <Button
                component={Link}
                to="/projects"
                variant="light"
                color="white"
                visibleFrom="sm"
              >
                Proyectos
              </Button>


            </Group>

            <Group gap="md" wrap="nowrap">
              <ColorSchemeToggle labelColor="white" />
              <Menu position="bottom-end" width={200}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="xs" wrap="nowrap">
                      <Avatar radius="xl" size="sm" variant="white">
                        {user?.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <Text size="sm" c="white" visibleFrom="sm">{user?.username}</Text>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to="/profile">Mi perfil</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" onClick={signOut}>Cerrar sesión</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg="var(--app-bg)">
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default AppLayout