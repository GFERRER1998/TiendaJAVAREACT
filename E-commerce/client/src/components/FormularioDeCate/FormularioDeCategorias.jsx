import { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { addCategory } from "../../service/CategoryService";
import { toast } from "react-hot-toast";
import { AppContext } from "../Context/AppContext"; // Import AppContext

const FormularioDeCategorias = () => {
    
    const { categories, setCategories } = useContext(AppContext); // Consume context
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        bgColor: "#000000",
        image: null,
    });

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.image) {
            toast.error("Por favor, selecciona una imagen");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append("category", JSON.stringify({
            name: formData.name,
            description: formData.description,
            bgColor: formData.bgColor
        }));
        data.append("file", formData.image);

        try {
            const response = await addCategory(data);
             if (response.status === 201) {
                toast.success("Categoría agregada exitosamente");
                setCategories([...categories, response.data]); 
                setFormData({
                    name: "",
                    description: "",
                    bgColor: "#000000",
                    image: null,
                });
                const fileInput = document.getElementById("imagenCategoria");
                if(fileInput) fileInput.value = "";
            }
        } catch(error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error al agregar la categoría");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-2 mt-2">
            <div className="row justify-content-center">
                <div className="card col-md-15 form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                        <label htmlFor="imagenCategoria" className="form-label">
                                <img src={formData.image ? URL.createObjectURL(formData.image) : assets.upload_area} alt="Upload" width={48} />
                            </label>
                            <input type="file" id="imagenCategoria" className="form-control" hidden onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nombreCategoria" className="form-label">Nombre</label>
                            <input type="text"
                                 id="nombreCategoria"
                                 name="name"
                                 className="form-control"
                                 placeholder="Nombre de la categoria"
                                 value={formData.name}
                                 onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripcion</label>
                            <textarea
                            rows="5"
                            name="description"
                            id="descripcion"
                            className="form-control" 
                            placeholder="Descripcion de la categoria"
                            value={formData.description}
                            onChange={handleChange}
                            ></textarea>    
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bgColor" className="form-label">Color de fondo</label>
                            <input 
                                type="color" 
                                id="bgColor"
                                name="bgColor"
                                className="form-control form-control-color" 
                                value={formData.bgColor}
                                onChange={handleChange}
                                title="Elige un color de fondo"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-warning w-100">{loading ? "Agregando..." : "Agregar"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormularioDeCategorias;