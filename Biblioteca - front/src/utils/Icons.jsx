
import React from "react";

const SvgBase = ({ children, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`sidebar__icon ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {children}
  </svg>
);


export const Icons = {
  // --- Dashboard ---
  Menu: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16 M4 12h16 M4 19h16" />
    </SvgBase>
  ),
  ExitDoor: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="m16 17 5-5-5-5 M21 12H9 M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </SvgBase>
  ),

  // --- Sidebar ---
   Usuario: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 
        0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 
        0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </SvgBase>
  ),
  Publicaciones: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 
        .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 
        8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 
        8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </SvgBase>
  ),
  Prestamo: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
       d="M16 19h6 M16 2v4 M19 16v6 M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5 
       M3 10h18 M8 2v4"/>
      </SvgBase>
  ),
  Devoluciones: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 9.5 2 2 4-4"/>
    </SvgBase>
  ),
  Reporte: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M13 17V9 M18 17V5 M3 3v16a2 2 0 0 0 2 2h16 M8 17v-3"/>
    </SvgBase>
  ),
  Sancion: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 16 6-6"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21.5 10.5-8-8"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 8 6-6"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.5 7.5 8 8"/>
    </SvgBase>
  ),

  PerfilIcon: (props) => (
    <SvgBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.376 18.91a6 6 0 0 1 11.249.003"/>
      <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" cx="12" cy="11" r="4"/>
    </SvgBase> 
),

  Notifacion: (props) => (
      <SvgBase {...props}>
        <path
          d="M10.268 21a2 2 0 0 0 3.464 0 M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SvgBase>
  ),
};

export function PencilIcon(props) {
  return (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.314l-4.5 1.125L4.125 16.5 16.862 3.487z"
      />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}

export function ViewIcon(props) {
  return (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <circle cx="12" cy="12.5" r="3.25" />
    </svg>
  );
}

export function ArchiveIcon(props) {
  return (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" {...props}>
      <rect
        x="3"
        y="4"
        width="16"
        height="4"
        rx="1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8v8.5A1.5 1.5 0 0 0 6.5 18h9A1.5 1.5 0 0 0 17 16.5V8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ViewPW(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <circle cx="12" cy="12.5" r="3.25" />
    </svg>
  );
}

export function GestorUsuario(){
  return(
       <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-800"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        </svg>
    );
}

export function GestorPub(){
  return(
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-800">
      <rect width="8" height="18" x="3" y="3" rx="1"/>
      <path d="M7 3v18"/>
      <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>
  );
}

export function ReporteIcon(){
  return(
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="lucide lucide-chart-pie-icon lucide-chart-pie">
      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/></svg>
  );
}
export function SearchPub(){
  return(
    <svg xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="lucide lucide-search-icon lucide-search">
        <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
  )
}

export function BtnAgregarUsuario(){
  return(
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
    </svg>
  )
}

export function BtnAgregar(){
  return(
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
    </svg>
  )
}

export function LimpiarFiltro(){
  return(
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd" />
    </svg>
  )
}
// Icono de usuario (círculo + hombros)
export function UserCircleIcon(props) {
  return (
    <SvgBase viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

// Estrella para el rol (Administrador)
export function StarBadgeIcon(props) {
  return (
    <SvgBase viewBox="0 0 24 24" {...props}>
      <path
        d="M12 1l3 7h7l-5.5 4 2 7L12 16l-6.5 3 2-7L2 8h7z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

// Icono para código / ID
export function CodeHashIcon(props) {
  return (
    <SvgBase viewBox="0 0 24 24" {...props}>
      <path
        d="M3 7h18M3 12h18M3 17h18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

// Icono de correo
export function MailIcon(props) {
  return (
    <SvgBase viewBox="0 0 24 24" {...props}>
      <path
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 8l-10 6L2 8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

// Icono de teléfono
export function PhoneIcon(props) {
  return (
    <SvgBase viewBox="0 0 24 24" {...props}>
      <path
        d="M3 5a2 2 0 0 1 2-2h3l1 4-2 2a14 14 0 0 0 6 6l2-2 4 1v3a2 2 0 0 1-2 2h-1A16 16 0 0 1 3 6V5z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgBase>
  );
}

export function PasswordIcon(props) {
  return (
    <SvgBase
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
      />
      <circle
        cx="16.5"
        cy="7.5"
        r="0.5"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
    </SvgBase>
  );
}

