// src/components/charts/PrestamosPorTipoChart.jsx
import { ResponsiveBar } from "@nivo/bar";

const colorPorTipo = {
  LIBRO: "#f97316",
  ARTICULO: "#018f35ff",
  TESIS: "#415d8aff", 
  SIN_TIPO: "#6b7280",
};

export default function PrestamosPorTipoChart({ data }) {
  const tieneDatos = Array.isArray(data) && data.length > 0;

  if (!tieneDatos) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos suficientes para mostrar préstamos por tipo de publicación.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveBar
        data={data}
        keys={["prestamos"]}
        indexBy="tipo"
        margin={{ top: 30, right: 20, bottom: 70, left: 48 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ data }) => colorPorTipo[data.tipo] || "#3b82f6"}
        borderRadius={3}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: "Tipo de publicación",
          legendPosition: "middle",
          legendOffset: 50,
          
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: "Préstamos",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={16}
        labelSkipHeight={16}
        labelTextColor="#f5f5f5ff"
        theme={{
          textColor: "#0f172a",
          axis: {
            ticks: {
              text: { fontSize: 11 },
            },
          },
          tooltip: {
            container: {
              background: "white",
              fontSize: 12,
            },
          },
        }}
        tooltip={({ indexValue, value, data }) => (
          <div className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900">
            <div className="font-semibold">{indexValue}</div>
            <div>{value} préstamos</div>
            {typeof data.porcentaje === "number" && (
              <div className="text-slate-500">
                {data.porcentaje.toFixed(1)}% del total
              </div>
            )}
          </div>
        )}
        animate={true}
        role="application"
        ariaLabel="Préstamos por tipo de publicación"
      />
    </div>
  );
}
