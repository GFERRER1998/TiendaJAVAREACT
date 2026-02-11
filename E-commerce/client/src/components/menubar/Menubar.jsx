import { Link, useNavigate, useLocation } from "react-router-dom";
import "./menubar.css";
import { assets } from "../../assets/assets";
import { useContext, useEffect } from "react";
import { AppContext } from "../Context/AppContext";

const Menubar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useContext(AppContext);

    const isAdmin = auth?.role === "ADMIN";

    const isActive = ({ path }) => location.pathname === path;

    // Auth state is now handled by AppContext initialization and ProtectedRoutes
    // This useEffect is no longer strictly necessary but kept for cross-tab sync if not in AppContext
    useEffect(() => {
        // AppContext handles the initial load from localStorage synchronously
    }, []);

    const Logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuth(null, null);
        navigate("/login");
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2">
            <Link className="navbar-brand" to="/">
                <img src={assets.logo} alt="Logo" height="40" />
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse p-2" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive({ path: "/dashboard" }) || isActive({ path: "/" }) ? "fw-bold text-warning" : ""}`} to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive({ path: "/explorar" }) ? "fw-bold text-warning" : ""}`} to="/explorar">Explorar</Link>
                    </li>
                    {isAdmin && (
                        <>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive({ path: "/items" }) ? "fw-bold text-warning" : ""}`} to="/items">Productos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive({ path: "/category" }) ? "fw-bold text-warning" : ""}`} to="/category">Categorias</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive({ path: "/users" }) ? "fw-bold text-warning" : ""}`} to="/users">Usuarios</Link>
                            </li>
                        </>
                    )}
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive({ path: "/orders" }) ? "fw-bold text-warning" : ""}`} to="/orders">Ordenes</Link>
                    </li>
                </ul>
                {/*Add the dropdown for userprofile*/}
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={assets.profile_icon} alt="Profile" width="32" height="32" className="rounded-circle" />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><a className="dropdown-item" href="#!">Perfil</a></li>
                            <li><a className="dropdown-item" href="#!">Settings</a></li>
                            <li><a className="dropdown-item" href="#!">Activity log</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item" onClick={Logout}>Logout</button>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                         <Link className="nav-link" to="/registro">Registrarse</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Menubar
 