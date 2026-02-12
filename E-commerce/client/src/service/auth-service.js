import axios from "axios";

export const login = async (data) => {
    return await axios.post("http://35.193.146.253:8080/api/login", data);
}
