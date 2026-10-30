const STATES = {
  ACTIVO: ["Activo", "green"],
  DEVUELTO: ["Devuelto", "green"],
  DEVUELTO_TARDE: ["Retraso", "red"],
  SANCIONADO: ["Sancionado", "red"],
  INACTIVO: ["Inactivo", "amber"],
  DISPONIBLE: ["Disponible", "green"],
  NO_DISPONIBLE: ["No disponible", "muted"],
  PENDIENTE: ["Pendiente", "amber"],
  VENCIDO: ["Vencido", "red"],
};
export default function EstadoPill({ estado = "" }) {
  const [label, color] = STATES[String(estado).toUpperCase()] || [
    estado || "—",
    "muted",
  ];
  return <span className={`status-pill status-pill--${color}`}>{label}</span>;
}
