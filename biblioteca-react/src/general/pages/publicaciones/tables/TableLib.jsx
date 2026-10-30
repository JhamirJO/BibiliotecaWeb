// src/general/pages/publicaciones/tables/TableLib.jsx
import React, { useMemo } from "react";
import GenericTable from "../../../../components/GenericTable";
import EstadoPill from "@/components/EstadoPill";

export function TableLib({ data = [], onView, onEdit, onArchive }) {
  const formatCod = (v) => `LIB${String(v ?? "").padStart(2, "0")}`;

  const columns = useMemo(
    () => [
      { id: "cod_lib", header: "Libro Id", cell: (r) => formatCod(r.libro?.cod_lib), width: "w-15", align: "center",},
      { id: "titulo", header: "Título", cell: (r) => r.publicacion?.titulo, width: "w-65", align: "center", },
      { id: "autor", header: "Autor", cell: (r) => r.publicacion?.autor, width: "w-65", align: "center", },
      { id: "genero", header: "Género", cell: (r) => r.libro?.genero, width: "w-40", align: "center", },
      { id: "stock", header: "Copias", cell: (r) => r.publicacion?.stock, width: "w-15", align: "center", },
      { id: "estado", header: "Estado", cell: (row) => <EstadoPill estado={row.publicacion?.estado} />,align: "center"  }
    ],
    []
  );

  return (
    <GenericTable
      columns={columns}
      data={data}
      rowKey={(r) => r.libro?.cod_lib}
      showActions
      onView={onView}
      onEdit={onEdit}
      onArchive={(idRow, row) => {
        const pubId = row.publicacion?.id_pub;
        if (!pubId) return;
        onArchive?.(pubId);   // 👈 aquí ya mandas sólo el id de la publicación
      }}

      showArchiveAction={true}
    />
  );
}
