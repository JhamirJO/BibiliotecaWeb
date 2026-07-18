
package com.TWeb.Biblioteca.domain.model;


public class BibliotecarioModel {
    private Long cod_b;
    private String dni_p;

    
    public BibliotecarioModel(){
        
    }

    public BibliotecarioModel(Long cod_b, String dni_p) {
        this.cod_b = cod_b;
        this.dni_p = dni_p;
    }

    public Long getCod_b() {
        return cod_b;
    }

    public void setCod_b(Long cod_b) {
        this.cod_b = cod_b;
    }

    public String getDni_p() {
        return dni_p;
    }

    public void setDni_p(String dni_p) {
        this.dni_p = dni_p;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        BibliotecarioModel newBibliotecario = new BibliotecarioModel();
        newBibliotecario.setDni_p(dni_p);
        return newBibliotecario;
    }
}
