
package com.TWeb.Biblioteca.domain.model;


public class PersonaModel {
    private String dni;
    private String nombre;
    private String apellido;
    private String telefono;
    private Long id_p;
    private Long usuario_id;
    
    public PersonaModel(){
        
    }

    public PersonaModel(String dni, String nombre, String apellido, String telefono, Long id_p, Long usuario_id) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.id_p = id_p;
        this.usuario_id = usuario_id;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Long getId_p() {
        return id_p;
    }

    public void setId_p(Long id_p) {
        this.id_p = id_p;
    }

    public Long getUsuario_id() {
        return usuario_id;
    }

    public void setUsuario_id(Long usuario_id) {
        this.usuario_id = usuario_id;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        PersonaModel newPersona = new PersonaModel();
        newPersona.setDni(dni);
        newPersona.setNombre(nombre);
        newPersona.setApellido(apellido);
        newPersona.setTelefono(telefono);
        newPersona.setId_p(id_p);
        newPersona.setUsuario_id(usuario_id);
        
        return newPersona;
    }
}
