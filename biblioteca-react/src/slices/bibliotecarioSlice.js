// src/slices/bibliotecarioSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "",

  // 🔹 listado (admin)
  bibliotecario: [],
  estaCargandoBibliotecario: false,
  error: null,

  // 🔹 detalle por id
  detalle: null,
  estaCargandoDetalle: false,
  errorDetalle: null,

  // 🔹 perfil del bibliotecario logueado (/me)
  perfil: null,
};

export const bibliotecarioSlice = createSlice({
  name: "bibliotecario",
  initialState,
  reducers: {
    // ===== LISTA =====
    iniciaCargaBibliotecario: (state) => {
      state.estaCargandoBibliotecario = true;
      state.error = null;
    },
    cargaBibliotecario: (state, action) => {
      state.bibliotecario = action.payload.bibliotecario;
      state.estaCargandoBibliotecario = false;
    },
    errorBibliotecario: (state, action) => {
      state.estaCargandoBibliotecario = false;
      state.error = action.payload;
    },

    // ===== DETALLE =====
    iniciaCargaDetalleBibliotecario: (state) => {
      state.estaCargandoDetalle = true;
      state.errorDetalle = null;
      state.detalle = null;
    },
    cargaDetalleBibliotecario: (state, action) => {
      state.detalle = action.payload;
      state.estaCargandoDetalle = false;
    },
    errorDetalleBibliotecario: (state, action) => {
      state.estaCargandoDetalle = false;
      state.errorDetalle = action.payload;
    },
    limpiarDetalleBibliotecario: (state) => {
      state.detalle = null;
      state.errorDetalle = null;
      state.estaCargandoDetalle = false;
    },

    // ===== PERFIL (/me) =====
    iniciaCargaPerfilBibliotecario: (state) => {
      state.estaCargandoBibliotecario = true;
      state.error = null;
    },
    cargaPerfilBibliotecario: (state, action) => {
      state.perfil = action.payload;    // 👈 objeto, NO array
      state.estaCargandoBibliotecario = false;
    },
    errorPerfilBibliotecario: (state, action) => {
      state.estaCargandoBibliotecario = false;
      state.error = action.payload;
    },

    // reset al hacer logout
    resetBibliotecario: () => initialState,
  },
});

export const {
  iniciaCargaBibliotecario,
  cargaBibliotecario,
  errorBibliotecario,
  iniciaCargaDetalleBibliotecario,
  cargaDetalleBibliotecario,
  errorDetalleBibliotecario,
  limpiarDetalleBibliotecario,
  iniciaCargaPerfilBibliotecario,
  cargaPerfilBibliotecario,
  errorPerfilBibliotecario,
  resetBibliotecario,
} = bibliotecarioSlice.actions;
