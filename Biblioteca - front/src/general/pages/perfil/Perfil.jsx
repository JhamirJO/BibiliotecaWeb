import PageHeader from "@/components/layout/PageHeader";
import RecordFields from "@/components/layout/RecordFields";
import EstadoPill from "@/components/EstadoPill";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLectorPerfil } from "@/actions/lectorThunks";
import { getBibliotecarioPerfil } from "@/actions/bibliotecarioThunks";

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

  const roleLabel =
    {
      ADMIN: "Administrador",
      BIBLIOTECARIO: "Bibliotecario",
      LECTOR: "Lector",
    }[role] || role;
  const profileName = registro ? titulo : username || "Mi cuenta";
  const initials =
    nombre || apellido
      ? `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
      : (username || "U").slice(0, 2).toUpperCase();
  return (
    <div className="feature-page profile-page">
      <PageHeader
        title="Mi perfil"
        description="Consulta tu información personal y los datos de acceso."
        section="Cuenta"
      />
      {error && (
        <div className="alert alert-error" role="alert">
          No se pudo cargar el perfil: {String(error)}
        </div>
      )}
      {isLoading ? (
        <div className="panel record-loading" role="status">
          <span className="loading" />
          Cargando tu perfil…
        </div>
      ) : (
        <article className="panel record-profile">
          <header className="record-profile-head">
            <span className="record-avatar">{initials}</span>
            <div>
              <h2>{profileName}</h2>
              <p>
                {roleLabel}{" "}
                {codigo !== undefined && codigo !== null
                  ? `· Código ${codigo}`
                  : `· @${username || "usuario"}`}
              </p>
            </div>
            <EstadoPill estado={estado} />
          </header>
          <div className="record-profile-body">
            <section className="record-content-section">
              <h3>Datos personales</h3>
              <RecordFields
                items={[
                  { label: "Nombres", value: nombre },
                  { label: "Apellidos", value: apellido },
                  { label: "Código", value: codigo },
                  { label: "Correo electrónico", value: email },
                  { label: "Teléfono", value: telefono },
                  { label: "Estado", value: <EstadoPill estado={estado} /> },
                ]}
              />
              {!registro && (
                <p className="record-help">
                  No se encontró un registro personal para esta cuenta.
                </p>
              )}
            </section>
            <section className="profile-security">
              <span className="profile-security-icon">
                <LockKeyhole size={23} strokeWidth={1.6} />
              </span>
              <div>
                <h3>Contraseña</h3>
                <p>Actualiza tu contraseña de acceso al portal.</p>
              </div>
              <Link to="/dashboard/cambiar-password" className="btn">
                Cambiar contraseña
                <ArrowUpRight size={16} />
              </Link>
            </section>
          </div>
        </article>
      )}
    </div>
  );
}
