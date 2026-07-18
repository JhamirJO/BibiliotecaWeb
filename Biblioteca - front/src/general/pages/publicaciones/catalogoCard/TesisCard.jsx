import CardImage from "@/components/CardImage";
import portadaFallback from "@/img/NoImagen.png";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPub = import.meta.env.VITE_APP_API_Publicacion;

export default function TesisCard({ entry, formatId, onClickDetalles }) {
  const { tesis, publicacion } = entry;

  const id = tesis?.cod_t ?? publicacion?.id_pub;
  const formattedId = formatId("TESIS", id);

  const codPub = publicacion?.id_pub;
  const portadaSrc = codPub
    ? `${urlBack}${apiPub}/portada/${codPub}`
    : portadaFallback;

  return (
    <CardImage
      src={portadaSrc}
      alt={publicacion?.titulo || "Portada tesis"}
      title={publicacion?.titulo}
      badge="TESIS"
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

      {/* Bloque compacto Autor + Área */}
      <div className="mt-1">
        {/* AUTOR */}
        <p>
          <span className="font-semibold block">Autor:</span>
          <span className="line-clamp-2">{publicacion?.autor}</span>
        </p>

        {/* ÁREA */}
        <p className="mt-[10px]">
          <span className="font-semibold block">Área:</span>
          <span className="line-clamp-2">{tesis?.area}</span>
        </p>
      </div>
    </CardImage>
  );
}
