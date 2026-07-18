// src/general/hooks/useReporteData.js
import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLector } from "@/actions/lectorThunks";
import { getPublicacion } from "@/actions/publicaconThunks";
import { getPrestamo } from "@/actions/prestamoThunks";

// === MAPEOS BASE ===================================================

// id_pub -> tipo (LIBRO / ARTICULO / TESIS)
function construirMapaTipos(publicaciones = []) {
  const map = new Map();
  publicaciones.forEach((pub) => {
    if (pub.id_pub != null) {
      map.set(pub.id_pub, pub.tipo || "SIN_TIPO");
    }
  });
  return map;
}

// id_pub -> titulo
function construirMapaTitulos(publicaciones = []) {
  const map = new Map();
  publicaciones.forEach((pub) => {
    if (pub.id_pub != null && pub.titulo) {
      map.set(pub.id_pub, pub.titulo);
    }
  });
  return map;
}

// === CHART 1: Evolución por mes y tipo =============================

function agruparPrestamosPorMesYTipo(prestamos = [], mapaTipos) {
  const porTipo = new Map();

  prestamos.forEach((p) => {
    const fechaRaw = p.fecha_p || p.fechaP || p.fecha;
    if (!fechaRaw) return;

    const soloFecha = fechaRaw.slice(0, 10);
    const [year, month] = soloFecha.split("-");
    const mesClave = `${year}-${month}`;

    const tipo = mapaTipos.get(p.cod_pub) || "SIN_TIPO";

    if (!porTipo.has(tipo)) {
      porTipo.set(tipo, new Map());
    }

    const mapMes = porTipo.get(tipo);
    mapMes.set(mesClave, (mapMes.get(mesClave) || 0) + 1);
  });

  const series = [];

  porTipo.forEach((mapMes, tipo) => {
    const mesesOrdenados = Array.from(mapMes.keys()).sort();
    const puntos = mesesOrdenados.map((mes) => ({
      x: mes,
      y: mapMes.get(mes),
    }));

    series.push({
      id: tipo,
      data: puntos,
    });
  });

  return series;
}

// === CHART 2: Estados de préstamo =================================

function agruparPrestamosPorEstado(prestamos = []) {
  const conteo = new Map();

  prestamos.forEach((p) => {
    const estado = p.estado || "SIN_ESTADO";
    conteo.set(estado, (conteo.get(estado) || 0) + 1);
  });

  const dataPie = [];
  let total = 0;

  conteo.forEach((valor, estado) => {
    total += valor;
    dataPie.push({
      id: estado,
      label: estado,
      value: valor,
    });
  });

  const devueltoTarde = conteo.get("DEVUELTO_TARDE") || 0;
  const porcentajeDevueltoTarde =
    total > 0 ? (devueltoTarde / total) * 100 : 0;

  return {
    dataPie,
    total,
    porcentajeDevueltoTarde,
  };
}

// === CHART 3: Préstamos por tipo de publicación ====================

function agruparPrestamosPorTipo(prestamos = [], mapaTipos) {
  const conteo = new Map();

  prestamos.forEach((p) => {
    const tipo = mapaTipos.get(p.cod_pub) || "SIN_TIPO";
    conteo.set(tipo, (conteo.get(tipo) || 0) + 1);
  });

  const data = [];
  let total = 0;

  conteo.forEach((valor) => {
    total += valor;
  });

  conteo.forEach((valor, tipo) => {
    const porcentaje = total > 0 ? (valor / total) * 100 : 0;
    data.push({
      tipo,
      prestamos: valor,
      porcentaje,
    });
  });

  return { data, total };
}

// === CHART 4: Top publicaciones ===================================

function truncarTitulo(titulo, maxLen = 32) {
  if (!titulo) return "";
  return titulo.length > maxLen ? `${titulo.slice(0, maxLen - 1)}…` : titulo;
}

