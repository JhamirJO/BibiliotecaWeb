import React, { useMemo, useState } from "react";
import { PencilIcon, TrashIcon, ViewIcon } from "../utils/Icons";


  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  export default function TableReport({
    columns = [],
    data = [],
    title,
    dense = false,
    rowKey,
    showActions = true,


    /** NUEVO: props de paginación (controladas o no) */
    page: controlledPage,                 // número de página (0-index) si controlas desde afuera
    pageSize: controlledPageSize,         // tamaño de página si controlas desde afuera
    totalRows,                            // total global (necesario en servidor)
    onPageChange,                         // callback (servidor)
    onPageSizeChange,                     // callback (servidor)
    paginationMode = "client",            // "client" | "server"
    pageSizeOptions = [5, 10, 20, 50],    // opciones del selector
  }) {
    // Estado interno solo si NO está controlado
    const [uncontrolledPage, setUncontrolledPage] = useState(0);
    const [uncontrolledPageSize, setUncontrolledPageSize] = useState(10);

    const page = controlledPage ?? uncontrolledPage;
    const pageSize = controlledPageSize ?? uncontrolledPageSize;

    // total a usar (en cliente = data.length; en servidor = prop totalRows)
    const total = paginationMode === "server" ? (totalRows ?? data.length) : data.length;

    // datos a renderizar
    const pagedData = useMemo(() => {
      if (paginationMode === "server") {
        // ya te llega la "página actual" desde el back
        return data;
      }
      const start = page * pageSize;
      const end = start + pageSize;
      return data.slice(start, end);
    }, [data, page, pageSize, paginationMode]);

    const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
    const startRow = total === 0 ? 0 : page * pageSize + 1;
    const endRow = total === 0
      ? 0
      : Math.min((page * pageSize) + (paginationMode === "server" ? data.length : pageSize), total);

    // helpers para cambiar página / tamaño
    const goToPage = (next) => {
      const clamped = Math.min(Math.max(next, 0), maxPage);
      if (controlledPage !== undefined) {
        onPageChange?.(clamped);
      } else {
        setUncontrolledPage(clamped);
      }
    };

    const setPageSize = (size) => {
      if (controlledPageSize !== undefined) {
        onPageSizeChange?.(size);
      } else {
        setUncontrolledPageSize(size);
        setUncontrolledPage(0); // reinicia a primera página
      }
    };

    return (
      <div className="w-full">
        {title && (
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-300 shadow-sm">
          <div className="overflow-x-auto">
            <table className={cx("table w-full table-fixed text-base", dense ? "table-xs" : "table-sm")}>
              <thead className="bg-slate-200/70 text-base-content/70 text-slate-800">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      className={cx(
                        "break-words whitespace-nowrap text-center",
                        col.width,
                        col.headerClass
                        
                      )}
                      style={col.style}  
                    >
                      <div className="inline-flex items-center gap-1">
                        {col.header}
                      </div>
                    </th>
                  ))}
                  
                </tr>
              </thead>

              <tbody>
                {pagedData.length === 0 && (
                  <tr>
                    <td colSpan={columns.length + (showActions ? 1 : 0)}>
                      <div className="py-10 text-center text-base-content/10">
                        Sin registros
                      </div>
                    </td>
                  </tr>
                )}

                {pagedData.map((row, idx) => (
                  <tr key={String(rowKey ? rowKey(row, idx) : idx)} className="hover">
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cx(
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                          col.width,                 // 👈 mismo ancho que header
                          col.cellClass,             // 👈 clases extra de celda
                          col.truncate && "truncate whitespace-nowrap overflow-hidden" // 👈 truncado opcional
                        )}
                        style={col.style} 
                      >
                        {col.cell
                          ? col.cell(row)
                          : col.accessor
                          ? (row[col.accessor] ?? row[col.accessor] === 0 ? String(row[col.accessor]) : "—")
                          : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer de paginación (FUNCIONAL) */}
          <div className="flex items-center justify-between gap-4 border-t border-base-200 bg-base-100 px-4 py-2 text-sm">
            {/* Page size */}
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-base-content/70">Filas por página:</span>
              <select
                className="select select-xs select-ghost inline-block w-auto"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Range */}
            <div className="ml-auto text-base-content/70">
              {startRow}–{endRow} de {total}
            </div>

            {/* Pager */}
            <div className="join hidden sm:inline-flex">
              <button
                className="btn btn-ghost btn-xs join-item"
                aria-label="Primera"
                onClick={() => goToPage(0)}
                disabled={page <= 0}
              >
                «
              </button>
              <button
                className="btn btn-ghost btn-xs join-item"
                aria-label="Anterior"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 0}
              >
                ‹
              </button>
              <button
                className="btn btn-ghost btn-xs join-item"
                aria-label="Siguiente"
                onClick={() => goToPage(page + 1)}
                disabled={page >= maxPage}
              >
                ›
              </button>
              <button
                className="btn btn-ghost btn-xs join-item"
                aria-label="Última"
                onClick={() => goToPage(maxPage)}
                disabled={page >= maxPage}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
