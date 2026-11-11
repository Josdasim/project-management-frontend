import { useState } from "react"
import { 
    Title, Alert, Anchor, Button, Container,
    Paper, PasswordInput, Stack, Text, TextInput
} from "@mantine/core"
import { useForm } from '@mantine/form'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ApiError } from "@/shared/api/client"
import { APP_NAME } from "@/shared/config"
import { login } from '../api'

function LoginPage(){
    const navigate = useNavigate()
    const location = useLocation()
    const registered = location.state?.registered
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { identifier: '', password: ''},
        validate: {
            identifier: (value) => (value.trim() ? null : 'Ingrese su usuario o correo electronico'),
            password: (value) => (value ? null : 'Ingrese su contraseña')
        }
    })

    const handleSubmit = async (values) => {
        setError(null)
        setLoading(true)

        try{
            await login(values.identifier.trim(), values.password)
            navigate('/projects', { replace: true })
        } catch(e) {
            if(e instanceof ApiError && e.status === 401){
                setError('Usuario o contraseña incorrectos')
            }
            else if(e instanceof ApiError && e.status === 0){
                setError(e.message)
            } else{
                setError('Ocurrio un error inesperado. Intentelo nuevamente')
            }
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <Container>
            <Title ta="center" order={2}>{APP_NAME}</Title>
            <Text c="dimmed" size ="sm" ta="center" mt={5}>
                ¿Desea registrarse? {' '}
                <Anchor component={Link} to="/register" size="sm">Registrate</Anchor>
            </Text>

            <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        {registered && !error && (
                            <Alert color="green">
                                Cuenta creada correctamente. Ya puedes iniciar sesión.
                            </Alert>
                        )}
                        {error && <Alert color="red">{error}</Alert>}

                        <TextInput
                            label = "Usuario o Correo electronico"
                            autoComplete="username"
                            key={form.key('identifier')}
                            {...form.getInputProps('identifier')}
                        />
                        <PasswordInput
                            label = "Contraseña"
                            autoComplete="current-password"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                        <Button type="submit" loading={loading}>Iniciar sesión</Button>
                    </Stack>
                </form>
            </Paper>
        </Container>

    )
}

export default LoginPage