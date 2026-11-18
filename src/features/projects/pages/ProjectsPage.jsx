import { useState } from 'react'
import {
  Alert, Button, Center, Loader, Pagination,
  SimpleGrid, Stack, Text, TextInput, Title,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import ProjectCard from '../components/ProjectCard'
import { useProjects } from '../hooks/useProjects'

const PAGE_SIZE = 10

function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 400)
  const search = debouncedSearch.trim()

  const { data, isPending, isError, error, refetch, isPlaceholderData } =
    useProjects({ page, pageSize: PAGE_SIZE, search })

  const handleSearchChange = (event) => {
    setSearchInput(event.currentTarget.value)
    setPage(1)
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <Stack>
      <Title order={2}>Proyectos</Title>

      <TextInput
        placeholder="Buscar entre tus proyectos"
        value={searchInput}
        onChange={handleSearchChange}
        maxLength={100}
        maw={400}
      />

      {isPending && <Center py="xl"><Loader /></Center>}

      {isError && (
        <Alert color="red" title="No se pudieron cargar los proyectos">
          {error.message}
          <Button mt="sm" size="xs" variant="light" onClick={() => refetch()}>
            Reintentar
          </Button>
        </Alert>
      )}

      {data && data.items.length === 0 && (
        <Text c="dimmed">
          {search
            ? `Ningún proyecto coincide con «${search}».`
            : 'Todavía no tienes proyectos.'}
        </Text>
      )}

      {data && data.items.length > 0 && (
        <>
          <Text size="sm" c="dimmed">
            {data.total} {data.total === 1 ? 'proyecto' : 'proyectos'}
          </Text>

          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            style={{ opacity: isPlaceholderData ? 0.6 : 1 }}
          >
            {data.items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </SimpleGrid>

          {totalPages > 1 && (
            <Pagination total={totalPages} value={page} onChange={setPage} />
          )}
        </>
      )}
    </Stack>
  )
}

export default ProjectsPage