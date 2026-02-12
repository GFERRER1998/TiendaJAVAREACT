import axios from "axios";

export const LatestOrder = async () => {
    return await axios.get("http://35.193.146.253:8080/api/orders/latest", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
};

export const createOrder = async (order) => {
    return await axios.post("http://35.193.146.253:8080/api/orders", order, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
};

export const deleteOrder = async (id) => {
    return await axios.delete(`http://35.193.146.253:8080/api/orders/${id}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
};
