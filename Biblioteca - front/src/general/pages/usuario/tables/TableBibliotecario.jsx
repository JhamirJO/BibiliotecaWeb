// src/pages/lector/TableBibliotecario.jsx
import React, { useMemo } from "react";
import GenericTable from "../../../../components/GenericTable";

export function TableBibliotecario({ data = [], onView, onEdit, onDelete }) {
  const formatCod = (v) => `BIBL25${String(v ?? "").padStart(2, "0")}`;

  const columns = useMemo(
    () => [
      { id: "codigo", header: "Código", cell: (row) => formatCod(row.bibliotecario?.cod_b),align: "center"  },
      { id: "dni", header: "DNI", cell: (row) => row.persona?.dni,align: "center" },
      { id: "nombre", header: "Nombre", cell: (row) => `${row.persona?.nombre ?? ""} ${row.persona?.apellido ?? ""}`.trim(),align: "center"  },
      { id: "telefono", header: "Teléfono", cell: (row) => row.persona?.telefono,align: "center"  },
      { id: "rol", header: "Rol", cell: (row) => row.usuario?.rol,align: "center" },
    ],
    []
  );

  return (
    <GenericTable
      columns={columns}
      data={data}        
      rowKey={(r) => r.bibliotecario?.cod_b}
      showActions
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}

      showArchiveAction={false}
      showDeleteAction={true}
    />
  );
}
