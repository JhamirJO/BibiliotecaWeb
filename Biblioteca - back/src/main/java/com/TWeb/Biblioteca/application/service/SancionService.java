package com.TWeb.Biblioteca.application.service;

import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class SancionService {

    private final DatabaseClient db;

    public SancionService(DatabaseClient db) {
        this.db = db;
    }

    public Mono<Void> levantarSancionPorDni(String dni) {

        if (dni == null || dni.isBlank()) {
            return Mono.error(new IllegalArgumentException("El DNI no puede ser vacío"));
        }

        return db.sql("SELECT public.levantar_sancion(:dni)")
                .bind("dni", dni)
                .fetch()
                .rowsUpdated() // devuelve Mono<Integer>, pero no nos interesa el número
                .then();       // lo convertimos a Mono<Void>
    }
}
