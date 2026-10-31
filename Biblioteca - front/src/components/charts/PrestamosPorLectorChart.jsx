// src/components/charts/PrestamosPorLectorChart.jsx
import { ResponsiveBar } from "@nivo/bar";

export default function PrestamosPorLectorChart({ data }) {
  const ok = Array.isArray(data) && data.length > 0;
  if (!ok) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos de préstamos por lector.
      </div>
    );
  }

  const dataOrdenada = [...data].sort((a, b) => a.prestamos - b.prestamos);

  return (
    <div className="h-80 w-full">
      <ResponsiveBar
        data={dataOrdenada}
        keys={["prestamos"]}
        indexBy="nombreCorto"
        layout="horizontal"
        margin={{ top: 10, right: 20, bottom: 40, left: 120 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors="#8c815f"
        borderRadius={3}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        axisBottom={{
          legend: "Préstamos",
          legendOffset: 36,
          tickSize: 5,
          tickPadding: 5,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 6,
        }}
        labelSkipWidth={16}
        labelSkipHeight={16}
        labelTextColor="#f5f5f5ff"
        theme={{
          textColor: "#182b43",
          tooltip: { container: { background: "white", fontSize: 12 } },
        }}
        tooltip={({ data, value }) => (
          <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 w-72">
            <div className="font-semibold mb-1">{data.nombreCompleto}</div>
            <div>{value} préstamos</div>
            <div className="text-[11px] text-slate-500 mt-1">
              DNI: {data.dni}
            </div>
          </div>
        )}
      />
    </div>
  );
}
