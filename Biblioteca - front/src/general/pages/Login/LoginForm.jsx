// src/general/pages/Login/LoginForm.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-box">
      <span className="eyebrow">Acceso al portal</span>
      <h1>
        Tu biblioteca,
        <br />
        más cerca.
      </h1>
      <p>
        Ingresa con el usuario y la contraseña proporcionados por la biblioteca.
      </p>
      <form onSubmit={onSubmit}>
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={form.username}
            onChange={onChange}
            placeholder="Ingresa tu usuario"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <div className="password-control">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={onChange}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword((show) => !show)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>
      <p className="login-footer">
        ¿Necesitas ayuda con tu cuenta? Comunícate con la biblioteca.
      </p>
    </div>
  );
};

export default LoginForm;
