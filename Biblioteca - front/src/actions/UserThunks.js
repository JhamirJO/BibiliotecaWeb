// src/actions/userThunks.js
import {
  iniciaAccionUsuario,
  exitoEliminarUsuario,
  exitoCambiarPassword,
  errorUsuario,
} from "../slices/userSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiUser = import.meta.env.VITE_APP_API_User;

// 🗑 Eliminar usuario por id (DELETE /api-user/usuarios/{id})
export const deleteUsuarioById = (id) => {
  return async (dispatch) => {
    dispatch(iniciaAccionUsuario());

    const resp = await dispatch(
      authFetch(`${urlBack + apiUser}/usuarios/${id}`, {
        method: "DELETE",
      })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(errorUsuario("Sesión expirada. Vuelve a iniciar sesión."));
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al eliminar el usuario";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorUsuario(msg));
      return { ok: false, error: msg };
    }

    // backend no devuelve body, solo 200/204
    dispatch(exitoEliminarUsuario(id));

    return { ok: true };
  };
};

// 🔐 Cambiar password (PATCH /api-user/password/{id})
export const cambiarPasswordUsuario = (id, nuevaPassword) => {
  return async (dispatch) => {
    dispatch(iniciaAccionUsuario());

    const resp = await dispatch(
      authFetch(`${urlBack + apiUser}/password/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevaPassword }),
      })
    );

    if (resp.status === 401) {
      dispatch(logoutThunk());
      dispatch(errorUsuario("Sesión expirada. Vuelve a iniciar sesión."));
      return { ok: false, error: "No autorizado" };
    }

    if (!resp.ok) {
      let msg = "Error al cambiar la contraseña";
      try {
        const err = await resp.json();
        msg = err.message || msg;
      } catch {}
      console.error(msg);
      dispatch(errorUsuario(msg));
      return { ok: false, error: msg };
    }

    // 204 No Content → no hay JSON
    dispatch(exitoCambiarPassword());

    return { ok: true };
  };
};
