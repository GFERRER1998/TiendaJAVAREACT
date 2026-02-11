import "./CartSummary.css";
import { useContext, useState } from "react";
import { AppContext } from "../../components/Context/AppContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createOrder } from "../../service/OrderService";
import { createPayment, verifyPayment } from "../../service/PaymentService";
import toast from "react-hot-toast";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup";

const stripePromise = loadStripe("pk_test_51SzEIn2NtqNFnnP3nlGMm52q7kBvQZZpZGEKx5wFNHeCEpJMWO4Y1o4UqS7EPIivF2o5npvUQHnsCqgDJvt5G5cN00YyamWmAK");

const CheckoutForm = ({ total, customerName, mobileNumber, cartItems, clearCart, onOrderSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    const handlePlaceOrder = async () => {
        if (!customerName || !mobileNumber) {
            toast.error("Please fill in customer details");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        setLoading(true);
        try {
            const orderRequest = {
                customerName,
                mobileNumber,
                totalAmount: total / 1.1,
                taxAmount: (total / 1.1) * 0.1,
                grandTotal: total,
                paymentMethod: paymentMethod,
                items: cartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    itemId: String(item.itemID)
                }))
            };

            if (paymentMethod === "CASH") {
                const response = await createOrder(orderRequest);
                toast.success("Order placed successfully (Cash)");
                onOrderSuccess(response.data);
                clearCart();
            } else if (paymentMethod === "STRIPE") {
                if (!stripe || !elements) {
                    toast.error("Stripe is not initialized");
                    return;
                }

                // 1. Create PaymentIntent on backend
                const paymentResponse = await createPayment(total, "usd");
                const { clientSecret } = paymentResponse;

                // 2. Create PENDING order on backend
                const orderResponse = await createOrder(orderRequest);
                const orderId = orderResponse.data.orderId;

                // 3. Confirm payment with Stripe
                const cardElement = elements.getElement(CardElement);
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: { name: customerName }
                    }
                });

                if (result.error) {
                    toast.error(result.error.message);
                } else {
                    if (result.paymentIntent.status === "succeeded") {
                        // 4. Verify payment on backend to complete order
                        const verifyResponse = await verifyPayment(result.paymentIntent.id, orderId);
                        toast.success("Payment successful! Order completed.");
                        onOrderSuccess(verifyResponse);
                        clearCart();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Order failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-auto">
            <div className="d-flex gap-2 mb-3">
                <button 
                    className={`btn ${paymentMethod === "CASH" ? "btn-success" : "btn-outline-success"} flex-grow-1 fw-bold`}
                    onClick={() => setPaymentMethod("CASH")}
                >
                    <i className="bi bi-cash me-2"></i>Cash
                </button>
                <button 
                    className={`btn ${paymentMethod === "STRIPE" ? "btn-primary" : "btn-outline-primary"} flex-grow-1 fw-bold`}
                    onClick={() => setPaymentMethod("STRIPE")}
                >
                    <i className="bi bi-credit-card me-2"></i>Stripe
                </button>
            </div>

            {paymentMethod === "STRIPE" && (
                <div className="mb-3 p-2 bg-light rounded shadow-sm" style={{ border: '1px solid #ced4da' }}>
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }} />
                </div>
            )}

            <button 
                className="btn btn-warning w-100 fw-bold py-2 shadow-sm" 
                onClick={handlePlaceOrder}
                disabled={loading}
            >
                {loading && (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                )}
                {loading ? "Processing..." : "Place Order"}
            </button>
        </div>
    );
};

const CartSummary = ({ customerName, mobileNumber }) => {
    const { cartItems, clearCart } = useContext(AppContext);
    const [showReceipt, setShowReceipt] = useState(false);
    const [orderData, setOrderData] = useState(null);
    
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxAmount = totalAmount * 0.1;
    const grandTotal = totalAmount + taxAmount;

    const handleOrderSuccess = (order) => {
        setOrderData(order);
        setShowReceipt(true);
    };

    return (
        <div className="cart-summary-container p-3 bg-dark text-light rounded shadow">
            <h4 className="mb-3">Resumen del Carrito</h4>
                
            <div className="summary-details mb-4">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light-50">Subtotal:</span>
                    <span className="text-light">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light-50">Tax (10%):</span>
                    <span className="text-light">${taxAmount.toFixed(2)}</span>
                </div>
                <hr className="border-secondary" />
                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light fw-bold">Total:</span>
                    <span className="text-light fw-bold text-warning fs-4">${grandTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <Elements stripe={stripePromise}>
                <CheckoutForm 
                    total={grandTotal} 
                    customerName={customerName} 
                    mobileNumber={mobileNumber}
                    cartItems={cartItems}
                    clearCart={clearCart}
                    onOrderSuccess={handleOrderSuccess}
                />
            </Elements>

            <ReceiptPopup 
                isOpen={showReceipt} 
                onClose={() => setShowReceipt(false)} 
                order={orderData} 
            />
        </div>
    );
}

export default CartSummary;
