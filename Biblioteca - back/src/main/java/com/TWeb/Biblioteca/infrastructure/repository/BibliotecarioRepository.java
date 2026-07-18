
package com.TWeb.Biblioteca.infrastructure.repository;

import com.TWeb.Biblioteca.infrastructure.mapper.BibliotecarioTable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface BibliotecarioRepository extends R2dbcRepository<BibliotecarioTable, Long> {
    @Query("SELECT * FROM bibliotecario WHERE dni_p = :dni")
    Mono<BibliotecarioTable> findByDni(String dni);
}
