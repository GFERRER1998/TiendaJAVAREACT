import "./ReceiptPopup.css";

const ReceiptPopup = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const {
        orderId,
        customerName,
        mobileNumber,
        items,
        totalAmount,
        taxAmount,
        grandTotal,
        paymentMethod,
        transactionId,
        paymentId,
        paymentDetails
    } = order;

    const displayPaymentId = paymentId || paymentDetails?.stripePaymentId;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="receipt-overlay">
            <div className="receipt-container shadow-lg rounded">
                <div className="receipt-header text-center">
                    <div className="success-icon mb-2">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h1 className="h3 fw-bold">Order Receipt</h1>
                </div>

                <div className="receipt-details mt-4">
                    <p className="mb-1"><strong>Order ID:</strong> {orderId || "N/A"}</p>
                    <p className="mb-1"><strong>Name:</strong> {customerName}</p>
                    <p className="mb-1"><strong>Phone:</strong> {mobileNumber}</p>
                </div>

                <hr className="my-4" />

                <div className="receipt-items-section">
                    <h3 className="h5 fw-bold mb-3">Items Ordered</h3>
                    <div className="receipt-items-list">
                        {items?.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between mb-2">
                                <span className="item-name">
                                    {item.name} <span className="text-muted">x{item.quantity}</span>
                                </span>
                                <span className="item-price fw-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="my-4" />

                <div className="receipt-totals">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">Subtotal:</span>
                        <span>${totalAmount?.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">Tax (10%):</span>
                        <span>${taxAmount?.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold fs-5">Grand Total:</span>
                        <span className="fw-bold fs-5">${grandTotal?.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">Payment Method:</span>
                        <span>{paymentMethod}</span>
                    </div>
                </div>

                {(transactionId || displayPaymentId) && (
                    <div className="receipt-payment-ids mt-4 pt-3 border-top">
                        {transactionId && <p className="mb-1 small"><strong>Transaction ID:</strong> {transactionId}</p>}
                        {displayPaymentId && <p className="mb-1 small"><strong>Payment ID:</strong> {displayPaymentId}</p>}
                    </div>
                )}

                <div className="receipt-actions d-flex gap-2 mt-5">
                    <button className="btn btn-warning flex-grow-1 fw-bold shadow-sm" onClick={handlePrint}>
                        Print Receipt
                    </button>
                    <button className="btn btn-danger flex-grow-1 fw-bold shadow-sm" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPopup;
