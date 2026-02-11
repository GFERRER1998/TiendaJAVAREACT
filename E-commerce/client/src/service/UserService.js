import axios from "axios";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const addUser = async (user) => {
    return await axios.post("http://localhost:8080/api/admin/users", user, getAuthHeaders())
}

export const deleteUser = async (userID) => {
    return await axios.delete(`http://localhost:8080/api/admin/users/${userID}`, getAuthHeaders())
}

export const fetchUsers = async () => {
    return await axios.get("http://localhost:8080/api/admin/users", getAuthHeaders())
}