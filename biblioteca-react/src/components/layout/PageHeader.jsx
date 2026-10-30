export default function PageHeader({
  title,
  description,
  section = "Gestión bibliotecaria",
  children,
}) {
  return (
    <header className="page-heading">
      <div>
        <span className="eyebrow">{section}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="page-heading__actions">{children}</div>}
    </header>
  );
}
