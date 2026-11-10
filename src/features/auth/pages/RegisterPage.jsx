import { Title } from "@mantine/core";
import { Link } from "react-router-dom";

function RegisterPage(){
    return (
        <div style={{ padding: 24 }}>
            <Title order={2}>Crear cuenta</Title>
            <Link to="/login">Ir a Login</Link>
        </div>

    )
}

export default RegisterPage