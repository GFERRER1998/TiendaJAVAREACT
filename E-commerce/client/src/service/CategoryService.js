import axios from 'axios';

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const addCategory = async (category) => {
 return await axios.post("http://35.193.146.253:8080/api/admin/categories", category, getAuthHeaders())
}

export const deleteCategory = async (categoryID) => {
 return await axios.delete(`http://35.193.146.253:8080/api/admin/categories/${categoryID}`, getAuthHeaders())
}

export const fetchCategories = async () => {
 return await axios.get("http://35.193.146.253:8080/api/categories", getAuthHeaders())
}