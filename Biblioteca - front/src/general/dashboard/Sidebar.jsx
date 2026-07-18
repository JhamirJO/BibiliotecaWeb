// src/dashboard/Sidebar.jsx
import React, { useMemo } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { SECTIONS, filterSectionsByRole } from "../../utils/navConfig";
import { useSelector } from "react-redux";

export default function Sidebar({ drawerId = "app-drawer" }) {
  const role = useSelector(s => s.auth?.role); // "BIBLIOTECARIO", "LECTOR", "ADMIN", etc.

  const sections = useMemo(
    () => filterSectionsByRole(SECTIONS, role),
    [role]
  );

  return (
    <div className="drawer-side">
      <div className="drawer-overlay lg:hidden pointer-events-none" />
      <aside className="sidebar h-screen lg:h-screen sticky lg:top-0 overflow-y-auto">
        <div className="sidebar__header">
          <div className="sidebar__panelHint">Panel</div>
          <div className="sidebar__brand">BIBLIOTECA</div>
        </div>

        <ul className="sidebar__menu">
          {sections.map((sec) => (
            <li key={sec.label} className="sidebar__section">
              <span className="sidebar__sectionLabel">{sec.label}</span>

              {sec.items.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
                  }
                >
                  {Icon && <Icon />}
                  <span>{label}</span>
                </NavLink>
              ))}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
