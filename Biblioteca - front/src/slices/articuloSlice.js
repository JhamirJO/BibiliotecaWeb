// slices/articuloSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const articuloSlice = createSlice({
  name: "articulo",
  initialState: {
    status: "",
    articulo: [],                 // lista [{ articulo, publicacion }, ...]
    detalle: null,                // { articulo, publicacion }
    estaCargandoArticulo: false,  // loading de lista
    estaCargandoDetalle: false,   // loading de detalle
    error: null,
  },
  reducers: {
    iniciaCargaArticulo: (state) => {
      state.estaCargandoArticulo = true;
      state.error = null;
    },
    cargaArticulo: (state, action) => {
      state.articulo = action.payload.articulo; // array
      state.estaCargandoArticulo = false;
    },
    agregaArticulo: (state, action) => {
      state.articulo.push(action.payload);
      state.estaCargandoArticulo = false;
    },

    // ---- DETALLE ----
    iniciaCargaDetalleArticulo: (state) => {
      state.estaCargandoDetalle = true;
      state.error = null;
      state.detalle = null;
    },
    cargaDetalleArticulo: (state, action) => {
      state.detalle = action.payload; // { articulo, publicacion }
      state.estaCargandoDetalle = false;
    },

    falloArticulo: (state, action) => {
      state.estaCargandoArticulo = false;
      state.estaCargandoDetalle = false;
      state.error = action.payload ?? "Error desconocido";
    },
  },
});

export const {
  iniciaCargaArticulo, cargaArticulo, agregaArticulo,
  iniciaCargaDetalleArticulo, cargaDetalleArticulo, limpiaDetalleArticulo,
  falloArticulo
} = articuloSlice.actions;
