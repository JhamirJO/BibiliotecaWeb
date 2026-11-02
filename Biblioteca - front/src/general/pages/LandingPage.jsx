import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Brand from "@/components/layout/Brand";
import lectura from "@/assets/media/sala-lectura.jpg";
import interior from "@/assets/media/biblioteca-interior.jpg";

const services = [
  [
    "01",
    "Catálogo de publicaciones",
    "Busca libros, artículos y tesis por título o autor. Consulta su ficha y disponibilidad.",
  ],
  [
    "02",
    "Préstamos y devoluciones",
    "Registra préstamos y devoluciones con sus fechas y comprobantes.",
  ],
  [
    "03",
    "Gestión de usuarios",
    "Administra los datos y el estado de lectores y bibliotecarios.",
  ],
  [
    "04",
    "Historial de préstamos",
    "Revisa tus préstamos, su fecha de vencimiento y su estado.",
  ],
  [
    "05",
    "Reportes",
    "Consulta el comportamiento de los préstamos y la composición del catálogo.",
  ],
  [
    "06",
    "Sanciones y avisos",
    "Gestiona sanciones y consulta recordatorios de préstamos por vencer o vencidos.",
  ],
];
const questions = [
  [
    "¿Cómo accedo al portal?",
    "Utiliza el usuario y la contraseña proporcionados por la biblioteca. El registro de usuarios se realiza desde el módulo de gestión.",
  ],
  [
    "¿Cómo encuentro una publicación?",
    "En el catálogo puedes buscar por título o autor y filtrar por libros, artículos o tesis. Abre una ficha para revisar sus datos.",
  ],
  [
    "¿Cuánto dura un préstamo?",
    "El plazo máximo es de 7 días desde la fecha del préstamo. Consulta la fecha de vencimiento en Mis préstamos.",
  ],
  [
    "¿Dónde reviso mis préstamos?",
    "Inicia sesión como lector y entra a Mis préstamos para consultar el historial y sus estados.",
  ],
  [
    "¿Qué ocurre si devuelvo tarde?",
    "Puede aplicarse una sanción por retraso. Acércate a la biblioteca para revisar tu situación.",
  ],
];
export default function LandingPage() {
  return (
    <div className="public-site">
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <div className="university-bar">
        <span>Portal bibliotecario</span>
      </div>
      <header className="public-header">
        <Brand />
        <nav className="public-nav" aria-label="Navegación principal">
          <a href="#servicios">Servicios</a>
          <a href="#biblioteca">La biblioteca</a>
          <a href="#contacto">Contacto</a>
          <Link className="btn btn-primary" to="/login">
            Iniciar sesión <ArrowRight size={17} />
          </Link>
        </nav>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Biblioteca San Marcos</span>
            <h1>
              Un lugar para
              <br />
              todas tus
              <br />
              <em>preguntas.</em>
            </h1>
            <p>
              Explora el conocimiento que buscas. Tu catálogo y el seguimiento
              de tus préstamos, en un mismo espacio.
            </p>
            <div className="actions">
              <Link className="btn btn-primary" to="/login">
                Ingresar al portal <ArrowRight size={18} />
              </Link>
              <a className="btn quiet" href="#biblioteca">
                Conoce la biblioteca
              </a>
            </div>
            <div className="hero-reference">
              <span>Libros</span>
              <span>Artículos</span>
              <span>Tesis</span>
            </div>
          </div>
          <figure className="hero-photo">
            <img src={lectura} alt="Sala de lectura con mesas y estanterías" />
            <figcaption className="photo-caption">
              El siguiente capítulo
              <br />
              comienza aquí.
            </figcaption>
            <span className="photo-index">San Marcos · Biblioteca</span>
          </figure>
        </section>
        <div className="stats-strip">
          {[
            ["150+", "Publicaciones en el catálogo"],
            ["100+", "Lectores registrados"],
            ["80+", "Libros físicos disponibles"],
            ["90+", "Artículos y tesis"],
          ].map(([number, title]) => (
            <div key={title} className="stat">
              <b>{number}</b>
              <span>{title}</span>
            </div>
          ))}
        </div>
        <section id="servicios" className="public-section">
          <div className="section-top">
            <div>
              <span className="eyebrow">Servicios bibliotecarios</span>
              <h2>
                Tu biblioteca,
                <br />
                mejor conectada.
              </h2>
            </div>
            <p>
              Consulta el catálogo como lector o administra las operaciones
              desde el portal de gestión.
            </p>
          </div>
          <div className="service-grid">
            {services.map(([number, title, description]) => (
              <article className="service" key={number}>
                <div className="service-number">{number}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="biblioteca" className="public-section about-grid">
          <img
            src={interior}
            alt="Estanterías y mesas de consulta de una biblioteca"
            loading="lazy"
          />
          <div>
            <span className="eyebrow">Nuestra biblioteca</span>
            <h2>
              Un punto de encuentro
              <br />
              con el conocimiento.
            </h2>
            <p>
              El portal reúne el catálogo y la gestión de préstamos para
              facilitar la consulta y el trabajo diario de la biblioteca.
              Lectores, bibliotecarios y administradores acceden a la
              información que necesitan desde su cuenta.
            </p>
            <Link to="/login" className="btn quiet">
              <ArrowRight size={17} />
              Acceder con mi cuenta
            </Link>
          </div>
        </section>
        <section id="contacto" className="public-section contact-grid">
          <div>
            <span className="eyebrow">Estamos para ayudarte</span>
            <h2>Contacto</h2>
            <p>
              Para consultas sobre tu cuenta o tus préstamos, comunícate con la
              biblioteca.
            </p>
            <dl>
              <div>
                <dt>Correo electrónico</dt>
                <dd>contacto@solrasan.edu.pe</dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>+51 1 619-7000</dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>
                  <br />
                  Lima, Perú
                </dd>
              </div>
            </dl>
          </div>
          <div className="faq">
            <h2>Preguntas frecuentes</h2>
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <span>Biblioteca</span>
        <span>
          © {new Date().getFullYear()} · Todos los derechos reservados
        </span>
      </footer>
    </div>
  );
}
