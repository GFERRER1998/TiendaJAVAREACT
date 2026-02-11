import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { deleteItem } from "../../service/ItemService";
import { toast } from "react-hot-toast";
import "./ListaDeProductos.css";

const ListaDeProductos = () => {
    const { itemData, setItemData } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredItems = itemData ? itemData.filter((item) => {
       return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }) : [];

    const removeItem = async (itemID) => {
        if(window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                const response = await deleteItem(itemID);
                if (response.status === 204 || response.status === 200) {
                     if (setItemData && itemData) {
                         setItemData(itemData.filter(item => item.itemID !== itemID));
                     }
                     toast.success("Producto eliminado correctamente");
                } else {
                     toast.error("Error al eliminar el producto");
                }
            } catch (error) {
                console.error("Error deleting item", error);
                toast.error("Error al eliminar producto");
            }
        }
    }

    return (
          <div className="categories-list-container">
            <div className="row pe-2 mb-3">
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
             {filteredItems.map((item) => (
                <div key={item.itemID} className="col-12" >
                    <div className="card p-3 bg-dark">
                        <div className="d-flex align-items-center">
                            <div className="product-image-container me-3">
                                <img    
                                    src={item.imageURL || "https://placehold.co/48x48"} 
                                    alt={item.name}
                                    className="product-image"
                                />
                            </div>
                            <div className="flex-grow-1">
                                <h5 className="mb-1 text-white fw-bold">{item.name}</h5>
                                <p className="mb-0 text-white opacity-75 small">{item.description}
                                </p>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="text-end">
                                    <h6 className="mb-1 text-white">&#36;{item.price}</h6>
                                    {item.categoryName && <p className="mb-0 text-white small">{item.categoryName}</p>}
                                    <span className="badge rounded-pill text-bg-warning">
                                        &#8369; {item.price}
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeItem(item.itemID)}
                                >
                                    <i className="bi bi-trash"></i>  
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             ))}
             {filteredItems.length === 0 && (
                 <div className="text-center text-white mt-4">No se encontraron productos.</div>
             )}
            </div>
        </div>
    )
}

export default ListaDeProductos;