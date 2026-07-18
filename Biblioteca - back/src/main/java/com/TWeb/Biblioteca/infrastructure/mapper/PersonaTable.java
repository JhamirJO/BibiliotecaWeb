package com.TWeb.Biblioteca.infrastructure.mapper;

import com.TWeb.Biblioteca.domain.model.PersonaModel;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("persona")
public class PersonaTable {

    
    private String dni;
    private String nombre;
    private String apellido;
    private String telefono;
    @Id
    private Long id_p;
    private Long usuario_id;

    public PersonaTable(){
        
    }

    public PersonaTable(String dni, String nombre, String apellido, String telefono, Long id_p, Long usuario_id) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.id_p = id_p;
        this.usuario_id = usuario_id;
    }
  
    public static PersonaTable fromDomainModel(PersonaModel personaModel){
        return new PersonaTable(personaModel.getDni(), personaModel.getNombre(), personaModel.getApellido(),
                personaModel.getTelefono(), personaModel.getId_p(), personaModel.getUsuario_id());
    }
    
    public PersonaModel toDomainModel(){
        return new PersonaModel(dni, nombre, apellido, telefono, id_p, usuario_id);
    }
    
    public Mono<PersonaModel> toMono(){
        return Mono.just(toDomainModel());
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
}