function agruparTopPublicaciones(
  prestamos = [],
  publicaciones = [],
  mapaTipos,
  topN = 5
) {
  const mapaTitulos = construirMapaTitulos(publicaciones);
  const conteo = new Map();

  prestamos.forEach((p) => {
    if (p.cod_pub == null) return;
    const idPub = Number(p.cod_pub);

    const existente = conteo.get(idPub) || {
      id_pub: idPub,
      prestamos: 0,
      titulo: "",
      tipo: mapaTipos.get(idPub) || "SIN_TIPO",
    };

    existente.prestamos += 1;

    if (!existente.titulo) {
      const tituloPub =
        mapaTitulos.get(idPub) ||
        p.titulo || // por si el préstamo trae título
        `Publicación ${idPub}`;
      existente.titulo = tituloPub;
    }

    conteo.set(idPub, existente);
  });

  const lista = Array.from(conteo.values()).sort(
    (a, b) => b.prestamos - a.prestamos
  );

  const top = lista.slice(0, topN).map((item) => ({
    id_pub: item.id_pub,
    titulo: item.titulo,
    tituloCorto: truncarTitulo(item.titulo, 40), 
    tituloEje: truncarTitulo(item.titulo, 20),
    tipo: item.tipo,
    prestamos: item.prestamos,
  }));

  return top;
}

// === NUEVO A: Lectores activos vs inactivos ========================

function agruparLectoresPorEstado(lector = []) {
  const conteo = new Map();

  lector.forEach((l) => {
    const estado = l.lector?.estado || l.estado || "SIN_ESTADO";
    conteo.set(estado, (conteo.get(estado) || 0) + 1);
  });

  return Array.from(conteo.entries()).map(([estado, valor]) => ({
    id: estado,
    label: estado,
    value: valor,
  }));
}


// === NUEVO B: Préstamos por lector (top lectores frecuentes) ======

function agruparPrestamosPorLector(prestamos = [], topN = 5) {
  const conteo = new Map();

  prestamos.forEach((p) => {
    const dni = p.dni_p || p.dni || "SIN_DNI";
    const nombre = p.nombre || "";
    const apellido = p.apellido || "";
    const nombreCompleto = `${nombre} ${apellido}`.trim() || dni;

    const existente = conteo.get(dni) || {
      dni,
      nombreCompleto,
      prestamos: 0,
    };

    existente.prestamos += 1;
    conteo.set(dni, existente);
  });

  const lista = Array.from(conteo.values()).sort(
    (a, b) => b.prestamos - a.prestamos
  );

  return lista.slice(0, topN).map((item) => ({
    dni: item.dni,
    nombreCompleto: item.nombreCompleto,
    nombreCorto: truncarTitulo(item.nombreCompleto, 26),
    prestamos: item.prestamos,
  }));
}

// === NUEVO C: Distribución del catálogo por tipo ===================

function agruparCatalogoPorTipo(publicaciones = []) {
  const conteo = new Map();

  publicaciones.forEach((pub) => {
    const tipo = pub.tipo || "SIN_TIPO";
    conteo.set(tipo, (conteo.get(tipo) || 0) + 1);
  });

  const dataPie = [];
  conteo.forEach((valor, tipo) => {
    dataPie.push({
      id: tipo,
      label: tipo,
      value: valor,
    });
  });

  return dataPie;
}

// === NUEVO D: Stock vs uso por tipo ===============================

function calcularStockVsUso(publicaciones = [], prestamos = [], mapaTipos) {
  // stock por tipo
  const stockPorTipo = new Map();
  publicaciones.forEach((pub) => {
    const tipo = pub.tipo || "SIN_TIPO";
    const stock = Number(pub.stock) || 0;
    stockPorTipo.set(tipo, (stockPorTipo.get(tipo) || 0) + stock);
  });

  // uso (prestamos) por tipo
  const prestamosPorTipo = new Map();
  prestamos.forEach((p) => {
    const tipo = mapaTipos.get(p.cod_pub) || "SIN_TIPO";
    prestamosPorTipo.set(
      tipo,
      (prestamosPorTipo.get(tipo) || 0) + 1
    );
  });

  // unificar tipos
  const tipos = new Set([
    ...stockPorTipo.keys(),
    ...prestamosPorTipo.keys(),
  ]);

  const data = [];
  tipos.forEach((tipo) => {
    data.push({
      tipo,
      stock: stockPorTipo.get(tipo) || 0,
      prestamos: prestamosPorTipo.get(tipo) || 0,
    });
  });

  return data;
}

// ==================================================================

