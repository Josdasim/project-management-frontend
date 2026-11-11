import { Button, Container, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { tokenStorage } from '@/shared/api/tokenStorage'

function ProjectsPage(){
    const navigate = useNavigate()

    const handleLogout = () => {
        tokenStorage.clear()
        navigate('/login', { replace: true })
    }

    return(
        <Container my={40}>
            <Title order={2} mb="md">Proyectos</Title>
            <Button variant="light" onClick={handleLogout}>Cerrar Sesión</Button>
        </Container>
    )
}

export default ProjectsPage