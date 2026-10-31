import PageHeader from "@/components/layout/PageHeader";
// src/general/page/reporte/Reporte.jsx
import Card from "../../../components/Card";
import PrestamosTiempoChart from "../../../components/charts/PrestamosTiempoChart";
import EstadoPrestamosChart from "../../../components/charts/EstadoPrestamosChart";
import PrestamosPorTipoChart from "../../../components/charts/PrestamosPorTipoChart";
import TopPublicacionesChart from "../../../components/charts/TopPublicacionesChart";
import LectoresEstadoChart from "../../../components/charts/LectoresEstadoChart";
import PrestamosPorLectorChart from "../../../components/charts/PrestamosPorLectorChart";
import CatalogoPorTipoChart from "../../../components/charts/CatalogoPorTipoChart";
import StockVsUsoChart from "../../../components/charts/StockVsUsoChart";
import useReporteData from "../../hooks/useReporteData";

export default function Reporte() {
  const {
    cargando,
    dataPrestamosTiempo,
    dataEstadoPrestamos,
    porcentajeDevueltoTarde,
    dataPrestamosPorTipo,
    dataTopPublicaciones,
    dataLectorEstado,
    dataPrestamosPorLector,
    dataCatalogoPorTipo,
    dataStockVsUso,
  } = useReporteData();

  const kpiDevueltoTarde = Number(porcentajeDevueltoTarde?.toFixed(1) || 0);

  return (
    <div className="feature-page space-y-5">
      {/* Header */}
      <PageHeader
        title="Reportes"
        description="Consulta el comportamiento de los préstamos y la composición del catálogo."
        section="Analítica"
      />

      {/* Grid único de tarjetas */}
      <div className="reports-grid">
        {/* 1. Evolución de préstamos (ancho en xl) */}
        <Card className="xl:col-span-1">
          <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Evolución de préstamos por mes
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>
            <div className="flex-1">
              <PrestamosTiempoChart data={dataPrestamosTiempo} />
            </div>
          </div>
        </Card>

        {/* 2. Estado actual de los préstamos */}
        <Card>
          <div className="h-full flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Estado actual de los préstamos
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>

            <div className="mb-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                % devueltos tarde
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-900">
                  {kpiDevueltoTarde}%
                </span>
                <span className="text-xs text-slate-500">
                  sobre el total de préstamos
                </span>
              </div>
            </div>

            <div className="flex-1">
              <EstadoPrestamosChart data={dataEstadoPrestamos} />
            </div>
          </div>
        </Card>

        {/* 3. Préstamos por tipo de publicación */}
        <Card>
          <div className="h-full flex flex-col">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Préstamos por tipo de publicación
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>
            <div className="flex-1">
              <PrestamosPorTipoChart data={dataPrestamosPorTipo} />
            </div>
          </div>
        </Card>

        {/* 4. Top publicaciones (ancha en xl) */}
        <Card className="xl:col-span-1">
          <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Top publicaciones más prestadas
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>
            <div className="flex-1">
              <TopPublicacionesChart data={dataTopPublicaciones} />
            </div>
          </div>
        </Card>

        {/* 5. Lectores activos vs inactivos */}
        <Card>
          <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Lectores activos vs inactivos
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>
            <div className="flex-1">
              <LectoresEstadoChart data={dataLectorEstado} />
            </div>
          </div>
        </Card>

        {/* 6. Lectores más frecuentes */}
        <Card>
          <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Lectores más frecuentes
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>
            <div className="flex-1">
              <PrestamosPorLectorChart data={dataPrestamosPorLector} />
            </div>
          </div>
        </Card>

        {/* 7. Distribución del catálogo por tipo */}
        <Card>
          <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Distribución del catálogo por tipo
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>
            <div className="flex-1">
              <CatalogoPorTipoChart data={dataCatalogoPorTipo} />
            </div>
          </div>
        </Card>

        {/* 8. Stock vs uso por tipo */}
        <Card>
          <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Stock vs uso por tipo
              </h3>
              {cargando && (
                <span className="text-xs text-slate-500">
                  Cargando datos...
                </span>
              )}
            </div>
            <div className="flex-1">
              <StockVsUsoChart data={dataStockVsUso} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
