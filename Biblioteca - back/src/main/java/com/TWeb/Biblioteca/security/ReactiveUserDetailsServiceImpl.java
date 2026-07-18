// com.TWeb.Biblioteca.security.ReactiveUserDetailsServiceImpl.java
package com.TWeb.Biblioteca.security;

import com.TWeb.Biblioteca.infrastructure.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ReactiveUserDetailsServiceImpl implements ReactiveUserDetailsService {

    private final UsuarioRepository usersRepo;

    public ReactiveUserDetailsServiceImpl(UsuarioRepository usersRepo) {
        this.usersRepo = usersRepo;
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        final String uname = username == null ? "" : username.trim();
        return usersRepo.findByUsername(uname)
                // ⬇️ clave: NO RuntimeException; usar UsernameNotFoundException
                .switchIfEmpty(Mono.error(new UsernameNotFoundException("Credenciales inválidas")))
                // Si tu AppUserDetails implementa UserDetails, perfecto:
                .map(AppUserDetails::new);
    }
}
