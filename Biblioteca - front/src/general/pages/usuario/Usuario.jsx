import PageHeader from "@/components/layout/PageHeader";
import { Plus, SearchX } from "lucide-react";
// src/pages/lector/Usuario.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLector,
  createLector,
  getLectorById,
  updateLector,
  toggleEstadoLector,
} from "@/actions/lectorThunks";
import {
  getBibliotecario,
  createBibliotecario,
  getBibliotecarioById,
  updateBibliotecario,
} from "@/actions/bibliotecarioThunks";
import { deleteUsuarioById } from "@/actions/UserThunks";
import Filter from "@/components/Filter";
import { TableLector } from "./tables/TableLector";
import { TableBibliotecario } from "./tables/TableBibliotecario";
import UsuarioForms from "./UsuarioForms";
import DetalleUser from "./DetalleUser";
import Swal from "sweetalert2";
import { useCurrentRole } from "@/general/hooks/useCurrentRole";

// 👇 mapas para elegir thunks según tipo
const getByIdThunkByTipo = {
  Lector: getLectorById,
  Bibliotecario: getBibliotecarioById,
};

const getAllThunkByTipo = {
  Lector: getLector,
  Bibliotecario: getBibliotecario,
};

export default function Usuario() {
  const dispatch = useDispatch();

  // --- UI state ---
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("Lector");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const addBtnRef = useRef(null);

  // modal de detalle (para ambos tipos)
  const [openDetalle, setOpenDetalle] = useState(false);

  // edición
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const closeForm = useCallback(() => {
    setOpen(false);
    setEditingId(null);
    setInitialValues(null);
  }, []);

  const focusAddBtn = useCallback(() => {
    requestAnimationFrame(() => addBtnRef.current?.focus?.());
  }, []);

  // --- auth/rol ---
  const role = useCurrentRole(); // => "ADMIN" | "BIBLIOTECARIO" | "LECTOR" ...
  const isAdmin = role === "ADMIN";

  // blindaje: si no eres admin, fija el tipo a "Lector"
  const safeTipo = isAdmin ? tipo : "Lector";

  // --- slices: lector ---
  const {
    lector = [],
    creando = false,
    errorCrear = null,
    estaCargandoLector,
    error: errorLector,

    detalle: detalleLector,
    estaCargandoDetalle: estaCargandoDetalleLector,
    errorDetalle: errorDetalleLector,
  } = useSelector((s) => s.lector ?? {});

  // --- slices: bibliotecario ---
  const {
    bibliotecario = [],
    estaCargandoBibliotecario,
    error: errorBibliotecario,

    detalle: detalleBibliotecario,
    estaCargandoDetalle: estaCargandoDetalleBibliotecario,
    errorDetalle: errorDetalleBibliotecario,
  } = useSelector((s) => s.bibliotecario ?? {});

  // --- cargas ---
  useEffect(() => {
    if (safeTipo === "Lector" && !lector?.length) {
      dispatch(getLector());
    }
    if (safeTipo === "Bibliotecario" && !bibliotecario?.length) {
      dispatch(getBibliotecario());
    }
  }, [dispatch, safeTipo, lector?.length, bibliotecario?.length]);

  // --- normalizador ---
  const normalize = (s = "") =>
    s
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  // --- filtros ---
  const filteredLector = useMemo(() => {
    const raw = search ?? "";
    const term = normalize(raw).trim();
    const digits = raw.replace(/\D/g, "");
    if (!term && !digits) return lector ?? [];

    return (lector ?? []).filter((row) => {
      const fullName = normalize(
        `${row?.nombre ?? ""} ${row?.apellido ?? ""}`.trim(),
      );
      const nameHit = term && fullName.includes(term);
      const dniStr = row?.dni?.toString() ?? "";
      const dniHit = digits && dniStr.startsWith(digits);
      return nameHit || dniHit;
    });
  }, [lector, search]);

  const filteredBibliotecario = useMemo(() => {
    const raw = search ?? "";
    const term = normalize(raw).trim();
    const digits = raw.replace(/\D/g, "");
    if (!term && !digits) return bibliotecario ?? [];

    return (bibliotecario ?? []).filter((row) => {
      const fullName = normalize(
        `${row?.nombre ?? ""} ${row?.apellido ?? ""}`.trim(),
      );
      const nameHit = term && fullName.includes(term);
      const dniStr = row?.dni?.toString() ?? "";
      const dniHit = digits && dniStr.startsWith(digits);
      return nameHit || dniHit;
    });
  }, [bibliotecario, search]);

  // --- helpers UI globales ---
  const isLoading =
    safeTipo === "Lector"
      ? !!estaCargandoLector
      : safeTipo === "Bibliotecario"
        ? !!estaCargandoBibliotecario
        : false;

  const uiError =
    safeTipo === "Lector"
      ? errorLector
      : safeTipo === "Bibliotecario"
        ? errorBibliotecario
        : null;

  const count =
    safeTipo === "Lector"
      ? (filteredLector?.length ?? 0)
      : safeTipo === "Bibliotecario"
        ? (filteredBibliotecario?.length ?? 0)
        : 0;

  // ===========================
  // Map detalle -> form shape
  // ===========================
  const mapDetalleToForm = (detalle, tipoUsuario) => {
    const d = detalle || {};
    return {
      usuario: {
        username: d.usuario?.username ?? "",
        email: d.usuario?.email ?? "",
        password_hash: "", // en edición no rellenamos nunca
      },
      persona: {
        dni: d.persona?.dni ?? "",
        nombre: d.persona?.nombre ?? "",
        apellido: d.persona?.apellido ?? "",
        telefono: d.persona?.telefono ?? "",
      },
      lector:
        tipoUsuario === "Lector"
          ? {
              direccion: d.lector?.direccion ?? "",
            }
          : undefined,
      biblio:
        tipoUsuario === "Bibliotecario"
          ? {
              ...(d.biblio || {}),
            }
          : undefined,
    };
  };

  // === handler genérico para VER DETALLE ===
  const handleView = useCallback(
    async (tipoUsuario, id) => {
      try {
        const thunk = getByIdThunkByTipo[tipoUsuario];
        if (!thunk) throw new Error(`Tipo no soportado: ${tipoUsuario}`);

        const res = await dispatch(thunk(id));
        if (!res?.ok) {
          throw new Error(res?.error || "No se pudo cargar el detalle");
        }
        setOpenDetalle(true);
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "No se pudo cargar el detalle",
          text: e.message || "Error desconocido",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
          },
        });
      }
    },
    [dispatch],
  );

  // === handler genérico para EDITAR ===
  const handleEdit = useCallback(
    async (tipoUsuario, id) => {
      try {
        setEditingId(id);
        const thunk = getByIdThunkByTipo[tipoUsuario];
        if (!thunk) throw new Error(`Tipo no soportado: ${tipoUsuario}`);

        const res = await dispatch(thunk(id));

        if (!res?.ok) {
          throw new Error(
            res?.error || `No se pudo obtener el ${tipoUsuario.toLowerCase()}`,
          );
        }

        const detalle = res.data;
        setInitialValues(mapDetalleToForm(detalle, tipoUsuario));
        setOpen(true);
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: e.message || "Ocurrió un error desconocido",
        });
      }
    },
    [dispatch],
  );

  // === handler genérico para ELIMINAR ===
  const handleDelete = useCallback(
    async (tipoUsuario, row, idEntidad) => {
      const idUsuario = row?.usuario?.id_u;
      const label = tipoUsuario === "Lector" ? "lector" : "bibliotecario";

      if (!idUsuario) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
          text: `El ${label} no tiene un usuario asociado (id_u no encontrado).`,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
          },
        });
        return;
      }

      const result = await Swal.fire({
        title: `¿Eliminar ${label}?`,
        text: "Se eliminará el usuario y sus datos asociados. Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn bg-red-600 text-white hover:bg-red-700 border-0",
          cancelButton: "btn btn-ghost border border-slate-300 text-slate-700",
        },
      });

      if (!result.isConfirmed) return;

      const resp = await dispatch(deleteUsuarioById(idUsuario));

      if (!resp?.ok) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
          text:
            resp?.error ||
            `Ocurrió un error inesperado al eliminar el ${label}.`,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
          },
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: `${tipoUsuario} eliminado`,
        text: `El ${label} con ID ${idEntidad} fue eliminado correctamente.`,
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
        },
      });

      // refrescar lista según tipo
      const thunkAll = getAllThunkByTipo[tipoUsuario];
      if (thunkAll) {
        await dispatch(thunkAll());
      }
    },
    [dispatch],
  );

  const handleArchiveLector = useCallback(
    async (id) => {
      // Confirmación
      const result = await Swal.fire({
        title: "¿Cambiar estado del lector?",
        text: "Se activará o desactivará el lector. Si tiene préstamos activos no se podrá desactivar.",
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

      // Llamar thunk
      const resp = await dispatch(toggleEstadoLector(id));

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

      const nuevoEstado = resp.data?.lector?.estado ?? "DESCONOCIDO";

      await Swal.fire({
        icon: "success",
        title:
          nuevoEstado === "ACTIVO" ? "Lector activado" : "Lector desactivado",
        text: `Estado actual: ${nuevoEstado}`,
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "btn bg-slate-700 text-white hover:bg-slate-800 border-0",
        },
      });
    },
    [dispatch],
  );

  const view =
    {
      Lector: (
        <TableLector
          data={filteredLector}
          onView={(id) => handleView("Lector", id)}
          onEdit={(id) => handleEdit("Lector", id)}
          onArchive={handleArchiveLector} // este sí es solo para lector
          onDelete={(row, id) => handleDelete("Lector", row, id)}
        />
      ),
      ...(isAdmin && {
        Bibliotecario: (
          <TableBibliotecario
            data={filteredBibliotecario}
            onView={(id) => handleView("Bibliotecario", id)}
            onEdit={(id) => handleEdit("Bibliotecario", id)}
            onDelete={(row, id) => handleDelete("Bibliotecario", row, id)}
          />
        ),
      }),
    }[safeTipo] ?? null;

  // === handler de submit (crear / editar) ===
  const handleSubmitUsuario = useCallback(
    async (payload, { mode }) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);

      // 1) cerramos modal antes de cualquier Swal
      closeForm();

      // 2) esperamos 2 frames a que el <dialog> se desmonte
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );

      const tipoSeleccionado = safeTipo;

      // Thunks según tipo
      const thunkCreate =
        tipoSeleccionado === "Lector" ? createLector : createBibliotecario;
      const thunkUpdate =
        tipoSeleccionado === "Lector" ? updateLector : updateBibliotecario;

      // 2.5) quitar foco al elemento activo
      const active = document.activeElement;
      if (active && active instanceof HTMLElement) {
        active.blur();
      }

      // 3) SweetAlert de cargando
      Swal.fire({
        title: "Guardando...",
        text:
          (mode === "edit" ? "Actualizando " : "Creando ") +
          (tipoSeleccionado === "Lector" ? "lector" : "bibliotecario") +
          "...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        let res;

        if (mode === "edit") {
          // 👉 Aquí usamos el id que obtuviste de la tabla y guardaste en editingId
          res = await dispatch(thunkUpdate(editingId, payload));
        } else {
          res = await dispatch(thunkCreate(payload));
        }

        Swal.close();

        if (res?.error === true || res?.ok === false) {
          const msg =
            res?.payload?.message ||
            res?.payload?.error ||
            res?.error ||
            "No se pudo guardar el usuario.";

          await Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: msg,
            confirmButtonText: "OK",
            buttonsStyling: false,
            customClass: {
              confirmButton:
                "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
            },
          });
          focusAddBtn();
          return;
        }

        await Swal.fire({
          icon: "success",
          title:
            tipoSeleccionado === "Lector"
              ? mode === "edit"
                ? "Lector actualizado"
                : "Lector creado"
              : mode === "edit"
                ? "Bibliotecario actualizado"
                : "Bibliotecario creado",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
          },
        });

        // refrescar tablas
        if (tipoSeleccionado === "Lector") await dispatch(getLector());
        if (tipoSeleccionado === "Bibliotecario")
          await dispatch(getBibliotecario());

        focusAddBtn();
      } catch (err) {
        Swal.close();
        await Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: err?.message || "Ocurrió un problema.",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
          },
        });
        focusAddBtn();
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [closeForm, dispatch, focusAddBtn, safeTipo, editingId],
  );

  // === Selección de detalle según tipo ===
  const detalleSeleccionado =
    safeTipo === "Lector" ? detalleLector : detalleBibliotecario;
  const loadingDetalleSeleccionado =
    safeTipo === "Lector"
      ? estaCargandoDetalleLector
      : estaCargandoDetalleBibliotecario;
  const errorDetalleSeleccionado =
    safeTipo === "Lector" ? errorDetalleLector : errorDetalleBibliotecario;

  return (
    <div className="feature-page">
      <div hidden={open || openDetalle}>
        <PageHeader
          title="Usuarios"
          description="Consulta los datos y administra las cuentas de la biblioteca."
        >
          <button
            ref={addBtnRef}
            type="button"
            className="btn btn-primary"
            onClick={() => {
              document.activeElement?.blur?.();
              setEditingId(null);
              setInitialValues(null);
              setOpen(true);
            }}
          >
            <Plus size={18} />
            Nuevo {safeTipo.toLowerCase()}
          </button>
        </PageHeader>
        <section className="panel management-panel" aria-label="Usuarios">
          <div className="management-toolbar">
            <Filter
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Buscar por nombre o DNI"
            />
            {isAdmin && (
              <select
                id="tipo"
                className="select"
                aria-label="Tipo de usuario"
                value={safeTipo}
                onChange={(event) => setTipo(event.target.value)}
              >
                <option value="Lector">Lector</option>
                <option value="Bibliotecario">Bibliotecario</option>
              </select>
            )}
            <span className="result-count" role="status">
              {isLoading
                ? "Cargando…"
                : `${count} ${safeTipo === "Lector" ? "lectores" : "bibliotecarios"}`}
            </span>
          </div>
          {uiError && (
            <div className="alert alert-error" role="alert">
              Error al cargar: {String(uiError)}
            </div>
          )}
          {isLoading ? (
            <div className="empty-state" role="status">
              Cargando usuarios…
            </div>
          ) : count === 0 ? (
            <div className="empty-state">
              <SearchX size={30} />
              <h2>No encontramos usuarios</h2>
              <p>Prueba con otro nombre o DNI, o limpia la búsqueda.</p>
            </div>
          ) : (
            view
          )}
        </section>
      </div>
      <UsuarioForms
        open={open}
        onClose={closeForm}
        creating={submitting || creando}
        error={errorCrear}
        tipo={safeTipo}
        initialValues={initialValues}
        mode={editingId ? "edit" : "create"}
        returnFocusRef={addBtnRef}
        onCreated={handleSubmitUsuario}
      />
      {(safeTipo === "Lector" || safeTipo === "Bibliotecario") && (
        <DetalleUser
          open={openDetalle}
          onClose={() => setOpenDetalle(false)}
          tipo={safeTipo}
          detalle={detalleSeleccionado}
          loading={loadingDetalleSeleccionado}
          error={errorDetalleSeleccionado}
        />
      )}
    </div>
  );
}
