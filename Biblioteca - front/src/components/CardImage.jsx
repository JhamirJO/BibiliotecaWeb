import portadaFallback from "@/img/NoImagen.png";

export default function CardImage({
  src,
  alt,
  title,
  badge,
  className = "",
  children,
  footer,
  onClick,
}) {
  return (
    <article className={`catalog-card ${className}`}>
      <button
        type="button"
        className="catalog-cover"
        onClick={onClick}
        aria-label={`Ver ficha de ${title || "la publicación"}`}
      >
        <img
          src={src || portadaFallback}
          alt={alt || "Portada de publicación"}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = portadaFallback;
          }}
        />
      </button>
      {badge && <span className="catalog-kind">{badge}</span>}
      <h2>
        <button type="button" onClick={onClick}>
          {title || "Sin título"}
        </button>
      </h2>
      <div className="catalog-card__description">{children}</div>
      {footer && <footer className="catalog-card__footer">{footer}</footer>}
    </article>
  );
}
