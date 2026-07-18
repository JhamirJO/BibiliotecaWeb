
package com.TWeb.Biblioteca.domain.model.publicaciones;


public class PublicacionModel {
    
    private Long id_pub;
    
    private String titulo;
    private String autor;
    private Long stock;
    private Long cant_pag;
    private String resumen;
    private String tipo;
    private String estado;
    
    public PublicacionModel(){
        
    }

    public PublicacionModel(Long id_pub, String titulo, String autor, Long stock, Long cant_pag, String resumen, String tipo, String estado) {
        this.id_pub = id_pub;
        this.titulo = titulo;
        this.autor = autor;
        this.stock = stock;
        this.cant_pag = cant_pag;
        this.resumen = resumen;
        this.tipo = tipo;
        this.estado = estado;
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

    @Override
    protected Object clone() throws CloneNotSupportedException {
        
        PublicacionModel newPublicacion = new PublicacionModel();
        newPublicacion.setTitulo(titulo);
        newPublicacion.setAutor(autor);
        newPublicacion.setStock(stock);
        newPublicacion.setCant_pag(cant_pag);
        newPublicacion.setResumen(resumen);
        newPublicacion.setTipo(tipo);
        newPublicacion.setEstado(estado);
        return newPublicacion;
    }
}
