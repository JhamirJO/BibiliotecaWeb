// src/hooks/useAuthFetch.js
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "@/actions/authThunks";

export function useAuthFetch() {
  const dispatch = useDispatch();
  const { token, exp } = useSelector((s) => s.auth || {});

  return async (input, init = {}) => {
    const isExpired = !exp || exp * 1000 <= Date.now();
    const headers = new Headers(init.headers || {});
    if (token && !isExpired) headers.set("Authorization", `Bearer ${token}`);

    const resp = await fetch(input, { ...init, headers });
    if (resp.status === 401) {
      dispatch(logoutThunk());
    }
    return resp;
  };
}
