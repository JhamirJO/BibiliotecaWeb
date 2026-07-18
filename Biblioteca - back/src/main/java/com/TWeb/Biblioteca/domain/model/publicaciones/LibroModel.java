
package com.TWeb.Biblioteca.domain.model.publicaciones;


public class LibroModel {
    
    private Long cod_lib;
    private String genero;
    private String edicion;
    private Long cod_p;
    
    public LibroModel(){
        
    }

    public LibroModel(Long cod_lib, String genero, String edicion, Long cod_p) {
        this.cod_lib = cod_lib;
        this.genero = genero;
        this.edicion = edicion;
        this.cod_p = cod_p;
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
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        LibroModel newLibro = new LibroModel();
        newLibro.setCod_lib(cod_lib);
        newLibro.setGenero(genero);
        newLibro.setEdicion(edicion);
        newLibro.setCod_p(cod_p);
        
        return newLibro;
    }
}
