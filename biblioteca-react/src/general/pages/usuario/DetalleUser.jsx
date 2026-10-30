// src/components/DetalleUser.jsx
import React, { useMemo, useEffect, useRef } from "react";

/* Chips generales (por si los quieres usar luego) */
const EMPTY_RECORD = Object.freeze({});

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-medium text-slate-700">
    {children}
  </span>
);

/* Chip especial para estado (ACTIVO / INACTIVO) */
const StatusBadge = ({ estado }) => {
  if (!estado) return null;
  const isActive = String(estado).toUpperCase() === "ACTIVO";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
          : "bg-rose-100 text-rose-700 border border-rose-200"
      }`}
    >
      ● {estado}
    </span>
  );
};

const Skeleton = () => (
  <div className="h-4 rounded bg-slate-200 animate-pulse" />
);

const hasValue = (v) =>
  v !== undefined && v !== null && String(v).trim() !== "";

const getInitials = (nombre, apellido) => {
  const n = (nombre || "").trim().charAt(0);
  const a = (apellido || "").trim().charAt(0);
  const both = `${n}${a}`.toUpperCase();
  return both || "U";
};

export default function DetalleUser({
  open,
  onClose,
  tipo, // "Lector" | "Bibliotecario"
  detalle, // { user, persona, lector?, biblio? }
  loading,
  error,
}) {
  const user = detalle?.user ?? detalle?.usuario ?? EMPTY_RECORD;
  const persona = detalle?.persona ?? EMPTY_RECORD;
  const lector = detalle?.lector ?? EMPTY_RECORD;
  const biblio = detalle?.biblio ?? EMPTY_RECORD;

  const fullName =
    `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim() || "Sin nombre";

  const initials = useMemo(
    () => getInitials(persona.nombre, persona.apellido),
    [persona.nombre, persona.apellido],
  );

  const secciones = useMemo(() => {
    // campos que ya se muestran en el panel izquierdo
    const labelsLadoIzq = [
      "Código de lector",
      "Usuario",
      "Email",
      "Rol",
      "Estado",
    ];

    const datosPersonalesItems = [
      { label: "DNI", value: persona.dni },
      { label: "Nombre", value: persona.nombre },
      { label: "Apellido", value: persona.apellido },
      { label: "Teléfono", value: persona.telefono },
    ];

    const cuentaItems = [
      { label: "Usuario", value: user.username },
      { label: "Email", value: user.email },
      { label: "Rol", value: user.rol },
    ];

    let base = [];

    if (tipo === "Lector") {
      // 🔹 Un solo bloque: DATOS DE LECTOR (incluye Dirección)
      base = [
        {
          titulo: "Datos de lector",
          items: [
            ...datosPersonalesItems,
            { label: "Dirección", value: lector.direccion },
          ],
        },
        {
          titulo: "Cuenta",
          items: cuentaItems,
        },
      ];
    } else {
      // 🔹 Caso general (bibliotecario u otros)
      base = [
        {
          titulo: "Datos personales",
          items: datosPersonalesItems,
        },
        {
          titulo: "Cuenta",
          items: cuentaItems,
        },
      ];

      if (tipo === "Bibliotecario") {
        base.push({
          titulo: "Datos de bibliotecario",
          items: [
            { label: "Código", value: biblio.cod_biblio },
            { label: "Sede", value: biblio.sede },
          ],
        });
      }
    }

    return base
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          (i) => hasValue(i.value) && !labelsLadoIzq.includes(i.label),
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [persona, user, lector, biblio, tipo]);

  const dialogRef = useRef(null);
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      previous?.focus?.();
    };
  }, [open]);
  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label="Detalle de usuario"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-box max-w-4xl p-0 overflow-hidden h-[90vh] max-h-[90vh] rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] h-full min-h-0">
          {/* Panel izquierdo */}
          <aside className="bg-slate-700 text-slate-50 p-5 md:p-6 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-900/40 flex items-center justify-center text-2xl font-semibold">
                {initials}
              </div>

              <div className="min-w-0">
                <h2 className="mt-1 text-lg font-semibold leading-snug truncate">
                  {fullName}
                </h2>
                {hasValue(user.email) && (
                  <p className="mt-1 text-xs text-slate-200 truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            {/* Datos de cuenta */}
            <div className="mt-5 space-y-2 text-[13px]">
              {hasValue(lector.estado) && (
                <p className="flex justify-between items-center gap-2">
                  <span className="text-slate-300">Estado</span>
                  <StatusBadge estado={lector.estado} />
                </p>
              )}

              {hasValue(lector.cod_l) && (
                <p className="flex justify-between gap-2">
                  <span className="text-slate-300">Código lector</span>
                  <span className="font-medium text-slate-50">
                    {lector.cod_l}
                  </span>
                </p>
              )}

              {hasValue(user.username) && (
                <p className="flex justify-between gap-2">
                  <span className="text-slate-300">Usuario</span>
                  <span className="font-medium text-slate-50">
                    {user.username}
                  </span>
                </p>
              )}

              {hasValue(user.email) && (
                <p className="flex justify-between gap-2">
                  <span className="text-slate-300">Email</span>
                  <span className="font-medium text-slate-50">
                    {user.email}
                  </span>
                </p>
              )}

              {hasValue(user.rol) && (
                <p className="flex justify-between gap-2">
                  <span className="text-slate-300">Rol</span>
                  <span className="font-medium text-slate-50">{user.rol}</span>
                </p>
              )}
            </div>
          </aside>

          {/* Panel derecho */}
          <section className="bg-slate-50 p-5 md:p-6 flex flex-col h-full min-h-0">
            <div className="mt-1 flex-1 min-h-0 overflow-y-auto pr-1 space-y-5">
              {loading && (
                <div className="space-y-2">
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              )}

              {!loading && error && (
                <div className="p-3 rounded-lg border border-red-200 text-red-700 bg-red-50">
                  {String(error)}
                </div>
              )}

              {!loading && !error && detalle && (
                <>
                  {secciones.map((sec) => (
                    <div key={sec.titulo}>
                      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                        {sec.titulo}
                      </div>
                      <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
                        {sec.items.map(({ label, value }, i) => (
                          <div
                            key={label + i}
                            className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-x-4 gap-y-1 px-4 py-3"
                          >
                            <dt className="text-[12px] uppercase tracking-wide text-slate-500">
                              {label}
                            </dt>
                            <dd className="text-[13px] text-slate-800 break-words">
                              {String(value)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}

                  {secciones.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No hay información adicional para este usuario.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="modal-action mt-4 pt-2 border-t border-slate-200 shrink-0">
              <button
                className="btn bg-slate-600 text-white hover:bg-slate-500"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}
