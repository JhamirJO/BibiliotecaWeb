
package com.TWeb.Biblioteca.security;

import com.TWeb.Biblioteca.infrastructure.mapper.UsuarioTable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class AppUserDetails implements UserDetails {
    private final UsuarioTable user;

    public AppUserDetails(UsuarioTable user) { this.user = user; }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        // Importante: usar "ROLE_" para roles
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRol()));
    }
    @Override public String getPassword() { return user.getPassword_hash(); }
    @Override public String getUsername() { return user.getUsername(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public UsuarioTable getUsuario() { return user; }
}
