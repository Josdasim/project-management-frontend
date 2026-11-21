import { Link, Outlet, useLocation } from 'react-router-dom'
import { AppShell, Avatar, Button, Container, Group, Menu, Text, Title, UnstyledButton } from '@mantine/core'
import { useAuth } from '@/features/auth'
import { APP_NAME } from '@/shared/config'

function AppLayout() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()

  const navButton = (to, label) => (
    <Button component={Link} to={to} variant={pathname.startsWith(to) ? 'light' : 'subtle'}>
      {label}
    </Button>
  )

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Group>
              <Title order={4}>{APP_NAME}</Title>
              {navButton('/projects', 'Proyectos')}
            </Group>

            <Menu position="bottom-end" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar radius="xl" size="sm" color="blue">
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Text size="sm">{user?.username}</Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item component={Link} to="/profile">
                  Mi perfil
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={signOut}>
                  Cerrar sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default AppLayout
