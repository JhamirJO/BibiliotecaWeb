import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import RecordFields from "@/components/layout/RecordFields";
import EstadoPill from "@/components/EstadoPill";
import useRecordView from "@/general/hooks/useRecordView";
import portadaFallback from "@/img/NoImagen.png";
const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPub = import.meta.env.VITE_APP_API_Publicacion;
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
  if (Array.isArray(autorField))
    return autorField.map((a) => String(a).trim()).filter(Boolean);
  return String(autorField)
    .split(";")
    .map((a) => a.trim())
    .filter(Boolean);
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

export default function DetallesPub({
  open,
  onClose,
  tipo,
  detalle,
  loading,
  error,
}) {
  const root = useRecordView(open, onClose);
  const pub = detalle?.publicacion;
  const autores = parseAutores(pub?.autor);
  const portadaSrc = useMemo(() => {
    const id = getCodPub(detalle);
    return id ? `${urlBack}${apiPub}/portada/${id}` : portadaFallback;
  }, [detalle]);
  if (!open) return null;
  const porTipo = {
    Libro: [
      { label: "ID libro", value: detalle?.libro?.cod_lib },
      { label: "Género", value: detalle?.libro?.genero },
      { label: "Edición", value: detalle?.libro?.edicion },
    ],
    Artículo: [
      { label: "ID artículo", value: detalle?.articulo?.cod_a },
      { label: "Área", value: detalle?.articulo?.area },
      {
        label: "Año",
        value: coalesce(detalle?.articulo, ["anio_pub", "año_pub"]),
      },
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

  const kind = tipo === "Articulo" ? "Artículo" : tipo;
  const technical = [
    ...(porTipo[kind] || []),
    { label: "Páginas", value: pub?.cant_pag },
    { label: "Copias", value: pub?.stock },
  ].filter(
    (item) =>
      item.value !== undefined && item.value !== null && item.value !== "",
  );
  return (
    <section
      ref={root}
      className="record-page publication-detail-page"
      aria-label="Ficha de publicación"
    >
      <PageHeader
        title="Detalle de publicación"
        section="Catálogo bibliográfico"
        description="Información de la publicación y disponibilidad en biblioteca."
      >
        <button type="button" className="btn" onClick={onClose}>
          <ArrowLeft size={17} />
          Volver al listado
        </button>
      </PageHeader>
      {loading ? (
        <div className="panel record-loading" role="status">
          <span className="loading" />
          Cargando ficha de publicación…
        </div>
      ) : error ? (
        <div className="alert alert-error" role="alert">
          {String(error)}
        </div>
      ) : !detalle ? (
        <div className="panel empty-state">No hay información disponible.</div>
      ) : (
        <div className="publication-detail-layout">
          <aside className="publication-detail-cover">
            <div className="publication-detail-image">
              <img
                src={portadaSrc}
                alt={`Portada de ${pub?.titulo || "la publicación"}`}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = portadaFallback;
                }}
              />
            </div>
            <div className="publication-stock">
              <EstadoPill estado={pub?.estado} />
              <span>{pub?.stock ?? "—"} copias en biblioteca</span>
            </div>
          </aside>
          <article className="panel publication-detail-content">
            <div className="publication-detail-heading">
              <span className="eyebrow">
                {kind} · PUB{String(getCodPub(detalle) ?? "").padStart(2, "0")}
              </span>
              <h2>{pub?.titulo || "Sin título"}</h2>
              <p className="publication-detail-author">
                {autores.join(" · ") || "Autor no registrado"}
              </p>
            </div>
            <section className="record-content-section">
              <h3>Resumen</h3>
              <p className="publication-summary">
                {pub?.resumen ||
                  "Esta publicación no cuenta con un resumen registrado."}
              </p>
            </section>
            <section className="record-content-section">
              <h3>Ficha técnica</h3>
              <RecordFields items={technical} />
            </section>
          </article>
        </div>
      )}
    </section>
  );
}
