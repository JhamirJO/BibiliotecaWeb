import { useEffect, useId, useRef, useState } from "react";
import { Bell, BellOff, CheckCheck, CircleAlert } from "lucide-react";

export default function NotificationDropdown({
  notifications = [],
  badgeCount,
  loading = false,
  onMarkAllRead,
}) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const id = useId();
  const count =
    typeof badgeCount === "number" ? badgeCount : notifications.length;
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div className="notification-root" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="header-icon notification-trigger"
        aria-label={`Notificaciones: ${count} sin leer`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={21} strokeWidth={1.7} />
        {count > 0 && (
          <span className="notification-count">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      {open && (
        <section
          className="notification-panel"
          id={id}
          aria-label="Notificaciones"
        >
          <header>
            <h2>Notificaciones</h2>
            {notifications.length > 0 && (
              <button
                type="button"
                className="text-button"
                onClick={onMarkAllRead}
              >
                <CheckCheck size={15} />
                Marcar todas
              </button>
            )}
          </header>
          <div className="notification-list">
            {loading ? (
              <p className="notification-empty" role="status">
                Cargando notificaciones…
              </p>
            ) : !notifications.length ? (
              <div className="notification-empty">
                <BellOff size={25} />
                <p>No tienes notificaciones pendientes.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={`notification-item notification-item--${notification.variant || "default"}`}
                  onClick={() => notification.onClick?.(notification)}
                >
                  <span className="notification-item__icon">
                    <CircleAlert size={19} />
                  </span>
                  <span>
                    <strong>{notification.etiqueta}</strong>
                    <span className="notification-message">
                      {notification.mensaje}
                    </span>
                    <small>{notification.hace}</small>
                  </span>
                </button>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
