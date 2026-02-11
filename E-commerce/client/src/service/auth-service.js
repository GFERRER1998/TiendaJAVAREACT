import axios from "axios";

export const login = async (data) => {
    return await axios.post("http://localhost:8080/api/login", data);
}
