// src/hooks/useSancion.js
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { authFetch, logoutThunk } from "@/actions/authThunks";
import { getLector } from "@/actions/lectorThunks";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiSancion = import.meta.env.VITE_APP_API_Sancion;

export default function useSancion() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const levantarSancion = useCallback(
    async (dni, lectorId) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        if (!dni || dni.trim() === "") {
          throw new Error("El DNI no puede estar vacío");
        }

        const resp = await dispatch(
          authFetch(
            `${urlBack + apiSancion}/levantar?dni=${encodeURIComponent(dni)}`,
            { method: "POST" }
          )
        );

        if (resp.status === 401) {
          dispatch(logoutThunk());
          return;
        }

        if (!resp.ok) {
          let msg = "Error al levantar la sanción";
          try {
            const err = await resp.json();
            msg = err.message || msg;
          } catch {}
          throw new Error(msg);
        }

        // ✅ Sanción levantada correctamente
        setSuccess(true);

        await dispatch(getLector());

      } catch (e) {
        console.error(e);
        setError(e.message || "Error al levantar la sanción");
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const resetEstado = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    levantarSancion,
    loading,
    error,
    success,
    resetEstado,
  };
}
