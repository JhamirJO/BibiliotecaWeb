import PageHeader from "@/components/layout/PageHeader";
import { Plus, SearchX } from "lucide-react";
// src/general/pages/publicaciones/Publicaciones.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getPublicacion,
  toggleEstadoPublicacion,
} from "@/actions/publicaconThunks";
import {
  getLibro,
  createLibro,
  getLibroById,
  updateLibro,
} from "@/actions/libroThunks";
import {
  getArticulo,
  createArticulo,
  getArticuloById,
  updateArticulo,
} from "@/actions/articuloThunks";
import {
  getTesis,
  createTesis,
  getTesisById,
  updateTesis,
} from "@/actions/tesisThunks";
import Filter from "../../../components/Filter";
import { TablePub } from "./tables/TablePub";
import { TableLib } from "./tables/TableLib";
import { TableArti } from "./tables/TableArti";
import { TableTesis } from "./tables/TableTesis";
import PublicacionForm from "./PublicacionForm";
import DetallesPub from "./DetallesPub"; // 👈 ahora se usa aquí

// Map de thunks por tipo de publicación (fuera del componente)
const GET_BY_ID_PUB = {
  Libro: getLibroById,
  Articulo: getArticuloById,
  Tesis: getTesisById,
};

export default function Publicaciones() {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("Publicacion");

  const [openForm, setOpenForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const addBtnRef = useRef(null);
  const dispatch = useDispatch();

  // --- edición ---
  const [editingId, setEditingId] = useState(null);
  const [editingTipo, setEditingTipo] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState(null);

  // --- detalle ---
  const [openDetalle, setOpenDetalle] = useState(false);
  const [tipoDetalle, setTipoDetalle] = useState(null); // "Libro" | "Articulo" | "Tesis"

  const closeForm = useCallback(() => setOpenForm(false), []);
  const focusAddBtn = useCallback(() => {
    requestAnimationFrame(() => addBtnRef.current?.focus?.());
  }, []);
  const closeFormAndFocus = useCallback(() => {
    setOpenForm(false);
    requestAnimationFrame(() => addBtnRef.current?.focus?.());
  }, []);

  const tipoForm = useMemo(() => {
    if (tipo === "Libro") return "Libro";
    if (tipo === "Artículo") return "Articulo";
    if (tipo === "Tesis") return "Tesis";
    return "Libro";
  }, [tipo]);

  // ====== Slices ======
  const {
    publicacion = [],
    estaCargandoPublicacion,
    error: errorPublicacion,
  } = useSelector((s) => s.publicacion ?? {});

  const {
    libro = [],
    estaCargandoLibro,
    error: errorLibro,
    detalle: detalleLibro,
    estaCargandoDetalle: estaCargandoDetalleLibro,
    errorDetalle: errorDetalleLibro,
  } = useSelector((s) => s.libro ?? {});

  const {
    articulo = [],
    estaCargandoArticulo,
    error: errorArticulo,
    detalle: detalleArticulo,
    estaCargandoDetalle: estaCargandoDetalleArticulo,
    errorDetalle: errorDetalleArticulo,
  } = useSelector((s) => s.articulo ?? {});

  const {
    tesis = [],
    estaCargandoTesis,
    error: errorTesis,
    detalle: detalleTesis,
    estaCargandoDetalle: estaCargandoDetalleTesis,
    errorDetalle: errorDetalleTesis,
  } = useSelector((s) => s.tesis ?? {});

  // ====== Effects de carga ======
  useEffect(() => {
    dispatch(getLibro());
    dispatch(getArticulo());
    dispatch(getTesis());
  }, [dispatch]);

  useEffect(() => {
    if (!publicacion.length) dispatch(getPublicacion());
  }, [dispatch, publicacion.length]);

  useEffect(() => {
    if (tipo === "Libro" && !libro.length) dispatch(getLibro());
  }, [dispatch, tipo, libro.length]);

  useEffect(() => {
    if (tipo === "Artículo" && !articulo.length) dispatch(getArticulo());
  }, [dispatch, tipo, articulo.length]);

  useEffect(() => {
    if (tipo === "Tesis" && !tesis.length) dispatch(getTesis());
  }, [dispatch, tipo, tesis.length]);

  // ====== Filtros ======
  const filteredPublicaciones = useMemo(() => {
    const q = search.trim().toLowerCase();
    return publicacion.filter((p) => {
      if (!q) return true;
      return (
        (p.titulo ?? "").toLowerCase().includes(q) ||
        (p.autor ?? "").toLowerCase().includes(q)
      );
    });
  }, [publicacion, search]);

  const filteredLibros = useMemo(() => {
    const q = search.trim().toLowerCase();
    return libro.filter((l) => {
      if (!q) return true;
      return (
        String(l.libro?.cod_lib ?? "")
          .toLowerCase()
          .includes(q) ||
        (l.publicacion?.titulo ?? "").toLowerCase().includes(q) ||
        (l.publicacion?.autor ?? "").toLowerCase().includes(q) ||
        (l.libro?.genero ?? "").toLowerCase().includes(q) ||
        (l.libro?.edicion ?? "").toLowerCase().includes(q)
      );
    });
  }, [libro, search]);

  const filteredArticulo = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articulo.filter((a) => {
      if (!q) return true;
      return (
        String(a.articulo?.cod_a ?? "")
          .toLowerCase()
          .includes(q) ||
        (a.publicacion?.titulo ?? "").toLowerCase().includes(q) ||
        (a.publicacion?.autor ?? "").toLowerCase().includes(q) ||
        (a.articulo?.area ?? "").toLowerCase().includes(q)
      );
    });
  }, [articulo, search]);

  const filteredTesis = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tesis.filter((t) => {
      if (!q) return true;
      return (
        String(t.tesis?.cod_t ?? "")
          .toLowerCase()
          .includes(q) ||
        (t.publicacion?.titulo ?? "").toLowerCase().includes(q) ||
        (t.publicacion?.autor ?? "").toLowerCase().includes(q) ||
        (t.tesis?.area ?? "").toLowerCase().includes(q)
      );
    });
  }, [tesis, search]);

  // ====== UI helpers ======
  const isLoading =
    tipo === "Libro"
      ? estaCargandoLibro
      : tipo === "Artículo"
        ? estaCargandoArticulo
        : tipo === "Tesis"
          ? estaCargandoTesis
          : estaCargandoPublicacion;

  const uiError =
    tipo === "Libro"
      ? errorLibro
      : tipo === "Artículo"
        ? errorArticulo
        : tipo === "Tesis"
          ? errorTesis
          : errorPublicacion;

  const count =
    tipo === "Libro"
      ? filteredLibros.length
      : tipo === "Artículo"
        ? filteredArticulo.length
        : tipo === "Tesis"
          ? filteredTesis.length
          : filteredPublicaciones.length;

  const empty = count === 0 && !isLoading;

  // ====== Map detalle -> form (para EDITAR) ======
  const mapDetalleToForm = useCallback((detalle, tipoDetalle) => {
    const pub = detalle?.publicacion || {};

    const base = {
      publicacion: {
        titulo: pub.titulo ?? "",
        autor: pub.autor ?? "",
        stock: pub.stock ?? "",
        cant_pag: pub.cant_pag ?? "",
        resumen: pub.resumen ?? "",
      },
      libro: undefined,
      articulo: undefined,
      tesis: undefined,
    };

    if (tipoDetalle === "Libro") {
      const lib = detalle?.libro || {};
      return {
        ...base,
        libro: {
          genero: lib.genero ?? pub.genero ?? "",
          edicion: lib.edicion ?? pub.edicion ?? "",
        },
      };
    }

    if (tipoDetalle === "Articulo") {
      const art = detalle?.articulo || {};
      return {
        ...base,
        articulo: {
          area: art.tesis?.area ?? "",
          anio_pub: art.anio_pub ?? "",
          idioma: art.idioma ?? "",
          volumen: art.volumen ?? "",
          numero_issue: art.numero_issue ?? "",
          titulo_revista: art.titulo_revista ?? "",
        },
      };
    }

    if (tipoDetalle === "Tesis") {
      const te = detalle?.tesis || {};
      return {
        ...base,
        tesis: {
          grado: te.grado ?? "",
          escuela: te.escuela ?? "",
          institucion: te.institucion ?? "",
          idioma: te.idioma ?? "",
          area: te.area ?? "",
          palabras_clave: te.palabras_clave ?? "",
        },
      };
    }

    return base;
  }, []);

  // ====== Ver detalle ======
  const handleView = useCallback(
    async (tipoItem, id) => {
      try {
        const thunk = GET_BY_ID_PUB[tipoItem];
        if (!thunk) throw new Error(`Tipo no soportado: ${tipoItem}`);

        const res = await dispatch(thunk(id));
        if (!res?.ok) {
          throw new Error(
            res?.error || `No se pudo obtener la ${tipoItem.toLowerCase()}`,
          );
        }

        setTipoDetalle(tipoItem); // "Libro" | "Articulo" | "Tesis"
        setOpenDetalle(true);
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "No se pudo cargar el detalle",
          text: e?.message || "Error desconocido",
        });
      }
    },
    [dispatch],
  );

  // ====== Handlers EDITAR (form) ======
  const handleEdit = useCallback(
    async (tipoItem, id) => {
      try {
        setEditingId(id);
        setEditingTipo(tipoItem);

        const thunk = GET_BY_ID_PUB[tipoItem];
        if (!thunk) throw new Error(`Tipo no soportado: ${tipoItem}`);

        const res = await dispatch(thunk(id));
        if (!res?.ok) {
          throw new Error(
            res?.error || `No se pudo obtener la ${tipoItem.toLowerCase()}`,
          );
        }

        const detalle = res.data;
        setFormInitialValues(mapDetalleToForm(detalle, tipoItem));
        setOpenForm(true);
      } catch (e) {
        setEditingId(null);
        setEditingTipo(null);
        setFormInitialValues(null);
        Swal.fire({
          icon: "error",
          title: `Error al cargar ${tipoItem.toLowerCase()}`,
          text: e?.message || "Ocurrió un error desconocido",
        });
      }
    },
    [dispatch, mapDetalleToForm],
  );

  // ====== Archivar / activar publicación ======
  const handleArchivePublicacion = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "¿Cambiar estado de la publicación?",
        text: "Se marcará como DISPONIBLE o NO DISPONIBLE. Si tiene préstamos activos no se podrá desactivar.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
          cancelButton: "btn btn-ghost border border-slate-300 text-slate-700",
        },
      });

      if (!result.isConfirmed) return;

      const resp = await dispatch(toggleEstadoPublicacion(id));

      if (!resp?.ok) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo cambiar el estado",
          text: resp?.error || "Ocurrió un error inesperado",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
          },
        });
        return;
      }

      const nuevoEstado =
        resp.data?.estado ?? resp.data?.publicacion?.estado ?? "DESCONOCIDO";

      await Swal.fire({
        icon: "success",
        title:
          nuevoEstado === "DISPONIBLE"
            ? "Publicación activada"
            : "Publicación desactivada",
        text: `Estado actual: ${nuevoEstado}`,
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
        },
      });

      // Refrescar listas según la pestaña actual
      if (tipo === "Libro") await dispatch(getLibro());
      if (tipo === "Artículo") await dispatch(getArticulo());
      if (tipo === "Tesis") await dispatch(getTesis());
      await dispatch(getPublicacion());
    },
    [dispatch, tipo],
  );

  // ====== Mapas de create/update ======
  const CREAR = useMemo(
    () => ({
      Libro: createLibro,
      Articulo: createArticulo,
      Tesis: createTesis,
    }),
    [],
  );

  const UPDATE = useMemo(
    () => ({
      Libro: updateLibro,
      Articulo: updateArticulo,
      Tesis: updateTesis,
    }),
    [],
  );

  // ====== Handler Submit (create / edit) ======
  const handleSubmit = useCallback(
    async (payload, { tipo: tipoSeleccionado, portadaFile, mode }) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);

      const isEdit = mode === "edit";

      closeForm();

      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );

      Swal.fire({
        title: isEdit ? "Actualizando..." : "Guardando...",
        text: `${isEdit ? "Actualizando" : "Creando"} ${
          tipoSeleccionado?.toLowerCase?.() || "registro"
        }...`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const tipoKey = tipoSeleccionado;
        const thunkCreate = CREAR[tipoKey];
        const thunkUpdate = UPDATE[tipoKey];

        if (!tipoKey || (!thunkCreate && !thunkUpdate)) {
          throw new Error("Tipo de publicación no soportado");
        }

        let res;

        if (isEdit) {
          if (!editingId) {
            throw new Error("No se encontró el id para actualizar.");
          }

          const input = {
            id: editingId,
            publicacion: payload.publicacion,
            portadaFile: portadaFile || undefined,
          };

          if (tipoKey === "Libro") input.libro = payload.libro;
          else if (tipoKey === "Articulo") input.articulo = payload.articulo;
          else if (tipoKey === "Tesis") input.tesis = payload.tesis;

          res = await dispatch(thunkUpdate(input));
        } else {
          const input = {
            publicacion: payload.publicacion,
            portadaFile,
          };

          if (tipoKey === "Libro") input.libro = payload.libro;
          else if (tipoKey === "Articulo") input.articulo = payload.articulo;
          else if (tipoKey === "Tesis") input.tesis = payload.tesis;

          res = await dispatch(thunkCreate(input));
        }

        const ok = res?.ok ?? res?.payload?.ok ?? false;
        const errorMsg = res?.error ?? res?.payload?.error;

        Swal.close();

        if (ok) {
          await Swal.fire({
            icon: "success",
            title: isEdit ? "Actualizado" : "Guardado",
            text: isEdit
              ? "Los datos se actualizaron correctamente."
              : `Se creó el ${tipoKey.toLowerCase()} correctamente.`,
            confirmButtonText: "OK",
            buttonsStyling: false,
            customClass: {
              confirmButton:
                "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
            },
          });
          setEditingId(null);
          setEditingTipo(null);
          setFormInitialValues(null);
          focusAddBtn();
        } else {
          const readable = Array.isArray(errorMsg)
            ? errorMsg.join("\n")
            : errorMsg || "Ocurrió un error inesperado";
          await Swal.fire({
            icon: "error",
            title: isEdit ? "No se pudo actualizar" : "No se pudo guardar",
            text: readable,
            confirmButtonText: "OK",
            buttonsStyling: false,
            customClass: {
              confirmButton:
                "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
            },
          });
          focusAddBtn();
        }
      } catch (e) {
        Swal.close();
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: e?.message || "Ocurrió un error inesperado",
        });
        focusAddBtn();
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [CREAR, UPDATE, dispatch, closeForm, focusAddBtn, editingId],
  );

  // ====== Selección de detalle según tipoDetalle ======
  const detalleSeleccionado =
    tipoDetalle === "Libro"
      ? detalleLibro
      : tipoDetalle === "Articulo"
        ? detalleArticulo
        : tipoDetalle === "Tesis"
          ? detalleTesis
          : null;

  const loadingDetalleSeleccionado =
    tipoDetalle === "Libro"
      ? !!estaCargandoDetalleLibro
      : tipoDetalle === "Articulo"
        ? !!estaCargandoDetalleArticulo
        : tipoDetalle === "Tesis"
          ? !!estaCargandoDetalleTesis
          : false;

  const errorDetalleSeleccionado =
    tipoDetalle === "Libro"
      ? errorDetalleLibro
      : tipoDetalle === "Articulo"
        ? errorDetalleArticulo
        : tipoDetalle === "Tesis"
          ? errorDetalleTesis
          : null;

  // ====== Vista según tipo ======
  const view =
    {
      Publicacion: (
        <TablePub
          data={filteredPublicaciones}
          onView={(id, kind) => handleView(kind, id)}
          onEdit={(id, kind) => handleEdit(kind, id)}
          onArchive={handleArchivePublicacion}
        />
      ),
      Libro: (
        <TableLib
          data={filteredLibros}
          onView={(id) => handleView("Libro", id)}
          onEdit={(id) => handleEdit("Libro", id)}
          onArchive={handleArchivePublicacion}
        />
      ),
      Artículo: (
        <TableArti
          data={filteredArticulo}
          onView={(id) => handleView("Articulo", id)}
          onEdit={(id) => handleEdit("Articulo", id)}
          onArchive={handleArchivePublicacion}
        />
      ),
      Tesis: (
        <TableTesis
          data={filteredTesis}
          onView={(id) => handleView("Tesis", id)}
          onEdit={(id) => handleEdit("Tesis", id)}
          onArchive={handleArchivePublicacion}
        />
      ),
    }[tipo] ?? null;

  return (
    <div className="feature-page">
      <div hidden={openForm || openDetalle}>
        <PageHeader
          title="Publicaciones"
          description="Administra el catálogo, los ejemplares y la información de cada publicación."
        >
          <button
            ref={addBtnRef}
            type="button"
            className="btn btn-primary"
            onClick={() => {
              document.activeElement?.blur?.();
              setEditingId(null);
              setEditingTipo(null);
              setFormInitialValues(null);
              setOpenForm(true);
            }}
          >
            <Plus size={18} />
            {tipo === "Libro"
              ? "Nuevo libro"
              : tipo === "Artículo"
                ? "Nuevo artículo"
                : tipo === "Tesis"
                  ? "Nueva tesis"
                  : "Nueva publicación"}
          </button>
        </PageHeader>
        <section className="panel management-panel" aria-label="Publicaciones">
          <div className="management-toolbar">
            <Filter
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Buscar por ID, título o autor"
            />
            <select
              id="tipo"
              className="select"
              aria-label="Tipo de publicación"
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
            >
              <option value="Publicacion">Todos los tipos</option>
              <option value="Libro">Libro</option>
              <option value="Artículo">Artículo</option>
              <option value="Tesis">Tesis</option>
            </select>
            <span className="result-count" role="status">
              {isLoading ? "Cargando…" : `${count} publicaciones`}
            </span>
          </div>
          {uiError && (
            <div className="alert alert-error" role="alert">
              Error al cargar: {String(uiError)}
            </div>
          )}
          {isLoading ? (
            <div className="empty-state" role="status">
              Cargando publicaciones…
            </div>
          ) : empty ? (
            <div className="empty-state">
              <SearchX size={30} />
              <h2>No encontramos publicaciones</h2>
              <p>
                Prueba con otro título o autor, o cambia el tipo seleccionado.
              </p>
            </div>
          ) : (
            view
          )}
        </section>
      </div>
      <PublicacionForm
        open={openForm}
        onClose={closeFormAndFocus}
        initialTipo={editingTipo || tipoForm}
        initialValues={formInitialValues}
        submitting={submitting}
        returnFocusRef={addBtnRef}
        mode={editingId ? "edit" : "create"}
        onSubmit={handleSubmit}
      />
      {openDetalle && (
        <DetallesPub
          open={openDetalle}
          onClose={() => setOpenDetalle(false)}
          tipo={tipoDetalle}
          detalle={detalleSeleccionado}
          loading={loadingDetalleSeleccionado}
          error={errorDetalleSeleccionado}
        />
      )}
    </div>
  );
}
