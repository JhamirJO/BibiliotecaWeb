import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { SECTIONS, filterSectionsByRole } from "@/utils/navConfig";

// The existing role configuration is shared by desktop and mobile navigation.
export default function Sidebar({
  isOpen = false,
  onNavigate,
  reader = false,
}) {
  const role = useSelector((state) => state.auth?.role);
  const items = filterSectionsByRole(SECTIONS, role).flatMap(
    (section) => section.items,
  );
  return (
    <nav
      id="workspace-navigation"
      className={`workspace-navigation${isOpen ? " is-open" : ""}${reader ? " workspace-navigation--reader" : ""}`}
      aria-label={reader ? "Menú del lector" : "Navegación de gestión"}
    >
      <div className="workspace-navigation__inner">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `workspace-link${isActive ? " is-active" : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
            <span>
              {role === "LECTOR" && to.endsWith("catalogo")
                ? "Catálogo"
                : to.endsWith("perfil")
                  ? "Mi perfil"
                  : label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
