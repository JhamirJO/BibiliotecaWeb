// src/actions/lectorThunks.js
import { iniciaCargaLector, cargaLector, errorLector, iniciaCargaDetalleLector, 
  cargaDetalleLector, errorDetalleLector,iniciaCargaPerfilLector,
  cargaPerfilLector, errorPerfilLector } from "../slices/lectorSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiLector = import.meta.env.VITE_APP_API_Lector;

export const getLector = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaLector());

    const resp = await dispatch(
      authFetch(`${urlBack + apiLector}/lista`, { method: "GET" })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      return;
    }

    const data = await resp.json();
    dispatch(cargaLector({ lector: data }));
  };
};


export const getLectorById = (id) => {
  return async (dispatch) => {
    dispatch(iniciaCargaDetalleLector());

    const resp = await dispatch(
      authFetch(`${urlBack + apiLector}/${id}`, { method: "GET" })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(errorDetalleLector("Sesión expirada. Vuelve a iniciar sesión."));
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al obtener el lector";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorDetalleLector(msg));
      return { ok: false, error: msg };
    }

    const data = await resp.json();
    dispatch(cargaDetalleLector(data)); // 🔹 guardamos en Redux
    return { ok: true, data };
  };
};

export const createLector = (lectorData) => {
  return async (dispatch) => {
    dispatch(iniciaCargaLector());

    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiLector}/crear`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lectorData),
        })
      );

      if (resp.status === 401) {
        dispatch(logoutThunk());
        return;
      }

      if (!resp.ok) {
        let msg = "Error al crear el lector";
        try {
          const err = await resp.json();
          msg = err.message || msg;
        } catch {}
        console.error(msg);
        dispatch(errorLector(msg));
        throw new Error(msg);
      }

      await dispatch(getLector());
    } catch (e) {
      if (!e.handledByErrorLector) {
        dispatch(errorLector(e.message || "Error desconocido"));
      }
      throw e;
    }
  };
};

export const getLectorPerfil = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaPerfilLector());

    const resp = await dispatch(
      authFetch(`${urlBack + apiLector}/me`, { method: "GET" })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(errorPerfilLector("Sesión expirada. Vuelve a iniciar sesión."));
      return;
    }

    if (!resp.ok) {
      let msg = "Error al obtener el perfil del lector";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorPerfilLector(msg));
      return;
    }

    const data = await resp.json();
    dispatch(cargaPerfilLector(data));   // 👈 ya no toca el listado
  };
};


export const updateLector = (id, payload) => {
  // payload: { persona: {...}, lector: {...}, usuario: {...} }
  return async (dispatch) => {
    dispatch(iniciaCargaDetalleLector());

    const resp = await dispatch(
      authFetch(`${urlBack + apiLector}/actualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(
        errorDetalleLector("Sesión expirada. Vuelve a iniciar sesión.")
      );
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al actualizar el lector";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorDetalleLector(msg));
      return { ok: false, error: msg };
    }

    const data = await resp.json();

    // el backend devuelve LectorModel
    dispatch(cargaDetalleLector(data));

    // si quieres refrescar la tabla de lectores:
    await dispatch(getLector());

    return { ok: true, data };
  };
};

export const toggleEstadoLector = (id) => {
  return async (dispatch) => {
    // Puedes usar el loader de lista o de detalle, yo usaré el de lista
    dispatch(iniciaCargaLector());

    const resp = await dispatch(
      authFetch(`${urlBack + apiLector}/estado/${id}`, {
        method: "PATCH",
      })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(errorLector("Sesión expirada. Vuelve a iniciar sesión."));
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al cambiar el estado del lector";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorLector(msg));
      return { ok: false, error: msg };
    }

    // El backend devuelve LectorWithPersona (lector, persona, usuario)
    const data = await resp.json();

    // Opcional: actualizas el detalle si lo estás viendo en un modal/página
    dispatch(cargaDetalleLector(data));

    // Refrescar tabla de lectores para que se vea el nuevo estado
    await dispatch(getLector());

    return { ok: true, data };
  };
};
