import { useState } from "react";
import { toast } from "react-hot-toast";
import { addUser } from "../../service/UserService";

const FormularioDeUsuario = ({ setUsers }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await addUser(data);
            setUsers((prevUsers) => [...prevUsers, response.data]);
            toast.success("User added successfully");
            setData({
                name: "",
                email: "",
                password: "",
                role: "USER"
            });
        } catch (error) {
            console.error(error);
            toast.error("Error adding user");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-8 form-container p-4">
                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-3">
                            <label htmlFor="nombreUsuario" className="form-label">Nombre</label>
                            <input type="text"
                                 name="name"
                                 id="nombreUsuario"
                                 className="form-control"
                                 placeholder="Nombre del usuario"
                                 value={data.name}
                                 onChange={onChangeHandler}
                            />
                        </div>
                         <div className="mb-3">
                            <label htmlFor="emailUsuario" className="form-label">Email</label>
                            <input type="email"
                                 name="email"
                                 id="emailUsuario"
                                 className="form-control"
                                 placeholder="Email"
                                 value={data.email}
                                 onChange={onChangeHandler}
                            />    
                        </div>
                         <div className="mb-3">
                            <label htmlFor="Contraseña" className="form-label">Contraseña</label>
                            <input type="password"
                                 name="password"
                                 id="Contraseña"
                                 className="form-control"
                                 placeholder="Contraseña"
                                 value={data.password}
                                 onChange={onChangeHandler}
                            />    
                        </div>  
                        <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                            {loading ? "Cargando..." : "Agregar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioDeUsuario;