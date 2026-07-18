package com.TWeb.Biblioteca.application.service;

import com.TWeb.Biblioteca.infrastructure.repository.PrestamoRepository;
import com.TWeb.Biblioteca.infrastructure.repository.TablesRepository;
import com.TWeb.Biblioteca.presentation.dto.PrestamoDTO;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PrestamoService {
    private final DatabaseClient db;
    private final TablesRepository tablesRepo;
    private final PrestamoRepository prestamoRepo;

    public PrestamoService(DatabaseClient db, TablesRepository tablesRepo, PrestamoRepository prestamoRepo) {
        this.db = db;
        this.tablesRepo = tablesRepo;
        this.prestamoRepo = prestamoRepo;
    }

    // NUEVO: multi (array)
    @Transactional
    public Mono<Long> realizarPrestamo(LocalDate fecha, String dni, List<Integer> publicacionCods) {
        Integer[] pubs = publicacionCods.toArray(Integer[]::new);
        return db.sql("""
                SELECT public.realizar_prestamo(:fecha, :dni, :pubs::int[]) AS id_comprobante
            """)
            .bind("fecha", fecha)
            .bind("dni", dni)
            .bind("pubs", pubs) // R2DBC Postgres acepta arrays Java
            .map((row, meta) -> row.get("id_comprobante", Long.class))
            .one()
            .onErrorMap(ex -> new ResponseStatusException(
                HttpStatus.CONFLICT,
                ex.getMessage() != null ? ex.getMessage() : "Error al realizar el préstamo",
                ex
            ));
    }

    // Lista
    public Flux<PrestamoDTO> obtenerPrestamoLista() {
        return tablesRepo.obtenerPrestamoLista();
    }
    
    public Flux<PrestamoDTO> obtenerPrestamosPorDni(String dni) {
        return tablesRepo.obtenerPrestamoPorDni(dni);
    }
    
    public Mono<Boolean> tienePrestamosActivosPorDni(String dni) {
        return prestamoRepo
                .findPrestamosActivosPorDni(dni, "ACTIVO")
                .hasElements();
    }

    public Mono<Boolean> tienePrestamosActivosPorPublicacion(Long codPub) {
        return prestamoRepo
                .findPrestamosActivosPorPublicacion(codPub, "ACTIVO")
                .hasElements();
    }

}
