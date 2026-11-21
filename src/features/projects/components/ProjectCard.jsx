import { Link } from 'react-router-dom'
import { Badge, Card, Group, Text, Stack } from '@mantine/core'
import { formatDate } from '@/shared/format'
import { ROLE_LABELS, STATUS_LABELS } from '../constants'

function ProjectCard({ project }) {
  return (
    <Card
      component={Link}
      to={`/projects/${project.id}`}
      withBorder
      radius="md"
      padding="md"
      h="100%"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Stack gap="xs" h="100%">
        <Group justify="space-between" wrap="nowrap">
          <Badge variant="light" size="sm">
            {ROLE_LABELS[project.role] ?? project.role}
          </Badge>
          <Badge variant="dot" size="sm">
            {STATUS_LABELS[project.status] ?? project.status}
          </Badge>
        </Group>

        <Text fw={600} size="lg" lineClamp={1}>
          {project.name}
        </Text>

        <Text size="sm" c="dimmed" mt={4} lineClamp={2}>
          {project.description || 'Sin descripción'}
        </Text>

        {project.created_at && (
          <Text size="xs" c="dimmed" mt="sm">
            Creado el {formatDate(project.created_at)}
          </Text>
        )}
      </Stack>
    </Card>
  )
}

export default ProjectCard
