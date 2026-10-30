// slices/notificacionSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const notificacionSlice = createSlice({
  name: "notificacion",
  initialState: {
    notificaciones: [],       // lista de notificaciones del usuario
    noLeidasCount: 0,         // contador rápido para la campanita
    estaCargandoNoti: false,  // loading general
    error: null,
  },
  reducers: {
    iniciaCargaNotificaciones: (state) => {
      state.estaCargandoNoti = true;
      state.error = null;
    },
    cargaNotificaciones: (state, action) => {
      const lista = action.payload.notificaciones ?? action.payload ?? [];
      state.notificaciones = lista;
      state.noLeidasCount = lista.filter((n) => !n.leido).length;
      state.estaCargandoNoti = false;
    },
    falloNotificaciones: (state, action) => {
      state.estaCargandoNoti = false;
      state.error = action.payload ?? "Error al cargar notificaciones";
    },

    marcarNotificacionLeidaLocal: (state, action) => {
      const id = action.payload;
      const idx = state.notificaciones.findIndex(
        (n) => n.id_notificacion === id
      );
      if (idx >= 0 && !state.notificaciones[idx].leido) {
        state.notificaciones[idx].leido = true;
        state.noLeidasCount = Math.max(0, state.noLeidasCount - 1);
      }
    },

    marcarTodasLeidasLocal: (state) => {
      state.notificaciones = state.notificaciones.map((n) => ({
        ...n,
        leido: true,
      }));
      state.noLeidasCount = 0;
    },
  },
});

export const {
  iniciaCargaNotificaciones,
  cargaNotificaciones,
  falloNotificaciones,
  marcarNotificacionLeidaLocal,
  marcarTodasLeidasLocal,
} = notificacionSlice.actions;
