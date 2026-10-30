// src/pages/lector/TableLector.jsx
import React, { useMemo } from "react";
import GenericTable from "../../../../components/GenericTable";
import EstadoPill from "@/components/EstadoPill";

export function TableLector({ data = [], onView, onEdit, onArchive, onDelete }) {
  const columns = useMemo(
    () => [
      { id: "dni", header: "DNI", cell: (row) => row.persona?.dni, align: "center" },
      { id: "nombre", header: "Nombre",cell: (row) => `${row.persona?.nombre ?? ""} ${row.persona?.apellido ?? ""}`.trim(),  align: "center"  },
      { id: "telefono", header: "Teléfono", cell: (row) => row.persona?.telefono, align: "center" },
      { id: "direccion", header: "Dirección", cell: (row) => row.lector?.direccion,align: "center" },
      { id: "rol", header: "Rol",  cell: (row) => row.usuario?.rol,align: "center" },
      { id: "estado", header: "Estado", cell: (row) => <EstadoPill estado={row.lector?.estado} />,align: "center"  }
    ],
    []
  );

  return (
    <GenericTable
      columns={columns}
      data={data}
      rowKey={(r) => r.lector?.cod_l}
      showActions
      onView={onView}
      onEdit={onEdit}
      onArchive={onArchive}
      onDelete={onDelete}
      showDeleteAction={true}
    />
  );
}
