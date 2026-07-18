import CardImage from "@/components/CardImage";
import portadaFallback from "@/img/NoImagen.png";
import { formatAutor } from "@/utils/formatAutor";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPub = import.meta.env.VITE_APP_API_Publicacion;

export default function ArticuloCard({ entry, formatId, onClickDetalles }) {
  const { articulo, publicacion } = entry;

  const id = articulo?.cod_a ?? publicacion?.id_pub;
  const formattedId = formatId("ARTICULO", id);

  const codPub = publicacion?.id_pub;
  const portadaSrc = codPub
    ? `${urlBack}${apiPub}/portada/${codPub}`
    : portadaFallback;

  const autorFormateado = formatAutor(publicacion?.autor) || "Sin autor";
  const area = articulo?.area;
  const anioPublicacion = articulo?.anio_pub ?? publicacion?.anio_pub ?? null;

  return (
    <CardImage
      src={portadaSrc}
      alt={publicacion?.titulo || "Portada artículo"}
      title={publicacion?.titulo}
      badge="ARTÍCULO"
      className="text-[13px] cursor-pointer"
      onClick={() => onClickDetalles?.(entry)}
      footer={
        <>
          <p className="text-[12px] text-slate-700">
            <span className="font-semibold">Copias: </span>
            {publicacion?.stock ?? 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 underline">
            Ver detalles
          </p>
        </>
      }
    >
      {/* Id */}
      <div className="text-[11px] text-slate-500">Id: {formattedId}</div>

      {/* Bloque compacto: Autor + Área + Año */}
      <div className="mt-1">
        {/* AUTOR */}
        <p title={publicacion?.autor || ""}>
          <span className="font-semibold block">Autor:</span>
          <span className="line-clamp-2">{autorFormateado}</span>
        </p>

        {/* ÁREA (mínima separación) */}
        <p className="mt-[10px]">
          <span className="font-semibold block">Área:</span>
          <span className="line-clamp-2">{area || "Sin área"}</span>
        </p>

        {/* AÑO (pegado al área) */}
        <p className="mt-[10px]">
          <span className="font-semibold block">Año:</span>
          <span className="line-clamp-1">{anioPublicacion ?? "—"}</span>
        </p>
      </div>
    </CardImage>
  );
}
