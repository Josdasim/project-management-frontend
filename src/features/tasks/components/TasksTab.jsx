import { useState } from 'react'
import {
  Alert, Badge, Button, Center, Group, Loader, Pagination,
  Select, Stack, Table, Text, TextInput,
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_OPTIONS,
  STATUS_COLORS, STATUS_LABELS, STATUS_OPTIONS,
} from '../constants.js'
import { useTasks } from '../hooks/useTasks.js'
import { canCreateTask } from '../permissions.js'
import CreateTaskModal from './CreateTaskModal'

const PAGE_SIZE = 10

function TasksTab({ project }) {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 400)
  const search = debouncedSearch.trim()
  const [status, setStatus] = useState(null)
  const [priority, setPriority] = useState(null)
  const [createOpened, createModal] = useDisclosure(false)

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useTasks(
    project.id,
    { page, pageSize: PAGE_SIZE, search, status: status ?? '', priority: priority ?? '' },
  )

  const hasFilters = Boolean(search || status || priority)
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const handleSearchChange = (event) => {
    setSearchInput(event.currentTarget.value)
    setPage(1)
  }
  const handleStatusChange = (value) => {
    setStatus(value)
    setPage(1)
  }
  const handlePriorityChange = (value) => {
    setPriority(value)
    setPage(1)
  }

  const handleCreated = () => {
    setSearchInput('')
    setStatus(null)
    setPriority(null)
    setPage(1)
  }

  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <Group align="flex-end">
          <TextInput
            label="Buscar"
            placeholder="Título o descripción"
            value={searchInput}
            onChange={handleSearchChange}
            maxLength={100}
          />
          <Select
            label="Estado"
            placeholder="Todos"
            data={STATUS_OPTIONS}
            value={status}
            onChange={handleStatusChange}
            clearable
            w={160}
          />
          <Select
            label="Prioridad"
            placeholder="Todas"
            data={PRIORITY_OPTIONS}
            value={priority}
            onChange={handlePriorityChange}
            clearable
            w={150}
          />
        </Group>
        {canCreateTask(project.role) && (
          <Button onClick={createModal.open}>Nueva tarea</Button>
        )}
      </Group>

      {isPending && <Center py="xl"><Loader /></Center>}

      {isError && (
        <Alert color="red" title="No se pudieron cargar las tareas">
          {error.message}
          <Button mt="sm" size="xs" variant="light" onClick={() => refetch()}>
            Reintentar
          </Button>
        </Alert>
      )}

      {data && data.items.length === 0 && (
        <Stack align="flex-start" gap="sm">
          <Text c="dimmed">
            {hasFilters
              ? 'Ninguna tarea coincide con los filtros.'
              : 'Este proyecto todavía no tiene tareas.'}
          </Text>
          {!hasFilters && canCreateTask(project.role) && (
            <Button variant="light" onClick={createModal.open}>Crear la primera tarea</Button>
          )}
        </Stack>
      )}

      {data && data.items.length > 0 && (
        <>
          <Text size="sm" c="dimmed">
            {data.total} {data.total === 1 ? 'tarea' : 'tareas'}
          </Text>

          <Table.ScrollContainer minWidth={560}>
            <Table verticalSpacing="sm" style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tarea</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Prioridad</Table.Th>
                  <Table.Th>Responsable</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.items.map((task) => (
                  <Table.Tr key={task.id}>
                    <Table.Td maw={320}>
                      <Text fw={500} lineClamp={1}>{task.title}</Text>
                      {task.description && (
                        <Text size="xs" c="dimmed" lineClamp={1}>{task.description}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={STATUS_COLORS[task.status]}>
                        {STATUS_LABELS[task.status] ?? task.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="dot" color={PRIORITY_COLORS[task.priority]}>
                        {PRIORITY_LABELS[task.priority] ?? task.priority}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {task.assignedTo ? (
                        <Text size="sm">@{task.assignedTo}</Text>
                      ) : (
                        <Text size="sm" c="dimmed">Sin asignar</Text>
                      )}
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

      <CreateTaskModal
        projectId={project.id}
        opened={createOpened}
        onClose={createModal.close}
        onCreated={handleCreated}
      />
    </Stack>
  )
}

export default TasksTab