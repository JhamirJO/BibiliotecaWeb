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
  mode = "create",          // 👈 NUEVO
}) {
  const dialogRef = useRef(null);
  const boxRef = useRef(null);
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
    []
  );

  const [tipo, setTipo] = useState(initialTipo);
  const [form, setForm] = useState(EMPTY);

  const isEdit = mode === "edit";   // 👈 NUEVO

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
  }, [initialValues, initialTipo, EMPTY]);

  // Control modal
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
    }
  }, [open]);

  useEffect(() => {
    if (!portadaFile) {
      if (portadaPreview) {
        URL.revokeObjectURL(portadaPreview);
      }
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

  const handleOverlayClick = (e) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) handleCancel();
  };
  const handleEsc = (e) => e.key === "Escape" && handleCancel();

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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Tipo de publicación<span className="text-error">*</span>
          </span>
        </label>
        <select
          className="select select-bordered w-full"
          value={c.tipo}
          onChange={c.handleTipoChange}
          disabled={submitting}
          required
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    ),
    titulo: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Título<span className="text-error">*</span>
          </span>
        </label>
        <Input
          type="text"
          placeholder="Ej: Diseño Operativo"
          value={c.form.publicacion.titulo}
          onChange={(e) => c.handleChange("publicacion", "titulo", e.target.value)}
          required
        />
      </div>
    ),
    autor: (c) => (
      <div className="md:col-span-2">
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Autor<span className="text-error">*</span>
          </span>
        </label>
        <Input
          type="text"
          placeholder="Ej: Alphonse Marshall"
          value={c.form.publicacion.autor}
          onChange={(e) => c.handleChange("publicacion", "autor", e.target.value)}
          required
        />
      </div>
    ),

    resumen: (c) => (
      <div className="md:col-span-2">
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Resumen<span className="text-error">*</span>
          </span>
        </label>
        <TextArea
          size="md"
          rows={4}
          placeholder="Breve descripción…"
          value={c.form.publicacion.resumen}
          onChange={(e) => c.handleChange("publicacion", "resumen", e.target.value)}
        />
      </div>
    ),

    portada: () => (
      <div className="md:col-span-2">
        <label className="label text-slate-700">
          <span className="label-text font-medium">Portada (PNG/JPG/WEBP, máx 5 MB)</span>
        </label>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Preview */}
          <div className="w-28 h-40 rounded-lg overflow-hidden ring-1 ring-slate-200 bg-slate-100 shrink-0">
            {portadaPreview ? (
              <img src={portadaPreview} alt="Preview portada" className="w-full h-full object-cover" />
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
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="file-input bg-slate-600 text-white hover:bg-slate-700 w-full"
              disabled={submitting}
              onChange={(e) => handlePortadaChange(e.target.files?.[0] ?? null)}
            />

            {portadaFile && (
              <div className="mt-2 text-xs text-slate-600">
                {portadaFile.name} · {(portadaFile.size / (1024*1024)).toFixed(2)} MB
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Edición<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Área<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Año publicación<span className="text-error">*</span>
          </span>
        </label>
        <Input
          type="number"
          min="1800"
          max="2100"
          step="1"
          placeholder="Ej: 2018"
          value={c.form.articulo.anio_pub}
          onChange={(e) => c.handleChange("articulo", "anio_pub", e.target.value)}
          required={c.tipo === "Articulo"}
        />
      </div>
    ),
    articulo_idioma: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Idioma<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Volumen
          </span>
        </label>
        <Input
          type="number"
          min="0"
          step="1"
          placeholder="Ej: 12"
          value={c.form.articulo.volumen}
          onChange={(e) => c.handleChange("articulo", "volumen", e.target.value)}
          disabled={submitting}
        />
      </div>
    ),
    numero_issue: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Número (issue)
          </span>
        </label>
        <Input
          type="number"
          min="0"
          step="1"
          placeholder="Ej: 3"
          value={c.form.articulo.numero_issue}
          onChange={(e) => c.handleChange("articulo", "numero_issue", e.target.value)}
          disabled={submitting}
        />
      </div>
    ),
    titulo_revista: (c) => (
      <div className="md:col-span-2">
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Título de la revista
          </span>
        </label>
        <Input
          type="text"
          placeholder="Ej: Journal of Computer Vision"
          value={c.form.articulo.titulo_revista}
          onChange={(e) => c.handleChange("articulo", "titulo_revista", e.target.value)}
          disabled={submitting}
        />
      </div>
    ),

    // Tesis (nuevo tipo)
    tesis_grado: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Grado<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Escuela<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Institución<span className="text-error">*</span>
          </span>
        </label>
        <Input
          type="text"
          placeholder="Ej: Universidad Nacional Mayor de San Marcos"
          value={c.form.tesis.institucion}
          onChange={(e) => c.handleChange("tesis", "institucion", e.target.value)}
          required={c.tipo === "Tesis"}
        />
      </div>
    ),
    tesis_idioma: (c) => (
      <div>
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Idioma<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Área<span className="text-error">*</span>
          </span>
        </label>
        <Input
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
        <label className="label text-slate-700">
          <span className="label-text font-medium">
            Palabras clave
          </span>
        </label>
        <Input
          type="text"
          placeholder="Ej: HSV; visión; espárrago; agricultura de precisión"
          value={c.form.tesis.palabras_clave}
          onChange={(e) => c.handleChange("tesis", "palabras_clave", e.target.value)}
        />
      </div>
    ),

    // Comunes al final

    stock_pag: (c) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label text-slate-700">
            <span className="label-text font-medium">
              Copias<span className="text-error">*</span>
            </span>
          </label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="Ej: 25"
            value={c.form.publicacion.stock}
            onChange={(e) => c.handleChange("publicacion", "stock", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label text-slate-700">
            <span className="label-text font-medium">
              Cant. páginas<span className="text-error">*</span>
            </span>
          </label>
          <Input
            type="number"
            min="1"
            step="1"
            placeholder="Ej: 220"
            value={c.form.publicacion.cant_pag}
            onChange={(e) => c.handleChange("publicacion", "cant_pag", e.target.value)}
            required
          />
        </div>
      </div>
    ),
  };

  // (dejo BASE_FIELDS, EXTRA_BY_TIPO y activeSpecs igual que ya los tienes)

  const BASE_FIELDS = [
    { key: "tipo", order: 10, span: 1 },
    { key: "titulo", order: 20, span: 1 },
    { key: "autor", order: 30, span: 1 },
    { key: "stock_pag", order: 900, span: 1 },
    { key: "resumen", order: 1000, span: 1 },
    { key: "portada", order: 1005, span: 1 },
  ];

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

  const activeSpecs = useMemo(() => {
    const extras = EXTRA_BY_TIPO[tipo] || [];
    return [...BASE_FIELDS, ...extras].sort((a, b) => a.order - b.order);
  }, [tipo]);

  const ctx = { tipo, form, handleTipoChange, handleChange };

  // 👇 título dinámico según tipo + modo
  const humanTipo =
    tipo === "Articulo" ? "Artículo" : tipo === "Tesis" ? "Tesis" : "Libro";
  const title = isEdit ? `Editar ${humanTipo}` : `Nueva ${humanTipo}`;

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClick={handleOverlayClick}
      onKeyDown={handleEsc}
      aria-label="Formulario de publicación"
      aria-modal="true"
    >
      <div
        ref={boxRef}
        className="modal-box max-w-3xl p-0 flex flex-col max-w-4xl max-h-[90vh] min-h-0"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="bg-slate-700 text-white px-6 py-4 shrink-0">
          <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
          <p className="text-sm opacity-90">
            Completa los campos según el tipo seleccionado.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0"
        >
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

          <div className="shrink-0 flex flex-col md:flex-row gap-3 md:justify-end px-6 py-3 border-t bg-base-100">
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
              className="btn bg-red-500 text-white hover:bg-red-400"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-slate-700 text-white hover:bg-slate-500"
              disabled={submitting}
            >
              {submitting
                ? "Guardando..."
                : isEdit
                ? "Guardar cambios"
                : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button
          aria-label="Cerrar"
          onClick={handleCancel}
          disabled={submitting}
        >
          close
        </button>
      </form>
    </dialog>
  );
}

function numOrEmpty(v) {
  if (v === "" || v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isNaN(n) ? "" : n;
}
