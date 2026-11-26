import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ActionIcon, Alert, Badge, Button, Center,
  Group, Loader, Menu, Pagination, Select, Stack,
  Table, Text, TextInput,
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useAuth } from '@/features/auth'
import ConfirmModal from '@/shared/components/ConfirmModal'
import { ROLE_LABELS } from '../constants'
import { useMembers } from '../hooks/useMembers'
import { useChangeMemberRole, useLeaveProject, useRemoveMember, useTransferOwnership } from '../hooks/useMemberMutations'
import { canAddMembers, canLeaveProject, canRemoveMember, canTransferTo, roleChangeOptions } from '../permissions.js'
import { memberDisplayName, memberErrorText, transferErrorText } from '../utils'
import AddMemberModal from './AddMemberModal'

const PAGE_SIZE = 10
const ROLE_FILTER_DATA = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}))

function MembersTab({ project }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const myUsername = user?.username?.toLowerCase()

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 400)
  const search = debouncedSearch.trim()
  const [roleFilter, setRoleFilter] = useState(null)

  const [addOpened, addModal] = useDisclosure(false)
  const [leaveOpened, leaveModal] = useDisclosure(false)
  const [toRemove, setToRemove] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [toTransfer, setToTransfer] = useState(null)
  const transferOwnership = useTransferOwnership(project.id)

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useMembers(project.id, {
    page,
    pageSize: PAGE_SIZE,
    search,
    role: roleFilter ?? '',
  })
  const changeRole = useChangeMemberRole(project.id)
  const removeMember = useRemoveMember(project.id)
  const leaveProject = useLeaveProject(project.id)

  const hasFilters = Boolean(search || roleFilter)
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const handleSearchChange = (event) => {
    setSearchInput(event.currentTarget.value)
    setPage(1)
  }

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value)
    setPage(1)
  }

  const handleAdded = () => {
    setSearchInput('')
    setRoleFilter(null)
    setPage(1)
  }

  const handleChangeRole = async (member, role) => {
    try {
      await changeRole.mutateAsync({ username: member.username, role })
      notifications.show({
        color: 'green',
        title: 'Rol actualizado',
        message: `Nuevo rol de ${memberDisplayName(member)}: ${ROLE_LABELS[role]}.`,
      })
    } catch (e) {
      notifications.show({
        color: 'red',
        title: 'No se pudo cambiar el rol',
        message: memberErrorText(e),
      })
    }
  }

  const closeRemove = () => {
    setToRemove(null)
    setActionError(null)
  }

  const handleRemove = async () => {
    setActionError(null)
    try {
      await removeMember.mutateAsync(toRemove.username)
      notifications.show({
        color: 'green',
        title: 'Miembro retirado',
        message: `${memberDisplayName(toRemove)} ya no pertenece al proyecto.`,
      })
      setToRemove(null)
      setPage(1)
    } catch (e) {
      setActionError(memberErrorText(e))
    }
  }

  const closeLeave = () => {
    leaveModal.close()
    setActionError(null)
  }

  const handleLeave = async () => {
    setActionError(null)
    try {
      await leaveProject.mutateAsync()
      notifications.show({
        color: 'green',
        title: 'Saliste del proyecto',
        message: `Ya no eres miembro de «${project.name}».`,
      })
      navigate('/projects', { replace: true })
    } catch (e) {
      setActionError(memberErrorText(e))
    }
  }

  const closeTransfer = ()  => {
    setToTransfer(null)
    setActionError(null)
  }

  const handleTransfer = async () => {
    setActionError(null)

    try {
      await transferOwnership.mutateAsync(toTransfer.username)
      notifications.show({
        color: 'green',
        title: 'Propiedad transferida',
        message: `${memberDisplayName(toTransfer)} es ahora el Propietario. Tu rol pasó a Administrador`
      })
      setToTransfer(null)
    } catch(e) {
      console.log('error?')
      setActionError(transferErrorText(e))
    }
  }
  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <Group align="flex-end">
          <TextInput
            label="Buscar"
            placeholder="Nombre o usuario"
            value={searchInput}
            onChange={handleSearchChange}
            maxLength={100}
          />
          <Select
            label="Rol"
            placeholder="Todos los roles"
            data={ROLE_FILTER_DATA}
            value={roleFilter}
            onChange={handleRoleFilterChange}
            clearable
            w={180}
          />
        </Group>
        {canAddMembers(project.role) && <Button onClick={addModal.open}>Agregar miembro</Button>}
      </Group>

      {isPending && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {isError && (
        <Alert color="red" title="No se pudieron cargar los miembros">
          {error.message}
          <Button mt="sm" size="xs" variant="light" onClick={() => refetch()}>
            Reintentar
          </Button>
        </Alert>
      )}

      {data && data.items.length === 0 && (
        <Text c="dimmed">
          {hasFilters ? 'Ningún miembro coincide con los filtros.' : 'Este proyecto no tiene miembros.'}
        </Text>
      )}

      {data && data.items.length > 0 && (
        <>
          <Text size="sm" c="dimmed">
            {data.total} {data.total === 1 ? 'miembro' : 'miembros'}
          </Text>

          <Table.ScrollContainer minWidth={420}>
            <Table verticalSpacing="sm" style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Miembro</Table.Th>
                  <Table.Th>Rol</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.items.map((member) => {
                  const isSelf = member.username.toLowerCase() === myUsername
                  const roleOptions = roleChangeOptions(project.role, member)
                  const removable = canRemoveMember(project.role, member, isSelf)
                  const transferable = canTransferTo(project.role, member, isSelf)

                  return (
                    <Table.Tr key={member.username}>
                      <Table.Td>
                        <Text fw={500}>
                          {memberDisplayName(member)}
                          {isSelf && ' (tú)'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          @{member.username}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">{ROLE_LABELS[member.role] ?? member.role}</Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        {(roleOptions.length > 0 || removable || transferable) && (
                          <Menu position="bottom-end">
                            <Menu.Target>
                              <ActionIcon
                                variant="subtle"
                                color="gray"
                                aria-label={`Acciones para ${member.username}`}
                                disabled={changeRole.isPending}
                              >
                                ⋯
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              {roleOptions.length > 0 && <Menu.Label>Cambiar rol a</Menu.Label>}
                              {roleOptions.map((r) => (
                                <Menu.Item key={r} onClick={() => handleChangeRole(member, r)}>
                                  {ROLE_LABELS[r]}
                                </Menu.Item>
                              ))}
                              {transferable && (
                                <>
                                  <Menu.Divider />
                                  <Menu.Item onClick={() => setToTransfer(member)}>
                                    Transferir propiedad
                                  </Menu.Item>
                                </>
                              )}
                              {removable && (
                                <>
                                <Menu.Divider />
                                <Menu.Item color="red" onClick={() => setToRemove(member)}>
                                  Retirar del proyecto
                                </Menu.Item>
                                </>
                              )}
                            </Menu.Dropdown>
                          </Menu>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {totalPages > 1 && <Pagination total={totalPages} value={page} onChange={setPage} />}
        </>
      )}

      {canLeaveProject(project.role) ? (
        <Group justify="flex-end" mt="md">
          <Button color="red" variant="subtle" onClick={leaveModal.open}>
            Abandonar proyecto
          </Button>
        </Group>
      ) : (
        <Text size="sm" c="dimmed" mt="md">
          Como Propietario no puedes abandonar el proyecto. Puedes eliminarlo desde la pestaña Resumen.
        </Text>
      )}

      <AddMemberModal
        projectId={project.id}
        actorRole={project.role}
        opened={addOpened}
        onClose={addModal.close}
        onAdded={handleAdded}
      />

      <ConfirmModal
        opened={Boolean(toRemove)}
        onClose={closeRemove}
        title="Retirar miembro"
        message={
          toRemove
            ? `¿Retirar a ${memberDisplayName(toRemove)} (@${toRemove.username}) de «${project.name}»? Perderá el acceso y se le quitarán las tareas que tenga asignadas.`
            : ''
        }
        confirmLabel="Retirar"
        loading={removeMember.isPending}
        error={actionError}
        onConfirm={handleRemove}
      />

      <ConfirmModal
        opened={leaveOpened}
        onClose={closeLeave}
        title="Abandonar proyecto"
        message={`¿Seguro que quieres abandonar «${project.name}»? Perderás el acceso y se te quitarán las tareas que tengas asignadas. Para volver, alguien tendrá que agregarte de nuevo.`}
        confirmLabel="Abandonar"
        loading={leaveProject.isPending}
        error={actionError}
        onConfirm={handleLeave}
      />

      <ConfirmModal
        opened={Boolean(toTransfer)}
        onClose={closeTransfer}
        title="Transferir propiedad"
        message={
          toTransfer
            ? `¿Transferir ‹‹${project.name}›› a ${memberDisplayName(toTransfer)} (@${toTransfer.username})? Pasaras a ser Administrador y solo esa persona podrá cambiar el nombre del proyecto, eliminarlo o transferirlo. Para recuperarlo, tendría que transferirtelo nuevamente.`
            : ''
        }
        confirmLabel="Transferir"
        color="indigo"
        loading={transferOwnership.isPending}
        error={actionError}
        onConfirm={handleTransfer}
      />
    </Stack>
  )
}

export default MembersTab
