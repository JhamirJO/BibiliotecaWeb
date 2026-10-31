import { lazy } from "react";
// src/general/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
const LandingPage = lazy(() => import("@/general/pages/LandingPage"));
const LoginPage = lazy(() => import("@/general/pages/Login/LoginPage"));
import Dashboard from "../dashboard/Dashboard";
const Usuario = lazy(() => import("../pages/usuario/Usuario.jsx"));
const Publicaciones = lazy(
  () => import("../pages/publicaciones/Publicaciones.jsx"),
);
const Prestamo = lazy(() => import("../pages/prestamo/Prestamo.jsx"));
const Devolucion = lazy(() => import("../pages/devoluciones/Devolucion.jsx"));
const Reporte = lazy(() => import("../pages/reporte/Reporte.jsx"));
const Sancion = lazy(() => import("../pages/sanciones/Sancion"));
const Perfil = lazy(() => import("../pages/perfil/Perfil.jsx"));
const PublicacionCatalogo = lazy(
  () => import("../pages/publicaciones/PublicacionCatalogo.jsx"),
);
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import { getDefaultDashboardPath } from "@/utils/navConfig";
const Comprobante = lazy(() => import("@/components/Comprobante"));
const PrestamoHistorial = lazy(
  () => import("../pages/prestamo/PrestamoHistorial"),
);
const CambiarContraseña = lazy(
  () => import("../pages/perfil/CambiarContraseña"),
);

function DashboardIndex() {
  const role = useSelector((s) => s.auth?.role);
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
        <Route path="catalogo" element={<PublicacionCatalogo />} />
        <Route path="historial" element={<PrestamoHistorial />} />
        <Route path="cambiar-password" element={<CambiarContraseña />} />
      </Route>
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);
