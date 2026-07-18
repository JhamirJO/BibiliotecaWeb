
package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.UsuarioService;
import com.TWeb.Biblioteca.presentation.dto.CambiarPasswordRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api-user")
public class UsuarioController {
    private final UsuarioService userService;

    public UsuarioController(UsuarioService userService) {
        this.userService = userService;
    }
    
    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<Void> eliminarUsuario(@PathVariable Long id) {
        return userService.eliminarUsuarioPorId(id);
    }
    
    @PatchMapping("/password/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN','LECTOR')")
    public Mono<Void> cambiarPassword(
            @PathVariable Long id,
            @RequestBody CambiarPasswordRequest request
    ) {
        return userService.cambiarPasswordPorId(id, request.getNuevaPassword());
    }
}
