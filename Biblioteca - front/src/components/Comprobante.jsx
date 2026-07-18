// @/components/Comprobante.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EstadoPill from "@/components/EstadoPill";
import { getPrestamo } from "@/actions/prestamoThunks";
import { useSearchParams } from "react-router-dom";
import icon from "@/img/libro.png";
import "./comprobante.css"; // <--- nuevo import

const formatCodigo = (n) => `LIB-${String(n ?? 0).toString().padStart(3, "0")}`;

function estadoGlobal(rows = []) {
  const s = new Set(rows.map((r) => String(r?.estado ?? "").toUpperCase()));
  if (s.has("DEVUELTO_TARDE")) return "DEVUELTO_TARDE";
  if (s.has("ACTIVO")) return "ACTIVO";
  if (s.has("DEVUELTO")) return "DEVUELTO";
  return rows[0]?.estado ?? "—";
}

export default function Comprobante() {
  const dispatch = useDispatch();
  const [search] = useSearchParams();
  const urlCid = search.get("cid");
  const autoPrint = search.get("autoprint") === "1";
  const compact = search.get("compact") === "1"; // activa modo compacto

  const {
    lista: prestamos = [],
    estaCargandoLista,
    errorLista: error,
  } = useSelector((s) => s.prestamo ?? {});

  useEffect(() => {
    if (!prestamos.length) dispatch(getPrestamo());
  }, [dispatch, prestamos.length]);

  // Agrupar por comprobante
  const grupos = useMemo(() => {
    const map = new Map();
    for (const row of prestamos) {
      const cid = row?.comprobante_id;
      if (cid == null) continue;
      if (!map.has(cid)) map.set(cid, []);
      map.get(cid).push(row);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([cid, rows]) => ({ comprobanteId: cid, rows }));
  }, [prestamos]);


  // Selección automática por ?cid o el más reciente
  const [selId, setSelId] = useState(null);
  useEffect(() => {
    if (!grupos.length) return;
    const cidNum = urlCid ? Number(urlCid) : null;
    if (cidNum && grupos.some((g) => g.comprobanteId === cidNum)) {
      setSelId(cidNum);
    } else if (selId == null) {
      setSelId(grupos[0].comprobanteId);
    }
  }, [grupos, urlCid, selId]);

  const seleccionado = useMemo(
    () => grupos.find((g) => g.comprobanteId === selId),
    [grupos, selId]
  );

  const items = useMemo(() => {
    if (!seleccionado) return [];
    return [...seleccionado.rows].sort(
      (a, b) => (a.cod_pub ?? 0) - (b.cod_pub ?? 0)
    );
  }, [seleccionado]);

  const nombre = useMemo(() => {
    if (!items.length) return "—";
    const n = items[0]?.nombre ?? "";
    const a = items[0]?.apellido ?? "";
    return `${n} ${a}`.trim() || "—";
  }, [items]);
  const dni = useMemo(() => items[0]?.dni_p || "—", [items]);
  const estado = useMemo(() => estadoGlobal(items), [items]);

  const handlePrint = () => window.print();

  // Auto imprimir
  useEffect(() => {
    if (autoPrint && seleccionado && !estaCargandoLista) {
      const t = setTimeout(() => handlePrint(), 150);
      return () => clearTimeout(t);
    }
  }, [autoPrint, seleccionado, estaCargandoLista]);

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center py-6">
      {/* ===== Hoja (aplica .compact según query) ===== */}
      <div className={`sheet ${compact ? "compact" : ""}`}>
        {/* Encabezado */}
        <div className="flex items-start justify-between avoid-break">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl soft-bg flex items-center justify-center text-slate-700">
              <img src={icon} className="h-5 w-5" />
            </div>
            <div>
              <div className={`${compact ? "text-base" : "text-lg"} font-bold`}>Biblioteca</div>
              <div className={`${compact ? "text-[11px]" : "text-sm"} text-slate-500`}>
                Comprobante de préstamo
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">N° Comprobante</div>
            <div className={`${compact ? "text-xl" : "text-3xl"} font-extrabold text-slate-700`}>
              {selId}
            </div>
          </div>
        </div>

        {/* Mensajes */}
        {estaCargandoLista && (
          <div className="mt-3 text-sm text-slate-600">Cargando préstamos…</div>
        )}
        {error && !estaCargandoLista && (
          <div className="mt-3 text-sm text-red-600">Ocurrió un error: {String(error)}</div>
        )}

        {/* Contenido */}
        {!estaCargandoLista && !error && seleccionado && (
          <>
            {/* Estado / Usuario */}
            <div
              className={`mt-3 grid grid-cols-1 md:grid-cols-2 ${
                compact ? "gap-3" : "gap-4"
              } grid-print-2 avoid-break`}
            >
              <div className={`rounded-xl border border-slate-200 soft-bg ${compact ? "p-3" : "p-4"}`}>
                <div className="text-[10px] text-slate-500">Nombre</div>
                <div className="font-semibold">{nombre}</div>
                <div className="mt-1.5 text-[10px] text-slate-500">DNI</div>
                <div className="font-semibold">{dni}</div>
              </div>

              <div className={`rounded-xl border border-slate-200 soft-bg ${compact ? "p-3" : "p-4"}`}>
                <div className="text-[10px] text-slate-500">Estado</div>
                <div className="mt-1">
                  <EstadoPill estado={estado} />
                </div>
                <div className="mt-2 text-[10px] text-slate-500">Código</div>
                <div className="font-semibold">{formatCodigo(selId)}</div>
              </div>
            </div>

            {/* Tabla */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 avoid-break">
              <table className="w-full print-table">
                <thead className="soft-header text-slate-700 text-xs">
                  <tr>
                    <th className="text-left px-2 py-1.5 col-id font-semibold">Id. Pub</th>
                    <th className="text-left px-2 py-1.5 font-semibold">Título</th>
                    <th className="text-left px-2 py-1.5 col-fp font-semibold">F. Préstamo</th>
                    <th className="text-left px-2 py-1.5 col-fm font-semibold">F. Máx. Devolución</th>
                  </tr>
                </thead>
                <tbody className="text-xs leading-tight">
                  {items.map((it) => (
                    <tr key={it.id_p}>
                      <td className="px-2 py-1.5">{it.cod_pub}</td>
                      <td className="px-2 py-1.5 whitespace-normal break-words">{it.titulo}</td>
                      <td className="px-2 py-1.5">{it.fecha_p}</td>
                      <td className="px-2 py-1.5">{it.fecha_max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Firmas + notas */}
            <div className={`${compact ? "mt-10" : "mt-20"} grid grid-cols-2 ${compact ? "gap-6" : "gap-8"} avoid-break`}>
              <div className="text-center text-[11px] text-slate-500">
                <div className="border-t border-dashed border-slate-300 pt-2">Firma del usuario</div>
              </div>
              <div className="text-center text-[11px] text-slate-500">
                <div className="border-t border-dashed border-slate-300 pt-2">Firma del bibliotecario</div>
              </div>
            </div>

            <div className="mt-10 text-[10px] text-slate-500 space-y-1 avoid-break">
              <div>• La no devolución en la fecha máxima genera sanciones y/o multas.</div>
              <div>• El usuario es responsable del buen estado del material prestado.</div>
              <div>• Conserve este comprobante para cualquier aclaración.</div>
            </div>
          </>
        )}
      </div>

      {/* Botón (no se imprime) */}
      <div className="no-print w-[210mm] mt-3 flex justify-end">
        <button
          type="button"
          className="btn btn-xs bg-slate-700 text-white hover:bg-slate-600"
          onClick={handlePrint}
          disabled={!seleccionado}
          title="Imprimir / Guardar como PDF"
        >
          Imprimir / PDF
        </button>
      </div>
    </div>
  );
}
