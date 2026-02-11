import "./Explorar.css";
import { useContext, useState } from "react";
import { AppContext } from "../../components/Context/AppContext";
import DisplayCategory from "../../components/DisplayCategorys/DisplayCategory";
import DisplayItem from "../../components/DisplayItem/DisplayItem";
import CustomerForm from "../../components/CustomerForm/CustomerForm/CustomerForm";
import CartItems from "../../components/CartItems/CartItems";
import CartSummary from "../../components/CartSummary/CartSummary";

const Explorar = () => {
    const { categories } = useContext(AppContext)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [customerName, setCustomerName] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    return (
        <div>
            <div className="explorar-container text-light">
                <div className="left-column">
                    <div className="first-row">
                        <DisplayCategory 
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories} />
                    </div>
                    <hr className="horizontal-line" />
                    <div className="second-row">
                        <DisplayItem selectedCategory={selectedCategory} />
                    </div>
                </div>
                <div className="right-column d-flex flex-column">
                    <div className="customer-form-container">
                        <CustomerForm 
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        mobileNumber={mobileNumber}
                        setMobileNumber={setMobileNumber}
                        />   
                    </div>
                    <hr className="my-3 text-light" />
                    <div className="cart-items-container">
                        <CartItems />
                    </div>
                    <div className="cart-summary-container">
                        <CartSummary 
                            customerName={customerName} 
                            mobileNumber={mobileNumber} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Explorar