// actions/articuloThunks.js
import {
  iniciaCargaArticulo, cargaArticulo, falloArticulo,
  iniciaCargaDetalleArticulo, cargaDetalleArticulo
} from "../slices/articuloSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";
import { getPublicacion } from "./publicaconThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPublicacion = import.meta.env.VITE_APP_API_Publicacion;

// LISTA
export const getArticulo = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaArticulo());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/articulo/lista`, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) { dispatch(logoutThunk()); return; }
        let msg = `Error ${resp.status}`;
        try { msg = (await resp.json()).message || msg; } catch {}
        throw new Error(msg);
      }

      const data = await resp.json(); // array de {articulo, publicacion}
      dispatch(cargaArticulo({ articulo: data }));
    } catch (e) {
      dispatch(falloArticulo(e.message));
      console.error("Error cargando artículos:", e.message);
    }
  };
};

// DETALLE por id
export const getArticuloById = (id) => {
  return async (dispatch) => {
    dispatch(iniciaCargaDetalleArticulo());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/articulo/${id}`, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        if (resp.status === 404) {
          const j = await resp.json().catch(() => ({}));
          const msg = j.message || "Artículo no encontrado";
          dispatch(falloArticulo(msg));
          return { ok: false, error: msg };
        }
        let msg = `Error ${resp.status}`;
        try { msg = (await resp.json()).message || msg; } catch {}
        dispatch(falloArticulo(msg));
        return { ok: false, error: msg };
      }

      const data = await resp.json(); // { articulo: {...}, publicacion: {...} | null }
      dispatch(cargaDetalleArticulo(data));
      return { ok: true, data };
    } catch (e) {
      const msg = e?.message || "Error obteniendo artículo";
      dispatch(falloArticulo(msg));
      return { ok: false, error: msg };
    }
  };
};

// Crear
export const createArticulo = ({ publicacion, articulo, portadaFile, refresh = true }) => {
  return async (dispatch) => {
    dispatch(iniciaCargaArticulo());
    try {
      // Validación rápida (el back lo pide obligatorio)
      if (!portadaFile) {
        const msg = "Selecciona una portada (PNG/JPG/WEBP, máx 5 MB).";
        dispatch(falloArticulo(msg));
        return { ok: false, error: msg };
      }
      const max = 5 * 1024 * 1024;
      if (portadaFile.size > max) {
        const msg = `La portada pesa ${(portadaFile.size / (1024*1024)).toFixed(2)} MB (máx 5 MB).`;
        dispatch(falloArticulo(msg));
        return { ok: false, error: msg };
      }
      if (!/^image\/(png|jpe?g|webp)$/i.test(portadaFile.type)) {
        const msg = "Formato de imagen no permitido (usa PNG/JPG/WEBP).";
        dispatch(falloArticulo(msg));
        return { ok: false, error: msg };
      }

      const fd = new FormData();
      fd.append("publicacion", new Blob([JSON.stringify(publicacion ?? {})], { type: "application/json" }), "publicacion.json");
      fd.append("articulo",    new Blob([JSON.stringify(articulo ?? {})],     { type: "application/json" }), "articulo.json");
      fd.append("portada", portadaFile, portadaFile.name);

      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/articulo/crear2`, {
          method: "POST",
          body: fd, // NO pongas Content-Type manualmente
        })
      );

      if (!resp?.ok) {
        if (resp?.status === 401) { dispatch(logoutThunk()); return { ok:false, error:"No autorizado" }; }
        let msg = `Error ${resp?.status ?? ""}`.trim();
        try { const j = await resp.json(); msg = j.message || j.error || msg; } catch {}
        dispatch(falloArticulo(msg));
        return { ok:false, error: msg };
      }

      const creado = await resp.json();

      if (refresh) {
        await dispatch(getPublicacion());
        await dispatch(getArticulo());
      }

      return { ok:true, data: creado };
    } catch (e) {
      const msg = e?.message || "Error creando artículo";
      dispatch(falloArticulo(msg));
      return { ok:false, error: msg };
    }
  };
};

// UPDATE artículo
export const updateArticulo = ({
  id,                  // id del artículo
  publicacion,
  articulo,
  portadaFile,         // opcional
  refresh = true,
}) => {
  return async (dispatch) => {
    dispatch(iniciaCargaArticulo());
    try {
      if (portadaFile) {
        const max = 5 * 1024 * 1024;
        if (portadaFile.size > max) {
          const msg = `La portada pesa ${(portadaFile.size / (1024*1024)).toFixed(2)} MB (máx 5 MB).`;
          dispatch(falloArticulo(msg));
          return { ok: false, error: msg };
        }
        if (!/^image\/(png|jpe?g|webp)$/i.test(portadaFile.type)) {
          const msg = "Formato de imagen no permitido (usa PNG/JPG/WEBP).";
          dispatch(falloArticulo(msg));
          return { ok: false, error: msg };
        }
      }

      const fd = new FormData();
      fd.append("publicacion",
        new Blob([JSON.stringify(publicacion ?? {})], { type: "application/json" }),
        "publicacion.json"
      );
      fd.append("articulo",
        new Blob([JSON.stringify(articulo ?? {})], { type: "application/json" }),
        "articulo.json"
      );
      if (portadaFile) {
        fd.append("portada", portadaFile, portadaFile.name);
      }

      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/articulo/actualizar/${id}`, {
          method: "PUT",
          body: fd,
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
        dispatch(falloArticulo(msg));
        return { ok: false, error: msg };
      }

      const actualizado = await resp.json(); // ArticuloModel

      if (refresh) {
        await dispatch(getPublicacion());
        await dispatch(getArticulo());
        await dispatch(getArticuloById(id));
      }

      return { ok: true, data: actualizado };
    } catch (e) {
      const msg = e?.message || "Error actualizando artículo";
      dispatch(falloArticulo(msg));
      return { ok: false, error: msg };
    }
  };
};
