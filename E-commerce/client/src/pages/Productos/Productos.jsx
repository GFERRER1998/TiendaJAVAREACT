import ListaDeProductos from "../../components/ListaDeProductos/ListaDeProductos"
import FormularioDeProductos from "../../components/FormularioDeProductos/FormularioDeProductos"
import "./Productos.css"


const Productos = () => {
    return (
        <div className="productos-container text-light">
            <div className="left-column">
                <FormularioDeProductos />
            </div>
            <div className="right-column">
                <ListaDeProductos />  
            </div>
        </div>
    )
}

export default Productos    