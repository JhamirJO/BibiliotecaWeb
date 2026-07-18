
package com.TWeb.Biblioteca.domain.model.publicaciones;

public class PortadaModel {
    private Long id_portada;
    private byte[] imagen;
    private Long codPub;
    
    public PortadaModel(){
        
    }

    public PortadaModel(Long id_portada, byte[] imagen, Long codPub) {
        this.id_portada = id_portada;
        this.imagen = imagen;
        this.codPub = codPub;
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

    public Long getCodPub() {
        return codPub;
    }

    public void setCodPub(Long codPub) {
        this.codPub = codPub;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        PortadaModel newPortada = new PortadaModel();
        newPortada.setId_portada(id_portada);
        newPortada.setImagen(imagen);
        newPortada.setCodPub(codPub);
        return newPortada;
    }
}
