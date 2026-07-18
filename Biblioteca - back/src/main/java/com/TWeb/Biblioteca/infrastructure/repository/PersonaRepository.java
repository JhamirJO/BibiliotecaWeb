
package com.TWeb.Biblioteca.infrastructure.repository;


import com.TWeb.Biblioteca.infrastructure.mapper.PersonaTable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface PersonaRepository extends R2dbcRepository<PersonaTable, Long> {

   
    Mono<PersonaTable> findByDni(String dni);
    
    @Query("SELECT * FROM persona WHERE usuario_id = :usuarioId")
    Mono<PersonaTable> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    
}
