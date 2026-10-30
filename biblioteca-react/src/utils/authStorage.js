// src/utils/authStorage.js
const AUTH_STORAGE_KEY = "auth/session";

export const saveSession = ({ token, username, role, exp }) => {
  try { localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, username, role, exp })); } catch {}
};

export const clearSession = () => { try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch {} };

export const loadSessionRaw = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const isSessionValid = (s) => !!(s && s.exp && s.exp * 1000 > Date.now());
export const AUTH_STORAGE_KEY_CONST = AUTH_STORAGE_KEY; // por si lo necesitas en otro lado
