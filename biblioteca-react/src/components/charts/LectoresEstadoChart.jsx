// src/components/charts/LectoresEstadoChart.jsx
import { ResponsivePie } from "@nivo/pie";

const lectorEstado = {
  INACTIVO: "#d1b478",
  ACTIVO: "#54759a",
};
export default function LectoresEstadoChart({ data }) {
  console.log("[LectoresEstadoChart] props.data:", data);
  const ok = Array.isArray(data) && data.length > 0;
  if (!ok) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos de lectores.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        innerRadius={0.6}
        padAngle={1}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={({ id }) => lectorEstado[id] ?? "#6b7280"}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLabelsSkipAngle={12}
        arcLabelsTextColor="#000000ff"
        enableArcLinkLabels={false}
        theme={{
          textColor: "#182b43",
          tooltip: { container: { background: "white", fontSize: 12 } },
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateX: 10,
            translateY: 40,
            itemsSpacing: 8,
            itemWidth: 90,
            itemHeight: 18,
            itemTextColor: "#71859b",
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
}
