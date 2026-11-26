import { Link } from 'react-router-dom' 
import { Button, Center, Stack, Text, Title} from '@mantine/core'

function NotFoundPage(){
    return (
        <Center h={"100vh"} bg="var(--mantine-primary-color-0)">
            <Stack align='center' gap="xs">
                <Title order={1} fz={72} c="var(--mantine-primary-color-filled)">
                    404
                </Title>
                <Title order={3}>
                    Página no encontrada
                </Title>
                <Text c="dimmed" ta="center">
                    La dirección que buscas no existe o fue movida.
                </Text>
                <Button component={Link} to='/' mt="sm">Ir al inicio</Button>
            </Stack>
        </Center>
    )
}

export default NotFoundPage