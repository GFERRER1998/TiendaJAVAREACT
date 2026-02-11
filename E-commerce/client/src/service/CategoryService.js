import axios from 'axios';

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const addCategory = async (category) => {
 return await axios.post("http://localhost:8080/api/admin/categories", category, getAuthHeaders())
}

export const deleteCategory = async (categoryID) => {
 return await axios.delete(`http://localhost:8080/api/admin/categories/${categoryID}`, getAuthHeaders())
}

export const fetchCategories = async () => {
 return await axios.get("http://localhost:8080/api/categories", getAuthHeaders())
}