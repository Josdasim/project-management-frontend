import { Title } from "@mantine/core";
import { Link } from "react-router-dom";

function LoginPage(){
    return (
        <div style={{ padding: 24 }}>
            <Title order={2}>Iniciar sesión</Title>
            <Link to="/register">Ir a Registro</Link>
        </div>

    )
}

export default LoginPage