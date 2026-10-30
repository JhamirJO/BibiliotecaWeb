import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import Brand from "@/components/layout/Brand";
import interior from "@/assets/media/biblioteca-interior.jpg";

export default function LoginPage() {
  return (
    <div className="login-site">
      <header className="login-top">
        <Brand />
        <Link className="text-link" to="/home">
          Volver al inicio
        </Link>
      </header>
      <main className="login-layout">
        <section className="login-form-side">
          <LoginForm />
        </section>
        <section className="login-photo">
          <img src={interior} alt="Interior de biblioteca" />
          <div className="login-story">
            <span className="eyebrow">Un espacio para aprender</span>
            <div>
              <h2>
                El conocimiento
                <br />
                se construye
                <br />
                leyendo.
              </h2>
              <p>
                Consulta nuestras publicaciones y lleva el seguimiento de tus
                préstamos.
              </p>
            </div>
            <small>Universidad Nacional Mayor de San Marcos</small>
          </div>
        </section>
      </main>
    </div>
  );
}
