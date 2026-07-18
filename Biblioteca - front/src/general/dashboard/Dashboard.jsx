// src/dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../dashboard/Sidebar";
import "./Dashboard.css";
import { Icons } from "@/utils/Icons";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBreadcrumbParts } from "@/utils/navConfig";
import { useLogout } from "@/general/hooks/useLogout";
import { useSesion } from "@/general/hooks/useSesion";
import NotificationDropdown from "@/components/NotificationDropdown";

import {
  getMisNotificaciones,
  marcarNotificacionComoLeida,
  marcarTodasNotificacionesComoLeidas,
} from "@/actions/notificacionThunks";

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
  const drawerId = "app-drawer";
  const role = useSelector((s) => s.auth?.role);
  const logout = useLogout();
  const dispatch = useDispatch();

  const { section, page } = getBreadcrumbParts(location.pathname, role);

  const [isOpen, setIsOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
  );

  const { hhmmss, expired } = useSesion();
  useEffect(() => {
    if (expired) logout();
  }, [expired, logout]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => {
      if (e.matches) setIsOpen(true);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // 🔍 Slice de notificaciones
  const notificacionState = useSelector((s) => s.notificacion);
  const notificaciones   = notificacionState?.notificaciones ?? [];
  const noLeidasCount    = notificacionState?.noLeidasCount ?? 0;
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

  const handleNotificationClick = (n) => {
    // n.id viene del objeto que armamos en notificationsForDropdown
    dispatch(marcarNotificacionComoLeida(n.id));
  };

  const handleMarkAllRead = () => {
    dispatch(marcarTodasNotificacionesComoLeidas());
  };

  const notificationsForDropdown = useMemo(
    () =>
      (notificaciones ?? []).map((n) => {
        const payload = n.payload || {};
        const tituloPub   = payload.titulo_publicacion || "Publicación";
        const fechaVenc   = payload.fecha_vencimiento || "";
        const diasRest    = payload.dias_restantes;
        const diasAtraso  = payload.dias_atraso;

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
          variant,                    // 👈 para estilos en el dropdown
          hace: formatTimeAgo(n.createdAt),
          onClick: handleNotificationClick,
          raw: n,
        };
      }),
    [notificaciones] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={`drawer ${isOpen ? "drawer-open" : ""} min-h-screen`}>
      <input
        id={drawerId}
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        readOnly
      />

      <div className="drawer-content flex min-h-screen min-w-0 flex-col">
        {/* Topbar */}
        <div className="topbar w-full max-w-full h-14 shrink-0">
          <div className="flex-none">
            <button
              className="topbar__btn"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <Icons.Menu className="topbar__btn h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 pl-2">
            <span className="text-slate-500 font-medium">{section}</span>
            <span className="text-slate-300 mx-2">/</span>
            <span className="text-slate-900 font-semibold">{page}</span>
          </div>

          {/* 🔔 Notificaciones + ⏱️ Contador */}
          <div className="flex items-center gap-3 mr-2">
            <NotificationDropdown
              notifications={notificationsForDropdown}
              badgeCount={noLeidasCount}
              loading={estaCargandoNoti}
              onMarkAllRead={handleMarkAllRead}
            />

            <span
              className="inline-flex items-center rounded-lg px-3 py-1 text-xl font-semibold
                         bg-zinc-50 text-slate-700"
              title="Tiempo restante de sesión"
            >
              {hhmmss}
            </span>
          </div>

          <div className="flex-none">
            <button
              className="topbar__btn"
              aria-label="Salir"
              onClick={logout}
            >
              <Icons.ExitDoor className="h-7 w-7" />
            </button>
          </div>
        </div>

        <main className="main__wrap flex-1 bg-slate-100">
          <div className="content-scroll-x w-full overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Sidebar drawerId={drawerId} />
    </div>
  );
}
