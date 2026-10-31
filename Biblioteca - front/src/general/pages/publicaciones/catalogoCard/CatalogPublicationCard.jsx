import CardImage from "@/components/CardImage";
import { formatAutor } from "@/utils/formatAutor";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPub = import.meta.env.VITE_APP_API_Publicacion;

export default function CatalogPublicationCard({
  entry,
  kind,
  formatId,
  onClickDetalles,
}) {
  const { publicacion = {} } = entry;
  const details =
    kind === "LIBRO"
      ? entry.libro
      : kind === "ARTICULO"
        ? entry.articulo
        : entry.tesis;
  const id =
    details?.cod_lib ?? details?.cod_a ?? details?.cod_t ?? publicacion.id_pub;
  const code = formatId(kind, id);
  const stock = Number(publicacion.stock ?? 0);
  const src = publicacion.id_pub
    ? `${urlBack}${apiPub}/portada/${publicacion.id_pub}`
    : undefined;
  const openDetails = () => onClickDetalles?.(entry);
  return (
    <CardImage
      src={src}
      alt={`Portada de ${publicacion.titulo || "publicación"}`}
      title={publicacion.titulo}
      badge={kind === "ARTICULO" ? "ARTÍCULO" : kind}
      onClick={openDetails}
      footer={
        <>
          <span
            className={`status-pill ${stock > 0 ? "status-pill--green" : "status-pill--muted"}`}
            title={`${stock} copias disponibles`}
          >
            {stock > 0 ? `Disponible · ${stock}` : "Sin copias"}
          </span>
          <button
            type="button"
            className="text-button catalog-detail-link"
            onClick={openDetails}
          >
            Ver ficha
          </button>
        </>
      }
    >
      <p className="catalog-author" title={publicacion.autor || ""}>
        {formatAutor(publicacion.autor) || "Sin autor"}
      </p>
      <span className="sr-only">
        Código: {code}.{" "}
        {kind === "LIBRO"
          ? `Género: ${details?.genero || "Sin género"}`
          : `Área: ${details?.area || "Sin área"}`}
      </span>
    </CardImage>
  );
}
