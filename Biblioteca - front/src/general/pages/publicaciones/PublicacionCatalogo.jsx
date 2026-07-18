import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLibro } from "@/actions/libroThunks";
import { getArticulo } from "@/actions/articuloThunks";
import { getTesis } from "@/actions/tesisThunks";
import { GestorPub, SearchPub } from "@/utils/Icons";
import Card from "@/components/Card";
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
  const {
    libro: libros = [],
    estaCargandoLibro = false,
  } = useSelector((s) => s.libro ?? {});

  const {
    articulo: articulos = [],
    estaCargandoArticulo = false,
  } = useSelector((s) => s.articulo ?? {});

  const {
    tesis: tesisList = [],
    estaCargandoTesis = false,
  } = useSelector((s) => s.tesis ?? {});

  // --- modal de detalles ---
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
  const [filtroTexto, setFiltroTexto] = useState("");   // título/autor
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
    [libros, articulos, tesisList]
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

  const totalPages = Math.max(
    1,
    Math.ceil((totalFiltradas || 1) / pageSize)
  );

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
    [filteredCards, startIndex, endIndex]
  );

  if (isLoading && cards.length === 0) {
    return <p className="p-4">Cargando catálogo...</p>;
  }

  if (!isLoading && cards.length === 0) {
    return (
      <p className="p-4 text-sm text-slate-500">
        No hay publicaciones para mostrar.
      </p>
    );
  }

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
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* 🔹 Encabezado: descripción + card de totales */}
      <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        {/* Card descripción */}
        <Card className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
            <GestorPub />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">
              Catálogo de Publicaciones
            </h2>
            <p className="mt-1 text-slate-600">
              Explora las publicaciones disponibles en la biblioteca
            </p>
          </div>
        </Card>

        {/* Card totales / métricas */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <span className="text-slate-800">
                <SearchPub />
              </span>
            </div>

            <div className="flex-1">
              <span className="text-sm text-slate-500"># Registros</span>

              {/* 🔹 número responsivo: cambia según el filtro */}
              <div className="leading-tight text-4xl font-extrabold text-slate-700">
                {isLoading ? "—" : totalFiltradas}
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Filtrado por:
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {labelTipo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* 🔹 Card de filtros (tipo + texto) */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-end">
          {/* Select de tipo */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm text-slate-700 font-semibold">
                Tipo
              </span>
            </label>
            <select
              className="select  select-bordered w-full"
              value={filtroTipo}
              onChange={(e) => {
                setPage(1);
                setFiltroTipo(e.target.value);
              }}
            >
              <option value="TODOS">Todos</option>
              <option value="LIBRO">Libros</option>
              <option value="ARTICULO">Artículos</option>
              <option value="TESIS">Tesis</option>
            </select>
          </div>

          {/* Buscador */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm text-slate-700 font-semibold">
                Buscar publicación
              </span>
            </label>
            <Filter
              value={filtroTexto}
              placeholder="Título o autor"
              className="w-full"
              inputClassName="input input-sm input-bordered w-full"
              onChange={(val) => {
                setPage(1);
                setFiltroTexto(val);
              }}
              onClear={() => {
                setPage(1);
                setFiltroTexto("");
              }}
            />
          </div>
        </div>
      </Card>

      {/* 🔹 Grid de cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
        {paginatedCards.map((entry) => {
          const { kind, publicacion } = entry;

          // clave estable por tipo
          let key = "";
          if (kind === "LIBRO") {
            key = `L-${entry.libro?.cod_lib ?? publicacion?.id_pub}`;
          } else if (kind === "ARTICULO") {
            key = `A-${entry.articulo?.cod_a ?? publicacion?.id_pub}`;
          } else {
            key = `T-${entry.tesis?.cod_t ?? publicacion?.id_pub}`;
          }

          if (kind === "LIBRO") {
            return (
              <LibroCard
                key={key}
                entry={entry}
                formatId={formatId}
                onClickDetalles={handleOpenDetalles}
              />
            );
          }

          if (kind === "ARTICULO") {
            return (
              <ArticuloCard
                key={key}
                entry={entry}
                formatId={formatId}
                onClickDetalles={handleOpenDetalles}
              />
            );
          }

          // TESIS
          return (
            <TesisCard
              key={key}
              entry={entry}
              formatId={formatId}
              onClickDetalles={handleOpenDetalles}
            />
          );
        })}
      </div>

      {/* 🔹 Paginación */}
      <Card className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Mostrando{" "}
            <span className="font-semibold">
              {totalFiltradas === 0 ? 0 : startIndex + 1}–
              {Math.min(endIndex, totalFiltradas)}
            </span>{" "}
            de{" "}
            <span className="font-semibold">{totalFiltradas}</span>{" "}
            publicaciones filtradas
          </div>

          <div className="flex items-center gap-2">
            <div className="join">
              <button
                type="button"
                className="btn btn-sm join-item"
                disabled={!canPrev}
                onClick={() => canPrev && setPage((p) => p - 1)}
              >
                «
              </button>

              <button
                type="button"
                className="btn btn-sm join-item pointer-events-none"
              >
                {page} / {totalPages}
              </button>

              <button
                type="button"
                className="btn btn-sm join-item"
                disabled={!canNext}
                onClick={() => canNext && setPage((p) => p + 1)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 🔹 Modal de detalles */}
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
