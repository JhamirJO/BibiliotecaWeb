// src/features/devolucion/Devolucion.jsx
import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import Card, { CardHeader, CardContent } from "../../../components/Card";
import Input from "@/components/Input";
import Swal from "sweetalert2";
import { todayYMD, isValidYMD } from "@/utils/date";
import { useCrearDevolucion } from "@/general/hooks/useCrearDevolucion";
import { getPrestamo } from "@/actions/prestamoThunks";
import { getLector } from "@/actions/lectorThunks";
export default function Devolucion() {
  const dispatch = useDispatch();

  const {
    // ❌ quitamos: crearDevolucionDNI
    crearDevolucionIDP,
    crearDevolucionComprobante,
    isLoading,
    error,
    setError,
  } = useCrearDevolucion();

  // Solo dos modos: 'idp' | 'comp'
  const [modo, setModo] = useState("idp");

  const [form, setForm] = useState({
    // Por ID de préstamo
    fechaIdp: todayYMD(),
    prestamoId: "",

    // Por comprobante (bloque)
    fechaComp: todayYMD(),
    comprobanteId: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const limpiar = () => {
    setForm({
      fechaIdp: todayYMD(),
      prestamoId: "",
      fechaComp: todayYMD(),
      comprobanteId: "",
    });
    setError(null);
  };

  // Validaciones
  const validarIdp = useMemo(
    () =>
      isValidYMD(form.fechaIdp) &&
      /^\d+$/.test(form.prestamoId) &&
      Number(form.prestamoId) > 0,
    [form.fechaIdp, form.prestamoId]
  );

  const validarComp = useMemo(
    () =>
      isValidYMD(form.fechaComp) &&
      /^\d+$/.test(form.comprobanteId) &&
      Number(form.comprobanteId) > 0,
    [form.fechaComp, form.comprobanteId]
  );

  const canSubmit = (modo === "idp" ? validarIdp : validarComp) && !isLoading;

  const registrar = async (e) => {
    e.preventDefault();

    try {
      if (modo === "idp") {
        const fechaOK = form.fechaIdp;
        const idOK = form.prestamoId;

        await crearDevolucionIDP({
          fecha: fechaOK,
          prestamoId: Number(idOK),
        });

        await Swal.fire({
          icon: "success",
          title: "¡Devolución registrada!",
          text: `Código de préstamo ${idOK}`,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
          },
        });
      } else {
        // modo === "comp"
        const fechaOK = form.fechaComp;
        const compOK = form.comprobanteId;

        await crearDevolucionComprobante({
          fecha: fechaOK,
          comprobanteId: Number(compOK),
        });

        await Swal.fire({
          icon: "success",
          title: "¡Devolución registrada!",
          text: `Comprobante ${compOK} (devolución en bloque)`,
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
          },
        });
      }

      // Refrescar préstamos inmediatamente
      await dispatch(getPrestamo());
      await dispatch(getLector());

      limpiar();
    } catch (err) {
      const msg = err?.message || "No se pudo registrar la devolución.";
      await Swal.fire({
        icon: "error",
        title: "No se pudo registrar la devolución",
        text: msg,
        footer: "Verifica los datos ingresados.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "btn bg-slate-700 text-white hover:bg-slate-800 border-0 focus-visible:outline-none",
        },
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-4">
      {/* Cabecera */}
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-slate-900">Registrar Devolución</h1>
        </CardHeader>
        <CardContent>
          <p className="mt-1 text-slate-600">
            Realiza devoluciones por <strong>código de préstamo</strong> o por <strong>comprobante</strong> (bloque).
          </p>
        </CardContent>
      </Card>

      {/* Formulario para ambos modos */}
      <form onSubmit={registrar} className="space-y-4">
        {/* Dos cards en responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IZQUIERDA: por ID de préstamo */}
          <Card
            className={`transition ring-offset-2 ${
              modo === "idp" ? "ring-1 ring-[#104e75]" : "ring-0"
            }`}
          >
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">
                Devolución con Código de Préstamo
              </h2>
            </CardHeader>
            <CardContent onFocus={() => setModo("idp")} onClick={() => setModo("idp")}>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="block text-sm font-medium text-slate-700 mb-1">
                      Fecha de devolución
                    </span>
                  </label>
                  <Input
                    type="date"
                    name="fechaIdp"
                    value={form.fechaIdp}
                    onChange={onChange}
                    required={modo === "idp"}
                    disabled={modo !== "idp"}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="block text-sm font-medium text-slate-700 mb-1">
                      Código de préstamo
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="prestamoId"
                    placeholder="Ej. 900123"
                    value={form.prestamoId}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setForm((f) => ({ ...f, prestamoId: v }));
                    }}
                    inputMode="numeric"
                    required={modo === "idp"}
                    disabled={modo !== "idp"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DERECHA: por comprobante */}
          <Card
            className={`transition ring-offset-2 ${
              modo === "comp" ? "ring-1 ring-[#104e75]" : "ring-0"
            }`}
          >
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Devolución por Comprobante</h2>
            </CardHeader>
            <CardContent onFocus={() => setModo("comp")} onClick={() => setModo("comp")}>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="block text-sm font-medium text-slate-700 mb-1">
                      Fecha de devolución
                    </span>
                  </label>
                  <Input
                    type="date"
                    name="fechaComp"
                    value={form.fechaComp}
                    onChange={onChange}
                    required={modo === "comp"}
                    disabled={modo !== "comp"}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="block text-sm font-medium text-slate-700 mb-1">
                      ID de comprobante
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="comprobanteId"
                    placeholder="Ej. 42"
                    value={form.comprobanteId}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setForm((f) => ({ ...f, comprobanteId: v }));
                    }}
                    inputMode="numeric"
                    required={modo === "comp"}
                    disabled={modo !== "comp"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error global del hook */}
        {error && (
          <div className="alert alert-error">
            <span>{String(error)}</span>
          </div>
        )}

        {/* Botonera */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="join">
            <button
              type="button"
              className={`btn join-item ${modo === "idp" ? "bg-slate-700 text-white hover:bg-slate-500" : ""}`}
              onClick={() => setModo("idp")}
            >
              Código de Préstamo
            </button>
            <button
              type="button"
              className={`btn join-item ${modo === "comp" ? "bg-slate-700 text-white hover:bg-slate-500" : ""}`}
              onClick={() => setModo("comp")}
            >
              Comprobante
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn bg-white hover:bg-neutral-content"
              onClick={limpiar}
              disabled={isLoading}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className={`btn bg-slate-700 text-white ${isLoading ? "loading" : ""}`}
              disabled={!canSubmit}
            >
              {isLoading ? "Registrando…" : "Registrar devolución"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
