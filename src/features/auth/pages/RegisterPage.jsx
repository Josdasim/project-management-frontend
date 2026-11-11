import { useState } from 'react'
import {
     Title, Alert, Anchor, Button, Container, Group, Paper,
     PasswordInput, Stack, Text, TextInput } from "@mantine/core"
import { hasLength, isEmail, matches, useForm } from '@mantine/form'
import { Link, useNavigate } from "react-router-dom"
import { ApiError } from '@/shared/api/client'
import { fieldErrorsFromApiError } from '@/shared/api/errors'
import { APP_NAME } from '@/shared/config'
import { register } from '../api'

function RegisterPage(){
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        initialValues: {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            confirmPassword: ''
        },
        validate: {
            username: (value) => {
                const v = value.trim()

                if(v.length < 3 || v.length > 30) return 'Debe tener entre 3 y 30 caracteres'
                if(!/^[A-Za-z0-9_.-]+$/.test(v)) return 'Solo letras, números, _ . -'

                return null
            },
            email: isEmail('Correo no válido'),
            first_name: (value) => (value.trim() ? null :'Ingrese su nombre'),
            password: hasLength({min:12, max:128}, 'Debe tener entre 12 y 128 caracteres'),
            confirmPassword: (value, values) => 
                value !== values.password ? 'Las contraseñas no coinciden' : null 
        }
    })

    const handleSubmit = async(values) => {
        setError(null)
        setLoading(true)
        try{
            await register({
                username: values.username.trim(),
                email: values.email.trim(),
                password: values.password,
                first_name:values.first_name.trim(),
                last_name: values.last_name.trim()
            })
            navigate('/login', { replace: true, state: { registered: true}})
        } catch(e){
            if(e instanceof ApiError && e.status === 409){
                setError('Ese usuario o correo electronico ya está registrado')
            } else if(e instanceof ApiError && e.status ===422){
                const fieldErrors = fieldErrorsFromApiError(e)

                if (Object.keys(fieldErrors).length > 0){
                    form.setError(fieldErrors)
                } else {
                    setError('Revise los datos del formulario')
                }
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
        <Container size ={460} my={40}>
            <Title ta="center" order={2}>{APP_NAME}</Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                ¿Ya tienes una cuenta?{' '}
                <Anchor component={Link} to="/login" size="sm">Iniciar Sesión</Anchor>
            </Text>

            <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        {error && <Alert color="red">{error}</Alert>}

                        <TextInput
                        label = "Usuario"
                        description = "3 a 30 caracteres: letras, números, _ . -"
                        autoComplete="username"
                        key={form.key('username')}
                        {...form.getInputProps('username')}
                        />
                        <TextInput
                        label = "Correo electronico"
                        autoComplete='email'
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                        />
                        <Group grow align='flex-start'>
                            <TextInput
                            label = "Nombre"
                            autoComplete="givin-name"
                            key={form.key('first_name')}
                            {...form.getInputProps('first_name')}
                            />
                            <TextInput
                            label = "Apellido (opcional)"
                            autoComplete="family-name"
                            key={form.key('last_name')}
                            {...form.getInputProps('last_name')}
                            />
                        </Group>
                        <PasswordInput
                        label = "Contraseña"
                        description = "Entre 12 y 128 caracteres"
                        autoComplete="new-password"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                        />
                        <PasswordInput
                        label = "Confirmar contraseña"
                        autoComplete="new-password"
                        key={form.key('confirmPassword')}
                        {...form.getInputProps('confirmPassword')}
                        />
                        <Button type="submit" loading={loading}>Crear Cuenta</Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    )
}

export default RegisterPage