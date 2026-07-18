
package com.TWeb.Biblioteca.infrastructure.mapper.publicaciones;

import com.TWeb.Biblioteca.domain.model.publicaciones.LibroModel;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("libro")
public class LibroTable {
    
    @Id
    private Long cod_lib;
    
    private String genero;
    private String edicion;
    private Long cod_p;
    
    public LibroTable(){
        
    }

    public LibroTable(Long cod_lib, String genero, String edicion, Long cod_p) {
        this.cod_lib = cod_lib;
        this.genero = genero;
        this.edicion = edicion;
        this.cod_p = cod_p;
    }
    
    public static LibroTable fromDomainModel(LibroModel libroModel){
        
        return new LibroTable(libroModel.getCod_lib(), libroModel.getGenero(), 
                libroModel.getEdicion(), libroModel.getCod_p());
    }
    
    public LibroModel toDomainModel(){
        return new LibroModel(cod_lib,genero,edicion,cod_p);
    }
    
    public Mono<LibroModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getCod_lib() {
        return cod_lib;
    }

    public void setCod_lib(Long cod_lib) {
        this.cod_lib = cod_lib;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getEdicion() {
        return edicion;
    }

    public void setEdicion(String edicion) {
        this.edicion = edicion;
    }

    public Long getCod_p() {
        return cod_p;
    }

    public void setCod_p(Long cod_p) {
        this.cod_p = cod_p;
    }
}
