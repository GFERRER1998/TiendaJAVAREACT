import axios from 'axios';

const registerUser = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/register', {
            name: "Admin User",
            email: "new_admin@tienda.com",
            password: "12345",
            role: "ADMIN"
        });
        console.log("User registered successfully:", response.data);
    } catch (error) {
        if (error.response) {
            console.error("Error response status:", error.response.status);
            console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
};

registerUser();
