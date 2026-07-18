package com.TWeb.Biblioteca.infrastructure.mapper.publicaciones;

import com.TWeb.Biblioteca.domain.model.publicaciones.PortadaModel;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("portada")
public class PortadaTable {
    @Id
    private Long id_portada;
    private byte[] imagen;
    @Column("cod_pub")
    private Long codPub;
    
    public PortadaTable(){
        
    }

    public PortadaTable(Long id_portada, byte[] imagen, Long codPub) {
        this.id_portada = id_portada;
        this.imagen = imagen;
        this.codPub = codPub;
    }
    
    public static PortadaTable fromDomainModel(PortadaModel portadaModel){
        return new PortadaTable(portadaModel.getId_portada(), portadaModel.getImagen(), 
                portadaModel.getCodPub());
    }
    
    public PortadaModel toDomainModel(){
        return new PortadaModel(id_portada, imagen, codPub);
    }
    
    public Mono<PortadaModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getId_portada() {
        return id_portada;
    }

    public void setId_portada(Long id_portada) {
        this.id_portada = id_portada;
    }

    public byte[] getImagen() {
        return imagen;
    }

    public void setImagen(byte[] imagen) {
        this.imagen = imagen;
    }
}
