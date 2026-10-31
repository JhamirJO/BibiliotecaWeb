import PageHeader from "@/components/layout/PageHeader";
// src/features/devolucion/Devolucion.jsx
import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
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
    [form.fechaIdp, form.prestamoId],
  );

  const validarComp = useMemo(
    () =>
      isValidYMD(form.fechaComp) &&
      /^\d+$/.test(form.comprobanteId) &&
      Number(form.comprobanteId) > 0,
    [form.fechaComp, form.comprobanteId],
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
    <div className="feature-page">
      <PageHeader
        title="Devoluciones"
        description="Registra la entrega del material por código de préstamo o por comprobante."
      />
      <div className="form-layout">
        <form className="panel return-panel" onSubmit={registrar}>
          <div className="return-panel__body">
            <h2>Identifica la devolución</h2>
            <p className="form-help">
              Selecciona cómo deseas registrar la entrega del material.
            </p>
            <div
              className="segmented-control"
              role="group"
              aria-label="Modo de devolución"
            >
              <button
                type="button"
                aria-pressed={modo === "idp"}
                onClick={() => setModo("idp")}
              >
                Por préstamo
              </button>
              <button
                type="button"
                aria-pressed={modo === "comp"}
                onClick={() => setModo("comp")}
              >
                Por comprobante
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label" htmlFor="return-code">
                  {modo === "idp"
                    ? "Código de préstamo"
                    : "Número de comprobante"}
                </label>
                <Input
                  id="return-code"
                  type="text"
                  name={modo === "idp" ? "prestamoId" : "comprobanteId"}
                  inputMode="numeric"
                  value={modo === "idp" ? form.prestamoId : form.comprobanteId}
                  placeholder={modo === "idp" ? "Ej. 900123" : "Ej. 42"}
                  required
                  onChange={(event) => {
                    const key = modo === "idp" ? "prestamoId" : "comprobanteId";
                    const value = event.target.value.replace(/\D/g, "");
                    setForm((current) => ({ ...current, [key]: value }));
                  }}
                />
              </div>
              <div>
                <label className="label" htmlFor="return-date">
                  Fecha de devolución
                </label>
                <Input
                  id="return-date"
                  type="date"
                  name={modo === "idp" ? "fechaIdp" : "fechaComp"}
                  value={modo === "idp" ? form.fechaIdp : form.fechaComp}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <p className="form-help">
              {modo === "idp"
                ? "La devolución se aplicará a la publicación del préstamo indicado."
                : "La devolución se aplicará a las publicaciones asociadas al comprobante."}
            </p>
            {error && (
              <div className="alert alert-error" role="alert">
                {String(error)}
              </div>
            )}
          </div>
          <footer className="form-actions">
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
              className="btn btn-primary"
              disabled={!canSubmit}
            >
              {isLoading ? "Registrando…" : "Registrar devolución"}
            </button>
          </footer>
        </form>
        <aside className="form-note">
          <span className="eyebrow">Devoluciones</span>
          <h3>Dos formas de registrar.</h3>
          <p>
            <strong>Por préstamo:</strong> utiliza el código para devolver una
            publicación.
            <br />
            <br />
            <strong>Por comprobante:</strong> registra la devolución de las
            publicaciones asociadas.
          </p>
        </aside>
      </div>
    </div>
  );
}
