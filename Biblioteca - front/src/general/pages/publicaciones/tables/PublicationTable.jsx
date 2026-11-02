import GenericTable from "@/components/GenericTable";
import EstadoPill from "@/components/EstadoPill";
import { formatAutor } from "@/utils/formatAutor";
import fallback from "@/img/NoImagen.png";
const base = import.meta.env.VITE_APP_BACKEND_URL;
const api = import.meta.env.VITE_APP_API_Publicacion;
function publicationKind(row) {
  return row.libro
    ? "Libro"
    : row.articulo
      ? "Articulo"
      : row.tesis
        ? "Tesis"
        : null;
}
function publicationTypeId(row) {
  return row.libro?.cod_lib ?? row.articulo?.cod_a ?? row.tesis?.cod_t;
}
export default function PublicationTable({
  data = [],
  kind,
  onView,
  onEdit,
  onArchive,
  actions = true,
}) {
  const columns = [
    {
      id: "code",
      header: "Código",
      cell: (row) => {
        const prefix =
          kind === "Libro"
            ? "LIB"
            : kind === "Articulo"
              ? "ARTI"
              : kind === "Tesis"
                ? "TES"
                : "PUB";
        const id = kind ? publicationTypeId(row) : row.publicacion?.id_pub;
        return (
          <span className="record-code">
            {prefix}
            {String(id ?? "").padStart(2, "0")}
          </span>
        );
      },
      cellClass: "collection-code",
    },
    {
      id: "publication",
      header: "Publicación",
      cell: (row) => (
        <div className="publication-table-cell">
          <img
            src={
              row.publicacion?.id_pub
                ? `${base}${api}/portada/${row.publicacion.id_pub}`
                : fallback
            }
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallback;
            }}
          />
          <span>
            <strong>{row.publicacion?.titulo || "Sin título"}</strong>
            <small>
              {formatAutor(row.publicacion?.autor) || "Autor no registrado"}
            </small>
          </span>
        </div>
      ),
      cellClass: "collection-title",
    },
    {
      id: "type",
      header: "Tipo",
      cell: (row) => (
        <span className="collection-kind">
          {(kind || publicationKind(row) || row.publicacion?.tipo || "")
            .replace("Articulo", "Artículo")
            .replace("ARTICULO", "Artículo")
            .replace("LIBRO", "Libro")
            .replace("TESIS", "Tesis")}
        </span>
      ),
    },
    {
      id: "stock",
      header: "Copias",
      cell: (row) => row.publicacion?.stock ?? "—",
    },
    {
      id: "state",
      header: "Estado",
      cell: (row) => <EstadoPill estado={row.publicacion?.estado} />,
    },
  ];
  return (
    <div className="collection-table publications-table">
      <GenericTable
        columns={columns}
        data={data}
        rowKey={(row) =>
          kind ? publicationTypeId(row) : row.publicacion?.id_pub
        }
        showActions={actions}
        onView={(id, row) =>
          onView?.(publicationTypeId(row), kind || publicationKind(row))
        }
        onEdit={(id, row) =>
          onEdit?.(publicationTypeId(row), kind || publicationKind(row))
        }
        onArchive={(id, row) => onArchive?.(row.publicacion?.id_pub)}
        isActionDisabled={(row) =>
          publicationTypeId(row) === undefined ||
          publicationTypeId(row) === null
        }
      />
    </div>
  );
}
