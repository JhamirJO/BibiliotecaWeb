export default function CardImage({
  src,
  alt,
  title,
  badge,
  className = "",
  children,   // contenido "principal"
  footer,     // 👈 nuevo prop para el footer fijo
  onClick,
}) {
  const clickable = typeof onClick === "function";

  return (
    <div
      className={`card bg-base-100 shadow-sm 
        w-[240px]               /* ancho fijo, no responsivo */
        ${clickable ? "cursor-pointer transition hover:shadow-md" : ""}
        ${className}
      `}
      onClick={onClick}
      {...(clickable ? { role: "button", tabIndex: 0 } : {})}
    >
      {/* Contenedor de imagen con alto fijo */}
      <figure className="bg-white w-full h-[350px] flex items-center justify-center overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </figure>

      {/* Body con layout fijo */}
      <div className="card-body p-3 text-[12px] gap-1 flex flex-col h-[380px] overflow-hidden">
        {badge && (
          <div className="badge bg-slate-500 text-white text-[10px] w-fit">
            {badge}
          </div>
        )}

        <h2 className="card-title text-[13px] leading-snug">
          {title}
        </h2>

        {/* Contenido scrollable/recortado */}
        <div className="mt-1 flex-1 flex flex-col gap-1 overflow-hidden">
          {children}
        </div>

        {/* Footer fijo abajo */}
        {footer && (
          <div className="pt-2 mt-2 border-t border-slate-200 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
