// src/features/prestamo/TablePrestamo.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import EstadoPill from "@/components/EstadoPill";
import TableReport from "@/components/TableReport";

export default function TablePrestamo({ data = [] }) {
  const { estaCargandoPrestamo, error } = useSelector(
    (state) => state.prestamo ?? {},
  );

  const columns = useMemo(
    () => [
      {
        id: "id_p",
        header: "ID P.",
        accessor: "id_p",
        width: "w-20",
        align: "center",
      },
      {
        id: "dni_p",
        header: "DNI",
        accessor: "dni_p",
        width: "w-20",
        align: "center",
      },
      {
        id: "nombre",
        header: "Nombre",
        cell: (row) => `${row?.nombre ?? ""} ${row?.apellido ?? ""}`.trim(),
        width: "w-25",
        align: "center",
      },
      {
        id: "titulo",
        header: "Título",
        cell: (row) => (
          <span className="line-clamp-3 max-w-xs"> {row?.titulo ?? ""}</span>
        ),
        width: "w-70",
        align: "center",
      },
      {
        id: "fecha_p",
        header: "F. Préstamo",
        accessor: "fecha_p",
        width: "w-22",
        align: "center",
      },
      {
        id: "fecha_max",
        header: "F. Máxima",
        accessor: "fecha_max",
        width: "w-22",
        align: "center",
      },
      {
        id: "fecha_e",
        header: "F. Devolución",
        accessor: "fecha_e",
        width: "w-22",
        align: "center",
      },
      {
        id: "estado",
        header: "Estado",
        cell: (row) => <EstadoPill estado={row?.estado} />,
        width: "w-25",
        align: "center",
      },
    ],
    [],
  );

  return (
    <div className="loans-table">
      {estaCargandoPrestamo && (
        <div className="p-2 text-sm text-slate-600">Cargando préstamos…</div>
      )}
      {error && !estaCargandoPrestamo && (
        <div className="p-2 text-sm text-red-600">
          Ocurrió un error: {String(error)}
        </div>
      )}
      {!estaCargandoPrestamo && !error && (
        <div className="p-0 sm:p-0">
          <TableReport
            columns={columns}
            data={data}
            rowKey={(r) => r.id_p}
            showActions
          />
        </div>
      )}
    </div>
  );
}
