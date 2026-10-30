// src/components/charts/CatalogoPorTipoChart.jsx
import { ResponsivePie } from "@nivo/pie";

const colorPorTipo = {
  LIBRO: "#176d78",
  ARTICULO: "#54759a",
  TESIS: "#8c815f",
  SIN_TIPO: "#6b7280",
};

export default function CatalogoPorTipoChart({ data }) {
  const ok = Array.isArray(data) && data.length > 0;
  if (!ok) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos de catálogo.
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
        colors={({ id }) => colorPorTipo[id] ?? "#6b7280"}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLabelsSkipAngle={12}
        arcLabelsTextColor="#f5f5f5ff"
        enableArcLinkLabels={false}
        theme={{
          textColor: "#182b43",
          tooltip: { container: { background: "white", fontSize: 13 } },
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateX: 10,
            itemsSpacing: 8,
            itemWidth: 90,
            itemHeight: 18,
            translateY: 40,
            itemTextColor: "#71859b",
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
}
