// src/general/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/general/pages/LandingPage";
import LoginPage from "@/general/pages/Login/LoginPage";
import Dashboard from "../dashboard/Dashboard";
import Usuario from "../pages/usuario/Usuario.jsx";
import Publicaciones from "../pages/publicaciones/Publicaciones.jsx";
import Prestamo from "../pages/prestamo/Prestamo.jsx";
import Devolucion from "../pages/devoluciones/Devolucion.jsx";
import Reporte from "../pages/reporte/Reporte.jsx";
import Sancion from "../pages/sanciones/Sancion";
import Perfil from "../pages/perfil/Perfil.jsx";
import PublicacionCatalogo  from "../pages/publicaciones/PublicacionCatalogo.jsx";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import { getDefaultDashboardPath } from "@/utils/navConfig";
import Comprobante from "@/components/Comprobante";
import PrestamoHistorial from "../pages/prestamo/PrestamoHistorial";
import CambiarContraseña from "../pages/perfil/CambiarContraseña";

function DashboardIndex() {
  const role = useSelector(s => s.auth?.role);
  const target = getDefaultDashboardPath(role) || "/dashboard/perfil";
  return <Navigate to={target} replace />;
}

export const AppRoutes = () => (
  <Routes>
    {/* Público */}
    <Route path="/home" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/comprobante" element={<Comprobante />} />
    {/* Privado */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardIndex />} />
        <Route path="usuarios" element={<Usuario />} />
        <Route path="publicaciones" element={<Publicaciones />} />
        <Route path="prestamo" element={<Prestamo />} />
        <Route path="devoluciones" element={<Devolucion />} />
        <Route path="reporte" element={<Reporte />} />
        <Route path="sancion" element={<Sancion />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="catalogo" element ={<PublicacionCatalogo />} />
        <Route path="historial" element ={<PrestamoHistorial/>} />
        <Route path="cambiar-password" element={<CambiarContraseña />} />

      </Route>
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);
