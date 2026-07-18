import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",           // idle | authenticating | authenticated | error
  token: null,
  username: null,
  role: null,
  exp: null,                // segs epoch (del JWT)
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.status = "authenticating";
      state.error = null;
    },
    loginSuccess(state, action) {
      const { token, username, role, exp } = action.payload;
      state.status = "authenticated";
      state.token = token;
      state.username = username;
      state.role = role;
      state.exp = exp;
      state.error = null;
    },
    loginFailure(state, action) {
      state.status = "error";
      state.error = action.payload || "Error de autenticación";
    },
    setFromStorage(state, action) {
      const { token, username, role, exp } = action.payload || {};
      if (token && exp && exp * 1000 > Date.now()) {
        state.status = "authenticated";
        state.token = token;
        state.username = username || null;
        state.role = role || null;
        state.exp = exp;
        state.error = null;
      } else {
        // sesión expirada o inválida
        state.status = "idle";
        state.token = null;
        state.username = null;
        state.role = null;
        state.exp = null;
        state.error = null;
      }
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.status = "idle";
      state.token = null;
      state.username = null;
      state.role = null;
      state.exp = null;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setFromStorage,
  clearError,
  logout,
} = authSlice.actions;
