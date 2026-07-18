// src/components/charts/TopPublicacionesChart.jsx
import { ResponsiveBar } from "@nivo/bar";

// Colores fijos por tipo de publicación
const colorPorTipo = {
  LIBRO: "#f97316",
  ARTICULO: "#018f35ff",
  TESIS: "#415d8aff", 
  SIN_TIPO: "#6b7280",
};

export default function TopPublicacionesChart({ data }) {
  const tieneDatos = Array.isArray(data) && data.length > 0;

  if (!tieneDatos) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No hay datos suficientes para mostrar el top de publicaciones.
      </div>
    );
  }

  // Tipos únicos para la leyenda
  const tiposUnicos = Array.from(new Set(data.map((d) => d.tipo))).sort();

  const dataOrdenada = [...data].sort(
    (a, b) => a.prestamos - b.prestamos
  );

  return (
    <div className="h-80 w-full flex flex-col">
      {/* Gráfico */}
      <div className="flex-1">
        <ResponsiveBar
          data={dataOrdenada} 
          keys={["prestamos"]}
          indexBy="tituloEje" 
          layout="horizontal"
          margin={{ top: 10, right: 20, bottom: 50, left: 130 }} // 👈 más margen izquierdo
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={(bar) =>
            colorPorTipo[bar.data.tipo] || "#2563eb"
          } // 👈 color por tipo
          borderRadius={3}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Préstamos",
            legendPosition: "middle",
            legendOffset: 38,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 6,
            tickRotation: 0,
            legend: "",
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
          tooltip={({ data, value }) => (
            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 w-[250px]">
              {/* 👆 max-w-md para hacerlo más ancho */}
              <div className="font-semibold mb-1">{data.titulo}</div>
              <div className="text-slate-500 text-[11px] mb-1">
                {data.tipo}
              </div>
              <div>{value} préstamos</div>
            </div>
          )}
          animate={true}
          role="application"
          ariaLabel="Top publicaciones más prestadas"
        />
      </div>

      {/* Leyenda por tipo */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
        {tiposUnicos.map((tipo) => (
          <div key={tipo} className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: colorPorTipo[tipo] || "#2563eb",
              }}
            />
            <span>{tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
