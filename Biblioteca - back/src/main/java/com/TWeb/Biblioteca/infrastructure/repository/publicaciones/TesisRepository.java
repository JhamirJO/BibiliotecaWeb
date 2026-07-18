
package com.TWeb.Biblioteca.infrastructure.repository.publicaciones;

import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.TesisTable;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TesisRepository extends R2dbcRepository<TesisTable, Long>{
    
}
