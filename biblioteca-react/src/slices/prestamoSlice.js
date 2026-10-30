// src/slices/prestamoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "",

  lista: [],
  estaCargandoLista: false,
  errorLista: null,

  misPrestamos: [],
  estaCargandoMisPrestamos: false,
  errorMisPrestamos: null,
};

export const prestamoSlice = createSlice({
  name: "prestamo",
  initialState,
  reducers: {
    // ===== LISTA GENERAL =====
    iniciaCargaPrestamo: (state) => {
      state.estaCargandoLista = true;
      state.errorLista = null;
    },
    cargaPrestamo: (state, action) => {
      state.lista = action.payload.prestamo;
      state.estaCargandoLista = false;
    },
    errorPrestamo: (state, action) => {
      state.estaCargandoLista = false;
      state.errorLista = action.payload;
    },

    // ===== MIS PRÉSTAMOS (por dni) =====
    iniciaCargaPrestamoUsuario: (state) => {
      state.estaCargandoMisPrestamos = true;
      state.errorMisPrestamos = null;
    },
    cargaPrestamoUsuario: (state, action) => {
      state.misPrestamos = action.payload.prestamo;
      state.estaCargandoMisPrestamos = false;
    },
    errorPrestamoUsuario: (state, action) => {
      state.estaCargandoMisPrestamos = false;
      state.errorMisPrestamos = action.payload;
    },

    // reset total del slice (logout)
    resetPrestamo: () => initialState,
  },
});

export const {
  iniciaCargaPrestamo,
  cargaPrestamo,
  errorPrestamo,
  iniciaCargaPrestamoUsuario,
  cargaPrestamoUsuario,
  errorPrestamoUsuario,
  resetPrestamo,
} = prestamoSlice.actions;
