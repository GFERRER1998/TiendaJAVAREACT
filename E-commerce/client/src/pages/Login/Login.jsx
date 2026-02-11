import "./Login.css";
import { useState, useContext } from "react";
import { AppContext } from "../../components/Context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../../service/auth-service.js";

export const Login = () => {
    const { setAuth } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name]: value
        })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(data);
            // Verify if the login was successful based on your API response structure
            // Assuming the token is directly in response.data or response.data.token
            if (response.status === 200) { 
                toast.success("Login successful");
                // Adjust these keys based on your actual API response (e.g., response.data.token)
                const token = response.data.token; 
                const role = response.data.role;

                if (token) {
                    console.log("Login details:", { token, role });
                    localStorage.setItem("token", token);
                    localStorage.setItem("role", role);
                    // Update context
                    setAuth (response.data.token, response.data.role);
                    navigate("/dashboard");
                } else {
                    toast.error("Login failed: No token received");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Email/Password invalid");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-light d-flex align-items-center justify-content-center vh-100 login-background">
            <div className="card shadow-lg w-100" style={{ maxWidth: "480px" }}>
                <div className="card-body">
                    <div className="text-center">
                        <h1 className="card-title">Login</h1>
                        <p className="card-text text-muted">Login to your account</p>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label text-muted">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    id="email"
                                    onChange={onChangeHandler}
                                    value={data.email}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label text-muted">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    id="password"
                                    onChange={onChangeHandler}
                                    value={data.password}
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-dark btn-lg" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
