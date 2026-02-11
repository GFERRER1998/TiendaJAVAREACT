import "./DisplayCategory.css";
import Category from "../../pages/Category/Category";

const DisplayCategory = ({selectedCategory, setSelectedCategory, categories }) => {
    return (
        <div className="d-flex flex-row flex-nowrap overflow-auto gap-3 pb-2" style={{ width: "100%", margin: 0 }}>
            {categories && categories.map((category) => (
                <div key={category.categoryID} style={{ minWidth: "200px" }}>
                    <Category
                        categoryName={category.name}
                        imgUrl={category.imgUrl}
                        numberOfItems={category.itemCount}
                        bgColor={category.bgColor}
                        isSelected={selectedCategory === category.categoryID}
                        onClick={() => setSelectedCategory(category.categoryID)}
                    />
                </div>
            ))}
        </div>
    )
}

export default DisplayCategory;
