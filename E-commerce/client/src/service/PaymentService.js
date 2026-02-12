import axios from "axios";

const API_URL = "http://35.193.146.253:8080/api/payment";

export const createPayment = async (amount, currency = "usd") => {
    const response = await axios.post(`${API_URL}/create`, {
        amount,
        currency
    }, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    return response.data;
};

export const verifyPayment = async (paymentIntentId, orderId) => {
    const response = await axios.post(`${API_URL}/verify`, {
        paymentIntentId,
        orderId
    }, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    return response.data;
};
