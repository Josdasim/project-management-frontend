import { Link } from 'react-router-dom'
import { Badge, Card, Divider, Group, Stack, Text } from '@mantine/core'
import { formatDate } from '@/shared/format.js'
import { ROLE_COLORS, ROLE_LABELS, STATUS_COLORS, STATUS_LABELS } from '../constants.js'
import classes from './ProjectCard.module.css'

function ProjectCard({ project }) {
  return (
    <Card
      component={Link}
      to={`/projects/${project.id}`}
      className={classes.card}
      withBorder
      radius="md"
      padding="md"
      h="100%"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Stack gap="xs" h="100%">
        <Group justify="space-between" wrap="nowrap">
          <Badge variant="light" size="sm" color={ROLE_COLORS[project.role]}>
            {ROLE_LABELS[project.role] ?? project.role}
          </Badge>
          <Badge variant="dot" size="sm" color={STATUS_COLORS[project.status]}>
            {STATUS_LABELS[project.status] ?? project.status}
          </Badge>
        </Group>

        <Text fw={600} size="lg" lineClamp={1}>{project.name}</Text>

        <Text
          size="sm"
          c="dimmed"
          fs={project.description ? undefined : 'italic'}
          lineClamp={2}
        >
          {project.description || 'Sin descripción'}
        </Text>

        {project.created_at && (
          <>
            <Divider mt="auto" />
            <Text size="xs" c="dimmed">Creado el {formatDate(project.created_at)}</Text>
          </>
        )}
      </Stack>
    </Card>
  )
}

export default ProjectCard