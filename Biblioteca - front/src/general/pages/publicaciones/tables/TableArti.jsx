// src/general/pages/publicaciones/tables/TableArti.jsx
import React, { useMemo } from "react";
import GenericTable from "../../../../components/GenericTable";
import { formatAutor } from "@/utils/formatAutor";
import EstadoPill from "@/components/EstadoPill";

export function TableArti({ data = [], onView, onEdit, onArchive }) {
  const formatCod = (v) => `ARTI${String(v ?? "").padStart(2, "0")}`;

  const columns = useMemo(
    () => [
      { id: "cod_a", header: "Artículo Id", cell: (r) => formatCod(r.articulo?.cod_a), width: "w-15", align: "center", },
      { id: "titulo", header: "Título", cell: (r) => r.publicacion?.titulo, width: "w-80", align: "center", },
      { id: "autor", header: "Autor", cell: (r) => formatAutor(r.publicacion?.autor), width: "w-35", align: "center",},     
      { id: "anio_pub", header: "Año", cell: (r) => r.articulo?.anio_pub ?? r.articulo?.["año_pub"], width: "w-10", align: "center",},
      { id: "stock", header: "Copias", cell: (r) => r.publicacion?.stock, width: "w-15", align: "center",},
      { id: "estado", header: "Estado", cell: (row) => <EstadoPill estado={row.publicacion?.estado} />,align: "center"  }
    ],
    []
  );

  return (
    <GenericTable
      columns={columns}
      data={data}
      rowKey={(r) => r.articulo?.cod_a}
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
