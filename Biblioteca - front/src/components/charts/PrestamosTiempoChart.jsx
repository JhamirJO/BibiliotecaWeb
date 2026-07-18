// src/components/charts/PrestamosTiempoChart.jsx
import { ResponsiveLine } from "@nivo/line";

const colorPorTipo = {
  LIBRO: "#f97316",
  ARTICULO: "#018f35ff",
  TESIS: "#155ed4ff",
  SIN_TIPO: "#6b7280",
};

export default function PrestamosTiempoChart({ data }) {
  const tieneDatos =
    Array.isArray(data) &&
    data.length > 0 &&
    Array.isArray(data[0].data) &&
    data[0].data.length > 0;

  if (!tieneDatos) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos suficientes para mostrar la evolución de préstamos.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 35, right: 20, bottom: 30, left: 55 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: "Mes",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: "Préstamos",
          legendOffset: -48,
          legendPosition: "middle",
        }}
        pointSize={6}
        pointBorderWidth={52}
        useMesh={true}
        enableArea={true}
        curve="monotoneX"
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
        // 👇 aquí usas tu paleta
        colors={({ id }) => colorPorTipo[id] || "#3b82f6"}
        legends={[
          {
            anchor: "top",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -35,
            itemsSpacing: 8,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderWidth: 1,
            symbolBorderColor: "rgba(0, 0, 0, 0.2)",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
