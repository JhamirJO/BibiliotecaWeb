import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Brand({ to = "/home", inverse = false }) {
  return (
    <Link
      to={to}
      className={`brand${inverse ? " brand--inverse" : ""}`}
      aria-label="Biblioteca San Marcos, inicio"
    >
      <span className="brand-mark">
        <BookOpen size={23} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span>
        <span className="brand-name">
          Biblioteca<span className="brand-dot">.</span>
        </span>
      </span>
    </Link>
  );
}
