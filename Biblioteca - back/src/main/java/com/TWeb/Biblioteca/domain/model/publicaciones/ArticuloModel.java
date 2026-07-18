
package com.TWeb.Biblioteca.domain.model.publicaciones;

public class ArticuloModel {
    private Long cod_a;
    private Long anio_pub;
    private String area;
    private Long cod_p;
    private String idioma;
    private Long volumen;
    private Long numero_issue;
    private String titulo_revista;
    
    public ArticuloModel(){
        
    }

    public ArticuloModel(Long cod_a, Long anio_pub, String area, Long cod_p, String idioma, Long volumen, Long numero_issue, String titulo_revista) {
        this.cod_a = cod_a;
        this.anio_pub = anio_pub;
        this.area = area;
        this.cod_p = cod_p;
        this.idioma = idioma;
        this.volumen = volumen;
        this.numero_issue = numero_issue;
        this.titulo_revista = titulo_revista;
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
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        ArticuloModel newArticulo = new ArticuloModel();
        newArticulo.setCod_a(cod_a);
        newArticulo.setAnio_pub(anio_pub);
        newArticulo.setArea(area);
        newArticulo.setCod_p(cod_p);
        newArticulo.setIdioma(idioma);
        newArticulo.setVolumen(volumen);
        newArticulo.setNumero_issue(numero_issue);
        newArticulo.setTitulo_revista(titulo_revista);

        return newArticulo;
    }
}
