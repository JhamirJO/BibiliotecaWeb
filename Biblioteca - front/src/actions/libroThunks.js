import {
  iniciaCargaLibro, cargaLibro,
  iniciaCargaDetalle, cargaDetalle, falloLibro
} from "../slices/libroSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";
import { getPublicacion } from "./publicaconThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPublicacion = import.meta.env.VITE_APP_API_Publicacion;

/**
 * Crea un libro + publicación + portada (archivo)
 * @param {{ publicacion: object, libro: object, portadaFile: File }} payload
 * @returns {{ ok: boolean, data?: any, error?: string }}
 */
export const createLibro = ({ publicacion, libro, portadaFile }) => {
  return async (dispatch) => {
    dispatch(iniciaCargaLibro());
    try {
      // Validaciones front (opcional pero útil)
      if (!portadaFile) {
        // si la portada es obligatoria, puedes cortar aquí
        // return { ok:false, error:"Selecciona una portada" };
      } else {
        const max = 5 * 1024 * 1024; // 5MB (igual que back)
        if (portadaFile.size > max) {
          const mb = (portadaFile.size / (1024 * 1024)).toFixed(2);
          return { ok: false, error: `La portada pesa ${mb} MB (máx 5 MB).` };
        }
        if (!/^image\/(png|jpe?g|webp)$/i.test(portadaFile.type)) {
          return { ok: false, error: "Formato de imagen no permitido (usa PNG/JPG/WEBP)." };
        }
      }

      const fd = new FormData();
      // Partes JSON
      fd.append(
        "publicacion",
        new Blob([JSON.stringify(publicacion ?? {})], { type: "application/json" }),
        "publicacion.json"
      );
      fd.append(
        "libro",
        new Blob([JSON.stringify(libro ?? {})], { type: "application/json" }),
        "libro.json"
      );
      // Parte archivo
      if (portadaFile) {
        fd.append("portada", portadaFile, portadaFile.name);
      }

      // ¡OJO! No pongas Content-Type aquí.
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/libro/crear2`, {
          method: "POST",
          body: fd,
        })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        let msg = `Error ${resp.status}`;
        try {
          const j = await resp.json();
          msg = j.message || j.error || msg;
        } catch {}
        dispatch(falloLibro(msg));
        return { ok: false, error: msg };
      }

      const creado = await resp.json(); // LibroModel (con cod_p/id_pub ya asignado)
      // refresca listas si las usas en la UI
      await dispatch(getPublicacion());
      await dispatch(getLibro());

      return { ok: true, data: creado };
    } catch (e) {
      const msg = e?.message || "Error creando libro";
      dispatch(falloLibro(msg));
      return { ok: false, error: msg };
    }
  };
};

// UPDATE libro
export const updateLibro = ({
  id,                  // id del libro (el que usas en /libro/{id})
  publicacion,
  libro,
  portadaFile,         // opcional: solo si el usuario cambió la portada
  refresh = true,
}) => {
  return async (dispatch) => {
    dispatch(iniciaCargaLibro());
    try {
      // ✅ Validar portada SOLO si se envía una nueva
      if (portadaFile) {
        const max = 5 * 1024 * 1024;
        if (portadaFile.size > max) {
          const mb = (portadaFile.size / (1024 * 1024)).toFixed(2);
          const msg = `La portada pesa ${mb} MB (máx 5 MB).`;
          dispatch(falloLibro(msg));
          return { ok: false, error: msg };
        }
        if (!/^image\/(png|jpe?g|webp)$/i.test(portadaFile.type)) {
          const msg = "Formato de imagen no permitido (usa PNG/JPG/WEBP).";
          dispatch(falloLibro(msg));
          return { ok: false, error: msg };
        }
      }

      const fd = new FormData();
      fd.append(
        "publicacion",
        new Blob([JSON.stringify(publicacion ?? {})], { type: "application/json" }),
        "publicacion.json"
      );
      fd.append(
        "libro",
        new Blob([JSON.stringify(libro ?? {})], { type: "application/json" }),
        "libro.json"
      );
      if (portadaFile) {
        fd.append("portada", portadaFile, portadaFile.name);
      }

      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/libro/actualizar/${id}`, {
          method: "PUT",
          body: fd, // ❗ NO setear Content-Type
        })
      );

      if (!resp?.ok) {
        if (resp?.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        let msg = `Error ${resp?.status ?? ""}`.trim();
        try {
          const j = await resp.json();
          msg = j.message || j.error || msg;
        } catch {}
        dispatch(falloLibro(msg));
        return { ok: false, error: msg };
      }

      const actualizado = await resp.json(); // LibroModel

      if (refresh) {
        await dispatch(getPublicacion());
        await dispatch(getLibro());
        // refrescamos el detalle combinado { libro, publicacion }
        await dispatch(getLibroById(id));
      }

      return { ok: true, data: actualizado };
    } catch (e) {
      const msg = e?.message || "Error actualizando libro";
      dispatch(falloLibro(msg));
      return { ok: false, error: msg };
    }
  };
};


// LISTA de libros
export const getLibro = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaLibro());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/libro/lista`, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return;
        }
        let msg = `Error ${resp.status}`;
        try { msg = (await resp.json()).message || msg; } catch {}
        throw new Error(msg);
      }

      const data = await resp.json();
      dispatch(cargaLibro({ libro: data }));
    } catch (e) {
      dispatch(falloLibro(e.message));
      console.error("Error cargando libros:", e.message);
    }
  };
};


// DETALLE por id
export const getLibroById = (id) => {
  return async (dispatch) => {
    dispatch(iniciaCargaDetalle());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/libro/${id}`, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        // Manejo fino de 404
        if (resp.status === 404) {
          const j = await resp.json().catch(() => ({}));
          const msg = j.message || "Libro no encontrado";
          dispatch(falloLibro(msg));
          return { ok: false, error: msg };
        }
        let msg = `Error ${resp.status}`;
        try { msg = (await resp.json()).message || msg; } catch {}
        dispatch(falloLibro(msg));
        return { ok: false, error: msg };
      }

      const data = await resp.json(); // { libro: {...}, publicacion: {...} | null }
      dispatch(cargaDetalle(data));
      return { ok: true, data };
    } catch (e) {
      const msg = e?.message || "Error obteniendo libro";
      dispatch(falloLibro(msg));
      return { ok: false, error: msg };
    }
  };
};