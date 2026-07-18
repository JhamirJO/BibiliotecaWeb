
package com.TWeb.Biblioteca.infrastructure.mapper.publicaciones;

import com.TWeb.Biblioteca.domain.model.publicaciones.ArticuloModel;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("articulo")
public class ArticuloTable {
    @Id
    private Long cod_a;
    @Column("año_pub")
    private Long anio_pub;
    private String area;
    private Long cod_p;
    private String idioma;
    private Long volumen;
    private Long numero_issue;
    private String titulo_revista;
    
    public ArticuloTable(){
        
    }

    public ArticuloTable(Long cod_a, Long anio_pub, String area, Long cod_p, String idioma, Long volumen, Long numero_issue, String titulo_revista) {
        this.cod_a = cod_a;
        this.anio_pub = anio_pub;
        this.area = area;
        this.cod_p = cod_p;
        this.idioma = idioma;
        this.volumen = volumen;
        this.numero_issue = numero_issue;
        this.titulo_revista = titulo_revista;
    }

    public static ArticuloTable fromDomainModel(ArticuloModel articuloModel){
        return new ArticuloTable(articuloModel.getCod_a(),articuloModel.getAnio_pub(),
                articuloModel.getArea(),articuloModel.getCod_p(), articuloModel.getIdioma(),
                articuloModel.getVolumen(), articuloModel.getNumero_issue(), articuloModel.getTitulo_revista());
    }
   
    public ArticuloModel toDomainModel(){
        return new ArticuloModel(cod_a, anio_pub, area, cod_p, idioma, volumen, numero_issue, titulo_revista);
    }
    
    public Mono<ArticuloModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getCod_a() {
        return cod_a;
    }

    public void setCod_a(Long cod_a) {
        this.cod_a = cod_a;
    }

    public Long getAnio_pub() {
        return anio_pub;
    }

    public void setAnio_pub(Long anio_pub) {
        this.anio_pub = anio_pub;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Long getCod_p() {
        return cod_p;
    }

    public void setCod_p(Long cod_p) {
        this.cod_p = cod_p;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public Long getVolumen() {
        return volumen;
    }

    public void setVolumen(Long volumen) {
        this.volumen = volumen;
    }

    public Long getNumero_issue() {
        return numero_issue;
    }

    public void setNumero_issue(Long numero_issue) {
        this.numero_issue = numero_issue;
    }

    public String getTitulo_revista() {
        return titulo_revista;
    }

    public void setTitulo_revista(String titulo_revista) {
        this.titulo_revista = titulo_revista;
    }
}
