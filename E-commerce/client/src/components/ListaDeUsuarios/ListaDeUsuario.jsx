import { useState } from "react";
import { toast } from "react-hot-toast";
import { deleteUser } from "../../service/UserService";

const ListaDeUsuario = ({users, setUsers}) => {
 const [searchTerm, setSearchTerm] = useState("")  

 const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
 const deleteByUserId = async (id) => {
    try {
        await deleteUser(id)
        setUsers(users.filter(user => user.userID !== id))  
        toast.success("Usuario eliminado")
    } catch (error) {
        console.log(error)
        toast.error("Error al eliminar usuario")
    }
 }  
    return (
        <div>
            <div className="categories-list-container" style={{height: "100%", overflowY: "auto", overflowX: "hidden" }}>
                <div className="row pe-2">
               <div className="col-12">
                <div className="input-group mb-3">
                    <input 
                        type="text"
                        name="keyword" 
                        id="keyword" 
                        placeholder="Buscar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control" 
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
               </div>
            </div>
            <div className="row g-3 pe-2">
            {filteredUsers.map((user, index)=>(
                <div className="col-12" key={user.userID || index}>
                    <div className="card p-3 bg-dark d-flex flex-row justify-content-between align-items-center">
                        <div className="flex-grow-1 overflow-hidden me-3">
                            <h5 className="mb-1 text-white text-truncate">{user.name}</h5>
                            <p className="mb-0 text-white text-truncate" title={user.email}>{user.email}</p>
                        </div>
                        <button className="btn btn-danger" onClick={() => deleteByUserId(user.userID)}>
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    )
}

export default ListaDeUsuario;