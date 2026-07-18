import { configureStore } from "@reduxjs/toolkit";
import {
  authSlice,
  lectorSlice,
  prestamoSlice,
  publicacionSlice,
  libroSlice,
  articuloSlice,
  bibliotecarioSlice,
  tesisSlice,
  notificacionSlice ,
  userSlice
} from "../slices";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    lector: lectorSlice.reducer,
    prestamo: prestamoSlice.reducer,
    publicacion: publicacionSlice.reducer,
    libro: libroSlice.reducer,
    articulo: articuloSlice.reducer,
    bibliotecario: bibliotecarioSlice.reducer,
    tesis: tesisSlice.reducer,
    notificacion: notificacionSlice.reducer,
    user: userSlice.reducer,
  },
});
