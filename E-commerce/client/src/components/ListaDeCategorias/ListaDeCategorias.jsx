import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import "./ListaDeCategorias.css";
import toast from "react-hot-toast";
import { deleteCategory } from "../../service/CategoryService";

const ListaDeCategorias = () => {
    const { categories, setCategories } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");

    
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (categoryID) => {
        try {
            await deleteCategory(categoryID);
            const updatedCategories = categories.filter(category => category.categoryID !== categoryID);
            setCategories(updatedCategories);
            toast.success("Categoría eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            toast.error("Error al eliminar la categoría");
        }
    };

    return (
        <div className="categories-list-container">
            <div className="row pe-2 mb-3">
               <div className="col-12">
                <div className="input-group">
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
                {filteredCategories.map((category, index) => (
                    <div key={index} className="col-12 mb-3">
                        <div className="card p-3 shadow-sm border-0" style={{ backgroundColor: category.bgColor }}>
                            <div className="d-flex align-items-center">
                                <div className="category-image-container">
                                    <img 
                                        src={category.imgUrl} 
                                        alt={category.name} 
                                        className="category-image"
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mb-1 text-white fw-bold">{category.name}</h5>
                                    <p className="mb-0 text-white opacity-75 small">
                                        {category.description}
                                    </p>
                                    <span className="badge bg-warning text-dark mt-2">
                                        {category.itemCount} productos
                                    </span>

                                </div>
                                <button 
                                    className="btn btn-danger btn-sm rounded-3"
                                    onClick={() => handleDelete(category.categoryID)}
                                >
                                    <i className="bi bi-trash"></i>  
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListaDeCategorias;