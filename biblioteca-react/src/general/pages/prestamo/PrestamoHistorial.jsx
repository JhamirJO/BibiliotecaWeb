import PageHeader from "@/components/layout/PageHeader";
// src/general/pages/prestamo/PrestamoHistorial.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@/components/Card";
import { getLectorPerfil } from "@/actions/lectorThunks";
import { getPrestamoByDni } from "@/actions/prestamoThunks";
import GenericTable from "@/components/GenericTable";
import EstadoPill from "@/components/EstadoPill";

export default function PrestamoHistorial() {
  const dispatch = useDispatch();

  // 🧩 Estado de lector
  const {
    perfil: perfilLector,
    estaCargandoLector,
    error: errorLector,
  } = useSelector((state) => state.lector ?? {});

  // 🧩 Estado de préstamos del lector
  const {
    misPrestamos = [],
    estaCargandoMisPrestamos = false,
    errorMisPrestamos = null,
  } = useSelector((state) => state.prestamo ?? {});

  const perfil = perfilLector;

  // 1️⃣ Cargar perfil del lector si aún no existe
  useEffect(() => {
    if (!perfil) {
      dispatch(getLectorPerfil());
    }
  }, [perfil, dispatch]);

  // 2️⃣ Cuando ya tengo el perfil, saco el DNI y pido los préstamos
  useEffect(() => {
    if (!perfil) return;

    const dni = perfil.persona?.dni || perfil.dni_p || perfil.dni;

    if (dni) {
      dispatch(getPrestamoByDni(dni));
    } else {
      console.warn("No se encontró DNI en el perfil del lector:", perfil);
    }
  }, [perfil, dispatch]);

  // 📋 Columnas
  const columns = [
    {
      id: "id_p",
      header: "Id Préstamo",
      accessor: "id_p",
      width: "w-28",
      align: "center",
    },
    {
      id: "titulo",
      header: "Título",
      accessor: "titulo",
      width: "w-72",
      align: "left",
    },
    {
      id: "fecha_p",
      header: "Fecha Préstamo",
      accessor: "fecha_p",
      width: "w-32",
      align: "center",
    },
    {
      id: "fecha_max",
      header: "Fecha Máx.",
      accessor: "fecha_max",
      width: "w-32",
      align: "center",
    },
    {
      id: "fecha_e",
      header: "Fecha Devolución",
      accessor: "fecha_e",
      width: "w-36",
      align: "center",
    },
    {
      id: "estado",
      header: "Estado",
      cell: (row) => <EstadoPill estado={row?.estado} />,
      width: "w-32",
      align: "center",
    },
  ];

  return (
    <div className="feature-page space-y-5">
      {/* 🔹 Card de presentación encima de la tabla */}
      <PageHeader
        title="Mis préstamos"
        description="Consulta las fechas y el estado de las publicaciones que has solicitado."
        section="Tu actividad en la biblioteca"
      />{" "}
      {estaCargandoLector && (
        <p className="mt-1 text-xs text-slate-400">Cargando perfil…</p>
      )}
      {errorLector && (
        <p className="mt-1 text-xs text-red-500">
          Error al cargar perfil del lector
        </p>
      )}
      {estaCargandoMisPrestamos && (
        <p className="mt-1 text-xs text-slate-400">Cargando préstamos…</p>
      )}
      {errorMisPrestamos && (
        <p className="mt-1 text-xs text-red-500">
          Error al cargar historial de préstamos
        </p>
      )}
      {/* 🔹 Tabla de historial */}
      <Card>
        <GenericTable
          columns={columns}
          data={misPrestamos}
          dense
          rowKey={(row) => row.id_p}
          showActions={false}
        />
      </Card>
    </div>
  );
}
