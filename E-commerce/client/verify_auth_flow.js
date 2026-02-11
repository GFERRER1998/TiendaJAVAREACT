import axios from 'axios';

const verifyFlow = async () => {
    const timestamp = Date.now();
    const email = `test_user_${timestamp}@example.com`;
    const password = "password123";
    const name = "Test User";
    const role = "ADMIN";

    console.log(`Starting Auth Flow Verification...`);
    console.log(`Target Email: ${email}`);

    // 1. Register
    try {
        console.log("Attempting Registration...");
        const regResponse = await axios.post('http://localhost:8080/api/register', {
            name,
            email,
            password,
            role
        });
        console.log("Registration Successful!", regResponse.data);
    } catch (error) {
        console.error("Registration Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
        return; // Stop if registration fails
    }

    // 2. Login
    try {
        console.log("Attempting Login...");
        const loginResponse = await axios.post('http://localhost:8080/api/login', {
            email,
            password
        });
        
        if (loginResponse.status === 200 && loginResponse.data.token) {
            console.log("Login Successful!");
            console.log("Token received:", loginResponse.data.token.substring(0, 20) + "...");
            console.log("Role:", loginResponse.data.role);
        } else {
            console.log("Login succeeded but response format unexpected:", loginResponse.data);
        }

    } catch (error) {
        console.error("Login Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
};

verifyFlow();
