// src/actions/publicaconThunks.js
import {
  iniciaCargaPublicacion,
  cargaPublicacion,
  errorPublicacion,        
} from "../slices/publicacionSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPublicacion = import.meta.env.VITE_APP_API_Publicacion;

// ya lo tienes:
export const getPublicacion = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaPublicacion());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/lista`, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return;
        }
        let msg = `Error ${resp.status}`;
        try {
          msg = (await resp.json()).message || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await resp.json();
      dispatch(cargaPublicacion({ publicacion: data }));
    } catch (e) {
      console.error("Error cargando publicaciones:", e.message);
      dispatch(errorPublicacion?.(e.message || "Error al cargar publicaciones"));
    }
  };
};

// 🔄 Cambiar estado DISPONIBLE / NO DISPONIBLE
export const toggleEstadoPublicacion = (id) => {
  return async (dispatch) => {
    // opcional: podrías tener un loading específico, pero no es obligatorio
    const resp = await dispatch(
      authFetch(`${urlBack + apiPublicacion}/estado/${id}`, {
        method: "PATCH",
      })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(
        errorPublicacion?.("Sesión expirada. Vuelve a iniciar sesión.")
      );
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al cambiar el estado de la publicación";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorPublicacion?.(msg));
      return { ok: false, error: msg };
    }

    // si tu backend devuelve el modelo actualizado:
    const data = await resp.json();

    // la forma sencilla: refrescar la lista completa
    await dispatch(getPublicacion());

    return { ok: true, data };
  };
};
