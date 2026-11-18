import { Badge, Card, Group, Text } from '@mantine/core'
import { formatDate } from '@/shared/format'
import { ROLE_LABELS } from '../constans'

function ProjectCard({ project }) {
  return (
    <Card withBorder radius="md" padding="md">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Text fw={600} lineClamp={1}>{project.name}</Text>
        <Badge variant="light">{ROLE_LABELS[project.role] ?? project.role}</Badge>
      </Group>

      <Text size="sm" c="dimmed" mt={4} lineClamp={2}>
        {project.description || 'Sin descripción'}
      </Text>

      {project.created_at && (
        <Text size="xs" c="dimmed" mt="sm">
          Creado el {formatDate(project.created_at)}
        </Text>
      )}
    </Card>
  )
}

export default ProjectCard