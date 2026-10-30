// actions/notificacionThunks.js
import {
  iniciaCargaNotificaciones,
  cargaNotificaciones,
  falloNotificaciones,
  marcarNotificacionLeidaLocal,
  marcarTodasLeidasLocal,
} from "../slices/notificacionSlice";

import { authFetch, logoutThunk } from "@/actions/authThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiNoti = import.meta.env.VITE_APP_API_Notificacion; // ej: "/api-noti"

// helper: parsea payload string → objeto
const mapNotificacionFromApi = (n) => {
  let payloadObj = null;
  try {
    payloadObj = n?.payload ? JSON.parse(n.payload) : null;
  } catch {
    payloadObj = null;
  }

  return {
    ...n,
    payload: payloadObj,
  };
};

export const getMisNotificaciones = (soloNoLeidas = true) => {
  return async (dispatch) => {
    dispatch(iniciaCargaNotificaciones());

    try {
      const url = `${urlBack + apiNoti}/mis?soloNoLeidas=${
        soloNoLeidas ? "true" : "false"
      }`;

      const resp = await dispatch(
        authFetch(url, { method: "GET" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        let msg = `Error ${resp.status}`;
        try {
          const j = await resp.json();
          msg = j.message || msg;
        } catch {}

        dispatch(falloNotificaciones(msg));
        return { ok: false, error: msg };
      }

      const data = await resp.json();
      const normalizadas = (data ?? []).map(mapNotificacionFromApi);

      dispatch(cargaNotificaciones({ notificaciones: normalizadas }));
      return { ok: true, data: normalizadas };
    } catch (e) {
      const msg = e?.message || "Error obteniendo notificaciones";
      dispatch(falloNotificaciones(msg));
      return { ok: false, error: msg };
    }
  };
};

export const marcarNotificacionComoLeida = (idNotificacion) => {
  return async (dispatch) => {
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiNoti}/${idNotificacion}/leer`, {
          method: "PATCH",
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
          msg = j.message || msg;
        } catch {}
        return { ok: false, error: msg };
      }

      const data = await resp.json();
      const normalizada = mapNotificacionFromApi(data);

      // actualizamos solo en el estado local
      dispatch(marcarNotificacionLeidaLocal(normalizada.id_notificacion));
      return { ok: true, data: normalizada };
    } catch (e) {
      const msg = e?.message || "Error marcando notificación";
      return { ok: false, error: msg };
    }
  };
};

export const marcarTodasNotificacionesComoLeidas = () => {
  return async (dispatch) => {
    try {
      const resp = await dispatch(
        authFetch(`${urlBack + apiNoti}/leer-todas`, {
          method: "PATCH",
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
          msg = j.message || msg;
        } catch {}
        return { ok: false, error: msg };
      }

      dispatch(marcarTodasLeidasLocal());
      return { ok: true };
    } catch (e) {
      const msg = e?.message || "Error marcando todas las notificaciones";
      return { ok: false, error: msg };
    }
  };
};

// ===== OPCIONALES: para disparar generación desde el front (solo si quieres) =====

export const generarNotificacionesPorVencer = (fechaReferencia) => {
  return async (dispatch) => {
    try {
      const query = fechaReferencia
        ? `?fechaReferencia=${fechaReferencia}`
        : "";
      const url = `${urlBack + apiNoti}/generar/por-vencer${query}`;

      const resp = await dispatch(
        authFetch(url, { method: "POST" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        let msg = `Error ${resp.status}`;
        try {
          const j = await resp.json();
          msg = j.message || msg;
        } catch {}
        return { ok: false, error: msg };
      }

      const data = await resp.json();
      const normalizadas = (data ?? []).map(mapNotificacionFromApi);

      // opcional: recargar lista completa después
      // dispatch(cargaNotificaciones({ notificaciones: normalizadas }));

      return { ok: true, data: normalizadas };
    } catch (e) {
      const msg = e?.message || "Error generando notificaciones por vencer";
      return { ok: false, error: msg };
    }
  };
};

export const generarNotificacionesVencidos = (fechaReferencia) => {
  return async (dispatch) => {
    try {
      const query = fechaReferencia
        ? `?fechaReferencia=${fechaReferencia}`
        : "";
      const url = `${urlBack + apiNoti}/generar/vencidos${query}`;

      const resp = await dispatch(
        authFetch(url, { method: "POST" })
      );

      if (!resp.ok) {
        if (resp.status === 401) {
          dispatch(logoutThunk());
          return { ok: false, error: "No autorizado" };
        }
        let msg = `Error ${resp.status}`;
        try {
          const j = await resp.json();
          msg = j.message || msg;
        } catch {}
        return { ok: false, error: msg };
      }

      const data = await resp.json();
      const normalizadas = (data ?? []).map(mapNotificacionFromApi);

      // opcional: recargar lista completa después
      // dispatch(cargaNotificaciones({ notificaciones: normalizadas }));

      return { ok: true, data: normalizadas };
    } catch (e) {
      const msg = e?.message || "Error generando notificaciones vencidas";
      return { ok: false, error: msg };
    }
  };
};
