import { useState } from 'react'
import { useForm } from '@mantine/form'
import { ApiError } from '@/shared/api/client.js'
import { Alert, Badge, Button, Center, Divider, Drawer, 
    Group, Loader, Select, Stack, Text, Title, Textarea, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth } from '@/features/auth'
import { formatDate } from '@/shared/format.js'
import { PRIORITY_COLORS, PRIORITY_LABELS, 
    STATUS_COLORS, STATUS_LABELS, STATUS_TRANSITIONS,
    PRIORITY_OPTIONS } from '../constants.js'
import { useAssignableMembers } from '../hooks/useAssignableMembers.js'
import { useTask } from '../hooks/useTask.js'
import { useAssignTask, useChangeTaskStatus,
    useDeleteTask, useUpdateTask
 } from '../hooks/useTaskMutations.js'
import { canAssignAnyone, canChangeStatus, 
    canSelfAssign, canSelfUnassign, isClosed,
    canDeleteTask, canEditTask } from '../permissions.js'
import { personLabel, taskErrorText } from '../utils.js'
import ConfirmModal from '@/shared/components/ConfirmModal.jsx'
import { fieldErrorsFromApiError } from '@/shared/api/errors.js'

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
          {members.isError && <Alert color="red">No se pudieron cargar los miembros del proyecto.</Alert>}
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
              <Button size="xs" variant="light" loading={assign.isPending} onClick={() => handleAssign(me)}>
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

function TaskEditForm({ project, task, onDone }) {
  const updateTask = useUpdateTask(project.id)
  const [error, setError] = useState(null)

  const form = useForm({
    initialValues: {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
    },
    validate: {
      title: (value) => {
        const v = value.trim()
        if (!v) return 'Ingresa un título'
        if (v.length > 200) return 'Máximo 200 caracteres'
        return null
      },
      description: (value) =>
        value.trim().length > 5000 ? 'Máximo 5000 caracteres' : null,
    },
  })

  const handleSubmit = async (values) => {
    const changes = {}
    const title = values.title.trim()
    const description = values.description.trim()

    if (title !== task.title) changes.title = title
    if (description !== (task.description ?? '')) changes.description = description || null
    if (values.priority !== task.priority) changes.priority = values.priority

    if (Object.keys(changes).length === 0) {
      onDone()
      return
    }

    setError(null)
    try {
      await updateTask.mutateAsync({ taskId: task.id, changes })
      notifications.show({
        color: 'green',
        title: 'Tarea actualizada',
        message: 'Tus cambios se guardaron.',
      })
      onDone()
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
        const fieldErrors = fieldErrorsFromApiError(e)
        if (Object.keys(fieldErrors).length > 0) form.setErrors(fieldErrors)
        else setError(taskErrorText(e, 'edit'))
      } else {
        setError(taskErrorText(e, 'edit'))
      }
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}
        <TextInput label="Título" data-autofocus {...form.getInputProps('title')} />
        <Textarea
          label="Descripción"
          autosize
          minRows={3}
          maxRows={10}
          {...form.getInputProps('description')}
        />
        <Select
          label="Prioridad"
          data={PRIORITY_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('priority')}
        />
        <Group justify="flex-end">
          <Button
            type="button"
            variant="subtle"
            color="gray"
            onClick={onDone}
            disabled={updateTask.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={updateTask.isPending} disabled={!form.isDirty()}>
            Guardar cambios
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

function DeleteSection({ project, task, onDeleted }) {
  const [opened, setOpened] = useState(false)
  const [error, setError] = useState(null)
  const deleteTask = useDeleteTask(project.id)

  const close = () => {
    setOpened(false)
    setError(null)
  }

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteTask.mutateAsync(task.id)
      notifications.show({
        color: 'green',
        title: 'Tarea eliminada',
        message: `«${task.title}» se eliminó definitivamente.`,
      })
      close()
      onDeleted()
    } catch (e) {
      setError(taskErrorText(e, 'delete'))
    }
  }

  return (
    <>
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Title order={5}>Eliminar tarea</Title>
          <Text size="xs" c="dimmed">No se puede deshacer.</Text>
        </div>
        <Button color="red" variant="light" size="xs" onClick={() => setOpened(true)}>
          Eliminar
        </Button>
      </Group>

      <ConfirmModal
        opened={opened}
        onClose={close}
        title="Eliminar tarea"
        message={`¿Seguro que quieres eliminar «${task.title}»? La tarea se borra definitivamente y no se puede recuperar.`}
        confirmLabel="Eliminar"
        loading={deleteTask.isPending}
        error={error}
        onConfirm={handleDelete}
      />
    </>
  )
}

function TaskDetail({ project, task, onDeleted }) {
  const { user } = useAuth()
  const me = user?.username
  const [editing, setEditing] = useState(false)

  if (editing) {
    return <TaskEditForm project={project} task={task} onDone={() => setEditing(false)} />
  }

  return (
    <Stack>
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Title order={3}>{task.title}</Title>
        {canEditTask(project.role, task, me) && (
          <Button size="xs" variant="light" onClick={() => setEditing(true)}>
            Editar
          </Button>
        )}
      </Group>

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

      {canDeleteTask(project.role) && (
        <>
          <Divider />
          <DeleteSection project={project} task={task} onDeleted={onDeleted} />
        </>
      )}
    </Stack>
  )
}

function TaskDrawer({ project, taskId, opened, onClose }) {
  const { data: task, isPending, isError, error, refetch } = useTask(project.id, taskId)
  const gone = isError && error.status === 404

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="md" title="Detalle de la tarea">
      {taskId && isPending && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {gone && (
        <Stack align="flex-start">
          <Text>Esta tarea ya no está disponible.</Text>
          <Button variant="light" onClick={onClose}>
            Cerrar
          </Button>
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

      {task && <TaskDetail project={project} task={task} onDeleted={onClose} />}
    </Drawer>
  )
}

export default TaskDrawer
