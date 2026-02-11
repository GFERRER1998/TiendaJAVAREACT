import Menubar from "./components/menubar/Menubar"
import { Routes, Route, useLocation } from "react-router-dom"
import Explorar from "./pages/Explorar/Explorar"
import ManageItems from "./pages/Productos/Productos"
import ManageCategory from "./pages/Categorias/Categorias"
import ManageUsers from "./pages/Usuarios/Usuarios"
import { Login } from "./pages/Login/Login"
import { Toaster } from "react-hot-toast"
import OrderHistory from "./components/OrdenHistory/OrdenHistory"
import Dashboard from "./components/Dashboard/Dashboard"
import ProtectedRoute from "./components/Routes/ProtectedRoute"
import LoginRoute from "./components/Routes/LoginRoute"
import NotFound from "./components/NotFound/NotFound"

const App = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/login" && <Menubar />}
      <Toaster />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explorar" element={<Explorar />} />
          
          {/*Admin only routes*/}
          <Route path="/category" element={<ProtectedRoute element={<ManageCategory />} adminOnly={true} />} />
          <Route path="/users" element={<ProtectedRoute element={<ManageUsers />} adminOnly={true} />} />
          <Route path="/items" element={<ProtectedRoute element={<ManageItems />} adminOnly={true} />} />

          <Route path="/login" element={<LoginRoute element={<Login />} />} />
          <Route path="/orders" element={<OrderHistory />} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
