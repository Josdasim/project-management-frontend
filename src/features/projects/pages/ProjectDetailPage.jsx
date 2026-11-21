import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Alert, Anchor, Badge, Button, Center, Group, Loader,
  Paper, Stack, Tabs, Text, Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import DeleteProjectModal from '../components/DeleteProjectModal'
import ProjectInfoCard from '../components/ProjectInfoCard'
import { ROLE_LABELS, STATUS_LABELS } from '../constans'
import { useProject } from '../hooks/useProject'
import { canDeleteProject } from '../permissions'

const TABS = ['overview', 'members', 'tasks']

function ProjectDetailPage() {
  const { projectId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [deleteOpened, deleteModal] = useDisclosure(false)
  const { data: project, isPending, isError, error, refetch } = useProject(projectId)

  const tabParam = searchParams.get('tab')
  const tab = TABS.includes(tabParam) ? tabParam : 'overview'

  const handleTabChange = (value) => {
    setSearchParams(value === 'overview' ? {} : { tab: value }, { replace: true })
  }

  if(isPending) return <Center py="xl"><Loader /></Center>

  if(isError) {
    if (error.status === 404 || error.status === 422) {
      return (
        <Stack align="flex-start">
          <Title order={3}>Proyecto no encontrado</Title>
          <Text c="dimmed">
            No existe, fue eliminado o no eres miembro de este proyecto.
          </Text>
          <Button component={Link} to="/projects" variant="light">
            Volver a mis proyectos
          </Button>
        </Stack>
      )
    }
    return (
      <Alert color="red" title="No se pudo cargar el proyecto">
        {error.message}
        <Button mt="sm" size="xs" variant="light" onClick={() => refetch()}>
          Reintentar
        </Button>
      </Alert>
    )
  }

  return (
    <Stack>
      <Anchor component={Link} to="/projects" size="sm">← Mis proyectos</Anchor>

      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Title order={2} lineClamp={2}>{project.name}</Title>
        <Group gap="xs" wrap="nowrap">
          <Badge variant="light">{ROLE_LABELS[project.role] ?? project.role}</Badge>
          <Badge variant="dot">{STATUS_LABELS[project.status] ?? project.status}</Badge>
        </Group>
      </Group>

      <Tabs value={tab} onChange={handleTabChange} keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="overview">Resumen</Tabs.Tab>
          <Tabs.Tab value="members">Miembros</Tabs.Tab>
          <Tabs.Tab value="tasks">Tareas</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Stack>
            <ProjectInfoCard project={project} />

            {canDeleteProject(project.role) && (
              <Paper withBorder p="lg" radius="md" maw={720}>
                <Group justify="space-between" wrap="nowrap">
                  <div>
                    <Title order={5}>Eliminar proyecto</Title>
                    <Text size="sm" c="dimmed">
                      Deja de estar disponible para todos sus miembros.
                    </Text>
                  </div>
                  <Button color="red" variant="light" onClick={deleteModal.open}>
                    Eliminar
                  </Button>
                </Group>
              </Paper>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="members" pt="md">
          <Text c="dimmed">Aquí irá la gestión de miembros.</Text>
        </Tabs.Panel>

        <Tabs.Panel value="tasks" pt="md">
          <Text c="dimmed">Aquí irán las tareas.</Text>
        </Tabs.Panel>
      </Tabs>

      <DeleteProjectModal
        project={project}
        opened={deleteOpened}
        onClose={deleteModal.close}
      />
    </Stack>
  )
}

export default ProjectDetailPage