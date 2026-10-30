// slices/tesisSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const tesisSlice = createSlice({
  name: "tesis",
  initialState: {
    status: '',
    tesis: [],                 // lista [{ tesis, publicacion }, ...]
    detalle: null,             // { tesis, publicacion }
    estaCargandoTesis: false,  // loading lista
    estaCargandoDetalle: false,// loading detalle
    error: null,
  },
  reducers: {
    iniciaCargaTesis: (state) => {
      state.estaCargandoTesis = true;
      state.error = null;
    },
    cargaTesis: (state, action) => {
      state.tesis = action.payload.tesis;
      state.estaCargandoTesis = false;
    },

    // ---- DETALLE ----
    iniciaCargaDetalleTesis: (state) => {
      state.estaCargandoDetalle = true;
      state.error = null;
      state.detalle = null;
    },
    cargaDetalleTesis: (state, action) => {
      state.detalle = action.payload; // { tesis, publicacion }
      state.estaCargandoDetalle = false;
    },

    falloTesis: (state, action) => {
      state.estaCargandoTesis = false;
      state.estaCargandoDetalle = false;
      state.error = action.payload ?? "Error desconocido";
    },
  },
});

export const {
  iniciaCargaTesis, cargaTesis, falloTesis,
  iniciaCargaDetalleTesis, cargaDetalleTesis, limpiaDetalleTesis
} = tesisSlice.actions;
