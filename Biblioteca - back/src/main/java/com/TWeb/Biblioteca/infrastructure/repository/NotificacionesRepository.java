package com.TWeb.Biblioteca.infrastructure.repository;

import com.TWeb.Biblioteca.infrastructure.mapper.NotificacionesTable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface  NotificacionesRepository extends R2dbcRepository<NotificacionesTable, Long> { 
    @Query("""
           SELECT * 
           FROM notificacion 
           WHERE usuario_id = :usuarioId
             AND leido = false
           ORDER BY created_at DESC
           """)
    Flux<NotificacionesTable> findNoLeidasByUsuario(Long usuarioId);

    @Query("""
           SELECT * 
           FROM notificacion 
           WHERE usuario_id = :usuarioId
           ORDER BY created_at DESC
           """)
    Flux<NotificacionesTable> findTodasByUsuario(Long usuarioId);
    
    @Query("""
           UPDATE notificacion
           SET leido = TRUE,
               leido_at = NOW()
           WHERE usuario_id = :usuarioId
             AND leido = FALSE
           """)
    Mono<Integer> marcarTodasComoLeidasPorUsuario(Long usuarioId);
    
}
