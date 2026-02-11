
import "./Categorias.css";
import FormularioDeCategorias from "../../components/FormularioDeCate/FormularioDeCategorias";
import ListaDeCategorias from "../../components/ListaDeCategorias/ListaDeCategorias";


const Categorias = () => {
    return (
        <div className="categorias-container text-light">
            <div className="left-column">
               <FormularioDeCategorias />
            </div>
            <div className="right-column">
                <ListaDeCategorias />
            </div>
        </div>
    )
}

export default Categorias