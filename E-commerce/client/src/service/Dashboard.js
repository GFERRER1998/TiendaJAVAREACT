import axios from "axios";

const API_URL = "http://localhost:8080/api/dashboard";

export const getDashboardData = async () => {
    const token = localStorage.getItem("token");
    return await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};