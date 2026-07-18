
package com.TWeb.Biblioteca.application.service;

import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
public class DevolucionService {
    
    private final DatabaseClient db;

    public DevolucionService(DatabaseClient db) {
        this.db = db;
    }
    
    
    
    @Transactional
    public Mono<Void> realizarDevolucionPorPrestamo(LocalDate fecha, Integer prestamoId) {
        return db.sql("SELECT public.realizar_devolucion_por_prestamo(:fecha, :cod)")
                .bind("fecha", fecha)
                .bind("cod", prestamoId)
                .fetch()
                .all() // no intentes mapear a ningún POJO
                .then() // descarta filas (evita el mapeo a Void)
                .onErrorMap(ex -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.CONFLICT,
                ex.getMessage() != null ? ex.getMessage() : "Error al realizar el préstamo",
                ex
        ));
    }
    
    @Transactional
    public Mono<Void> realizarDevolucionPorComprobante(LocalDate fechaDevolucion, long comprobanteId) {
        return db.sql("""
                SELECT public.realizar_devolucion_por_comprobante(:fecha, :id)
            """)
                .bind("fecha", fechaDevolucion)
                .bind("id", comprobanteId)
                .fetch().rowsUpdated()
                .then()
                .onErrorMap(ex -> new ResponseStatusException(
                HttpStatus.CONFLICT,
                ex.getMessage() != null ? ex.getMessage() : "Error al registrar la devolución (por comprobante)",
                ex
        ));
    }
}
