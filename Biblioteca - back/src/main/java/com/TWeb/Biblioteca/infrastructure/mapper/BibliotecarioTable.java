
package com.TWeb.Biblioteca.infrastructure.mapper;

import com.TWeb.Biblioteca.domain.model.BibliotecarioModel;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("bibliotecario")
public class BibliotecarioTable {
    @Id
    private Long cod_b;
    private String dni_p;

    
    public BibliotecarioTable(){
        
    }

    public BibliotecarioTable(Long cod_b, String dni_p) {
        this.cod_b = cod_b;
        this.dni_p = dni_p;
    }
    
    public static BibliotecarioTable fromDomainModel(BibliotecarioModel bibliotecarioModel){
        return new BibliotecarioTable(bibliotecarioModel.getCod_b(), bibliotecarioModel.getDni_p());
    }
    
    public BibliotecarioModel toDomainModel(){
        return new BibliotecarioModel(cod_b, dni_p);
    }
    
    public Mono<BibliotecarioModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getCod_b() {
        return cod_b;
    }

    public void setCod_b(Long cod_b) {
        this.cod_b = cod_b;
    }

    public String getDni_p() {
        return dni_p;
    }

    public void setDni_p(String dni_p) {
        this.dni_p = dni_p;
    }
}
