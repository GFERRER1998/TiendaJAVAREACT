import "./Category.css";

const Category = ({ categoryName, imgUrl, numberOfItems, bgColor, isSelected, onClick }) => {
    return (
        <div className="d-flex align-items-center p-3 rounded gap-3 position-relative category-card" style={{ backgroundColor: bgColor, cursor: "pointer", border: isSelected ? "3px solid white" : "none" }}
        onClick={onClick}>
            <div style={{ position: "relative", width: "50px", height: "50px" }}>
                <img src={imgUrl} alt={categoryName} className="img-fluid rounded-circle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="flex-grow-1">
                <h6 className="text-white mb-0 fw-bold">{categoryName}</h6>
                <p className="text-white-50 mb-0 small">{numberOfItems} items</p>
            </div>
        </div>
    )
}

export default Category;
