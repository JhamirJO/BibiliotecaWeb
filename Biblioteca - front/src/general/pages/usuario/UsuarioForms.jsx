import { ArrowLeft, UserRound } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import useRecordView from "@/general/hooks/useRecordView";
// src/pages/lector/UsuarioForms.jsx
import React, { useEffect, useMemo, useState } from "react";
import Input from "@/components/Input";

export default function UsuarioForms({
  open,
  onClose,
  creating = false,
  error,
  tipo = "Lector", // "Lector" | "Bibliotecario"
  initialValues, // para modo edición
  onCreated, // (payload, { mode }) => Promise / void
  returnFocusRef, // opcional, para devolver el foco
  mode = "create", // "create" | "edit"
}) {
  const recordRef = useRecordView(open, onClose, creating);

  const isEdit = mode === "edit";

  // ======================
  // Estado base del form
  // ======================
  const EMPTY = useMemo(
    () => ({
      usuario: {
        username: "",
        email: "",
        password_hash: "",
      },
      persona: {
        dni: "",
        nombre: "",
        apellido: "",
        telefono: "",
      },
      lector: {
        direccion: "",
      },
      biblio: {
        // aquí podrías agregar campos específicos de bibliotecario en el futuro
      },
    }),
    [],
  );

  const [form, setForm] = useState(EMPTY);

  // Hidratar desde initialValues (modo edición) o limpiar
  useEffect(() => {
    if (initialValues) {
      setForm({
        ...EMPTY,
        ...initialValues,
        usuario: { ...EMPTY.usuario, ...(initialValues.usuario || {}) },
        persona: { ...EMPTY.persona, ...(initialValues.persona || {}) },
        lector: { ...EMPTY.lector, ...(initialValues.lector || {}) },
        biblio: { ...EMPTY.biblio, ...(initialValues.biblio || {}) },
      });
    } else {
      setForm(EMPTY);
    }
  }, [initialValues, EMPTY, open]);

  const handleCancel = () => {
    onClose?.();
    requestAnimationFrame(() => returnFocusRef?.current?.focus?.());
  };

  // ======================
  // Helpers de estado
  // ======================
  const handleChange = (section, name, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  // Construir payload según el tipo
  const buildPayload = () => {
    const base = {
      usuario: {
        username: form.usuario.username.trim(),
        email: form.usuario.email.trim(),
        // en edición normalmente el backend interpreta "" como "no cambiar"
        password_hash: form.usuario.password_hash,
      },
      persona: {
        dni: form.persona.dni.trim(),
        nombre: form.persona.nombre.trim(),
        apellido: form.persona.apellido.trim(),
        telefono: form.persona.telefono.trim(),
      },
    };

    if (tipo === "Lector") {
      return {
        ...base,
        lector: {
          direccion: form.lector.direccion.trim(),
        },
      };
    }

    if (tipo === "Bibliotecario") {
      return {
        ...base,
        biblio: {
          ...form.biblio,
        },
      };
    }

    // fallback (no debería ocurrir)
    return base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();

    await onCreated?.(payload, { mode });
  };

  // ======================
  // Campos (registry)
  // ======================
  const Fields = {
    // USER
    user_username: (c) => (
      <div>
        <label htmlFor="user-field-1" className="label text-slate-700">
          <span className="label-text font-medium">
            Usuario<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="user-field-1"
          type="text"
          placeholder="Ej: Lector3"
          value={c.form.usuario.username}
          onChange={(e) =>
            c.handleChange("usuario", "username", e.target.value)
          }
          required
          disabled={c.creating}
        />
      </div>
    ),
    user_email: (c) => (
      <div>
        <label htmlFor="user-field-2" className="label text-slate-700">
          <span className="label-text font-medium">
            Correo electrónico<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="user-field-2"
          type="email"
          placeholder="Ej: lector3@demo.com"
          value={c.form.usuario.email}
          onChange={(e) => c.handleChange("usuario", "email", e.target.value)}
          required
          disabled={c.creating}
        />
      </div>
    ),
    user_password: (c) => (
      <div>
        <label htmlFor="user-field-3" className="label text-slate-700">
          <span className="label-text font-medium">
            Contraseña
            {!c.isEdit && <span className="text-error">*</span>}
          </span>
        </label>
        <Input
          id="user-field-3"
          type="password"
          placeholder={c.isEdit ? "Contraseña" : "********"}
          value={c.form.usuario.password_hash}
          onChange={(e) =>
            c.handleChange("usuario", "password_hash", e.target.value)
          }
          required={!c.isEdit} // solo obligatoria al crear
          disabled={c.creating}
        />
      </div>
    ),

    // PERSONA
    persona_dni: (c) => (
      <div>
        <label htmlFor="user-field-4" className="label text-slate-700">
          <span className="label-text font-medium">
            DNI<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="user-field-4"
          type="text"
          placeholder="Ej: 87732925"
          inputMode="numeric"
          numeric
          maxLength={8}
          value={c.form.persona.dni}
          onChange={(e) => c.handleChange("persona", "dni", e.target.value)}
          required
          disabled={c.creating}
        />
      </div>
    ),
    persona_nombre: (c) => (
      <div>
        <label htmlFor="user-field-5" className="label text-slate-700">
          <span className="label-text font-medium">
            Nombre<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="user-field-5"
          type="text"
          placeholder="Ej: Juan"
          value={c.form.persona.nombre}
          onChange={(e) => c.handleChange("persona", "nombre", e.target.value)}
          required
          disabled={c.creating}
        />
      </div>
    ),
    persona_apellido: (c) => (
      <div>
        <label htmlFor="user-field-6" className="label text-slate-700">
          <span className="label-text font-medium">
            Apellidos<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="user-field-6"
          type="text"
          placeholder="Ej: Pérez"
          value={c.form.persona.apellido}
          onChange={(e) =>
            c.handleChange("persona", "apellido", e.target.value)
          }
          required
          disabled={c.creating}
        />
      </div>
    ),
    persona_telefono: (c) => (
      <div>
        <label htmlFor="user-field-7" className="label text-slate-700">
          <span className="label-text font-medium">
            Teléfono<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="user-field-7"
          type="text"
          inputMode="numeric"
          numeric
          placeholder="Ej: 957114222"
          maxLength={9}
          value={c.form.persona.telefono}
          onChange={(e) =>
            c.handleChange("persona", "telefono", e.target.value)
          }
          required
          disabled={c.creating}
        />
      </div>
    ),

    // LECTOR (solo cuando tipo === "Lector")
    lector_direccion: (c) => (
      <div className="md:col-span-2">
        <label htmlFor="user-field-8" className="label text-slate-700">
          <span className="label-text font-medium">
            Dirección<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="user-field-8"
          type="text"
          placeholder="Ej: Av. San José 754"
          value={c.form.lector.direccion}
          onChange={(e) =>
            c.handleChange("lector", "direccion", e.target.value)
          }
          required={c.tipo === "Lector"}
          disabled={c.creating}
        />
      </div>
    ),
  };

  // Campos base (comunes a ambos roles)
  const ctx = {
    tipo,
    form,
    creating,
    handleChange,
    isEdit,
  };

  // ======================
  // Render
  // ======================
  const title = `${isEdit ? "Editar" : "Nuevo"} ${tipo.toLowerCase()}`;

  if (!open) return null;
  const renderFields = (keys) =>
    keys.map((key) => (
      <div
        key={key}
        className={
          ["lector_direccion", "user_password"].includes(key)
            ? "field-full"
            : ""
        }
      >
        {Fields[key](ctx)}
      </div>
    ));
  return (
    <section
      ref={recordRef}
      className="record-page user-form-page"
      aria-label="Formulario de usuario"
    >
      <PageHeader
        title={title}
        section="Usuarios"
        description={
          isEdit
            ? "Actualiza la información personal y los datos de acceso."
            : "Completa los datos personales y crea la cuenta de acceso al portal."
        }
      >
        <button
          type="button"
          className="btn"
          onClick={handleCancel}
          disabled={creating}
        >
          <ArrowLeft size={17} />
          Volver a usuarios
        </button>
      </PageHeader>
      <div className="record-form-layout">
        <form className="panel record-form" onSubmit={handleSubmit}>
          {error && (
            <div className="record-form-error alert alert-error" role="alert">
              {String(error)}
            </div>
          )}
          <fieldset className="record-form-section">
            <legend>Datos personales</legend>
            <p>Los campos marcados con * son obligatorios.</p>
            <div className="record-form-grid">
              {renderFields([
                "persona_nombre",
                "persona_apellido",
                "persona_dni",
                "persona_telefono",
                ...(tipo === "Lector" ? ["lector_direccion"] : []),
              ])}
            </div>
          </fieldset>
          <fieldset className="record-form-section">
            <legend>Datos de acceso</legend>
            <p>La cuenta se utilizará para ingresar al portal.</p>
            <div className="record-form-grid">
              {renderFields(["user_username", "user_email", "user_password"])}
            </div>
          </fieldset>
          <footer className="record-form-actions">
            <button
              type="button"
              className="btn"
              onClick={handleCancel}
              disabled={creating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating
                ? "Guardando…"
                : isEdit
                  ? "Guardar cambios"
                  : "Guardar usuario"}
            </button>
          </footer>
        </form>
        <aside className="record-note">
          <span className="eyebrow">{tipo}</span>
          <UserRound size={30} strokeWidth={1.4} />
          <h2>
            Información
            <br />
            de la cuenta
          </h2>
          <p>
            {tipo === "Lector"
              ? "El lector tendrá acceso al catálogo, a su historial de préstamos y a los datos de su perfil."
              : "El bibliotecario tendrá acceso a los módulos de gestión autorizados para su rol."}
          </p>
          <hr />
          <p>
            La creación de bibliotecarios corresponde al administrador del
            sistema.
          </p>
          {isEdit && (
            <p>Conserva la contraseña vacía si no deseas modificarla.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
