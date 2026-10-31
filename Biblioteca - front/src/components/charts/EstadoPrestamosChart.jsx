// src/components/charts/EstadoPrestamosChart.jsx
import { ResponsivePie } from "@nivo/pie";

const COLORS_BY_ESTADO = {
  ACTIVO: "#54759a",
  DEVUELTO: "#8c815f",
  DEVUELTO_TARDE: "#b15860",
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
    <div className="w-full">
      <div className="h-72 w-full">
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
            textColor: "#182b43",
            tooltip: {
              container: {
                background: "white",
                fontSize: 12,
              },
            },
          }}
          legends={[]}
        />
      </div>
      <ul className="chart-legend" aria-label="Leyenda de estados">
        {data.map((item) => (
          <li key={item.id}>
            <span
              style={{
                backgroundColor: COLORS_BY_ESTADO[item.id] || "#e5e7eb",
              }}
            />
            {{
              ACTIVO: "Activo",
              DEVUELTO: "Devuelto",
              DEVUELTO_TARDE: "Devuelto tarde",
            }[item.id] ||
              item.label ||
              item.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
