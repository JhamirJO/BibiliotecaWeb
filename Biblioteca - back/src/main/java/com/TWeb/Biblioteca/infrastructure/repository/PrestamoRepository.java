package com.TWeb.Biblioteca.infrastructure.repository;

import com.TWeb.Biblioteca.infrastructure.mapper.PrestamoTable;
import java.time.LocalDate;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface PrestamoRepository extends R2dbcRepository<PrestamoTable, Long> {
    @Query("""
           SELECT * 
           FROM prestamo 
           WHERE fecha_max = :fechaMax 
             AND estado = :estado
             AND fecha_e IS NULL
           """)
    Flux<PrestamoTable> findPrestamosPorVencer(LocalDate fechaMax, String estado);
    
    @Query("""
           SELECT *
           FROM prestamo
           WHERE dni_p = :dni
             AND estado = :estado
             AND fecha_e IS NULL
           """)
    Flux<PrestamoTable> findPrestamosActivosPorDni(String dni, String estado);
    
    @Query("""
           SELECT *
           FROM prestamo
           WHERE cod_pub = :codPub
             AND estado = :estado
             AND fecha_e IS NULL
           """)
    Flux<PrestamoTable> findPrestamosActivosPorPublicacion(Long codPub, String estado);
    
    @Query("""
           SELECT *
           FROM prestamo
           WHERE fecha_max < :fechaReferencia
             AND estado = :estado
           """)
    Flux<PrestamoTable> findPrestamosVencidos(LocalDate fechaReferencia, String estado);
}
