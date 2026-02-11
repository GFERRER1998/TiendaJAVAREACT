import { useState, useEffect } from "react";
import { LatestOrder } from "../../service/OrderService";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
     const   fetchOrders=async()=>{
        setLoading(true);
        try {
            const response = await LatestOrder();
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
     }
     fetchOrders();
    },[])
    

    const formatItems = (items) => {
        if (!items) return "";
        return items.map((item) => `${item.name} x ${item.quantity}`).join(", ");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    }
    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }
    if (orders.length === 0) {
        return <div className="text-center py-4">No orders found</div>;
    }


    return (
        <div className="Order-History-container">
            <h2 className="mb-4 text-light">Order History</h2>
            <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.orderId || order.id}</td>
                                <td>
                                    <div>{order.customerName}</div>
                                    <small className="text-muted">{order.mobileNumber}</small>
                                </td>
                                <td>{formatItems(order.items)}</td>
                                <td>${order.grandTotal || order.totalAmount}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <span className={`badge ${order.paymentDetails?.status === "COMPLETED" ? "bg-success" : "bg-warning text-dark"}`}>
                                        {order.paymentDetails?.status || "PENDING"}
                                    </span>
                                </td>
                                <td>
                                    {formatDate(order.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderHistory
