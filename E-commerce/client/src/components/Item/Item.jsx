import "./Item.css";
import { useContext } from "react";
import { AppContext } from "../../components/Context/AppContext";

const Item = ({ itemName, itemPrice, itemImage, itemID, stock }) => {
    const {addToCart} = useContext(AppContext);
    const handleAddToCart = () => {
        addToCart({
            itemID,
            name: itemName,
            price: itemPrice,
            image: itemImage,
            stock: stock
        });
    };

    return (
        <div className="p-3 bg-dark rounded shadow-sm h-100 d-flex align-items-center item-card">
            <div style={{ position: "relative", marginRight: "15px" }}>
                <img src={itemImage} alt={itemName} className="item-image" />
            </div>

            <div className="flex-grow-1 ms-2">
                <h6 className="text-light mb-1">{itemName}</h6>
                <p className="mb-0 fw-bold text-light">${itemPrice}</p>
            </div>

            <div className="d-flex flex-column justify-content-between align-items-center ms-3" style={{ height: "100%" }}>
                {/* Placeholder for future cart count or status */}
                <i className="bi bi-cart-plus fs-4 text-warning mb-2"></i>
                
                <button className="btn btn-success btn-sm rounded-circle" onClick={handleAddToCart} style={{width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <i className="bi bi-plus fs-5"></i>
                </button>
            </div>
        </div>
    )
}

export default Item;