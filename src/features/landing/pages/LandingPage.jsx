import { Link } from 'react-router-dom'
import { Anchor, Box, Button, Container, Group, Stack,
    Card, SimpleGrid, Text, Title, ThemeIcon } from '@mantine/core'
import { APP_NAME } from '@/shared/config.js'

function LandingPage() {

  const FEATURES = [
    {
      title: 'Proyectos',
      text: 'Crea proyectos privados, busca entre los tuyos y edita su descripción. Cada proyecto solo lo ven sus miembros.',
    },
    {
      title: 'Miembros y roles',
      text: 'Agrega personas por su nombre de usuario y asígnales un rol: Propietario, Administrador, Miembro u Observador. Cada rol tiene permisos distintos.',
    },
    {
      title: 'Tareas',
      text: 'Crea tareas con prioridad, asígnalas a un responsable y cambia su estado: pendiente, en progreso, completada o cancelada. Filtra por estado, prioridad o responsable.',
    },
    {
      title: 'Papelera',
      text: 'Si eliminas un proyecto, puedes restaurarlo desde la papelera o eliminarlo definitivamente.',
    },
    ]

    const STEPS = [
            {
                title: 'Crea tu cuenta', 
                text: 'Regístrate con un nombre de usuario, un correo y una contraseña.' 
            },
            { 
                title: 'Crea un proyecto',   
                text: 'Ponle nombre y agrega a tu equipo por su nombre de usuario.' 
            },
            { 
                title: 'Organiza las tareas', 
                text: 'Crea tareas, asígnalas y cambia su estado a medida que avanzan.' 
            },
    ]

  return (
    <Box>
      <Box
        component="header"
        py="md"
        style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
      >
        <Container size="lg">
          <Group justify="space-between">
            <Title order={4}>{APP_NAME}</Title>
            <Group gap="xs">
              <Anchor href="#funciones" size="sm" visibleFrom="sm" mr="sm">
                Funciones
              </Anchor>
              <Button component={Link} to="/login" variant="subtle">Iniciar sesión</Button>
              <Button component={Link} to="/register">Crear cuenta</Button>
            </Group>
          </Group>
        </Container>
      </Box>

      <Container size="md">
        <Stack align="center" ta="center" gap="md" py={{ base: 48, sm: 96 }}>
          <Title order={1} style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Organiza tus proyectos, sus miembros y tus tareas en un solo lugar
          </Title>
          <Text c="dimmed" size="lg" maw={560}>
            Crea proyectos, elige sus integrantes con roles y permisos, y sigue el avance de cada tarea.
          </Text>
          <Group mt="sm">
            <Button component={Link} to="/register" size="lg">Crear cuenta</Button>
            <Button component={Link} to="/login" size="lg" variant="default">
              Iniciar sesión
            </Button>
          </Group>
        </Stack>
      </Container>

        <Box id="funciones" py={{ base: 48, sm: 80 }} bg="var(--mantine-color-default-hover)">
        <Container size="lg">
          <Stack gap="xl">
            <Stack gap="xs" ta="center" align="center">
              <Title order={2}>Lo que puedes hacer</Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
              {FEATURES.map((feature) => (
                <Card key={feature.title} withBorder radius="md" padding="lg">
                  <Title order={4} mb="xs">{feature.title}</Title>
                  <Text size="sm" c="dimmed">{feature.text}</Text>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
        <Box py={{ base: 48, sm: 80 }} bg="dark.8" c="white">
            <Container size="lg">
              <Stack gap="xl">
                <Title order={2} ta="center">Cómo empezar</Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                  {STEPS.map((step, index) => (
                    <Group
                    key={step.title} gap="md"
                    justify="center" align="center"
                    wrap="nowrap">
                        <ThemeIcon radius="x1" size="lg" variant="white"
                            color="blue.6" style={{ flexShrink: 0}}
                        > {index+1}</ThemeIcon>
                        <Stack gap={4} maw={280}>
                            <Text fw={600}>{step.title}</Text>
                            <Text size="sm" c="gray.4">
                                {step.text}
                            </Text>
                        </Stack>
                    </Group>
                  ))}
                </SimpleGrid>
              </Stack>
            </Container>
      </Box>

      <Container size="lg" py={{ base: 48, sm: 80 }}>
        <Stack
          align="center"
          ta="center"
          gap="md"
          p={{ base: 'xl', sm: 56 }}
          bg="var(--mantine-primary-color-filled)"
          c="white"
          style={{ borderRadius: 'var(--mantine-radius-lg)' }}
        >
          <Title order={2}>¿Listo para empezar?</Title>
          <Text maw={480}>Crea tu cuenta y organiza tu primer proyecto.</Text>
          <Group>
            <Button component={Link} to="/register" size="lg" variant="white" color="indigo">
              Crear cuenta
            </Button>
            <Button component={Link} to="/login" size="lg" variant="outline" color="white">
              Iniciar sesión
            </Button>
          </Group>
        </Stack>
      </Container>

        <Box
          component="footer"
          py="lg"
          style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
        >
          <Container size="lg">
            <Group justify="space-between">
              <Text size="sm" fw={500}>{APP_NAME}</Text>
              <Text size="xs" c="dimmed">
                Proyecto académico. Backend con FastAPI y Frontend con React.
              </Text>
            </Group>
          </Container>
        </Box>
    </Box>
  )
}

export default LandingPage