export default function useReporteData() {
  const dispatch = useDispatch();

  // ===== SELECTORES =====
  const prestamos = useSelector((state) => state.prestamo.lista);
  const estaCargandoPrestamos = useSelector(
    (state) => state.prestamo.estaCargandoLista
  );
  const errorPrestamos = useSelector((state) => state.prestamo.errorLista);

  const publicaciones = useSelector(
    (state) => state.publicacion.publicacion
  );
  const estaCargandoPublicacion = useSelector(
    (state) => state.publicacion.estaCargandoPublicacion
  );

  const lector = useSelector((state) => state.lector.lector);
  const estaCargandoLector = useSelector(
    (state) => state.lector.estaCargandoLector
  );

    useEffect(() => {
    console.log("[Reporte] prestamos en store:", prestamos);
    console.log("[Reporte] publicaciones en store:", publicaciones);
    console.log("[Reporte] lectores en store:", lector);
  }, [prestamos, publicaciones, lector]);

  // ===== CARGAS INICIALES =====
  // Prestamos
  useEffect(() => {
    if (!prestamos || prestamos.length === 0) {
      if (!estaCargandoPrestamos) {
        dispatch(getPrestamo());
      }
    }
  }, [dispatch, prestamos, estaCargandoPrestamos]);

  // Publicaciones
  useEffect(() => {
    if (!publicaciones || publicaciones.length === 0) {
      if (!estaCargandoPublicacion) {
        dispatch(getPublicacion());
      }
    }
  }, [dispatch, publicaciones, estaCargandoPublicacion]);

  // Lectores
  useEffect(() => {
    if (!lector || lector.length === 0) {
      if (!estaCargandoLector) {
        dispatch(getLector());
      }
    }
  }, [dispatch, lector, estaCargandoLector]);

  const cargando =
    estaCargandoPrestamos || estaCargandoPublicacion || estaCargandoLector;

  // ===== A PARTIR DE AQUÍ, IGUAL QUE YA TENÍAS =====

  const mapaTipos = useMemo(
    () => construirMapaTipos(publicaciones),
    [publicaciones]
  );

  const dataPrestamosTiempo = useMemo(() => {
    if (!prestamos || prestamos.length === 0) return [];
    return agruparPrestamosPorMesYTipo(prestamos, mapaTipos);
  }, [prestamos, mapaTipos]);

  const resumenEstados = useMemo(() => {
    if (!prestamos || prestamos.length === 0) {
      return { dataPie: [], total: 0, porcentajeDevueltoTarde: 0 };
    }
    return agruparPrestamosPorEstado(prestamos);
  }, [prestamos]);

  const resumenTipo = useMemo(() => {
    if (!prestamos || prestamos.length === 0) {
      return { data: [], total: 0 };
    }
    return agruparPrestamosPorTipo(prestamos, mapaTipos);
  }, [prestamos, mapaTipos]);

  const dataTopPublicaciones = useMemo(() => {
    if (!prestamos || prestamos.length === 0) return [];
    return agruparTopPublicaciones(prestamos, publicaciones, mapaTipos, 5);
  }, [prestamos, publicaciones, mapaTipos]);

  const dataLectorEstado = useMemo(() => {
    if (!lector || lector.length === 0) return [];
    return agruparLectoresPorEstado(lector);
  }, [lector]);

  useEffect(() => {
    console.log("[Reporte] dataLectorEstado (para donut):", dataLectorEstado);
  }, [dataLectorEstado]);

  const dataPrestamosPorLector = useMemo(() => {
    if (!prestamos || prestamos.length === 0) return [];
    return agruparPrestamosPorLector(prestamos, 5);
  }, [prestamos]);

  const dataCatalogoPorTipo = useMemo(() => {
    if (!publicaciones || publicaciones.length === 0) return [];
    return agruparCatalogoPorTipo(publicaciones);
  }, [publicaciones]);

  const dataStockVsUso = useMemo(() => {
    if (!publicaciones || publicaciones.length === 0) return [];
    return calcularStockVsUso(publicaciones, prestamos, mapaTipos);
  }, [publicaciones, prestamos, mapaTipos]);

  return {
    cargando,
    errorPrestamos,
    publicaciones,

    dataPrestamosTiempo,
    dataEstadoPrestamos: resumenEstados.dataPie,
    totalPrestamos: resumenEstados.total,
    porcentajeDevueltoTarde: resumenEstados.porcentajeDevueltoTarde,
    dataPrestamosPorTipo: resumenTipo.data,
    dataTopPublicaciones,

    dataLectorEstado,
    dataPrestamosPorLector,
    dataCatalogoPorTipo,
    dataStockVsUso,
  };
}