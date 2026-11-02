import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLibro } from "@/actions/libroThunks";
import { getArticulo } from "@/actions/articuloThunks";
import { getTesis } from "@/actions/tesisThunks";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import DetallesPub from "./DetallesPub";

import LibroCard from "./catalogoCard/LibroCard";
import ArticuloCard from "./catalogoCard/ArticuloCard";
import TesisCard from "./catalogoCard/TesisCard";
import Filter from "@/components/Filter";

// helper para ID visible
function formatId(kind, rawId) {
  if (rawId === null || rawId === undefined) return "--";

  const n = Number(rawId);
  const numPart = Number.isFinite(n)
    ? n.toString().padStart(2, "0")
    : String(rawId);

  let prefix = "";
  if (kind === "LIBRO") prefix = "LIB";
  else if (kind === "ARTICULO") prefix = "ART";
  else if (kind === "TESIS") prefix = "TES";

  return `${prefix}${numPart}`;
}

export default function PublicacionCatalogo() {
  const dispatch = useDispatch();

  // --- slices ---
  const { libro: libros = [], estaCargandoLibro = false } = useSelector(
    (s) => s.libro ?? {},
  );

  const { articulo: articulos = [], estaCargandoArticulo = false } =
    useSelector((s) => s.articulo ?? {});

  const { tesis: tesisList = [], estaCargandoTesis = false } = useSelector(
    (s) => s.tesis ?? {},
  );

  // --- ficha de publicación ---
  const [openDetalles, setOpenDetalles] = useState(false);
  const [detalleTipo, setDetalleTipo] = useState(null); // "Libro" | "Artículo" | "Tesis"
  const [detalleData, setDetalleData] = useState(null); // entry completo

  const handleOpenDetalles = (entry) => {
    const tipoMap = {
      LIBRO: "Libro",
      ARTICULO: "Artículo",
      TESIS: "Tesis",
    };

    setDetalleTipo(tipoMap[entry.kind] || "Libro");
    setDetalleData(entry);
    setOpenDetalles(true);
  };

  const handleCloseDetalles = () => {
    setOpenDetalles(false);
    setDetalleData(null);
    setDetalleTipo(null);
  };

  // --- filtros ---
  const [filtroTexto, setFiltroTexto] = useState(""); // título/autor
  const [filtroTipo, setFiltroTipo] = useState("TODOS"); // TODOS | LIBRO | ARTICULO | TESIS

  // --- carga inicial ---
  useEffect(() => {
    if (!libros?.length) {
      dispatch(getLibro());
    }
    if (!articulos?.length) {
      dispatch(getArticulo());
    }
    if (!tesisList?.length) {
      dispatch(getTesis());
    }
  }, [dispatch, libros?.length, articulos?.length, tesisList?.length]);

  const isLoading =
    estaCargandoLibro || estaCargandoArticulo || estaCargandoTesis;

  // 🔹 Array plano de cards (sin filtro)
  const cards = useMemo(
    () => [
      ...libros.map((item) => ({ kind: "LIBRO", ...item })),
      ...articulos.map((item) => ({ kind: "ARTICULO", ...item })),
      ...tesisList.map((item) => ({ kind: "TESIS", ...item })),
    ],
    [libros, articulos, tesisList],
  );

  // 🔹 APLICAR FILTRO por estado + tipo + texto (título/autor)
  const filteredCards = useMemo(() => {
    const q = filtroTexto.trim().toLowerCase();

    // 0) solo publicaciones DISPONIBLES
    const byEstado = cards.filter((entry) => {
      const estado = (entry.publicacion?.estado || "").toUpperCase();
      return estado === "DISPONIBLE";
    });

    // 1) filtro por tipo
    const byType =
      filtroTipo === "TODOS"
        ? byEstado
        : byEstado.filter((entry) => entry.kind === filtroTipo);

    if (!q) return byType;

    // 2) filtro por texto en título o autor
    return byType.filter((entry) => {
      const titulo = entry.publicacion?.titulo?.toLowerCase() ?? "";
      const autor = entry.publicacion?.autor?.toLowerCase() ?? "";
      return titulo.includes(q) || autor.includes(q);
    });
  }, [cards, filtroTexto, filtroTipo]);

  const totalFiltradas = filteredCards.length;

  // 🔹 PAGINACIÓN (front) sobre las filtradas
  const [page, setPage] = useState(1);
  const pageSize = 16;

  const totalPages = Math.max(1, Math.ceil((totalFiltradas || 1) / pageSize));

  // si cambia el total filtrado, ajustar página
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedCards = useMemo(
    () => filteredCards.slice(startIndex, endIndex),
    [filteredCards, startIndex, endIndex],
  );

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const labelTipo =
    filtroTipo === "TODOS"
      ? "Todos"
      : filtroTipo === "LIBRO"
        ? "Libros"
        : filtroTipo === "ARTICULO"
          ? "Artículos"
          : "Tesis";

  return (
    <div className="feature-page catalog-page">
      <div hidden={openDetalles}>
        <header className="catalog-intro">
          <div>
            <span className="eyebrow">Colección bibliográfica</span>
            <h1>Encuentra tu próxima lectura.</h1>
            <p>
              Explora libros, artículos y tesis. Consulta su información y las
              copias disponibles en la biblioteca.
            </p>
          </div>
          <div className="catalog-meta">
            Biblioteca San Marcos
            <br />
            Catálogo de publicaciones
          </div>
        </header>
        <div className="catalog-tools">
          <Filter
            id="catalog-search"
            value={filtroTexto}
            placeholder="Buscar por título o autor"
            onChange={(value) => {
              setPage(1);
              setFiltroTexto(value);
            }}
            onClear={() => {
              setPage(1);
              setFiltroTexto("");
            }}
          />
          <select
            aria-label="Tipo de publicación"
            className="select"
            value={filtroTipo}
            onChange={(event) => {
              setPage(1);
              setFiltroTipo(event.target.value);
            }}
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="LIBRO">Libros</option>
            <option value="ARTICULO">Artículos</option>
            <option value="TESIS">Tesis</option>
          </select>
          <span className="result-count" role="status">
            {isLoading ? "Cargando…" : `${totalFiltradas} publicaciones`}
          </span>
        </div>
        {isLoading && cards.length === 0 ? (
          <div className="empty-state" role="status">
            Cargando catálogo…
          </div>
        ) : totalFiltradas === 0 ? (
          <div className="empty-state">
            <SearchX size={32} />
            <h2>No encontramos publicaciones</h2>
            <p>
              Prueba con otro título o autor, o cambia el tipo seleccionado.
            </p>
          </div>
        ) : (
          <div className="catalog-grid">
            {paginatedCards.map((entry) => {
              const { kind, publicacion } = entry;
              const key =
                kind === "LIBRO"
                  ? `L-${entry.libro?.cod_lib ?? publicacion?.id_pub}`
                  : kind === "ARTICULO"
                    ? `A-${entry.articulo?.cod_a ?? publicacion?.id_pub}`
                    : `T-${entry.tesis?.cod_t ?? publicacion?.id_pub}`;
              const PublicationCard =
                kind === "LIBRO"
                  ? LibroCard
                  : kind === "ARTICULO"
                    ? ArticuloCard
                    : TesisCard;
              return (
                <PublicationCard
                  key={key}
                  entry={entry}
                  formatId={formatId}
                  onClickDetalles={handleOpenDetalles}
                />
              );
            })}
          </div>
        )}
        <nav
          className="catalog-pagination"
          aria-label="Paginación del catálogo"
        >
          <span>
            {totalFiltradas === 0 ? 0 : startIndex + 1}–
            {Math.min(endIndex, totalFiltradas)} de {totalFiltradas}{" "}
            publicaciones
            <span className="sr-only">. Filtro: {labelTipo}</span>
          </span>
          <div>
            <button
              type="button"
              className="btn btn-ghost btn-square"
              aria-label="Página anterior"
              disabled={!canPrev}
              onClick={() => canPrev && setPage((value) => value - 1)}
            >
              <ArrowLeft size={18} />
            </button>
            <span aria-live="polite">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-square"
              aria-label="Página siguiente"
              disabled={!canNext}
              onClick={() => canNext && setPage((value) => value + 1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </nav>
      </div>
      <DetallesPub
        open={openDetalles}
        onClose={handleCloseDetalles}
        tipo={detalleTipo}
        detalle={detalleData}
        loading={false}
        error={null}
      />
    </div>
  );
}
