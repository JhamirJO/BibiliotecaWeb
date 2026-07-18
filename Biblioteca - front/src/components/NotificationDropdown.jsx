// src/components/NotificationDropdown.jsx
import React from "react";
import { Icons } from "@/utils/Icons";

export default function NotificationDropdown({
  notifications = [],
  badgeCount,
  loading = false,
  onMarkAllRead,
}) {
  const hasNotifications = notifications.length > 0;

  // si no pasa badgeCount, usamos el tamaño de la lista
  const effectiveBadge =
    typeof badgeCount === "number" ? badgeCount : notifications.length;
  const showBadge = effectiveBadge > 0;

  const getVariantClasses = (variant) => {
    switch (variant) {
      case "danger":
        return {
          card: "border-red-200 bg-rose-50 hover:bg-rose-100",
          tagBg: "bg-red-100",
          tagText: "text-red-700",
        };
      case "info":
        return {
          card: "border-sky-200 bg-white hover:bg-sky-50",
          tagBg: "bg-sky-50",
          tagText: "text-sky-700",
        };
      default:
        return {
          card: "border-slate-200 bg-white hover:bg-slate-50",
          tagBg: "bg-slate-50",
          tagText: "text-slate-700",
        };
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        role="button"
        className="topbar__btn btn-ghost relative"
        aria-label="Notificaciones"
      >
        <Icons.Notifacion className="h-7 w-7" />

        {showBadge && (
          <span
            className="absolute -top-1 -right-1 inline-flex items-center justify-center 
                       rounded-full bg-red-500 text-white text-[10px] h-4 min-w-4 px-1"
          >
            {effectiveBadge > 9 ? "9+" : effectiveBadge}
          </span>
        )}
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content bg-base-100 rounded-2xl z-20 w-80 p-0 shadow-xl border border-slate-200"
      >
        {/* Header */}
        <li className="px-4 py-3 border-b border-slate-200 bg-slate-700 rounded-t-2xl">
          <span className="block text-center text-[14px] font-semibold text-white">
            Notificaciones
          </span>
        </li>

        {/* Contenido */}
        <li className="max-h-80 overflow-y-auto px-2 py-2 space-y-1">
          {loading && (
            <div className="px-2 py-2">
              <span className="text-sm text-slate-400">Cargando...</span>
            </div>
          )}

          {!loading && !hasNotifications && (
            <div className="px-2 py-2">
              <span className="text-sm text-slate-500">
                No tienes notificaciones nuevas
              </span>
            </div>
          )}

          {!loading &&
            hasNotifications &&
            notifications.map((n) => {
              const { card, tagBg, tagText } = getVariantClasses(n.variant);

              return (
                <button
                  key={n.id}
                  type="button"
                  className="w-full text-left"
                  onClick={() => n.onClick?.(n)}
                >
                  <div
                    className={`border rounded-xl px-3 py-2 transition-colors ${card}`}
                  >
                    {n.etiqueta && (
                      <div
                        className={`inline-flex items-center rounded-full px-2 py-0.5 mb-1 ${tagBg}`}
                      >
                        <span
                          className={`text-[11px] uppercase tracking-wide font-bold ${tagText}`}
                        >
                          {n.etiqueta}
                        </span>
                      </div>
                    )}

                    <div className="text-sm text-slate-800">
                      {n.mensaje}
                    </div>

                    {n.hace && (
                      <div className="text-[11px] text-slate-400 mt-1">
                        {n.hace}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
        </li>

        {/* Footer */}
        {hasNotifications && onMarkAllRead && (
          <li className="border-t border-slate-200 bg-slate-700 rounded-b-2xl">
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-[12px] font-semibold 
                         text-white hover:bg-slate-600 transition-colors"
              onClick={onMarkAllRead}
            >
              Marcar todas como leídas
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
