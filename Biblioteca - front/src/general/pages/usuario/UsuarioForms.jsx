// src/pages/lector/UsuarioForms.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Input from "@/components/Input";

export default function UsuarioForms({
  open,
  onClose,
  creating = false,
  error,
  tipo = "Lector",        // "Lector" | "Bibliotecario"
  initialValues,          // para modo edición
  onCreated,              // (payload, { mode }) => Promise / void
  returnFocusRef,         // opcional, para devolver el foco
  mode = "create",        // "create" | "edit"
}) {
  const dialogRef = useRef(null);
  const boxRef = useRef(null);

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
    []
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
  }, [initialValues, EMPTY]);

  // Control del <dialog> (apertura/cierre + foco)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    if (open) {
      requestAnimationFrame(() => {
        if (boxRef.current) boxRef.current.focus();
        else dialog?.focus();
      });
    } else {
      // al cerrar, limpiamos el formulario
      setForm(EMPTY);
    }
  }, [open, EMPTY]);

  const handleOverlayClick = (e) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) handleCancel();
  };

  const handleEsc = (e) => {
    if (e.key === "Escape") handleCancel();
  };

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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Usuario<span className="text-error">*</span>
          </span>
        </label>
        <Input
          type="text"
          placeholder="Ej: Lector3"
          value={c.form.usuario.username}
          onChange={(e) => c.handleChange("usuario", "username", e.target.value)}
          required
          disabled={c.creating}
        />
      </div>
    ),
    user_email: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Correo electrónico<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Contraseña
            {!c.isEdit && <span className="text-error">*</span>}
          </span>
        </label>
        <Input
          type="password"
          placeholder={c.isEdit ? "Contraseña" : "********"}
          value={c.form.usuario.password_hash}
          onChange={(e) =>
            c.handleChange("usuario", "password_hash", e.target.value)
          }
          required={!c.isEdit}  // solo obligatoria al crear
          disabled={c.creating}
        />
      </div>
    ),

    // PERSONA
    persona_dni: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            DNI<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Nombre<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Apellidos<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Teléfono<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Dirección<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
  const BASE_FIELDS = [
    // User
    { key: "user_username", order: 10, span: 1 },
    { key: "user_password", order: 20, span: 1 },
    { key: "user_email", order: 60, span: 1 },

    // Persona
    { key: "persona_nombre", order: 30, span: 1 },
    { key: "persona_apellido", order: 40, span: 1 },
    { key: "persona_dni", order: 50, span: 1 },
    { key: "persona_telefono", order: 70, span: 1 },
  ];

  // Extra según rol
  const EXTRA_BY_TIPO = {
    Lector: [{ key: "lector_direccion", order: 80, span: 1 }],
  };

  const activeSpecs = useMemo(() => {
    const extras = EXTRA_BY_TIPO[tipo] || [];
    return [...BASE_FIELDS, ...extras].sort((a, b) => a.order - b.order);
  }, [tipo]);

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
  const title = isEdit
    ? tipo === "Bibliotecario"
      ? "Editar Bibliotecario"
      : "Editar Lector"
    : tipo === "Bibliotecario"
    ? "Nuevo Bibliotecario"
    : "Nuevo Lector";

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClick={handleOverlayClick}
      onKeyDown={handleEsc}
      aria-label="Formulario de usuario"
      aria-modal="true"
    >
      <div
        ref={boxRef}
        className="modal-box max-w-2xl p-0 flex flex-col max-h-[90vh] min-h-0"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="bg-slate-700 text-white px-6 py-4 shrink-0">
          <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
          <p className="text-sm opacity-90">
            Completa los datos de acceso y de la persona.
            {tipo === "Lector" &&
              " La dirección se registra como dato del lector."}
          </p>
          {error && (
            <p className="mt-2 text-xs bg-red-500/20 border border-red-400 text-red-50 rounded px-3 py-1.5">
              {String(error)}
            </p>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Body con scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6 overscroll-contain">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSpecs.map(({ key, span = 1 }) => {
                const spanClass =
                  span === 2
                    ? "md:col-span-2"
                    : span === 3
                    ? "md:col-span-3"
                    : "";
                return (
                  <div key={key} className={spanClass}>
                    {Fields[key](ctx)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex flex-col md:flex-row gap-3 md:justify-end px-6 py-3 border-t bg-base-100">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleCancel}
              disabled={creating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-slate-700 text-white hover:bg-slate-500"
              disabled={creating}
            >
              {creating
                ? isEdit
                  ? "Guardando..."
                  : "Creando..."
                : isEdit
                ? "Guardar cambios"
                : "Crear"}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button
          aria-label="Cerrar"
          onClick={handleCancel}
          disabled={creating}
        >
          close
        </button>
      </form>
    </dialog>
  );
}
