
package com.TWeb.Biblioteca.domain.model.publicaciones;


public class TesisModel {
    private Long cod_t;
    private Long cod_p;
    private String grado;
    private String escuela;
    private String institucion;
    private String idioma;
    private String area;
    private String palabras_clave;
    
    public TesisModel(){
        
    }

    public TesisModel(Long cod_t, Long cod_p, String grado, String escuela, String institucion, String idioma, String area, String palabras_clave) {
        this.cod_t = cod_t;
        this.cod_p = cod_p;
        this.grado = grado;
        this.escuela = escuela;
        this.institucion = institucion;
        this.idioma = idioma;
        this.area = area;
        this.palabras_clave = palabras_clave;
    }

    public Long getCod_t() {
        return cod_t;
    }

    public void setCod_t(Long cod_t) {
        this.cod_t = cod_t;
    }

    public Long getCod_p() {
        return cod_p;
    }

    public void setCod_p(Long cod_p) {
        this.cod_p = cod_p;
    }

    public String getGrado() {
        return grado;
    }

    public void setGrado(String grado) {
        this.grado = grado;
    }

    public String getEscuela() {
        return escuela;
    }

    public void setEscuela(String escuela) {
        this.escuela = escuela;
    }

    public String getInstitucion() {
        return institucion;
    }

    public void setInstitucion(String institucion) {
        this.institucion = institucion;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getPalabras_clave() {
        return palabras_clave;
    }

    public void setPalabras_clave(String palabras_clave) {
        this.palabras_clave = palabras_clave;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        TesisModel newTesis = new TesisModel();
        newTesis.setCod_t(cod_t);
        newTesis.setCod_p(cod_p);
        newTesis.setGrado(grado);
        newTesis.setEscuela(escuela);
        newTesis.setInstitucion(institucion);
        newTesis.setIdioma(idioma);
        newTesis.setArea(area);
        newTesis.setPalabras_clave(palabras_clave);
        
        return newTesis;
    }
}
