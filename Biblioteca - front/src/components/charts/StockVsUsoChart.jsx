// src/components/charts/StockVsUsoChart.jsx
import { ResponsiveBar } from "@nivo/bar";

const colorStockPrestamo = {
  stock:  "#415d8aff",
  prestamos: "#018f35ff",
};


export default function StockVsUsoChart({ data }) {
  const ok = Array.isArray(data) && data.length > 0;
  if (!ok) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos de stock/uso.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveBar
        data={data}
        keys={["stock", "prestamos"]}
        indexBy="tipo"
        margin={{ top: 30, right: 20, bottom: 50, left: 50 }}
        padding={0.3}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        // 🔹 Usar tus colores personalizados
        colors={({ id }) => colorStockPrestamo[id] ?? "#6b7280"}
        borderRadius={3}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        axisBottom={{
          legend: "Tipo de publicación",
          legendOffset: 36,
          tickPadding: 8,
        }}
        axisLeft={{
          legend: "Cantidad",
          legendOffset: -40,
          tickPadding: 8,
        }}
        labelSkipWidth={16}
        labelSkipHeight={16}
        labelTextColor="#f5f5f5ff"
        theme={{
          textColor: "#0f172a",
          tooltip: { container: { background: "white", fontSize: 12 } },
        }}
        legends={[
          {
            anchor: "top-right",
            direction: "row",
            translateY: -20,
            itemsSpacing: 8,
            itemWidth: 80,
            itemHeight: 18,
            itemTextColor: "#64748b",
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
}