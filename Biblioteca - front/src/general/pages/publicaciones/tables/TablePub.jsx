import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import TableReport from "@/components/TableReport";
import { formatAutor } from "@/utils/formatAutor"; 


export function TablePub({ data = [] }) {
  const { estaCargandoPublicacion, error } =
    useSelector((state) => state.publicacion ?? {});

  // 🔹 Data ya formateada para la tabla
  const dataFormateada = useMemo(
    () =>
      data.map((pub) => ({
        ...pub,
        autor_resumen: formatAutor(pub.autor),
      })),
    [data]
  );

  const formatCod = (v) => `PUB${String(v ?? "").padStart(2, "0")}`;

  const columns = useMemo(
    () => [
      { id: "id_pub", header: "Pub Id", cell: (row) => formatCod(row?.id_pub), width: "w-5", align: "center" },
      { id: "titulo", header: "Título", accessor: "titulo", width: "w-20", align: "center" },
      { id: "autor",  header: "Autor",  accessor: "autor_resumen", width: "w-10", align: "center"},
      { id: "tipo", header: "Tipo", accessor: "tipo", width: "w-10", align: "center" },
      { id: "stock", header: "Copias", accessor: "stock", width: "w-5", align: "center" },
    ],
    []
  );

  return (
    <div>
      {estaCargandoPublicacion && (
        <div className="p-2 text-sm text-slate-600">Cargando publicaciones…</div>
      )}
      {error && !estaCargandoPublicacion && (
        <div className="p-2 text-sm text-red-600">
          Ocurrió un error: {String(error)}
        </div>
      )}
      {!estaCargandoPublicacion && !error && (
        <div className="p-0 sm:p-0">
          <TableReport
            columns={columns}
            data={dataFormateada} 
            rowKey={(r) => r.id_pub}
            showActions
          />
        </div>
      )}
    </div>
  );
}
