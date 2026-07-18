
package com.TWeb.Biblioteca.infrastructure.repository.publicaciones;

import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.LibroTable;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibroRepository extends R2dbcRepository <LibroTable, Long> {
    
}
