// com.TWeb.Biblioteca.security.JwtReactiveAuthenticationManager.java
package com.TWeb.Biblioteca.security;


import com.TWeb.Biblioteca.infrastructure.repository.UsuarioRepository;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import reactor.core.publisher.Mono;


public class JwtReactiveAuthenticationManager implements ReactiveAuthenticationManager {

    private final UsuarioRepository usersRepo;
    private final JwtService jwt;

    public JwtReactiveAuthenticationManager(UsuarioRepository usersRepo, JwtService jwt) {
        this.usersRepo = usersRepo;
        this.jwt = jwt;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String username = (String) authentication.getPrincipal();
        String token    = (String) authentication.getCredentials();

        return usersRepo.findByUsername(username)
                .map(AppUserDetails::new)
                .filter(ud -> jwt.isValid(token, ud))
                .map(ud -> new UsernamePasswordAuthenticationToken(
                        ud.getUsername(), null, ud.getAuthorities()))
                .cast(Authentication.class);
    }
}
