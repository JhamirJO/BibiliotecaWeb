// src/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  estaProcesando: false,
  error: null,

  // para que el front pueda reaccionar si quiere
  ultimoUsuarioEliminadoId: null,
  cambioPasswordOk: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    iniciaAccionUsuario: (state) => {
      state.estaProcesando = true;
      state.error = null;
      state.cambioPasswordOk = false;
    },
    exitoEliminarUsuario: (state, action) => {
      state.estaProcesando = false;
      state.ultimoUsuarioEliminadoId = action.payload; // id
    },
    exitoCambiarPassword: (state) => {
      state.estaProcesando = false;
      state.cambioPasswordOk = true;
    },
    errorUsuario: (state, action) => {
      state.estaProcesando = false;
      state.error = action.payload || "Ocurrió un error";
    },
    resetUserEstado: () => initialState,
  },
});

export const {
  iniciaAccionUsuario,
  exitoEliminarUsuario,
  exitoCambiarPassword,
  errorUsuario,
  resetUserEstado,
} = userSlice.actions;

