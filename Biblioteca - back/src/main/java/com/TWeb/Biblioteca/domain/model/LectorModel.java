
package com.TWeb.Biblioteca.domain.model;



public class LectorModel {
    private Long cod_l;
    private String direccion;
    private String dni_p;
    private String estado;
    
    public LectorModel(){
        
    }

    public LectorModel(Long cod_l, String direccion, String dni_p, String estado) {
        this.cod_l = cod_l;
        this.direccion = direccion;
        this.dni_p = dni_p;
        this.estado = estado;
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
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        LectorModel newLector = new LectorModel();

        newLector.setDireccion(direccion);
        newLector.setDni_p(dni_p);
        newLector.setEstado(estado);
        
        return newLector;
    }
    
}
