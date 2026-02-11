import { useState, useEffect } from "react";
import { getDashboardData } from "../../service/Dashboard";
import { toast } from "react-hot-toast";
import "./dashboard.css";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getDashboardData();
                setData(response.data);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
                toast.error("No se pudieron cargar los datos del dashboard");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="loading">Cargando dashboard...</div>;
    }

    if (!data) {
        return <div className="error">Error al cargar los datos.</div>;
    }

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <h1 className="mb-4">Dashboard</h1>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-currency-dollar"></i>
                        </div>
                        <div className="stat-content">
                            <h3>Ventas de Hoy</h3>
                            <p>${data.todaySale.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-cart-check"></i>
                        </div>
                        <div className="stat-content">
                            <h3>Pedidos de Hoy</h3>
                            <p>{data.todayOrderCount}</p>
                        </div>
                    </div>
                </div>

                <div className="recent-orders-card">
                    <h3 className="recent-orders-title">
                        <i className="bi bi-clock-history"></i>
                        Pedidos Recientes
                    </h3>
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Método</th>
                                    <th>Estado</th>
                                    <th>Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders.map(order => (
                                    <tr key={order.orderId}>
                                        <td>{order.orderId?.substring(0, 8) || "N/A"}</td>
                                        <td>{order.customerName}</td>
                                        <td>${order.grandTotal.toFixed(2)}</td>
                                        <td>
                                            <span className="payment-badge">
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${order.paymentDetails?.status?.toLowerCase()}`}>
                                                {order.paymentDetails?.status || "PENDING"}
                                            </span>
                                        </td>
                                        <td>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;