// src/slices/lectorSlice.js
import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    status: '',
    lector: [],
    perfil: null, 

    // 🔹 listado
    estaCargandoLector: false,
    error: null,

    // 🔹 detalle
    detalle: null,
    estaCargandoDetalle: false,
    errorDetalle: null,
  };


export const lectorSlice = createSlice({
  name: "lector",
  initialState,
  
  reducers: {
    // ===== LISTA =====
    iniciaCargaLector: (state) => {
      state.estaCargandoLector = true;
      state.error = null;
    },
    cargaLector: (state, action) => {
      state.lector = action.payload.lector;
      state.estaCargandoLector = false;
    },
    errorLector: (state, action) => {
      state.estaCargandoLector = false;
      state.error = action.payload;
    },

    // ===== DETALLE =====
    iniciaCargaDetalleLector: (state) => {
      state.estaCargandoDetalle = true;
      state.errorDetalle = null;
      state.detalle = null;     // opcional: limpias el detalle anterior
    },
    cargaDetalleLector: (state, action) => {
      state.detalle = action.payload;
      state.estaCargandoDetalle = false;
    },
    errorDetalleLector: (state, action) => {
      state.estaCargandoDetalle = false;
      state.errorDetalle = action.payload;
    },
    limpiarDetalleLector: (state) => {
      state.detalle = null;
      state.errorDetalle = null;
      state.estaCargandoDetalle = false;
    },

      // ===== PERFIL =====
    iniciaCargaPerfilLector: (state) => {
      state.estaCargandoLector = true;
      state.error = null;
    },
    cargaPerfilLector: (state, action) => {
      state.perfil = action.payload;   // 👈 solo un objeto, no array
      state.estaCargandoLector = false;
    },
    errorPerfilLector: (state, action) => {
      state.estaCargandoLector = false;
      state.error = action.payload;
    },

    resetLector: () => initialState,
  }
});

export const {
  iniciaCargaLector,
  cargaLector,
  errorLector,
  iniciaCargaDetalleLector,
  cargaDetalleLector,
  errorDetalleLector,
  limpiarDetalleLector,
  iniciaCargaPerfilLector,
  cargaPerfilLector,
  errorPerfilLector,
  resetLector
} = lectorSlice.actions;
