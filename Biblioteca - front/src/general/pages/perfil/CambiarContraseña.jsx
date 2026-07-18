// src/general/pages/perfil/CambiarContraseña.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@/components/Card";
import Input from "@/components/Input";

import {
  getLectorPerfil,
} from "@/actions/lectorThunks";

import {
  getBibliotecarioPerfil,
} from "@/actions/bibliotecarioThunks";

import {
  cambiarPasswordUsuario,
} from "@/actions/userThunks";

export default function CambiarContraseña() {
  const dispatch = useDispatch();

  // --- auth: para saber si es lector o bibliotecario ---
  const { role } = useSelector((state) => state.auth || {});
  const isLector = role === "LECTOR";
  const isBibliotecario = role === "BIBLIOTECARIO";

  // --- slices de perfil ---
  const {
    perfil: perfilLector = null,
    estaCargandoLector = false,
    error: errorLector = null,
  } = useSelector((s) => s.lector ?? {});

  const {
    perfil: perfilBibliotecario = null,
    estaCargandoBibliotecario = false,
    error: errorBibliotecario = null,
  } = useSelector((s) => s.bibliotecario ?? {});

  // --- slice de usuario (cambio de password / delete) ---
  const {
    estaProcesando: estaProcesandoUsuario = false,
    error: errorUsuario = null,
    cambioPasswordOk = false,
  } = useSelector((s) => s.user ?? {});

  // registro común (como en Perfil.jsx) pero usando perfil
  const registro = useMemo(() => {
    if (isLector) return perfilLector;
    if (isBibliotecario) return perfilBibliotecario;
    return null;
  }, [isLector, isBibliotecario, perfilLector, perfilBibliotecario]);

  const usuario = registro?.usuario;

  // ⚠️ AHORA tomamos el id_u desde usuario, NO el cod_l / cod_b
  const usuarioId = usuario?.id_u;

  const isLoadingPerfil = isLector ? estaCargandoLector : estaCargandoBibliotecario;
  const errorGlobalPerfil = errorLector || errorBibliotecario;

  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errorLocal, setErrorLocal] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar perfil según rol (para poder obtener usuario.id_u)
  useEffect(() => {
    if (!registro) {
      if (isLector) dispatch(getLectorPerfil());
      else if (isBibliotecario) dispatch(getBibliotecarioPerfil());
    }
  }, [registro, isLector, isBibliotecario, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal("");
    setSuccessMsg("");

    if (!nueva || !confirmar) {
      setErrorLocal("Completa ambos campos.");
      return;
    }

    if (nueva !== confirmar) {
      setErrorLocal("Las contraseñas no coinciden.");
      return;
    }

    if (!registro || !usuario || !usuarioId) {
      setErrorLocal("No se pudo obtener tu perfil. Intenta nuevamente.");
      return;
    }

    try {
      // 👉 ahora SOLO usamos el thunk de usuario (no updateLector/updateBibliotecario)
      const resp = await dispatch(cambiarPasswordUsuario(usuarioId, nueva));

      if (!resp?.ok) {
        setErrorLocal(resp?.error || "Error al actualizar la contraseña.");
        return;
      }

      setSuccessMsg("Tu contraseña se actualizó correctamente.");
      setNueva("");
      setConfirmar("");
    } catch (err) {
      setErrorLocal(err.message || "Ocurrió un error al actualizar.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Cambiar contraseña</h1>
          <p className="text-slate-600 mb-6">
            Ingresa tu nueva contraseña y confírmala para actualizarla.
          </p>

          {isLoadingPerfil && (
            <p className="text-sm text-slate-500 mb-4">
              Cargando tu perfil...
            </p>
          )}

          {errorGlobalPerfil && (
            <p className="text-sm text-red-600 mb-4">{errorGlobalPerfil}</p>
          )}

          {errorUsuario && (
            <p className="text-sm text-red-600 mb-4">{errorUsuario}</p>
          )}

          {errorLocal && (
            <p className="text-sm text-red-600 mb-4">{errorLocal}</p>
          )}

          {(cambioPasswordOk || successMsg) && (
            <p className="text-sm text-emerald-600 mb-4">
              {successMsg || "Tu contraseña se actualizó correctamente."}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña nueva
              </label>
              <Input
                type="password"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmar contraseña
              </label>
              <Input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Vuelve a escribir la contraseña"
                autoComplete="new-password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn bg-slate-700 hover:bg-slate-600 text-white w-full sm:w-auto"
                disabled={isLoadingPerfil || estaProcesandoUsuario}
              >
                {estaProcesandoUsuario ? "Guardando..." : "Guardar contraseña"}
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
