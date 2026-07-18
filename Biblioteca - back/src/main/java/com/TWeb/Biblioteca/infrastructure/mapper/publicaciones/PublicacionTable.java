
package com.TWeb.Biblioteca.infrastructure.mapper.publicaciones;

import com.TWeb.Biblioteca.domain.model.publicaciones.PublicacionModel;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("publicacion")
public class PublicacionTable {
    
    @Id
    private Long id_pub;
    private String titulo;
    private String autor;
    private Long stock;
    private Long cant_pag;
    private String resumen;
    private String tipo;
    private String estado;
    
    public PublicacionTable(){
        
    }

    public PublicacionTable(Long id_pub, String titulo, String autor, Long stock, Long cant_pag, String resumen, String tipo, String estado) {
        this.id_pub = id_pub;
        this.titulo = titulo;
        this.autor = autor;
        this.stock = stock;
        this.cant_pag = cant_pag;
        this.resumen = resumen;
        this.tipo = tipo;
        this.estado = estado;
    }
    
    public static PublicacionTable fromDomainModel(PublicacionModel publicacionModel){
        
        return new PublicacionTable(publicacionModel.getId_pub(), publicacionModel.getTitulo(),
                publicacionModel.getAutor(), publicacionModel.getStock(), publicacionModel.getCant_pag(),
                publicacionModel.getResumen(), publicacionModel.getTipo(), publicacionModel.getEstado());
    }
    
    public PublicacionModel toDomainModel(){
        return new PublicacionModel(id_pub,titulo,autor,stock,cant_pag,resumen,tipo,estado);
    }
    
    public Mono<PublicacionModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getId_pub() {
        return id_pub;
    }

    public void setId_pub(Long id_pub) {
        this.id_pub = id_pub;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public Long getCant_pag() {
        return cant_pag;
    }

    public void setCant_pag(Long cant_pag) {
        this.cant_pag = cant_pag;
    }

    public String getResumen() {
        return resumen;
    }

    public void setResumen(String resumen) {
        this.resumen = resumen;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}