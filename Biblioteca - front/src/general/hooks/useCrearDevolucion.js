// src/hooks/useCrearDevolucion.js
import { useState } from "react";
import { useAuthFetch } from "./useAuthFetch";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiDevolucion = import.meta.env.VITE_APP_API_Devolucion;

async function readErrorMessage(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { const data = await res.json(); return data.message || `Error ${res.status}`; }
    catch { return `Error ${res.status}`; }
  } else {
    try { return (await res.text()) || `Error ${res.status}`; }
    catch { return `Error ${res.status}`; }
  }
}

export function useCrearDevolucion() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const authFetch = useAuthFetch();


  // Por id de préstamo (línea única)
  const crearDevolucionIDP = async ({ fecha, prestamoId }) => {
    setIsLoading(true); setError(null);
    try {
      const res = await authFetch(`${urlBack + apiDevolucion}/id-prestamo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha, prestamoId }),
      });
      if (!res.ok) throw new Error(await readErrorMessage(res));
      return true;
    } catch (err) {
      setError(err.message || "Error desconocido");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Por id de comprobante (bloque)
  const crearDevolucionComprobante = async ({ fecha, comprobanteId }) => {
    setIsLoading(true); setError(null);
    try {
      const res = await authFetch(`${urlBack + apiDevolucion}/comprobante`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha, comprobanteId }),
      });
      if (!res.ok) throw new Error(await readErrorMessage(res));
      return true;
    } catch (err) {
      setError(err.message || "Error desconocido");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    crearDevolucionIDP,
    crearDevolucionComprobante,
    isLoading,
    error,
    setError
  };
}
