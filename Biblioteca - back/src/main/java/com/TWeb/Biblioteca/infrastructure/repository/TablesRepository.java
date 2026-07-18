
package com.TWeb.Biblioteca.infrastructure.repository;

import com.TWeb.Biblioteca.presentation.dto.PrestamoDTO;
import java.time.LocalDate;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public class TablesRepository {

    private final DatabaseClient db;

    public TablesRepository(DatabaseClient db) {
        this.db = db;
    }

    // 🔹 MAPPER reutilizable (opcional)
    private PrestamoDTO mapPrestamoRow(io.r2dbc.spi.Row row) {
        PrestamoDTO dto = new PrestamoDTO();
        dto.setId_p(row.get("id_p", Long.class));
        dto.setCod_pub(row.get("cod_pub", Long.class));
        dto.setDni_p(row.get("dni_p", String.class));
        dto.setNombre(row.get("nombre", String.class));
        dto.setApellido(row.get("apellido", String.class));
        dto.setTitulo(row.get("titulo", String.class));
        dto.setFecha_p(row.get("fecha_p", LocalDate.class));
        dto.setFecha_max(row.get("fecha_max", LocalDate.class));
        dto.setFecha_e(row.get("fecha_e", LocalDate.class));
        dto.setEstado(row.get("estado", String.class));
        dto.setComprobante_id(row.get("comprobante_id", Long.class));
        return dto;
    }

    // ✅ Lista completa
    public Flux<PrestamoDTO> obtenerPrestamoLista() {
        String query = """
            SELECT
              pr.id_p,
              pr.cod_pub,
              pr.dni_p,
              pe.nombre,
              pe.apellido,
              pu.titulo,
              pr.fecha_p,
              pr.fecha_max,
              pr.fecha_e,
              pr.estado,
              pr.comprobante_id
            FROM public.prestamo   AS pr
            JOIN public.publicacion AS pu ON pu.id_pub = pr.cod_pub
            JOIN public.lector      AS le ON le.dni_p  = pr.dni_p
            JOIN public.persona     AS pe ON pe.dni    = le.dni_p
            ORDER BY pr.id_p DESC
            """;

        return db.sql(query)
                .map((row, meta) -> mapPrestamoRow(row))
                .all();
    }

    // ✅ Filtrar por DNI
    public Flux<PrestamoDTO> obtenerPrestamoPorDni(String dni) {
        String query = """
            SELECT
              pr.id_p,
              pr.cod_pub,
              pr.dni_p,
              pe.nombre,
              pe.apellido,
              pu.titulo,
              pr.fecha_p,
              pr.fecha_max,
              pr.fecha_e,
              pr.estado,
              pr.comprobante_id
            FROM public.prestamo   AS pr
            JOIN public.publicacion AS pu ON pu.id_pub = pr.cod_pub
            JOIN public.lector      AS le ON le.dni_p  = pr.dni_p
            JOIN public.persona     AS pe ON pe.dni    = le.dni_p
            WHERE pr.dni_p = :dni
            ORDER BY pr.id_p DESC
            """;

        return db.sql(query)
                .bind("dni", dni)
                .map((row, meta) -> mapPrestamoRow(row))
                .all();
    }
}
