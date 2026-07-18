package com.TWeb.Biblioteca.infrastructure.repository.publicaciones;

import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.ArticuloTable;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ArticuloRepository extends R2dbcRepository <ArticuloTable,Long>{
    
}
