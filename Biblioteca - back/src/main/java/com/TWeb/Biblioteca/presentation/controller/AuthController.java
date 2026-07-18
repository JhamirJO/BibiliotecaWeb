package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.presentation.dto.AuthResponse;
import com.TWeb.Biblioteca.presentation.dto.LoginRequest;
import com.TWeb.Biblioteca.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api-auth")
public class AuthController {

    private final ReactiveAuthenticationManager authManager;
    private final JwtService jwt;

    public AuthController(ReactiveAuthenticationManager authManager, JwtService jwt) {
        this.authManager = authManager;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public Mono<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        var token = new UsernamePasswordAuthenticationToken(req.username(), req.password());

        return authManager.authenticate(token)
                .map(auth -> {
                    var ud = (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();
                    String role = auth.getAuthorities().stream().findFirst()
                            .map(a -> a.getAuthority()).orElse("ROLE_USER");
                    if (role.startsWith("ROLE_")) {
                        role = role.substring(5);
                    }
                    String jwtStr = jwt.generateToken(ud, role);
                    return new AuthResponse(jwtStr, ud.getUsername(), role);
                })
                // ⬇⬇⬇  Mapea a 401 si la causa es de autenticación
                .onErrorResume(t -> isAuthCause(t),
                        t -> Mono.error(new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas"))
                );
    }

    // helper local 
    private boolean isAuthCause(Throwable t) {
        for (Throwable cur = t; cur != null && cur.getCause() != cur; cur = cur.getCause()) {
            if (cur instanceof org.springframework.security.core.AuthenticationException) {
                return true;
            }
            String cn = cur.getClass().getName();
            if (cn.contains("UsernameNotFound") || cn.contains("UserNotFound") || cn.contains("BadCredentials")) {
                return true;
            }
        }
        return false;
    }

}
