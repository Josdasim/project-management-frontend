import {
  Alert, Badge, Button, Center, Divider, Drawer, Group,
  Loader, Select, Stack, Text, Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth } from '@/features/auth'
import { formatDate } from '@/shared/format.js'
import {
  PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS, STATUS_TRANSITIONS,
} from '../constants.js'
import { useAssignableMembers } from '../hooks/useAssignableMembers.js'
import { useTask } from '../hooks/useTask.js'
import { useAssignTask, useChangeTaskStatus } from '../hooks/useTaskMutations.js'
import {
  canAssignAnyone, canChangeStatus, canSelfAssign, canSelfUnassign, isClosed,
} from '../permissions.js'
import { personLabel, taskErrorText } from '../utils.js'

function StatusSection({ project, task, me }) {
  const changeStatus = useChangeTaskStatus(project.id)
  const allowed = canChangeStatus(project.role, task, me)

  const handleChange = async (to) => {
    try {
      await changeStatus.mutateAsync({ taskId: task.id, status: to })
      notifications.show({
        color: 'green',
        title: 'Estado actualizado',
        message: `Ahora está «${STATUS_LABELS[to]}».`,
      })
    } catch (e) {
      notifications.show({
        color: 'red',
        title: 'No se pudo cambiar el estado',
        message: taskErrorText(e, 'status'),
      })
    }
  }

  return (
    <Stack gap="xs">
      <Title order={5}>Estado</Title>
      {allowed ? (
        <Group>
          {(STATUS_TRANSITIONS[task.status] ?? []).map(({ to, label, color }) => (
            <Button
              key={to}
              size="xs"
              variant="light"
              color={color}
              loading={changeStatus.isPending && changeStatus.variables?.status === to}
              disabled={changeStatus.isPending}
              onClick={() => handleChange(to)}
            >
              {label}
            </Button>
          ))}
        </Group>
      ) : (
        <Text size="sm" c="dimmed">
          Solo el Propietario, los Administradores y la persona asignada pueden cambiar el estado.
        </Text>
      )}
    </Stack>
  )
}

function AssigneeSection({ project, task, me }) {
  const assign = useAssignTask(project.id)
  const closed = isClosed(task)
  const manager = canAssignAnyone(project.role)
  const members = useAssignableMembers(project.id, manager && !closed)

  const handleAssign = async (username) => {
    try {
      await assign.mutateAsync({ taskId: task.id, username })
      notifications.show({
        color: 'green',
        title: 'Responsable actualizado',
        message: username ? `Ahora la tiene @${username}.` : 'La tarea quedó sin responsable.',
      })
    } catch (e) {
      notifications.show({
        color: 'red',
        title: 'No se pudo cambiar el responsable',
        message: taskErrorText(e, 'assign'),
      })
    }
  }

  let options = (members.data ?? []).map((m) => ({
    value: m.username,
    label: personLabel(m),
  }))
  if (task.assignedTo && !options.some((o) => o.value === task.assignedTo)) {
    options = [{ value: task.assignedTo, label: `@${task.assignedTo}` }, ...options]
  }

  const current = task.assignedTo ? `@${task.assignedTo}` : 'Sin asignar'

  return (
    <Stack gap="xs">
      <Title order={5}>Responsable</Title>

      {closed ? (
        <>
          <Text size="sm">{current}</Text>
          <Text size="xs" c="dimmed">
            Las tareas completadas o canceladas no se pueden reasignar. Reábrela para cambiar el responsable.
          </Text>
        </>
      ) : manager ? (
        <>
          {members.isError && (
            <Alert color="red">No se pudieron cargar los miembros del proyecto.</Alert>
          )}
          <Select
            placeholder={members.isPending ? 'Cargando…' : 'Sin asignar'}
            data={options}
            value={task.assignedTo}
            onChange={(value) => handleAssign(value ?? null)}
            searchable
            clearable
            nothingFoundMessage="Ningún miembro coincide"
            disabled={members.isPending || assign.isPending}
          />
        </>
      ) : (
        <>
          <Text size="sm">{current}</Text>
          {canSelfAssign(project.role, task) && (
            <Group>
              <Button
                size="xs"
                variant="light"
                loading={assign.isPending}
                onClick={() => handleAssign(me)}
              >
                Asignármela
              </Button>
            </Group>
          )}
          {canSelfUnassign(project.role, task, me) && (
            <Group>
              <Button
                size="xs"
                variant="light"
                color="gray"
                loading={assign.isPending}
                onClick={() => handleAssign(null)}
              >
                Quitarme la tarea
              </Button>
            </Group>
          )}
        </>
      )}
    </Stack>
  )
}

function TaskDetail({ project, task }) {
  const { user } = useAuth()
  const me = user?.username

  return (
    <Stack>
      <Title order={3}>{task.title}</Title>

      <Group gap="xs">
        <Badge variant="light" color={STATUS_COLORS[task.status]}>
          {STATUS_LABELS[task.status] ?? task.status}
        </Badge>
        <Badge variant="dot" color={PRIORITY_COLORS[task.priority]}>
          {PRIORITY_LABELS[task.priority] ?? task.priority}
        </Badge>
      </Group>

      <Text
        size="sm"
        c={task.description ? undefined : 'dimmed'}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {task.description || 'Sin descripción'}
      </Text>

      <Text size="xs" c="dimmed">
        {task.createdBy ? `Creada por @${task.createdBy}` : 'Creada'} el{' '}
        {formatDate(task.createdAt)} · Actualizada el {formatDate(task.updatedAt)}
      </Text>

      <Divider />
      <StatusSection project={project} task={task} me={me} />
      <Divider />
      <AssigneeSection project={project} task={task} me={me} />
    </Stack>
  )
}

function TaskDrawer({ project, taskId, opened, onClose }) {
  const { data: task, isPending, isError, error, refetch } = useTask(project.id, taskId)
  const gone = isError && error.status === 404

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title="Detalle de la tarea"
    >
      {taskId && isPending && <Center py="xl"><Loader /></Center>}

      {gone && (
        <Stack align="flex-start">
          <Text>Esta tarea ya no está disponible.</Text>
          <Button variant="light" onClick={onClose}>Cerrar</Button>
        </Stack>
      )}

      {isError && !gone && (
        <Alert color="red" title="No se pudo cargar la tarea">
          {error.message}
          <Button mt="sm" size="xs" variant="light" onClick={() => refetch()}>
            Reintentar
          </Button>
        </Alert>
      )}

      {task && <TaskDetail project={project} task={task} />}
    </Drawer>
  )
}

export default TaskDrawer