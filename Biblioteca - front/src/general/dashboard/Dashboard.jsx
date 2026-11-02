// src/dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../dashboard/Sidebar";
import Brand from "@/components/layout/Brand";
import { Link } from "react-router-dom";
import { Icons } from "@/utils/Icons";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBreadcrumbParts, getDefaultDashboardPath } from "@/utils/navConfig";
import { useLogout } from "@/general/hooks/useLogout";
import { useSesion } from "@/general/hooks/useSesion";
import NotificationDropdown from "@/components/NotificationDropdown";

import {
  getMisNotificaciones,
  marcarNotificacionComoLeida,
  marcarTodasNotificacionesComoLeidas,
} from "@/actions/notificacionThunks";

const EMPTY_NOTIFICATIONS = [];

function formatTimeAgo(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs)) return "";

  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "justo ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `hace ${diffHr} h`;

  const diffDay = Math.floor(diffHr / 24);
  return `hace ${diffDay} d`;
}

export default function Dashboard() {
  const location = useLocation();
  const role = useSelector((s) => s.auth?.role);
  const logout = useLogout();
  const dispatch = useDispatch();

  const { page } = getBreadcrumbParts(location.pathname, role);

  const [isOpen, setIsOpen] = useState(false);
  const username = useSelector((state) => state.auth?.username) || "Usuario";
  const isReader = role === "LECTOR";
  const roleLabel =
    {
      ADMIN: "Administrador",
      BIBLIOTECARIO: "Bibliotecario",
      LECTOR: "Lector",
    }[role] || role;
  const initials = username
    .split(/[.\s_-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const { hhmmss, expired } = useSesion();
  useEffect(() => {
    if (expired) logout();
  }, [expired, logout]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const media = window.matchMedia("(min-width: 801px)");
    const onResize = () => {
      if (media.matches) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onResize);
    };
  }, []);

  // 🔍 Slice de notificaciones
  const notificacionState = useSelector((s) => s.notificacion);
  const notificaciones =
    notificacionState?.notificaciones ?? EMPTY_NOTIFICATIONS;
  const noLeidasCount = notificacionState?.noLeidasCount ?? 0;
  const estaCargandoNoti = notificacionState?.estaCargandoNoti ?? false;

  // 🔁 Polling de notificaciones (solo no leídas)
  useEffect(() => {
    const REFRESH_MS = 30_000; // 30 segundos, ajusta si quieres

    // primera carga
    dispatch(getMisNotificaciones(true));

    // intervalo
    const intervalId = setInterval(() => {
      dispatch(getMisNotificaciones(true));
    }, REFRESH_MS);

    // cleanup
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleNotificationClick = useCallback(
    (n) => {
      // n.id viene del objeto que armamos en notificationsForDropdown
      dispatch(marcarNotificacionComoLeida(n.id));
    },
    [dispatch],
  );

  const handleMarkAllRead = () => {
    dispatch(marcarTodasNotificacionesComoLeidas());
  };

  const notificationsForDropdown = useMemo(
    () =>
      (notificaciones ?? []).map((n) => {
        const payload = n.payload || {};
        const tituloPub = payload.titulo_publicacion || "Publicación";
        const fechaVenc = payload.fecha_vencimiento || "";
        const diasRest = payload.dias_restantes;
        const diasAtraso = payload.dias_atraso;

        let etiqueta = "";
        let mensaje = "";
        let variant = "info"; // info | danger | default

        switch (n.tipo) {
          case "PRESTAMO_POR_VENCER":
            etiqueta = "Préstamo por vencer";
            variant = "info";
            if (diasRest != null) {
              mensaje = `El préstamo de "${tituloPub}" vence en ${diasRest} día(s)${
                fechaVenc ? ` (${fechaVenc})` : ""
              }.`;
            } else {
              mensaje = `El préstamo de "${tituloPub}" vence mañana${
                fechaVenc ? ` (${fechaVenc})` : ""
              }.`;
            }
            break;

          case "PRESTAMO_VENCIDO":
            etiqueta = "Préstamo vencido";
            variant = "danger";
            if (diasAtraso != null) {
              mensaje = `El préstamo de "${tituloPub}" está vencido desde ${
                fechaVenc || "hace tiempo"
              } ( ${diasAtraso} día(s) de atraso ).`;
            } else {
              mensaje = `El préstamo de "${tituloPub}" está vencido${
                fechaVenc ? ` desde ${fechaVenc}` : ""
              }.`;
            }
            break;

          default:
            etiqueta = "Notificación";
            variant = "default";
            mensaje = tituloPub;
            break;
        }

        return {
          id: n.id_notificacion,
          tipo: n.tipo,
          etiqueta,
          mensaje,
          variant, // 👈 para estilos en el dropdown
          hace: formatTimeAgo(n.createdAt),
          onClick: handleNotificationClick,
          raw: n,
        };
      }),
    [notificaciones, handleNotificationClick],
  );

  return (
    <div className={`workspace${isReader ? " workspace--reader" : ""}`}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <header className="workspace-header">
        <div className="workspace-header__inner">
          {!isReader && (
            <button
              className="header-icon mobile-menu"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              aria-controls="workspace-navigation"
            >
              <Icons.Menu size={22} />
            </button>
          )}
          <Brand inverse to={getDefaultDashboardPath(role)} />
          {isReader ? (
            <Sidebar reader onNavigate={() => setIsOpen(false)} />
          ) : (
            <span className="workspace-caption">Gestión bibliotecaria</span>
          )}
          <div className="workspace-actions">
            <NotificationDropdown
              notifications={notificationsForDropdown}
              badgeCount={noLeidasCount}
              loading={estaCargandoNoti}
              onMarkAllRead={handleMarkAllRead}
            />
            <div
              className="session-countdown"
              title="Tiempo restante de sesión"
            >
              <span>Sesión restante</span>
              <strong>{hhmmss}</strong>
            </div>
            <Link to="/dashboard/perfil" className="account-link">
              <span className="account-avatar">{initials}</span>
              <span className="account-label">
                <strong>{username}</strong>
                <small>{roleLabel}</small>
              </span>
            </Link>
            <button
              className="header-icon"
              aria-label="Cerrar sesión"
              onClick={logout}
            >
              <Icons.ExitDoor size={21} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>
      {!isReader && (
        <>
          <Sidebar isOpen={isOpen} onNavigate={() => setIsOpen(false)} />
          {isOpen && (
            <button
              className="navigation-backdrop"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
            />
          )}
        </>
      )}
      <main
        id="main-content"
        className="workspace-main"
        data-view={location.pathname.split("/").pop()}
        aria-label={page}
      >
        <Outlet />
      </main>
      <footer className="workspace-footer">
        <span>© {new Date().getFullYear()} · Portal bibliotecario</span>
      </footer>
    </div>
  );
}
