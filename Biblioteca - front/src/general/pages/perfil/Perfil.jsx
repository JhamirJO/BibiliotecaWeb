import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/Card";
import {
  UserCircleIcon,
  StarBadgeIcon,
  CodeHashIcon,
  MailIcon,
  PhoneIcon,
  PasswordIcon,
} from "@/utils/icons";
import { Link } from "react-router-dom";
import { getLectorPerfil } from "@/actions/lectorThunks";
import { getBibliotecarioPerfil } from "@/actions/bibliotecarioThunks";

function DetailItem({ label, icon, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
          {label}
        </div>
        <div className="mt-1 text-slate-900 font-medium">
          {value || "Información no disponible"}
        </div>
      </div>
    </div>
  );
}

export default function Perfil() {
  const dispatch = useDispatch();

  // --- auth ---
  const { username, role } = useSelector((state) => state.auth || {});

  const isLector = role === "LECTOR";
  const isBibliotecario = role === "BIBLIOTECARIO";

  // --- lector slice ---
  const {
    perfil: perfilLector = null,
    estaCargandoLector = false,
    error: errorLector = null,
  } = useSelector((s) => s.lector ?? {});

  // --- bibliotecario slice ---
  const {
    perfil: perfilBibliotecario = null,
    estaCargandoBibliotecario = false,
    error: errorBibliotecario = null,
  } = useSelector((s) => s.bibliotecario ?? {});

  // 1) Traer datos según el rol, usando /me, pero atado al username
  useEffect(() => {
    if (isLector) {
      const perfilUsername = perfilLector?.usuario?.username;
      if (!perfilLector || perfilUsername !== username) {
        dispatch(getLectorPerfil());
      }
    } else if (isBibliotecario) {
      const perfilUsername = perfilBibliotecario?.usuario?.username;
      if (!perfilBibliotecario || perfilUsername !== username) {
        dispatch(getBibliotecarioPerfil());
      }
    }
  }, [
    dispatch,
    isLector,
    isBibliotecario,
    username,
    perfilLector,
    perfilBibliotecario,
  ]);


  // 2) Elegir el perfil según rol
  const registro = useMemo(() => {
    if (isLector) return perfilLector;
    if (isBibliotecario) return perfilBibliotecario;
    return null;
  }, [isLector, isBibliotecario, perfilLector, perfilBibliotecario]);

  // 3) Desestructurar según el tipo
  const persona = registro?.persona;
  const usuario = registro?.usuario;
  const lector = registro?.lector;
  const bibliotecario = registro?.bibliotecario;

  const nombre = persona?.nombre || "";
  const apellido = persona?.apellido || "";
  const codigo = isLector ? lector?.cod_l : bibliotecario?.cod_b;
  const email = usuario?.email || "";
  const telefono = persona?.telefono || "";
  const estado = lector?.estado || bibliotecario?.estado || "ACTIVO";

  const titulo =
    nombre || apellido
      ? `${nombre || ""} ${apellido || ""}`.trim()
      : "Información No Disponible";

  const isLoading = isLector ? estaCargandoLector : estaCargandoBibliotecario;
  const error = errorLector || errorBibliotecario;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <Card>
        <div className="p-6">
          {/* Encabezado */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
              <UserCircleIcon className="h-7 w-7 text-slate-500" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{titulo}</h2>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                {/* Rol */}
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <StarBadgeIcon className="h-4 w-4" />
                  {role || "Rol no disponible"}
                </span>

                {/* Username */}
                <span className="text-slate-500 font-mono">
                  @{username || "usuario"}
                </span>

                {/* Estado */}
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {estado}
                </span>

                {isLoading && (
                  <span className="text-xs text-slate-400">Cargando…</span>
                )}
                {error && (
                  <span className="text-xs text-red-500">
                    Error al cargar perfil
                  </span>
                )}
                {!isLoading && !error && !registro && (
                  <span className="text-xs text-slate-400">
                    No se encontró un registro para este usuario.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detalle */}
          <div className="pt-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <DetailItem
              label="Nombre"
              icon={<UserCircleIcon className="h-5 w-5" />}
              value={nombre}
            />

            <DetailItem
              label="Apellido"
              icon={<UserCircleIcon className="h-5 w-5" />}
              value={apellido}
            />

            <DetailItem
              label="Código"
              icon={<CodeHashIcon className="h-5 w-5" />}
              value={codigo}
            />

            <DetailItem
              label="Correo"
              icon={<MailIcon className="h-5 w-5" />}
              value={email}
            />

            <DetailItem
              label="Teléfono"
              icon={<PhoneIcon className="h-5 w-5" />}
              value={telefono}
            />

            <DetailItem
              label="Contraseña"
              icon={<PasswordIcon className="h-5 w-5" />}
              value={
                <Link
                  to="/dashboard/cambiar-password"
                  className="text-blue-800 hover:underline cursor-pointer"
                >
                  Cambiar Contraseña
                </Link>
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
