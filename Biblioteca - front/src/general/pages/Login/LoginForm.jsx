// src/general/pages/Login/LoginForm.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/img/logobanner.png";
import "@/general/pages/Login/Login.css";
import Input from "@/components/Input";
import { loginThunk } from "@/actions/authThunks";
import { clearError } from "@/slices/authSlice";
import { getDefaultDashboardPath } from "@/utils/navConfig"; // <-- usa tu helper

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error, role } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: "", password: "" });

  // `from` ahora es string
  const from = location.state?.from ?? null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearError());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginThunk(form));
    // navegación la maneja el useEffect
  };

  useEffect(() => {
    if (status !== "authenticated") return;

    // Destino por rol (p.ej. /dashboard/publicaciones para BIBLIOTECARIO)
    const roleDefault = getDefaultDashboardPath(role) || "/dashboard";

    // Si venías de una protegida del dashboard, puedes respetarla.
    const target =
      typeof from === "string" && from.startsWith("/dashboard")
        ? from
        : roleDefault;

    // Evita navegar si ya estás en ese destino (rompe loops)
    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [status, role, from, navigate, location.pathname]);

  const isLoading = status === "authenticating";

  return (
    <div className="bg-gray-100 flex flex-col w-full flex-grow items-center">
      <img src={logo} alt="Logo" className="w-40 my-4 md:w-52" />
      <div className="flex flex-col items-center justify-center flex-grow mb-16">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-10">
          PORTAL DE GESTIÓN BIBLIOTECARIO
        </h1>

        {error && (
          <div className="alert alert-error w-72 sm:w-80 md:w-96 lg:w-[20rem] mb-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col space-y-4 text-sm w-72 sm:w-80 md:w-96 lg:w-[20rem]">
          <Input
            id="username" name="username" type="text" placeholder="Usuario"
            className="input input-bordered w-full" autoComplete="username"
            required value={form.username} onChange={onChange}
          />
          <Input
            id="password" name="password" type="password" placeholder="Contraseña"
            className="input input-bordered w-full" autoComplete="current-password"
            required value={form.password} onChange={onChange}
          />

          <button type="submit" className="btn bg-slate-700 text-white w-full hover:bg-slate-600" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
