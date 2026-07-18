
package com.TWeb.Biblioteca.infrastructure.repository.publicaciones;

import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.PortadaTable;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface PortadaRepository extends R2dbcRepository <PortadaTable,Long> {
    Mono<PortadaTable> findFirstByCodPub(Long codPub);
}
