import { useSelector } from "react-redux";
export const useCurrentRole = () => {
  const raw =
    useSelector((s) => s.auth?.user?.role || s.auth?.user?.rol || s.auth?.role || s.auth?.rol) || "";
  return raw.toString().trim().toUpperCase().replace(/^ROLE_/, "");
};