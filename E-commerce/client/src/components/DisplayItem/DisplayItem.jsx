import "./DisplayItem.css";
import { useContext, useState } from "react";
import { AppContext } from "../../components/Context/AppContext";
import Item from "../../components/Item/Item";
import SearchBox from "../../components/SearchBox/SearchBox";

const DisplayItem = ({ selectedCategory }) => {
    const { itemData } = useContext(AppContext);
    const [searchText, setSearchText] = useState("");

    const filteredItems = itemData ? itemData.filter((item) => {
        // If no category is selected, show all
        if (!selectedCategory) return true;
        // Verify mismatch: item.categoryID vs item.categoryName?
        // For now, assuming item has categoryID or we need to fix backend.
        return item.categoryID === selectedCategory;
    }).filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())) : [];

    return (
        <div className="p-3 h-100 d-flex flex-column">
             <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light mb-0">Productos</h4>
                <div style={{ maxWidth: '300px', width: '100%' }}>
                    <SearchBox onSearch={setSearchText} />
                </div>
            </div>
            
            <div className="row g-3 overflow-auto no-scrollbar" style={{maxHeight: "calc(100vh - 250px)"}}>
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.itemID} className="col-lg-4 col-md-6 col-sm-12">
                            <Item
                                itemName={item.name}
                                itemPrice={item.price}
                                itemImage={item.imageURL}
                                itemID={item.itemID}
                                stock={item.stock}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-white text-center w-100 mt-5">
                        <p>{itemData && itemData.length > 0 ? "No products match your search." : "No products available."}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DisplayItem;