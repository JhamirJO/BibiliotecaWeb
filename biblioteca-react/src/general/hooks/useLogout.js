// src/hooks/useLogout.js
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "@/actions/authThunks";

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useCallback(async () => {
    await dispatch(logoutThunk());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);
}
