// src/components/EstadoPill.jsx
import React from "react";

const STYLES = {
  ACTIVO: {
    wrap: "bg-green-100 text-accent-content",
    dot: "bg-accent-content",
    label: "Activo",
  },
  DEVUELTO: {
    wrap: "bg-slate-300 text-slate-800",
    dot: "bg-slate-800",
    label: "Devuelto",
  },
  DEVUELTO_TARDE: {
    wrap: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "Retraso",
  },

  SANCIONADO:{
    wrap: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "Sancionado",
  },

  INACTIVO:{
    wrap: "bg-yellow-200 text-yellow-700",
    dot: "bg-yellow-700",
    label: "Inactivo",
  },
  
  DISPONIBLE: {
    wrap: "bg-green-100 text-accent-content",
    dot: "bg-accent-content",
    label: "Disponible",
  },

  NO_DISPONIBLE:{
    wrap: "bg-yellow-200 text-yellow-700",
    dot: "bg-yellow-700",
    label: "No Disponible",
  }
};

export default function EstadoPill({ estado = "" }) {
  const key = String(estado).toUpperCase();
  const s = STYLES[key] ?? {
    wrap: "bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
    label: estado || "—",
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.wrap}`}>
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
