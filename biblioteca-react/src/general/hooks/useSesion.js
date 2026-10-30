import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const FALLBACK_KEY = "session/countdownEndsAt"; // por si no hay exp

const format = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export function useSesion() {
  const exp = useSelector((s) => s.auth?.exp); // seg UNIX
  const [targetTs, setTargetTs] = useState(() => {
    if (exp) return exp * 1000;
    // fallback 60 minutos persistente
    const saved = Number(localStorage.getItem(FALLBACK_KEY));
    if (saved && saved > Date.now()) return saved;
    const t = Date.now() + 60 * 60 * 1000;
    localStorage.setItem(FALLBACK_KEY, String(t));
    return t;
  });

  // Si cambia exp (p.ej., login/refresh), actualiza destino
  useEffect(() => {
    if (exp) {
      const t = exp * 1000;
      setTargetTs(t);
      localStorage.removeItem(FALLBACK_KEY);
    }
  }, [exp]);

  const [now, setNow] = useState(Date.now());
  const tick = () => {
    // 1Hz sin drift, basado en fecha real
    setNow(Date.now());
  };

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, targetTs - now);
  const expired = remainingMs <= 0;
  const hhmmss = useMemo(() => format(remainingMs), [remainingMs]);

  return { hhmmss, remainingMs, expired };
}
