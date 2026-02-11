import ListaDeUsuario from "../../components/ListaDeUsuarios/ListaDeUsuario"
import FormularioDeUsuario from "../../components/FormularioDeUsuario/FormularioDeUsuario"
import "./Usuarios.css"
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { fetchUsers } from "../../service/UserService";

const Usuarios = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        async function LoadUsers() {
            try {
                setLoading(true);
                const response = await fetchUsers();
                setUsers(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Error fetching users");
            } finally {
                setLoading(false);
            }
        }
        LoadUsers();
    }, []);
    return (
        <div className="usuarios-container text-light">
            <div className="left-column">
                <FormularioDeUsuario setUsers={setUsers} />
            </div>
            <div className="right-column">
                <ListaDeUsuario users={users} setUsers={setUsers} />  
            </div>
        </div>
    )
}

export default Usuarios