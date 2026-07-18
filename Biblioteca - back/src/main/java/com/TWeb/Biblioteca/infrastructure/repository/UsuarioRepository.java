
package com.TWeb.Biblioteca.infrastructure.repository;

import com.TWeb.Biblioteca.infrastructure.mapper.UsuarioTable;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;


public interface UsuarioRepository extends R2dbcRepository<UsuarioTable,Long> {
    Mono<UsuarioTable> findByUsername(String username);
    Mono<Boolean> existsByUsername(String username);
    Mono<Boolean> existsByEmail(String email);
    Mono<Boolean> existsByUsernameOrEmail(String username, String email);
}
