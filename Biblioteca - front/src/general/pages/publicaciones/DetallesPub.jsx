// src/components/DetallesPub.jsx
import React, { useMemo } from "react";
import portadaFallback from "../../../img/NoImagen.png";

const urlBack  = import.meta.env.VITE_APP_BACKEND_URL;
const apiPub   = import.meta.env.VITE_APP_API_Publicacion;

/* Badge (chips) */
const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs text-slate-700">
    {children}
  </span>
);

const Skeleton = () => <div className="h-4 rounded bg-slate-200 animate-pulse" />;

const coalesce = (obj, keys = []) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

/* Normaliza autores a array de strings */
function parseAutores(autorField) {
  if (!autorField) return [];
  if (Array.isArray(autorField)) return autorField.map(a => String(a).trim()).filter(Boolean);
  return String(autorField).split(";").map(a => a.trim()).filter(Boolean);
}

/* ⬅️ NUEVO: toma cod_p (o id_pub) desde publicacion/libro/articulo/tesis */
function getCodPub(detalle) {
  return (
    detalle?.publicacion?.cod_p ??
    detalle?.publicacion?.id_pub ??
    detalle?.libro?.cod_p ??
    detalle?.libro?.id_pub ??
    detalle?.articulo?.cod_p ??
    detalle?.articulo?.id_pub ??
    detalle?.tesis?.cod_p ??
    detalle?.tesis?.id_pub ??
    null
  );
}

export default function DetallesPub({ open, onClose, tipo, detalle, loading, error }) {
  if (!open) return null;

  const pub = detalle?.publicacion;
  const autores = parseAutores(pub?.autor);

  /* ⬅️ NUEVO: construye la URL de portada con fallback local */
  const portadaSrc = useMemo(() => {
    const codPub = getCodPub(detalle);
    return codPub ? `${urlBack}${apiPub}/portada/${codPub}` : portadaFallback;
  }, [detalle]);

  const porTipo = {
    Libro: [
      { label: "ID libro", value: detalle?.libro?.cod_lib },
      { label: "Género", value: detalle?.libro?.genero },
      { label: "Edición", value: detalle?.libro?.edicion },
    ],
    "Artículo": [
      { label: "ID artículo", value: detalle?.articulo?.cod_a },
      { label: "Área", value: detalle?.articulo?.area },
      { label: "Año", value: coalesce(detalle?.articulo, ["anio_pub", "año_pub"]) },
      { label: "Idioma", value: detalle?.articulo?.idioma },
      { label: "Volumen", value: detalle?.articulo?.volumen },
      { label: "Número (issue)", value: detalle?.articulo?.numero_issue },
      { label: "Título de revista", value: detalle?.articulo?.titulo_revista },
    ],
    Tesis: [
      { label: "ID tesis", value: detalle?.tesis?.cod_t },
      { label: "Grado", value: detalle?.tesis?.grado },
      { label: "Escuela", value: detalle?.tesis?.escuela },
      { label: "Institución", value: detalle?.tesis?.institucion },
      { label: "Idioma", value: detalle?.tesis?.idioma },
      { label: "Área", value: detalle?.tesis?.area },
      { label: "Palabras clave", value: detalle?.tesis?.palabras_clave },
    ],
  };

  return (
    <dialog open className="modal">
      <div className="modal-box max-w-4xl p-0 overflow-hidden h-[90vh] max-h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-full min-h-0">
          {/* Izquierda */}
          <aside className="bg-slate-700 text-slate-50 p-5 md:p-6 flex flex-col">
            <div className="rounded-lg overflow-hidden aspect-[3/4] ring-1 ring-black/10">
              <img
                src={portadaSrc}
                alt="Portada"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = portadaFallback; }}
              />
            </div>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wide text-slate-300">{tipo}</div>
              <h2 className="mt-1 text-lg font-semibold leading-snug">{pub?.titulo ?? "—"}</h2>
            </div>
          </aside>

          {/* Derecha con scroll interno */}
          <section className="bg-slate-50 p-5 md:p-6 flex flex-col h-full min-h-0">
            {/* Chips */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {tipo && <Badge>{tipo}</Badge>}
              {pub?.stock !== undefined && <Badge>Stock: {pub.stock}</Badge>}
              {pub?.cant_pag !== undefined && <Badge>Páginas: {pub.cant_pag}</Badge>}
              {pub?.id_pub !== undefined && <Badge>ID Pub: {pub.id_pub}</Badge>}
            </div>

            {/* Scrollable */}
            <div className="mt-5 flex-1 min-h-0 overflow-y-auto pr-1 space-y-5">
              {loading && (
                <div className="space-y-2">
                  <Skeleton /><Skeleton /><Skeleton /><Skeleton />
                </div>
              )}

              {!loading && error && (
                <div className="p-3 rounded-lg border border-red-200 text-red-700 bg-red-50">
                  {String(error)}
                </div>
              )}

              {!loading && !error && detalle && (
                <>
                  {pub?.resumen && (
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">Resumen</div>
                      <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {pub.resumen}
                      </p>
                    </div>
                  )}

                  {autores.length > 0 && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                        Autor/Autores
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {autores.map((a, i) => <Badge key={i}>{a}</Badge>)}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                      Ficha técnica
                    </div>
                    <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                      {(porTipo[tipo] ?? []).filter(i => i.value !== undefined && i.value !== null && i.value !== "").map(({ label, value }, i) => (
                        <div key={label + i} className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-x-4 gap-y-1 px-4 py-3">
                          <dt className="text-[12px] uppercase tracking-wide text-slate-500">{label}</dt>
                          <dd className="text-[12px] text-slate-800">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )}
            </div>

            <div className="modal-action mt-4 pt-2 border-t border-slate-200 shrink-0">
              <button className="btn bg-slate-600 text-white hover:bg-slate-500" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}
