import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Alert, Anchor, Button, Center, Loader, Pagination, 
  Stack, Table, Text, Title, Group
} from '@mantine/core'
import { formatDate } from '@/shared/format.js'
import { useDeletedProjects } from '../hooks/useDeletedProjects.js'
import { notifications } from '@mantine/notifications'
import { useRestoreProject } from '../hooks/useRestoreProject.js'
import { trashErrorText } from '../utils.js'
import PurgeProjectModal from '../components/PurgeProjectModal.jsx'

const PAGE_SIZE = 10

function TrashPage() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useDeletedProjects({ page, pageSize: PAGE_SIZE })

  const [toPurge, setToPurge] = useState(null) 
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const restore = useRestoreProject()

  const afterRemoval = () => {
    if (data && data.items.length === 1 && page > 1) setPage(page - 1)
  }

  const handleRestore = async (project) => {
    try {
      await restore.mutateAsync(project.id)
      notifications.show({
        color: 'green',
        title: 'Proyecto restaurado',
        message: `<<${project.name}>> volvió a tu lista de proyectos.`,
      })
      afterRemoval()
    } catch (e) {
      notifications.show({
        color: 'red',
        title: 'No se pudo restaurar',
        message: trashErrorText(e),
      })
    }
  }

  return (
    <Stack>
      <Anchor component={Link} to="/projects" size="sm">← Mis proyectos</Anchor>
      <div>
        <Title order={2}>Papelera</Title>
        <Text c="dimmed" size="sm">
          Proyectos que eliminaste. Mientras estén aquí, el nombre sigue reservado.
        </Text>
      </div>

      {isPending && <Center py="xl"><Loader /></Center>}

      {isError && (
        <Alert color="red" title="No se pudo cargar la papelera">
          {error.message}
          <Button mt="sm" size="xs" variant="light" onClick={() => refetch()}>
            Reintentar
          </Button>
        </Alert>
      )}

      {data && data.items.length === 0 && <Text c="dimmed">La papelera está vacía.</Text>}

      {data && data.items.length > 0 && (
        <>
          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Proyecto</Table.Th>
                  <Table.Th>Eliminado el</Table.Th>
                  <Table.Th/>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.items.map((project) => (
                  <Table.Tr key={project.id}>
                    <Table.Td maw={360}>
                      <Text fw={500} lineClamp={1}>{project.name}</Text>
                      {project.description && (
                        <Text size="xs" c="dimmed" lineClamp={1}>{project.description}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>{formatDate(project.deleted_at)}</Table.Td>
                    <Table.Td ta="right">
                      <Group gap="xs" justify="flex-end" wrap="nowrap">
                        <Button
                          size="xs"
                          variant="light"
                          loading={restore.isPending && restore.variables === project.id}
                          disabled={restore.isPending}
                          onClick={() => handleRestore(project)}
                        >
                          Restaurar
                        </Button>
                        <Button
                          size="xs"
                          variant="subtle"
                          color="red"
                          onClick={() => setToPurge(project)}
                        >
                          Eliminar definitivamente
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {totalPages > 1 && (
            <Pagination total={totalPages} value={page} onChange={setPage} />
          )}
        </>
      )}
        <PurgeProjectModal
        project={toPurge}
        onClose={() => setToPurge(null)}
        onDone={() => {
          setToPurge(null)
          afterRemoval()
            }}
        />
    </Stack>
  )
}

export default TrashPage