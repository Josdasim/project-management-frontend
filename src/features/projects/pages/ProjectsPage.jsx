import { useState } from 'react'
import {
  Alert, Button, Center, Loader, Pagination,
  SimpleGrid, Stack, Text, TextInput,
  Title, Group,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import ProjectCard from '../components/ProjectCard'
import { useProjects } from '../hooks/useProjects'
import { useDisclosure } from '@mantine/hooks'
import CreateProjectModal from '../components/CreateProjectModal'

const PAGE_SIZE = 10

function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 400)
  const search = debouncedSearch.trim()
  const [modalOpened, modal] = useDisclosure(false)

  const handleCreated = () => {
    setSearchInput('')
    setPage(1)
  }

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useProjects({
    page,
    pageSize: PAGE_SIZE,
    search,
  })

  const handleSearchChange = (event) => {
    setSearchInput(event.currentTarget.value)
    setPage(1)
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <Stack>
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>Mis proyectos</Title>
          <Text c="dimmed" size="sm">
            Proyectos donde eres propietario o participante.
          </Text>
          <Button onClick={modal.open}>Nuevo proyecto</Button>
        </div>
      </Group>

      <TextInput
        placeholder="Buscar entre tus proyectos"
        value={searchInput}
        onChange={handleSearchChange}
        maxLength={100}
        maw={400}
      />

      {isPending && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {isError && (
        <Alert color="red" title="No se pudieron cargar los proyectos">
          {error.message}
          <Button mt="sm" size="xs" variant="light" onClick={() => refetch()}>
            Reintentar
          </Button>
        </Alert>
      )}

      {data && data.items.length === 0 && (
        <Stack align="flex-start" gap="sm">
          <Text c="dimmed">
            {search ? `Ningún proyecto coincide con <<${search}>>.` : 'Todavia no tienes proyectos.'}
          </Text>
          {!search && (
            <Button variant="light" onClick={modal.open}>
              Crear mi primer proyecto
            </Button>
          )}
        </Stack>
      )}

      {data && data.items.length > 0 && (
        <>
          <Text size="sm" c="dimmed">
            {data.total} {data.total === 1 ? 'proyecto' : 'proyectos'}
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
            {data.items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </SimpleGrid>

          {totalPages > 1 && <Pagination total={totalPages} value={page} onChange={setPage} />}
        </>
      )}

      <CreateProjectModal opened={modalOpened} onClose={modal.close} onCreated={handleCreated} />
    </Stack>
  )
}

export default ProjectsPage
