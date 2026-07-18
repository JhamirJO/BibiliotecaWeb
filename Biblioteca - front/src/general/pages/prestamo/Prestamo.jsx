// src/general/pages/prestamo/Prestamo.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card, { CardHeader, CardContent } from "../../../components/Card";
import Input from "@/components/Input";
import { getPrestamo } from "@/actions/prestamoThunks";
import { todayYMD } from "@/utils/date";
import { useCrearPrestamo } from "@/general/hooks/useCrearPrestamo";
import Swal from "sweetalert2";
import TablePrestamo from "./TablePrestamo";

export default function Prestamo() {
  const dispatch = useDispatch();
  const {
    crearPrestamo,
    isLoading,
    error: errorCrear,
    setError: setCrearError,
  } = useCrearPrestamo();

  // 🔹 Ahora leemos la lista general de préstamos del slice
  const {
    lista: prestamos = [],
  } = useSelector((state) => state.prestamo ?? {});

  // Cargar siempre la lista (o si prefieres, solo cuando esté vacía)
  useEffect(() => {
    if (!prestamos.length) {
      dispatch(getPrestamo());
    }
  }, [dispatch, prestamos.length]);

  // ---- FORM MULTI ----
  const [form, setForm] = useState({
    fechaPrestamo: todayYMD(),
    dni: "",
    publicacionInput: "",
    publicacionIds: [], // máx. 3
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const limpiar = () => {
    setForm({
      fechaPrestamo: todayYMD(),
      dni: "",
      publicacionInput: "",
      publicacionIds: [],
    });
    setCrearError(null);
  };

  const addPublicacion = () => {
    const raw = (form.publicacionInput || "").trim();
    const onlyDigits = raw.replace(/\D/g, "");
    if (!onlyDigits) return;

    const idNum = Number(onlyDigits);
    if (!Number.isFinite(idNum)) return;

    setForm((f) => {
      if (f.publicacionIds.includes(idNum)) {
        return { ...f, publicacionInput: "" };
      }
      if (f.publicacionIds.length >= 3) return f;
      return {
        ...f,
        publicacionIds: [...f.publicacionIds, idNum],
        publicacionInput: "",
      };
    });
  };

  const removePublicacion = (id) => {
    setForm((f) => ({
      ...f,
      publicacionIds: f.publicacionIds.filter((x) => x !== id),
    }));
  };

  const onEnterAdd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPublicacion();
    }
  };

  const registrar = async (e) => {
    e.preventDefault();
    try {
      const idComprobante = await crearPrestamo({
        fecha: form.fechaPrestamo,
        dni: form.dni.trim(),
        publicacionCod: form.publicacionIds,
      });

      // refrescamos la lista general
      await dispatch(getPrestamo());

      await Swal.fire({
        icon: "success",
        title: "¡Préstamo creado!",
        text: `DNI ${form.dni} • Publicaciones ${form.publicacionIds.join(", ")}`,
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
        },
      });

      limpiar();

      if (idComprobante != null) {
        window.open(`/comprobante?cid=${idComprobante}&autoprint=1`, "_blank");
      }
    } catch (err) {
      const msg = err?.message || "No se pudo crear el préstamo.";
      await Swal.fire({
        icon: "error",
        title: "No se pudo crear el préstamo",
        text: msg,
        footer: "Verifica DNI, stock, sanciones y límites.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
        },
      });
    }
  };

  const canSubmit =
    form.fechaPrestamo &&
    /^\d{8}$/.test(form.dni) &&
    form.publicacionIds.length >= 1 &&
    form.publicacionIds.length <= 3 &&
    !isLoading;

  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-slate-900">Nuevo Préstamo</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={registrar} className="space-y-4">
            {/* Fila 1: Fecha + DNI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="block text-sm font-medium text-slate-700 mb-1">
                    Fecha de préstamo
                  </span>
                </label>
                <Input
                  type="date"
                  name="fechaPrestamo"
                  value={form.fechaPrestamo}
                  onChange={(e) => setField("fechaPrestamo", e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="block text-sm font-medium text-slate-700 mb-1">
                    DNI del lector
                  </span>
                </label>
                <Input
                  type="text"
                  name="dni"
                  placeholder="Ej. 12345678"
                  value={form.dni}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                    setField("dni", v);
                  }}
                  inputMode="numeric"
                  maxLength={8}
                  required
                />
              </div>
            </div>

            {/* Fila 2: IDs de publicaciones (chips) */}
            <div className="form-control">
              <label className="label">
                <span className="block text-sm font-medium text-slate-700 mb-1">
                  IDs de publicaciones (máx. 3)
                </span>
              </label>

              <div className="flex gap-2">
                <Input
                  type="text"
                  name="publicacionInput"
                  placeholder="Ej. 10234"
                  value={form.publicacionInput}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d,]/g, "");
                    setField("publicacionInput", v);
                  }}
                  onKeyDown={onEnterAdd}
                  inputMode="numeric"
                />
                <button
                  type="button"
                  className="btn bg-slate-700 text-white hover:bg-slate-500"
                  onClick={addPublicacion}
                  disabled={form.publicacionIds.length >= 3}
                  title={
                    form.publicacionIds.length >= 3
                      ? "Máximo 3 publicaciones"
                      : "Agregar"
                  }
                >
                  Añadir
                </button>
              </div>

              {/* Chips */}
              <div className="mt-2 flex flex-wrap gap-2">
                {form.publicacionIds.map((id) => (
                  <span key={id} className="badge badge-lg gap-2">
                    {id}
                    <button
                      type="button"
                      className="ml-1 btn btn-xs btn-ghost"
                      onClick={() => removePublicacion(id)}
                      aria-label={`Quitar ${id}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Puedes añadir hasta 3 publicaciones. Presiona{" "}
                <kbd>Enter</kbd> para agregar rápidamente.
              </p>
            </div>

            {/* Error al crear */}
            {errorCrear && (
              <div className="alert alert-error">
                <span>{String(errorCrear)}</span>
              </div>
            )}

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="btn"
                onClick={limpiar}
                disabled={isLoading}
              >
                Limpiar
              </button>
              <button
                type="submit"
                className={`btn bg-slate-700 text-white ${
                  isLoading ? "loading" : ""
                }`}
                disabled={!canSubmit}
              >
                {isLoading ? "Registrando…" : "Registrar préstamo"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tabla (usa lista general de préstamos) */}
      <Card>
        <div className="p-0 sm:p-0">
          <TablePrestamo data={prestamos} />
        </div>
      </Card>
    </div>
  );
}
