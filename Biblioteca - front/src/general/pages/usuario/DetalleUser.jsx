import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import RecordFields from "@/components/layout/RecordFields";
import EstadoPill from "@/components/EstadoPill";
import useRecordView from "@/general/hooks/useRecordView";

export default function DetalleUser({
  open,
  onClose,
  tipo,
  detalle,
  loading,
  error,
}) {
  const root = useRecordView(open, onClose);
  if (!open) return null;
  const user = detalle?.user ?? detalle?.usuario ?? {};
  const persona = detalle?.persona ?? {};
  const lector = detalle?.lector ?? {};
  const bibliotecario = detalle?.bibliotecario ?? detalle?.biblio ?? {};
  const fullName =
    `${persona.nombre || ""} ${persona.apellido || ""}`.trim() || "Sin nombre";
  const initials =
    `${(persona.nombre || "").charAt(0)}${(persona.apellido || "").charAt(0)}`.toUpperCase() ||
    "U";
  const code =
    tipo === "Lector"
      ? lector.cod_l
      : (bibliotecario.cod_b ?? bibliotecario.cod_biblio);
  const state = lector.estado || bibliotecario.estado;
  const personal = [
    { label: "DNI", value: persona.dni },
    { label: "Nombre", value: persona.nombre },
    { label: "Apellido", value: persona.apellido },
    { label: "Teléfono", value: persona.telefono },
    ...(tipo === "Lector"
      ? [{ label: "Dirección", value: lector.direccion }]
      : bibliotecario.sede
        ? [{ label: "Sede", value: bibliotecario.sede }]
        : []),
  ];
  return (
    <section
      ref={root}
      className="record-page user-detail-page"
      aria-label="Detalle de usuario"
    >
      <PageHeader
        title="Detalle de usuario"
        section="Usuarios"
        description="Información personal y datos de la cuenta."
      >
        <button className="btn" type="button" onClick={onClose}>
          <ArrowLeft size={17} />
          Volver a usuarios
        </button>
      </PageHeader>
      {loading ? (
        <div className="panel record-loading" role="status">
          <span className="loading" />
          Cargando datos del usuario…
        </div>
      ) : error ? (
        <div className="alert alert-error" role="alert">
          {String(error)}
        </div>
      ) : !detalle ? (
        <div className="panel empty-state">No hay información disponible.</div>
      ) : (
        <article className="panel record-profile">
          <header className="record-profile-head">
            <span className="record-avatar">{initials}</span>
            <div>
              <h2>{fullName}</h2>
              <p>
                {tipo} · Código {code ?? "—"}
              </p>
            </div>
            {state && <EstadoPill estado={state} />}
          </header>
          <div className="record-profile-body">
            <section className="record-content-section">
              <h3>Datos personales</h3>
              <RecordFields items={personal} />
            </section>
            <section className="record-content-section">
              <h3>Cuenta de usuario</h3>
              <RecordFields
                items={[
                  { label: "Usuario", value: user.username },
                  { label: "Correo electrónico", value: user.email },
                  { label: "Rol", value: user.rol },
                ]}
              />
            </section>
          </div>
        </article>
      )}
    </section>
  );
}
