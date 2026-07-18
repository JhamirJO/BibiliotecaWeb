// src/components/charts/EstadoPrestamosChart.jsx
import { ResponsivePie } from "@nivo/pie";

const COLORS_BY_ESTADO = {
  ACTIVO: "#018f35ff",         
  DEVUELTO: "#415d8aff",       
  DEVUELTO_TARDE: "#ef4444", 
  SIN_ESTADO: "#e5e7eb",
};

export default function EstadoPrestamosChart({ data }) {
  const tieneDatos = Array.isArray(data) && data.length > 0;

  if (!tieneDatos) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos suficientes para mostrar el estado de los préstamos.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsivePie
        data={data}
        margin={{ top: 10, right: 40, bottom: 40, left: 40 }}
        innerRadius={0.6}
        padAngle={1}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={({ id }) => COLORS_BY_ESTADO[id] || "#e5e7eb"} // 👈 aquí
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        theme={{
          textColor: "#0f172a",
          tooltip: {
            container: {
              background: "white",
              fontSize: 12,
            },
          },
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 40,
            itemsSpacing: -5,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#64748b",
            itemDirection: "left-to-right",
            itemOpacity: 0.8,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
}
