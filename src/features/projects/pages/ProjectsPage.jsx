import { Button, Container, Title, Text } from '@mantine/core'
import { useAuth } from '@/features/auth'

function ProjectsPage(){
    const { user, signOut } = useAuth()

    return(
        <Container my={40}>
            <Title order={2} mb="md">Proyectos</Title>
            <Text mb="mb">Sesión iniciada como {user?.username}</Text>
            <Button variant="light" onClick={signOut}>Cerrar Sesión</Button>
        </Container>
    )
}

export default ProjectsPage