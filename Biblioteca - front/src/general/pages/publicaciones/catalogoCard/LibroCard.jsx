import CardImage from "@/components/CardImage";
import portadaFallback from "@/img/NoImagen.png";
import { formatAutor } from "@/utils/formatAutor";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPub = import.meta.env.VITE_APP_API_Publicacion;

export default function LibroCard({ entry, formatId, onClickDetalles }) {
  const { libro, publicacion } = entry;

  const id = libro?.cod_lib ?? publicacion?.id_pub;
  const formattedId = formatId("LIBRO", id);

  const codPub = publicacion?.id_pub;
  const portadaSrc = codPub
    ? `${urlBack}${apiPub}/portada/${codPub}`
    : portadaFallback;

  const autorFormateado = formatAutor(publicacion?.autor) || "Sin autor";
  const genero = libro?.genero || "Sin género";

  return (
    <CardImage
      src={portadaSrc}
      alt={publicacion?.titulo || "Portada libro"}
      title={publicacion?.titulo}
      badge="LIBRO"
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

      {/* Bloque compacto Autor + Género */}
      <div className="mt-1">
        {/* AUTOR */}
        <p>
          <span className="font-semibold block">Autor:</span>
          <span className="line-clamp-2">{autorFormateado}</span>
        </p>

        {/* GÉNERO (casi pegado al autor) */}
        <p className="mt-[10px]">
          <span className="font-semibold block">Género:</span>
          <span className="line-clamp-2">{genero}</span>
        </p>
      </div>
    </CardImage>
  );
}
