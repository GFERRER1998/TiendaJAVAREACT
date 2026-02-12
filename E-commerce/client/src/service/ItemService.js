import axios from "axios";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const addItem = async (item) => {
    return await axios.post("http://35.193.146.253:8080/api/items", item, getAuthHeaders())
}   

export const deleteItem = async (itemID) => {
    return await axios.delete(`http://35.193.146.253:8080/api/admin/items/${itemID}`, getAuthHeaders())
}

export const fetchItems = async () => {
    return await axios.get("http://35.193.146.253:8080/api/items", getAuthHeaders())
}