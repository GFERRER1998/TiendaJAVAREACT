import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { auth } = useContext(AppContext);

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && auth.role !== "ADMIN") {
    // If route requires admin and user is not admin, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default ProtectedRoute;
