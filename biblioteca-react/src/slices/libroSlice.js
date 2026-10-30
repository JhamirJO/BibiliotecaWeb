// slices/libroSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const libroSlice = createSlice({
  name: "libro",
  initialState: {
    status: '',
    libro: [],                // LISTA [{ libro, publicacion }, ...] como ya lo tienes
    detalle: null,            // DETALLE { libro, publicacion }
    estaCargandoLibro: false, // loading para lista
    estaCargandoDetalle: false, // loading para detalle
    error: null,
  },
  reducers: {
    iniciaCargaLibro: (state) => {
      state.estaCargandoLibro = true;
      state.error = null;
    },
    cargaLibro: (state, action) => {
      state.libro = action.payload.libro; // array
      state.estaCargandoLibro = false;
    },

    // ---- DETALLE ----
    iniciaCargaDetalle: (state) => {
      state.estaCargandoDetalle = true;
      state.error = null;
      state.detalle = null; // opcional: limpia antes de cargar
    },
    cargaDetalle: (state, action) => {
      state.detalle = action.payload; // { libro, publicacion }
      state.estaCargandoDetalle = false;
    },

    falloLibro: (state, action) => {
      state.estaCargandoLibro = false;
      state.estaCargandoDetalle = false;
      state.error = action.payload ?? "Error desconocido";
    },
  },
});

export const {
  iniciaCargaLibro,
  cargaLibro,
  iniciaCargaDetalle,
  cargaDetalle,
  falloLibro
} = libroSlice.actions;
