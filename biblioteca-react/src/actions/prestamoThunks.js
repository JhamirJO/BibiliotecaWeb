// src/actions/prestamoThunks.js
import {
  iniciaCargaPrestamo,
  cargaPrestamo,
  errorPrestamo,
  iniciaCargaPrestamoUsuario,
  cargaPrestamoUsuario,
  errorPrestamoUsuario,
} from "../slices/prestamoSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPrestamo = import.meta.env.VITE_APP_API_Prestamo;

// lista general (admin/biblio)
export const getPrestamo = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaPrestamo());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPrestamo}/lista`, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          dispatch(errorPrestamo("Sesión expirada."));
          return;
        }
        let msg = `Error ${resp.status}`;
        try {
          msg = (await resp.json()).message || msg;
        } catch {}
        dispatch(errorPrestamo(msg));
        return;
      }

      const data = await resp.json();
      dispatch(cargaPrestamo({ prestamo: data }));
    } catch (e) {
      console.error("Error cargando préstamos:", e.message);
      dispatch(errorPrestamo(e.message || "Error desconocido"));
    }
  };
};

// préstamos del lector por DNI (historial)
export const getPrestamoByDni = (dni) => {
  return async (dispatch) => {
    dispatch(iniciaCargaPrestamoUsuario());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPrestamo}/me/${dni}`, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          dispatch(errorPrestamoUsuario("Sesión expirada."));
          return;
        }
        let msg = `Error ${resp.status}`;
        try {
          msg = (await resp.json()).message || msg;
        } catch {}
        dispatch(errorPrestamoUsuario(msg));
        return;
      }

      const data = await resp.json();
      dispatch(cargaPrestamoUsuario({ prestamo: data }));
    } catch (e) {
      console.error("Error cargando préstamos por dni:", e.message);
      dispatch(
        errorPrestamoUsuario(
          e.message || "Error desconocido al listar préstamos del lector"
        )
      );
    }
  };
};
