import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { PencilIcon, TrashIcon, ViewIcon, ArchiveIcon } from "../utils/Icons";
import { useCurrentRole } from "@/general/hooks/useCurrentRole";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
const normalizeRole = (r = "") =>
  r
    .toString()
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");

export default function GenericTable({
  columns = [],
  data = [],
  title,
  dense = false,
  rowKey,
  showActions = true,
  currentRole,
  onView,
  onEdit,
  onDelete,
  onArchive,
  page: controlledPage,
  pageSize: controlledPageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  paginationMode = "client",
  pageSizeOptions = [5, 10, 20, 50],

  isActionDisabled,
  showViewAction = true,
  showEditAction = true,
  showArchiveAction = true,
  showDeleteAction = false,
}) {
  const hookRole = useCurrentRole();
  const effectiveRole = normalizeRole(currentRole || hookRole);
  const canEditDelete =
    effectiveRole === "ADMIN" || effectiveRole === "BIBLIOTECARIO";

  const [uncontrolledPage, setUncontrolledPage] = useState(0);
  const [uncontrolledPageSize, setUncontrolledPageSize] = useState(10);
  const requestedPage = controlledPage ?? uncontrolledPage;
  const pageSize = controlledPageSize ?? uncontrolledPageSize;

  const total =
    paginationMode === "server" ? (totalRows ?? data.length) : data.length;

  const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  const page = Math.min(requestedPage, maxPage);
  const pagedData = useMemo(() => {
    if (paginationMode === "server") return data;
    const start = page * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize, paginationMode]);

  const startRow = total === 0 ? 0 : page * pageSize + 1;
  const endRow =
    total === 0
      ? 0
      : Math.min(
          page * pageSize +
            (paginationMode === "server" ? data.length : pageSize),
          total,
        );

  const goToPage = (next) => {
    const clamped = Math.min(Math.max(next, 0), maxPage);
    if (controlledPage !== undefined) onPageChange?.(clamped);
    else setUncontrolledPage(clamped);
  };

  const setPageSize = (size) => {
    if (controlledPageSize !== undefined) onPageSizeChange?.(size);
    else {
      setUncontrolledPageSize(size);
      setUncontrolledPage(0);
    }
  };

  const getRowId = (row, idx) => {
    if (typeof rowKey === "function") return rowKey(row, idx);
    return row?.id ?? row?.libro?.cod_lib ?? row?.lector?.cod_lector ?? idx;
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}

      <div className="table-shell">
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label={title || "Tabla de registros"}
        >
          <table
            className={cx(
              "table w-full text-base",
              dense ? "table-xs" : "table-sm",
            )}
          >
            <thead className="bg-slate-200/70 text-base-content/70 text-slate-800">
              <tr>
                {columns.map((col) => (
                  <th
                    scope="col"
                    key={col.id}
                    className={cx(
                      "break-words whitespace-nowrap",
                      col.width, // respeta el width
                      col.headerClass,
                    )}
                  >
                    <div className="inline-flex items-center gap-1">
                      {col.header}
                    </div>
                  </th>
                ))}
                {showActions && (
                  <th className="w-32 text-center whitespace-nowrap font-bold text-slate-800">
                    Acciones
                  </th>
                )}
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

              {pagedData.map((row, idx) => {
                const id = getRowId(row, idx);
                return (
                  <tr key={String(id)} className="hover">
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cx(
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                          col.width, // 👈 mismo ancho que header
                          col.cellClass, // opcional para estilos extra
                        )}
                      >
                        {col.cell
                          ? col.cell(row)
                          : col.accessor
                            ? row[col.accessor] !== null &&
                              row[col.accessor] !== undefined
                              ? String(row[col.accessor])
                              : "—"
                            : null}
                      </td>
                    ))}

                    {showActions && (
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {showViewAction && (
                            <button
                              className="btn btn-ghost btn-xs btn-circle text-success"
                              aria-label="Ver"
                              title="Ver"
                              disabled={isActionDisabled?.(row)}
                              type="button"
                              onClick={() => {
                                if (onView) onView(id, row);
                                else console.log("View ID ->", id);
                              }}
                            >
                              <ViewIcon className="h-5 w-5" />
                            </button>
                          )}

                          {canEditDelete && showEditAction && (
                            <button
                              className="btn btn-ghost btn-xs btn-circle text-primary"
                              aria-label="Editar"
                              title="Editar"
                              disabled={isActionDisabled?.(row)}
                              type="button"
                              onClick={() =>
                                onEdit
                                  ? onEdit(id, row)
                                  : console.log("Edit ID ->", id)
                              }
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                          )}

                          {canEditDelete && showArchiveAction && (
                            <button
                              className="btn btn-ghost btn-xs btn-circle text-amber-600"
                              aria-label="Archivar"
                              title="Archivar"
                              disabled={isActionDisabled?.(row)}
                              type="button"
                              onClick={() =>
                                onArchive
                                  ? onArchive(id, row)
                                  : console.log("Archive ID ->", id)
                              }
                            >
                              <ArchiveIcon className="h-5 w-5" />
                            </button>
                          )}

                          {canEditDelete && showDeleteAction && (
                            <button
                              className="btn btn-ghost btn-xs btn-circle text-error"
                              aria-label="Eliminar"
                              title="Eliminar"
                              disabled={isActionDisabled?.(row)}
                              type="button"
                              onClick={() =>
                                onDelete
                                  ? onDelete(row, id)
                                  : console.log("Delete ID ->", row, id)
                              }
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer paginación igual que lo tenías */}
        <div className="table-pagination">
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

          <div className="ml-auto text-base-content/70">
            {startRow}–{endRow} de {total}
          </div>

          <div className="join hidden sm:inline-flex">
            <button
              className="btn btn-ghost btn-xs join-item"
              onClick={() => goToPage(0)}
              aria-label="Primera página"
              disabled={page <= 0}
            >
              <ChevronsLeft size={16} aria-hidden="true" />
            </button>
            <button
              className="btn btn-ghost btn-xs join-item"
              onClick={() => goToPage(page - 1)}
              aria-label="Página anterior"
              disabled={page <= 0}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              className="btn btn-ghost btn-xs join-item"
              onClick={() => goToPage(page + 1)}
              aria-label="Página siguiente"
              disabled={page >= maxPage}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
            <button
              className="btn btn-ghost btn-xs join-item"
              onClick={() => goToPage(maxPage)}
              aria-label="Última página"
              disabled={page >= maxPage}
            >
              <ChevronsRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
