import { Link } from 'react-router-dom' 
import { Button, Center, Stack, Text, Title} from '@mantine/core'

function NotFoundPage(){
    return (
        <Center h={"100vh"}>
            <Stack align='center' gap="xs">
                <Title order={2}>Página no encontrada</Title>
                <Text c="dimmed" ta="center">
                    La dirección que buscas no existe o fue movida.
                </Text>
                <Button component={Link} to='/' mt="sm">Ir al inicio</Button>
            </Stack>
        </Center>
    )
}

export default NotFoundPage