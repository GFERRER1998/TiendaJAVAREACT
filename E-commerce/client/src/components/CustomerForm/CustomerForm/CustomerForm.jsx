import "./CustomerForm.css";

const CustomerForm = ({ customerName, setCustomerName, mobileNumber, setMobileNumber }) => {
    return (
        <div className="d-flex flex-column gap-3">
            <div className="row align-items-center">
                <label htmlFor="customerName" className="col-5 col-form-label text-light">Customer Name</label>
                <div className="col-7">
                    <input type="text" className="form-control" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
            </div>
            <div className="row align-items-center">
                <label htmlFor="mobilenumber" className="col-5 col-form-label text-light">Mobile Number</label>
                <div className="col-7">
                    <input type="text" className="form-control" id="mobilenumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

export default CustomerForm;