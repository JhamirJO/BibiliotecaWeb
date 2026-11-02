import { ArrowLeft, BookOpen } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import useRecordView from "@/general/hooks/useRecordView";
// PublicacionForm.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";

export default function PublicacionForm({
  open,
  onClose,
  onSubmit,
  initialTipo = "Libro",
  initialValues,
  submitting = false,
  returnFocusRef,
  mode = "create", // 👈 NUEVO
}) {
  const recordRef = useRecordView(open, onClose, submitting);
  const fileRef = useRef(null);
  const [portadaFile, setPortadaFile] = useState(null);
  const [portadaPreview, setPortadaPreview] = useState(null);

  const TIPOS = ["Libro", "Articulo", "Tesis"];

  const EMPTY = useMemo(
    () => ({
      publicacion: {
        titulo: "",
        autor: "",
        stock: "",
        cant_pag: "",
        resumen: "",
      },
      libro: { genero: "", edicion: "" },
      articulo: {
        area: "",
        anio_pub: "",
        idioma: "",
        volumen: "",
        numero_issue: "",
        titulo_revista: "",
      },
      tesis: {
        grado: "",
        escuela: "",
        institucion: "",
        idioma: "",
        area: "",
        palabras_clave: "",
      },
    }),
    [],
  );

  const [tipo, setTipo] = useState(initialTipo);
  const [form, setForm] = useState(EMPTY);

  const isEdit = mode === "edit"; // 👈 NUEVO

  // Hidratar/limpiar
  useEffect(() => {
    if (initialValues) {
      setForm({
        ...EMPTY,
        ...initialValues,
        publicacion: {
          ...EMPTY.publicacion,
          ...(initialValues.publicacion || {}),
        },
        libro: { ...EMPTY.libro, ...(initialValues.libro || {}) },
        articulo: { ...EMPTY.articulo, ...(initialValues.articulo || {}) },
        tesis: { ...EMPTY.tesis, ...(initialValues.tesis || {}) },
      });
      setTipo(initialTipo || "Libro");
    } else {
      setForm(EMPTY);
      setTipo(initialTipo || "Libro");
    }
  }, [initialValues, initialTipo, EMPTY, open]);

  useEffect(() => {
    if (!portadaFile) {
      setPortadaPreview(null);
      return;
    }
    const url = URL.createObjectURL(portadaFile);
    setPortadaPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [portadaFile]);

  const clearPortada = () => {
    setPortadaFile(null);
    if (portadaPreview) URL.revokeObjectURL(portadaPreview);
    setPortadaPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCancel = () => {
    onClose?.();
    requestAnimationFrame(() => returnFocusRef?.current?.focus?.());
  };

  const handleChange = (section, name, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleTipoChange = (e) => {
    const t = e.target.value;
    setTipo(t);
    setForm((prev) => ({
      ...prev,
      libro: { ...EMPTY.libro },
      articulo: { ...EMPTY.articulo },
      tesis: { ...EMPTY.tesis },
    }));
  };

  const handleClear = () => {
    setForm(EMPTY);
    clearPortada();
  };

  const MAX_MB = 5;
  const handlePortadaChange = (file) => {
    if (!file) {
      setPortadaFile(null);
      return;
    }
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      alert("Formato no permitido. Usa PNG/JPG/WEBP.");
      return;
    }
    const max = MAX_MB * 1024 * 1024;
    if (file.size > max) {
      const mb = (file.size / (1024 * 1024)).toFixed(2);
      alert(`La portada pesa ${mb} MB (máx ${MAX_MB} MB).`);
      return;
    }
    setPortadaFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      publicacion: {
        ...form.publicacion,
        stock: numOrEmpty(form.publicacion.stock),
        cant_pag: numOrEmpty(form.publicacion.cant_pag),
      },
    };

    if (tipo === "Libro") {
      payload.libro = { ...form.libro };
    } else if (tipo === "Articulo") {
      payload.articulo = {
        ...form.articulo,
        anio_pub: numOrEmpty(form.articulo.anio_pub),
        volumen: numOrEmpty(form.articulo.volumen),
        numero_issue: numOrEmpty(form.articulo.numero_issue),
      };
    } else if (tipo === "Tesis") {
      payload.tesis = { ...form.tesis };
    }

    // 👇 ahora pasamos también mode
    const res = await onSubmit?.(payload, { tipo, portadaFile, mode });

    if (!res || res.ok) {
      setForm(EMPTY);
      clearPortada();
    }
  };

  // =========================
  // Registry de campos
  // =========================
  const Fields = {
    // Comunes
    tipo: (c) => (
      <div>
        <label htmlFor="publication-field-1" className="label text-slate-700">
          <span className="label-text font-medium">
            Tipo de publicación<span className="text-error">*</span>
          </span>
        </label>
        <select
          id="publication-field-1"
          className="select select-bordered w-full"
          value={c.tipo}
          onChange={c.handleTipoChange}
          disabled={submitting}
          required
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    ),
    titulo: (c) => (
      <div>
        <label htmlFor="publication-field-2" className="label text-slate-700">
          <span className="label-text font-medium">
            Título<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-2"
          type="text"
          placeholder="Ej: Diseño Operativo"
          value={c.form.publicacion.titulo}
          onChange={(e) =>
            c.handleChange("publicacion", "titulo", e.target.value)
          }
          required
        />
      </div>
    ),
    autor: (c) => (
      <div className="md:col-span-2">
        <label htmlFor="publication-field-3" className="label text-slate-700">
          <span className="label-text font-medium">
            Autor<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-3"
          type="text"
          placeholder="Ej: Alphonse Marshall"
          value={c.form.publicacion.autor}
          onChange={(e) =>
            c.handleChange("publicacion", "autor", e.target.value)
          }
          required
        />
      </div>
    ),

    resumen: (c) => (
      <div className="md:col-span-2">
        <label htmlFor="publication-field-4" className="label text-slate-700">
          <span className="label-text font-medium">
            Resumen<span className="text-error">*</span>
          </span>
        </label>
        <TextArea
          id="publication-field-4"
          size="md"
          rows={4}
          placeholder="Breve descripción…"
          value={c.form.publicacion.resumen}
          onChange={(e) =>
            c.handleChange("publicacion", "resumen", e.target.value)
          }
        />
      </div>
    ),

    portada: () => (
      <div className="md:col-span-2">
        <label htmlFor="publication-field-5" className="label text-slate-700">
          <span className="label-text font-medium">
            Portada (PNG/JPG/WEBP, máx 5 MB)
          </span>
        </label>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Preview */}
          <div className="w-28 h-40 rounded-lg overflow-hidden ring-1 ring-slate-200 bg-slate-100 shrink-0">
            {portadaPreview ? (
              <img
                src={portadaPreview}
                alt="Preview portada"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs text-slate-500">
                Sin imagen
              </div>
            )}
          </div>

          {/* Input de archivo + acciones */}
          <div className="flex-1">
            <input
              ref={fileRef}
              id="publication-field-5"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="file-input w-full"
              disabled={submitting}
              onChange={(e) => handlePortadaChange(e.target.files?.[0] ?? null)}
            />

            {portadaFile && (
              <div className="mt-2 text-xs text-slate-600">
                {portadaFile.name} ·{" "}
                {(portadaFile.size / (1024 * 1024)).toFixed(2)} MB
                <button
                  type="button"
                  className="ml-2 link text-red-600"
                  onClick={clearPortada}
                  disabled={submitting}
                >
                  Quitar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    // Libro
    genero: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Género<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-5"
          type="text"
          placeholder="Ej: Tecnología"
          value={c.form.libro.genero}
          onChange={(e) => c.handleChange("libro", "genero", e.target.value)}
          required={c.tipo === "Libro"}
        />
      </div>
    ),
    edicion: (c) => (
      <div>
        <label htmlFor="publication-field-6" className="label text-slate-700">
          <span className="label-text font-medium">
            Edición<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-6"
          type="text"
          placeholder="Ej: 5ta"
          value={c.form.libro.edicion}
          onChange={(e) => c.handleChange("libro", "edicion", e.target.value)}
          required={c.tipo === "Libro"}
        />
      </div>
    ),

    // Artículo
    area: (c) => (
      <div className="md:col-span-2">
        <label htmlFor="publication-field-7" className="label text-slate-700">
          <span className="label-text font-medium">
            Área<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-7"
          type="text"
          placeholder="Ej: Financiero"
          value={c.form.articulo.area}
          onChange={(e) => c.handleChange("articulo", "area", e.target.value)}
          required={c.tipo === "Articulo"}
        />
      </div>
    ),
    articulo_anio_pub: (c) => (
      <div>
        <label htmlFor="publication-field-8" className="label text-slate-700">
          <span className="label-text font-medium">
            Año publicación<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-8"
          type="number"
          min="1800"
          max="2100"
          step="1"
          placeholder="Ej: 2018"
          value={c.form.articulo.anio_pub}
          onChange={(e) =>
            c.handleChange("articulo", "anio_pub", e.target.value)
          }
          required={c.tipo === "Articulo"}
        />
      </div>
    ),
    articulo_idioma: (c) => (
      <div>
        <label htmlFor="publication-field-9" className="label text-slate-700">
          <span className="label-text font-medium">
            Idioma<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-9"
          type="text"
          placeholder="Ej: es / en"
          value={c.form.articulo.idioma}
          onChange={(e) => c.handleChange("articulo", "idioma", e.target.value)}
          required={c.tipo === "Articulo"}
        />
      </div>
    ),
    volumen: (c) => (
      <div>
        <label htmlFor="publication-field-10" className="label text-slate-700">
          <span className="label-text font-medium">Volumen</span>
        </label>
        <Input
          id="publication-field-10"
          type="number"
          min="0"
          step="1"
          placeholder="Ej: 12"
          value={c.form.articulo.volumen}
          onChange={(e) =>
            c.handleChange("articulo", "volumen", e.target.value)
          }
          disabled={submitting}
        />
      </div>
    ),
    numero_issue: (c) => (
      <div>
        <label htmlFor="publication-field-11" className="label text-slate-700">
          <span className="label-text font-medium">Número (issue)</span>
        </label>
        <Input
          id="publication-field-11"
          type="number"
          min="0"
          step="1"
          placeholder="Ej: 3"
          value={c.form.articulo.numero_issue}
          onChange={(e) =>
            c.handleChange("articulo", "numero_issue", e.target.value)
          }
          disabled={submitting}
        />
      </div>
    ),
    titulo_revista: (c) => (
      <div className="md:col-span-2">
        <label htmlFor="publication-field-12" className="label text-slate-700">
          <span className="label-text font-medium">Título de la revista</span>
        </label>
        <Input
          id="publication-field-12"
          type="text"
          placeholder="Ej: Journal of Computer Vision"
          value={c.form.articulo.titulo_revista}
          onChange={(e) =>
            c.handleChange("articulo", "titulo_revista", e.target.value)
          }
          disabled={submitting}
        />
      </div>
    ),

    // Tesis (nuevo tipo)
    tesis_grado: (c) => (
      <div>
        <label htmlFor="publication-field-13" className="label text-slate-700">
          <span className="label-text font-medium">
            Grado<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-13"
          type="text"
          placeholder="Ej: Maestría / Doctorado"
          value={c.form.tesis.grado}
          onChange={(e) => c.handleChange("tesis", "grado", e.target.value)}
          required={c.tipo === "Tesis"}
        />
      </div>
    ),
    escuela: (c) => (
      <div>
        <label htmlFor="publication-field-14" className="label text-slate-700">
          <span className="label-text font-medium">
            Escuela<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-14"
          type="text"
          placeholder="Ej: Escuela de Ingeniería de Sistemas"
          value={c.form.tesis.escuela}
          onChange={(e) => c.handleChange("tesis", "escuela", e.target.value)}
          required={c.tipo === "Tesis"}
        />
      </div>
    ),
    institucion: (c) => (
      <div>
        <label htmlFor="publication-field-15" className="label text-slate-700">
          <span className="label-text font-medium">
            Institución<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-15"
          type="text"
          placeholder="Ej: Universidad Nacional Mayor de San Marcos"
          value={c.form.tesis.institucion}
          onChange={(e) =>
            c.handleChange("tesis", "institucion", e.target.value)
          }
          required={c.tipo === "Tesis"}
        />
      </div>
    ),
    tesis_idioma: (c) => (
      <div>
        <label htmlFor="publication-field-16" className="label text-slate-700">
          <span className="label-text font-medium">
            Idioma<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-16"
          type="text"
          placeholder="Ej: es / en"
          value={c.form.tesis.idioma}
          onChange={(e) => c.handleChange("tesis", "idioma", e.target.value)}
          required={c.tipo === "Tesis"}
        />
      </div>
    ),
    tesis_area: (c) => (
      <div className="md:col-span-2">
        <label htmlFor="publication-field-17" className="label text-slate-700">
          <span className="label-text font-medium">
            Área<span className="text-error">*</span>
          </span>
        </label>
        <Input
          id="publication-field-17"
          type="text"
          placeholder="Ej: Ingeniería / Visión por Computador"
          value={c.form.tesis.area}
          onChange={(e) => c.handleChange("tesis", "area", e.target.value)}
          required={c.tipo === "Tesis"}
        />
      </div>
    ),
    palabras_clave: (c) => (
      <div className="md:col-span-2">
        <label htmlFor="publication-field-18" className="label text-slate-700">
          <span className="label-text font-medium">Palabras clave</span>
        </label>
        <Input
          id="publication-field-18"
          type="text"
          placeholder="Ej: HSV; visión; espárrago; agricultura de precisión"
          value={c.form.tesis.palabras_clave}
          onChange={(e) =>
            c.handleChange("tesis", "palabras_clave", e.target.value)
          }
        />
      </div>
    ),

    // Comunes al final

    stock_pag: (c) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="publication-field-19"
            className="label text-slate-700"
          >
            <span className="label-text font-medium">
              Copias<span className="text-error">*</span>
            </span>
          </label>
          <Input
            id="publication-field-19"
            type="number"
            min="0"
            step="1"
            placeholder="Ej: 25"
            value={c.form.publicacion.stock}
            onChange={(e) =>
              c.handleChange("publicacion", "stock", e.target.value)
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="publication-field-20"
            className="label text-slate-700"
          >
            <span className="label-text font-medium">
              Cant. páginas<span className="text-error">*</span>
            </span>
          </label>
          <Input
            id="publication-field-20"
            type="number"
            min="1"
            step="1"
            placeholder="Ej: 220"
            value={c.form.publicacion.cant_pag}
            onChange={(e) =>
              c.handleChange("publicacion", "cant_pag", e.target.value)
            }
            required
          />
        </div>
      </div>
    ),
  };

  const EXTRA_BY_TIPO = {
    Libro: [
      { key: "genero", order: 40, span: 1 },
      { key: "edicion", order: 50, span: 1 },
    ],
    Articulo: [
      { key: "area", order: 40, span: 1 },
      { key: "articulo_anio_pub", order: 50, span: 1 },
      { key: "articulo_idioma", order: 60, span: 1 },
      { key: "volumen", order: 70, span: 1 },
      { key: "numero_issue", order: 80, span: 1 },
      { key: "titulo_revista", order: 90, span: 1 },
    ],
    Tesis: [
      { key: "tesis_grado", order: 40, span: 1 },
      { key: "escuela", order: 50, span: 1 },
      { key: "institucion", order: 60, span: 1 },
      { key: "tesis_idioma", order: 70, span: 1 },
      { key: "tesis_area", order: 80, span: 1 },
      { key: "palabras_clave", order: 90, span: 1 },
    ],
  };

  const ctx = { tipo, form, handleTipoChange, handleChange };

  // 👇 título dinámico según tipo + modo
  const humanTipo =
    tipo === "Articulo" ? "Artículo" : tipo === "Tesis" ? "Tesis" : "Libro";
  const title = isEdit
    ? `Editar ${humanTipo.toLowerCase()}`
    : `${tipo === "Tesis" ? "Nueva" : "Nuevo"} ${humanTipo.toLowerCase()}`;

  if (!open) return null;
  const renderFields = (keys) =>
    keys.map((key) => (
      <div
        key={key}
        className={
          [
            "autor",
            "stock_pag",
            "resumen",
            "portada",
            "titulo_revista",
            "palabras_clave",
          ].includes(key)
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
      className="record-page publication-form-page"
      aria-label="Formulario de publicación"
    >
      <PageHeader
        title={title}
        section="Publicaciones"
        description={
          isEdit
            ? "Actualiza la información de la publicación y sus ejemplares."
            : "Registra un libro, artículo o tesis en el catálogo."
        }
      >
        <button
          type="button"
          className="btn"
          onClick={handleCancel}
          disabled={submitting}
        >
          <ArrowLeft size={17} />
          Volver a publicaciones
        </button>
      </PageHeader>
      <div className="record-form-layout">
        <form className="panel record-form" onSubmit={handleSubmit}>
          <fieldset className="record-form-section">
            <legend>Datos de la publicación</legend>
            <p>Los campos marcados con * son obligatorios.</p>
            <div className="record-form-grid">
              {renderFields(["tipo", "titulo", "autor"])}
            </div>
          </fieldset>
          <fieldset className="record-form-section">
            <legend>Información específica</legend>
            <p>Completa los datos correspondientes al tipo de publicación.</p>
            <div className="record-form-grid">
              {renderFields((EXTRA_BY_TIPO[tipo] || []).map(({ key }) => key))}
            </div>
          </fieldset>
          <fieldset className="record-form-section">
            <legend>Ejemplares y descripción</legend>
            <p>Información visible en la ficha de la publicación.</p>
            <div className="record-form-grid">
              {renderFields(["stock_pag", "resumen", "portada"])}
            </div>
          </fieldset>
          <footer className="record-form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClear}
              disabled={submitting}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Guardando…"
                : isEdit
                  ? "Guardar cambios"
                  : "Guardar publicación"}
            </button>
          </footer>
        </form>
        <aside className="record-note">
          <span className="eyebrow">Catálogo bibliográfico</span>
          <BookOpen size={30} strokeWidth={1.4} />
          <h2>
            Una ficha completa,
            <br />
            una mejor consulta.
          </h2>
          <p>
            Revisa el título, los autores y los datos específicos antes de
            guardar la publicación.
          </p>
          <hr />
          <h3>Portada de la publicación</h3>
          <p>Usa una imagen vertical en JPG, PNG o WebP, de hasta 5 MB.</p>
          <p>
            El número de copias indica los ejemplares registrados en biblioteca.
          </p>
        </aside>
      </div>
    </section>
  );
}

function numOrEmpty(v) {
  if (v === "" || v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isNaN(n) ? "" : n;
}
