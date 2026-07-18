import { createSlice } from "@reduxjs/toolkit";

export const publicacionSlice = createSlice({
  name: "publicacion",
  initialState: {
    status: "",
    publicacion: [],
    estaCargandoPublicacion: false,
    error: null,
  },
  reducers: {
    iniciaCargaPublicacion: (state) => {
      state.estaCargandoPublicacion = true;
      state.error = null;
    },
    cargaPublicacion: (state, action) => {
      state.publicacion = action.payload.publicacion;
      state.estaCargandoPublicacion = false;
      state.error = null;
    },
    errorPublicacion: (state, action) => {
      state.estaCargandoPublicacion = false;
      state.error = action.payload;
    },
  },
});

export const {
  iniciaCargaPublicacion,
  cargaPublicacion,
  errorPublicacion,
} = publicacionSlice.actions;
