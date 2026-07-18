// src/actions/bibliotecarioThunks.js
import {
  iniciaCargaBibliotecario,
  cargaBibliotecario,
  errorBibliotecario,
  iniciaCargaDetalleBibliotecario,
  cargaDetalleBibliotecario,
  errorDetalleBibliotecario,
  iniciaCargaPerfilBibliotecario,
  cargaPerfilBibliotecario,
  errorPerfilBibliotecario,
} from "../slices/bibliotecarioSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiBiblio = import.meta.env.VITE_APP_API_Bibliotecario;

export const getBibliotecario = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaBibliotecario());

    const resp = await dispatch(
      authFetch(`${urlBack + apiBiblio}/lista`, { method: "GET" })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(errorBibliotecario("Sesión expirada. Vuelve a iniciar sesión."));
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al obtener bibliotecarios";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorBibliotecario(msg));
      return { ok: false, error: msg };
    }

    const data = await resp.json();
    dispatch(cargaBibliotecario({ bibliotecario: data }));
    return { ok: true };
  };
};

// detalle por ID
export const getBibliotecarioById = (id) => {
  return async (dispatch) => {
    dispatch(iniciaCargaDetalleBibliotecario());

    const resp = await dispatch(
      authFetch(`${urlBack + apiBiblio}/${id}`, { method: "GET" })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(
        errorDetalleBibliotecario("Sesión expirada. Vuelve a iniciar sesión.")
      );
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al obtener el bibliotecario";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorDetalleBibliotecario(msg));
      return { ok: false, error: msg };
    }

    const data = await resp.json();

    dispatch(cargaDetalleBibliotecario(data));

    return { ok: true, data };
  };
};

export const createBibliotecario = (biblioData) => {
  return async (dispatch) => {
    dispatch(iniciaCargaBibliotecario());

    const resp = await dispatch(
      authFetch(`${urlBack + apiBiblio}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(biblioData), // { user, persona, biblio }
      })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(
        errorBibliotecario("Sesión expirada. Vuelve a iniciar sesión.")
      );
      return { error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al crear el bibliotecario";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorBibliotecario(msg));
      return { error: msg };
    }

    await dispatch(getBibliotecario());
    return { ok: true };
  };
};

// obtener el perfil del bibliotecario logueado (/me)
export const getBibliotecarioPerfil = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaPerfilBibliotecario());

    const resp = await dispatch(
      authFetch(`${urlBack + apiBiblio}/me`, { method: "GET" })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(
        errorPerfilBibliotecario("Sesión expirada. Vuelve a iniciar sesión.")
      );
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al obtener el perfil del bibliotecario";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorPerfilBibliotecario(msg));
      return { ok: false, error: msg };
    }

    const data = await resp.json();
    console.log(data);

    // 👇 ahora se guarda en perfil, no en el listado
    dispatch(cargaPerfilBibliotecario(data));
    return { ok: true, data };
  };
};

export const updateBibliotecario = (id, payload) => {
  // payload: { persona: {...}, biblio: {...}, usuario: {...} }
  return async (dispatch) => {
    dispatch(iniciaCargaDetalleBibliotecario());

    const resp = await dispatch(
      authFetch(`${urlBack + apiBiblio}/actualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(
        errorDetalleBibliotecario("Sesión expirada. Vuelve a iniciar sesión.")
      );
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al actualizar el bibliotecario";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorDetalleBibliotecario(msg));
      return { ok: false, error: msg };
    }

    const data = await resp.json();

    // backend devuelve BibliotecarioModel
    dispatch(cargaDetalleBibliotecario(data));

    // refrescar lista de bibliotecarios si lo necesitas
    await dispatch(getBibliotecario());

    return { ok: true, data };
  };
};
