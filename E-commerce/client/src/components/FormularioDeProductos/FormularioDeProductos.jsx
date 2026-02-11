import { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { addItem } from "../../service/ItemService";
import { AppContext } from "../Context/AppContext";
import { assets } from "../../assets/assets";

const FormularioDeProductos = () => {

    const {categories, setItemData, itemData} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [imagen, setImagen] = useState(null);
    const [data, setData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: ""
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
        const formData = new FormData();
        
        // Ensure numbers are parsed if backend expects numbers
        const productData = {
            ...data,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            categoryID: data.category
        };
        
        formData.append("item", JSON.stringify(productData));
        if (imagen) {
            formData.append("file", imagen);
        }

        try{    
            /* 
               If image is mandatory, check here. 
            */
            if (!imagen) {
                 toast.error("Por favor, selecciona una imagen");
                 setLoading(false);
                 return;
            }

            const response = await addItem(formData);
            if (response.status === 200 || response.status === 201) {
                if(setItemData && itemData) {
                   setItemData([...itemData, response.data]);
                }
                toast.success("Producto agregado exitosamente");
                setData({
                    name: "",
                    category: "",
                    description: "",
                    price: "",
                    stock: ""
                });
                setImagen(null);
                // Reset file input manually
                const fileInput = document.getElementById("imagenProducto");
                if(fileInput) fileInput.value = "";
            } else {
                toast.error("Error al agregar el producto"); 
            }
        } catch(error) {
            console.error(error);
            toast.error("Error al agregar el producto");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="mx-2 mt-2">
            <div className="product-form-container" style={{height: "calc(100vh - 5rem)", overflowY: "auto", overflowX: "hidden"}}>
                <div className="card col-md-8 form-container p-4">
                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-3">
                            <label htmlFor="imagenProducto" className="form-label">
                                <img src={imagen ? URL.createObjectURL(imagen) : assets.upload_area} alt="Upload" width={48} />
                            </label>
                            <input type="file" id="imagenProducto" className="form-control" hidden onChange={e => setImagen(e.target.files[0])} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nombreProducto" className="form-label">Nombre</label>
                            <input type="text"
                                 id="nombreProducto"
                                 name="name"
                                 className="form-control"
                                 placeholder="Nombre del producto"
                                 value={data.name}
                                 onChange={onChangeHandler}
                                 required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="categoriaProducto" className="form-label">Categoria</label>
                            <select name="category" id="categoriaProducto" className="form-control" onChange={onChangeHandler} value={data.category} required>
                                <option value="">Seleccionar categoria</option>
                               {categories.map((category) => (
                                    <option key={category.categoryID} value={category.categoryID}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descripcionProducto" className="form-label">Descripcion</label>
                            <textarea
                                id="descripcionProducto"
                                name="description"
                                className="form-control"
                                placeholder="Descripcion del producto"
                                rows="3"
                                onChange={onChangeHandler}
                                value={data.description}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="precioProducto" className="form-label">Precio</label>
                            <input type="number"
                                 id="precioProducto"
                                 name="price"
                                 className="form-control"
                                 placeholder="0.00"
                                 onChange={onChangeHandler}
                                 value={data.price}
                                 required
                                 min="0"
                                 step="0.01"
                            />
                        </div>
                         <div className="mb-3">
                            <label htmlFor="stockProducto" className="form-label">Stock</label>
                            <input type="number"
                                 id="stockProducto"
                                 name="stock"
                                 className="form-control"
                                 placeholder="0"
                                 onChange={onChangeHandler}
                                 value={data.stock}
                                 required
                                 min="0"
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

export default FormularioDeProductos;