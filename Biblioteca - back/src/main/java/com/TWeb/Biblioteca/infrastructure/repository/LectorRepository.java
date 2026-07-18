
package com.TWeb.Biblioteca.infrastructure.repository;

import com.TWeb.Biblioteca.infrastructure.mapper.LectorTable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface LectorRepository extends R2dbcRepository<LectorTable, Long> {
    @Query("SELECT * FROM lector WHERE dni_p = :dni")
    Mono<LectorTable> findByDni(String dni);
    
}
