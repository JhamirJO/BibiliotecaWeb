
package com.TWeb.Biblioteca.infrastructure.mapper;

import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("usuarios")
public class UsuarioTable {
    @Id
    private Long id_u;
    private String username;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password_hash;
    private String rol;
    private Boolean is_active;
    
    public UsuarioTable(){
        
    }

    public UsuarioTable(Long id_u, String username, String email, String password_hash, String rol, Boolean is_active) {
        this.id_u = id_u;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.rol = rol;
        this.is_active = is_active;
    }
    
    public static UsuarioTable fromDomainModel(UsuarioModel usuarioModel){
        return new UsuarioTable(usuarioModel.getId_u(), usuarioModel.getUsername(), usuarioModel.getEmail(),
                                usuarioModel.getPassword_hash(), usuarioModel.getRol(), usuarioModel.getIs_active());
    }
    
    public UsuarioModel toDomainModel(){
        return new UsuarioModel(id_u, username, email, password_hash, rol, is_active);
    }
    
    public Mono<UsuarioModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getId_u() {
        return id_u;
    }

    public void setId_u(Long id_u) {
        this.id_u = id_u;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Boolean getIs_active() {
        return is_active;
    }

    public void setIs_active(Boolean is_active) {
        this.is_active = is_active;
    }
}
