import { Suspense } from "react";
import { AppRoutes } from "@/general/routes/AppRoutes";

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="page-loader" role="status">
          <span className="loading" aria-hidden="true" />
          <span>Cargando biblioteca…</span>
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  );
}
