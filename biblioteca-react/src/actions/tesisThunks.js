import {
  iniciaCargaTesis, cargaTesis, falloTesis,
  iniciaCargaDetalleTesis, cargaDetalleTesis
} from "../slices/tesisSlice";
import { authFetch, logoutThunk } from "@/actions/authThunks";
import { getPublicacion } from "./publicaconThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPublicacion = import.meta.env.VITE_APP_API_Publicacion;

// LISTA
export const getTesis = () => {
  return async (dispatch) => {
    dispatch(iniciaCargaTesis());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/tesis/lista`, { method: "GET" })
      );

      if (!resp?.ok) {
        if (resp?.status === 401) { dispatch(logoutThunk()); return; }
        let msg = `Error ${resp?.status ?? ""}`.trim();
        try { msg = (await resp.json())?.message || msg; } catch {}
        throw new Error(msg);
      }

      const data = await resp.json(); // array de {tesis, publicacion}
      dispatch(cargaTesis({ tesis: data }));
    } catch (e) {
      dispatch(falloTesis(e?.message || "Error cargando tesis"));
      console.error("Error cargando tesis:", e);
    }
  };
};

// DETALLE por id -> GET /api-pub/tesis/{id}
export const getTesisById = (id) => {
  return async (dispatch) => {
    dispatch(iniciaCargaDetalleTesis());
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/tesis/${id}`, { method: "GET" })
      );

      if (!resp?.ok) {
        if (resp?.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        if (resp?.status === 404) {
          const j = await resp.json().catch(() => ({}));
          const msg = j.message || "Tesis no encontrada";
          dispatch(falloTesis(msg));
          return { ok: false, error: msg };
        }
        let msg = `Error ${resp?.status ?? ""}`.trim();
        try { msg = (await resp.json())?.message || msg; } catch {}
        dispatch(falloTesis(msg));
        return { ok: false, error: msg };
      }

      const data = await resp.json(); // { tesis: {...}, publicacion: {...} | null }
      dispatch(cargaDetalleTesis(data));
      return { ok: true, data };
    } catch (e) {
      const msg = e?.message || "Error obteniendo tesis";
      dispatch(falloTesis(msg));
      return { ok: false, error: msg };
    }
  };
};

// Crear
export const createTesis = ({ publicacion, tesis, portadaFile, refresh = true }) => {
  return async (dispatch) => {
    dispatch(iniciaCargaTesis());
    try {
      // Validación rápida (ajusta si tu back la hace opcional)
      if (!portadaFile) {
        const msg = "Selecciona una portada (PNG/JPG/WEBP, máx 5 MB).";
        dispatch(falloTesis(msg));
        return { ok: false, error: msg };
      }
      const max = 5 * 1024 * 1024;
      if (portadaFile.size > max) {
        const msg = `La portada pesa ${(portadaFile.size / (1024*1024)).toFixed(2)} MB (máx 5 MB).`;
        dispatch(falloTesis(msg));
        return { ok: false, error: msg };
      }
      if (!/^image\/(png|jpe?g|webp)$/i.test(portadaFile.type)) {
        const msg = "Formato de imagen no permitido (usa PNG/JPG/WEBP).";
        dispatch(falloTesis(msg));
        return { ok: false, error: msg };
      }

      const fd = new FormData();
      fd.append("publicacion", new Blob([JSON.stringify(publicacion ?? {})], { type: "application/json" }), "publicacion.json");
      fd.append("tesis",       new Blob([JSON.stringify(tesis ?? {})],       { type: "application/json" }), "tesis.json");
      fd.append("portada", portadaFile, portadaFile.name);

      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/tesis/crear2`, {
          method: "POST",
          body: fd, // NO pongas Content-Type manualmente
        })
      );

      if (!resp?.ok) {
        if (resp?.status === 401) { dispatch(logoutThunk()); return { ok:false, error:"No autorizado" }; }
        let msg = `Error ${resp?.status ?? ""}`.trim();
        try { const j = await resp.json(); msg = j.message || j.error || msg; } catch {}
        dispatch(falloTesis(msg));
        return { ok:false, error: msg };
      }

      const creado = await resp.json();

      if (refresh) {
        await dispatch(getPublicacion());
        await dispatch(getTesis());
      }

      return { ok:true, data: creado };
    } catch (e) {
      const msg = e?.message || "Error creando tesis";
      dispatch(falloTesis(msg));
      return { ok:false, error: msg };
    }
  };
};

// UPDATE tesis
export const updateTesis = ({
  id,                  // id de la tesis
  publicacion,
  tesis,
  portadaFile,         // opcional
  refresh = true,
}) => {
  return async (dispatch) => {
    dispatch(iniciaCargaTesis());
    try {
      if (portadaFile) {
        const max = 5 * 1024 * 1024;
        if (portadaFile.size > max) {
          const msg = `La portada pesa ${(portadaFile.size / (1024*1024)).toFixed(2)} MB (máx 5 MB).`;
          dispatch(falloTesis(msg));
          return { ok: false, error: msg };
        }
        if (!/^image\/(png|jpe?g|webp)$/i.test(portadaFile.type)) {
          const msg = "Formato de imagen no permitido (usa PNG/JPG/WEBP).";
          dispatch(falloTesis(msg));
          return { ok: false, error: msg };
        }
      }

      const fd = new FormData();
      fd.append("publicacion",
        new Blob([JSON.stringify(publicacion ?? {})], { type: "application/json" }),
        "publicacion.json"
      );
      fd.append("tesis",
        new Blob([JSON.stringify(tesis ?? {})], { type: "application/json" }),
        "tesis.json"
      );
      if (portadaFile) {
        fd.append("portada", portadaFile, portadaFile.name);
      }

      const resp = await dispatch(
        authFetch(`${urlBack + apiPublicacion}/tesis/actualizar/${id}`, {
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
        dispatch(falloTesis(msg));
        return { ok: false, error: msg };
      }

      const actualizado = await resp.json(); // TesisModel

      if (refresh) {
        await dispatch(getPublicacion());
        await dispatch(getTesis());
        await dispatch(getTesisById(id));
      }

      return { ok: true, data: actualizado };
    } catch (e) {
      const msg = e?.message || "Error actualizando tesis";
      dispatch(falloTesis(msg));
      return { ok: false, error: msg };
    }
  };
};
