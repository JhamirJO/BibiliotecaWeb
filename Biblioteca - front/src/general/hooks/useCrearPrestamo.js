// /general/hooks/useCrearPrestamo.js
import { useState, useCallback } from "react";
import { useAuthFetch } from "@/general/hooks/useAuthFetch";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiPrestamo = import.meta.env.VITE_APP_API_Prestamo;

async function extractApiMessage(resp) {
  try {
    const ctype = resp.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      const data = await resp.clone().json();
      const msg = (typeof data?.message === "string" && data.message.trim()) ||
                  (typeof data?.error === "string" && data.error.trim());
      if (msg) return msg;
    }
    const text = await resp.text();
    if (!text) return `HTTP ${resp.status}`;
    try { const data = JSON.parse(text); return data?.message || data?.error || text; }
    catch { return text; }
  } catch {
    return `HTTP ${resp.status}`;
  }
}

export function useCrearPrestamo() {
  const authFetch = useAuthFetch();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const crearPrestamo = useCallback(async ({ fecha, dni, publicacionCod }) => {
    setLoading(true);
    setError(null);
    try {
      const pubs = Array.isArray(publicacionCod) ? publicacionCod : [publicacionCod];
      const payload = { fecha, dni, publicacionCod: pubs.map(n => Number(n)) };

      const resp = await authFetch(`${urlBack + apiPrestamo}/generar`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const msg = await extractApiMessage(resp);
        setError(msg);
        throw new Error(msg);
      }
      const ctype = resp.headers.get("content-type") || "";
      if (!ctype.includes("application/json")) {
        return null;
      }
      const data = await resp.json(); // { idComprobante: number }
      setError(null);
      return data?.idComprobante ?? null;
    } catch (e) {
      setError(prev => prev || e?.message || "No se pudo conectar con el servidor");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  return { crearPrestamo, isLoading, error, setError };
}
