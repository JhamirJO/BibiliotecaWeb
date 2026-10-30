// src/utils/navConfig.js
import { Icons } from "./Icons";

export const SECTIONS = [
  {
    label: "Gestión",
    items: [
      { to: "/dashboard/publicaciones", label: "Publicaciones", Icon: Icons.Publicaciones, roles: ["ADMIN","BIBLIOTECARIO"] },
      { to: "/dashboard/usuarios",      label: "Usuarios",      Icon: Icons.Usuario,       roles: ["ADMIN","BIBLIOTECARIO"] },
      { to: "/dashboard/prestamo",      label: "Préstamos",     Icon: Icons.Prestamo,      roles: ["ADMIN","BIBLIOTECARIO"] },
      { to: "/dashboard/devoluciones",  label: "Devoluciones",  Icon: Icons.Devoluciones,  roles: ["ADMIN","BIBLIOTECARIO"] },
    ],
  },
  {
    label: "Sistema",
    items: [{ to: "/dashboard/sancion", label: "Sanción", Icon: Icons.Sancion, roles: ["ADMIN","BIBLIOTECARIO"] }],
  },
  {
    label: "Analítica",
    items: [{ to: "/dashboard/reporte", label: "Reporte", Icon: Icons.Reporte, roles: ["ADMIN"] }],
  },
  {
    label: "Catálogo",
    items: [{ to: "/dashboard/catalogo", label: "Publicaciones", Icon: Icons.Publicaciones,roles: ["LECTOR"] }],
  },
  {
    label: "Historial",
    items: [{ to: "/dashboard/historial", label: "Mis Préstamos", Icon: Icons.Prestamo,roles: ["LECTOR"] }],
  },
  {
    label: "Información",
    items: [{ to: "/dashboard/perfil", label: "Ver Perfil", Icon: Icons.PerfilIcon }],
  },
];

// ✅ Rutas extra permitidas (no visibles en menú)
// (solo raíz /comprobante)
const EXTRA_ALLOWED = [
  "/comprobante",
  "/dashboard/cambiar-password",  // 👈 añadimos esto
];

export function filterSectionsByRole(sections, role) {
  return sections
    .map(s => ({ ...s, items: s.items.filter(it => !it.roles || it.roles.includes(role)) }))
    .filter(s => s.items.length > 0);
}

export function getBreadcrumbParts(pathname, role) {
  const strip = (p) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);
  const path = strip(pathname);
  const normalized = path === "/dashboard" ? "/dashboard/perfil" : path;

  const sections = filterSectionsByRole(SECTIONS, role);

  for (const section of sections) {
    for (const item of section.items) {
      if (normalized === item.to || normalized.startsWith(item.to + "/")) {
        return { section: section.label, page: item.label };
      }
    }
  }
  return { section: "Panel", page: "Control" };
}

export function isRouteAllowed(role, path) {
  const sections = filterSectionsByRole(SECTIONS, role);
  const inMenu = sections.some(s => s.items.some(it => path.startsWith(it.to)));
  const inExtra = EXTRA_ALLOWED.some(p => path.startsWith(p));
  return inMenu || inExtra; // permite /comprobante aunque no esté en el menú
}

export function getDefaultDashboardPath(role) {
  const sections = filterSectionsByRole(SECTIONS, role);
  const first = sections.flatMap(s => s.items)[0];
  return first?.to ?? "/dashboard/perfil";
}
