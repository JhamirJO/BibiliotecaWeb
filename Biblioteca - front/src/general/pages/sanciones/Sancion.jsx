import PageHeader from "@/components/layout/PageHeader";
// src/pages/Sancion.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLector } from "@/actions/lectorThunks";

import Card, { CardHeader, CardContent } from "@/components/Card";
import Input from "@/components/Input";
import EstadoPill from "@/components/EstadoPill";
import useSancion from "@/general/hooks/useSancion"; // ⬅️ tu hook

export default function Sancion() {
  const dispatch = useDispatch();

  const { lector: lectores = [], cargando } = useSelector(
    (state) => state.lector || {},
  );

  const [dni, setDni] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  // hook de sanción
  const {
    levantarSancion,
    loading: levantando,
    error: sancionError,
    success: sancionSuccess,
    resetEstado,
  } = useSancion();

  useEffect(() => {
    dispatch(getLector());
  }, [dispatch]);

  const handleBuscar = () => {
    setError("");
    setSeleccionado(null);
    resetEstado(); // limpiamos estado de sanción al buscar otro DNI

    const dniTrim = dni.trim();
    if (!dniTrim) {
      setError("Ingresa un DNI.");
      return;
    }

    const encontrado = (lectores || []).find(
      (row) => row.persona?.dni === dniTrim,
    );

    if (!encontrado) {
      setError("No se encontró un lector con ese DNI.");
      return;
    }

    setSeleccionado(encontrado);
  };

  const estadoLector = seleccionado?.lector?.estado;

  // cuando la sanción se levanta con éxito, actualizamos el estado local
  useEffect(() => {
    if (!sancionSuccess) return;

    setSeleccionado((prev) => {
      if (!prev) return prev;
      if (prev.lector?.estado === "ACTIVO") return prev; // no cambiar si ya está activo

      return {
        ...prev,
        lector: {
          ...prev.lector,
          estado: "ACTIVO",
        },
      };
    });
  }, [sancionSuccess]); // ⬅️ ya no depende de 'seleccionado'

  const handleLevantarClick = async () => {
    if (!seleccionado) return;
    const dniLector = seleccionado.persona?.dni;
    await levantarSancion(dniLector);
    // el useEffect de arriba se encargará de actualizar la UI cuando success=true
  };

  return (
    <div className="feature-page space-y-6">
      <PageHeader
        title="Sanciones"
        description="Consulta el estado de un lector y gestiona el levantamiento de su sanción."
      />
      {/* Card: buscar por DNI */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-slate-900">
            Levantar sanción de lector
          </h2>
          <p className="mt-1 text-slate-600">
            Ingresa el DNI del lector sancionado para buscarlo y levantar la
            sanción.
          </p>
        </CardHeader>
        <CardContent>
          <label htmlFor="sanction-dni" className="label">
            <span className="block text-sm font-medium text-slate-700 mb-1">
              DNI del lector
            </span>
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              id="sanction-dni"
              placeholder="Ej. 87732321"
            />
            <button
              type="button"
              className="btn bg-slate-700 text-sm text-white hover:bg-slate-500"
              onClick={handleBuscar}
              disabled={cargando}
            >
              {cargando ? "Cargando..." : "Buscar"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {/* Card: resultado */}
      <Card>
        <CardHeader className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Lector encontrado
            </h2>
          </div>

          {estadoLector && <EstadoPill estado={estadoLector} />}
        </CardHeader>

        <CardContent>
          {!seleccionado && !error && (
            <p className="text-slate-600">
              Aquí se mostrarán los detalles del lector sancionado una vez que
              se realice la búsqueda.
            </p>
          )}

          {seleccionado && (
            <div className="space-y-4">
              {/* Datos del lector */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {(seleccionado.persona?.nombre ?? "") +
                    " " +
                    (seleccionado.persona?.apellido ?? "")}
                </h3>
                <p className="text-sm text-slate-600">
                  DNI: {seleccionado.persona?.dni} · Código lector:{" "}
                  {seleccionado.lector?.cod_l}
                </p>
              </div>

              <hr className="border-slate-100" />

              {sancionSuccess && (
                <p role="status" className="text-sm text-emerald-600">
                  Sanción levantada correctamente.
                </p>
              )}
              {/* Detalle de sanción solo si estaba sancionado */}
              {estadoLector === "SANCIONADO" ? (
                <>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-500 tracking-wide">
                      DETALLE DE SANCIÓN
                    </h4>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Motivo: </span>
                      {seleccionado.motivo_sancion || "Retraso en devolución"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 items-end">
                    <div className="flex gap-3">
                      <button
                        className="btn bg-slate-700 text-sm text-white hover:bg-slate-500"
                        onClick={handleLevantarClick}
                        disabled={levantando}
                      >
                        {levantando ? "Levantando..." : "Levantar sanción"}
                      </button>
                    </div>

                    {/* mensajes del hook */}
                    {sancionError && (
                      <p className="text-sm text-red-600">{sancionError}</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-600">
                  Este lector actualmente está {estadoLector || "ACTIVO"} y no
                  tiene sanciones por levantar.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
