// src/general/routes/ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { isRouteAllowed, getDefaultDashboardPath } from "@/utils/navConfig";

export default function ProtectedRoute() {
  const { token, exp, role } = useSelector(s => s.auth || {});
  const { pathname } = useLocation();
  const expired = !exp || exp * 1000 <= Date.now();

  // No autenticado
  if (!token || expired) {
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }

  // Autenticado pero sin rol aún (pasa si tu store carga tarde)
  if (!role) return null; // o un loader/spinner

  // Sin permiso → ir al dashboard por defecto del rol (o perfil)
  if (!isRouteAllowed(role, pathname)) {
    const fallback = getDefaultDashboardPath(role) || "/dashboard/perfil";
    if (pathname !== fallback) return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
