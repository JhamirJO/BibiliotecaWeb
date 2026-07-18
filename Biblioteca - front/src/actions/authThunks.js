// src/actions/authThunks.js
import { loginStart, loginSuccess, loginFailure, setFromStorage, logout } from "@/slices/authSlice";
import { saveSession, clearSession, loadSessionRaw, isSessionValid } from "@/utils/authStorage";
import { resetPrestamo } from "@/slices/prestamoSlice";
import { resetBibliotecario } from "@/slices/bibliotecarioSlice";
import { resetLector } from "@/slices/lectorSlice";
import { decodeJwt } from "@/utils/jwt";

const urlBack = import.meta.env.VITE_APP_BACKEND_URL;
const apiAuth = import.meta.env.VITE_APP_API_Auth;

export const loginThunk = ({ username, password }) => {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const res = await fetch(`${urlBack + apiAuth}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(res.status === 401 ? "Credenciales inválidas" : `Error ${res.status}`);

      const { token } = await res.json();
      if (!token) throw new Error("Token no recibido");

      const payload = decodeJwt(token);
      if (!payload?.exp || payload.exp * 1000 <= Date.now()) throw new Error("Token expirado");

      const role = (payload.role || "").replace(/^ROLE_/, "");
      const auth = { token, username: payload.sub, role, exp: payload.exp };
      console.log(role);
      dispatch(loginSuccess(auth));
      saveSession(auth);
    } catch (err) {
      dispatch(loginFailure(err.message));
      clearSession();
    }
  };
};

export const loadSessionThunk = () => {
  return (dispatch) => {
    const saved = loadSessionRaw();
    if (isSessionValid(saved)) {
      dispatch(setFromStorage(saved));
    } else {
      clearSession();
      dispatch(logout());
    }
  };
};

export const logoutThunk = () => (dispatch) => { 
  clearSession(); 
  dispatch(logout()); 
  dispatch(resetPrestamo());
  dispatch(resetLector());
  dispatch(resetBibliotecario());
};

export const authFetch = (input, init = {}) => {
  return async (dispatch, getState) => {
    const { token, exp } = getState()?.auth || {};
    const isExpired = !exp || exp * 1000 <= Date.now();

    const headers = new Headers(init.headers || {});
    if (token && !isExpired) headers.set("Authorization", `Bearer ${token}`);

    const resp = await fetch(input, { ...init, headers });
    return resp;
  };
};
