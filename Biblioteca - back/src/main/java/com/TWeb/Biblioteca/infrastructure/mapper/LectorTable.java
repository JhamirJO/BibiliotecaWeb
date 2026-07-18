
package com.TWeb.Biblioteca.infrastructure.mapper;

import com.TWeb.Biblioteca.domain.model.LectorModel;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("lector")
public class LectorTable {
    @Id
    private Long cod_l;
    private String direccion;
    private String dni_p;
    private String estado;
    
    public LectorTable(){
        
    }

    public LectorTable(Long cod_l, String direccion, String dni_p, String estado) {
        this.cod_l = cod_l;
        this.direccion = direccion;
        this.dni_p = dni_p;
        this.estado = estado;
    }
    
    public static LectorTable fromDomainModel(LectorModel lectorModel){
        return new LectorTable(lectorModel.getCod_l(),lectorModel.getDireccion(),lectorModel.getDni_p(),
                                lectorModel.getEstado());
    }
    
    public LectorModel toDomainModel(){
        return new LectorModel(cod_l, direccion, dni_p, estado);
    }
    
    public Mono<LectorModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getCod_l() {
        return cod_l;
    }

    public void setCod_l(Long cod_l) {
        this.cod_l = cod_l;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDni_p() {
        return dni_p;
    }

    public void setDni_p(String dni_p) {
        this.dni_p = dni_p;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
