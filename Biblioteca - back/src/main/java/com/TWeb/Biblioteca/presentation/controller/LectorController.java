
package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.LectorService;
import com.TWeb.Biblioteca.domain.model.PersonaModel;
import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import com.TWeb.Biblioteca.domain.model.LectorModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("api-lector")
public class LectorController {
    
    private final LectorService lectorService;

    public LectorController(LectorService lectorService) {
        this.lectorService = lectorService;
    }

    public static record PersonaLectorUsuario(
        PersonaModel persona,
        LectorModel lector,
        UsuarioModel usuario
    ){}
    
    @PostMapping("/crear")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<LectorModel>> newUsuarioModel(@RequestBody PersonaLectorUsuario req){
        return lectorService
                .crearLector(req.persona(), req.lector(),req.usuario())
                .map(saved -> ResponseEntity.status(201).body(saved));
    }
    
    @GetMapping("/lista")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN','LECTOR')")
    public Flux<LectorService.LectorWithPersona> obtenerLibroLista() {
        return lectorService.listar();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Mono<LectorService.LectorWithPersona> obtenerLibroPorId(@PathVariable Long id) {
        return lectorService.buscarPorId(id);
    }
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('LECTOR')")
    public Mono<LectorService.LectorWithPersona> obtenerMiPerfil(
            Authentication authentication 
    ) {
        String username = authentication.getName(); 
        return lectorService.buscarPorUsername(username);
    }
    
    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN','LECTOR')")
    public Mono<ResponseEntity<LectorModel>> actualizarLector(
            @PathVariable Long id,
            @RequestBody PersonaLectorUsuario req
    ) {
        return lectorService
                .actualizarLector(id, req.persona(), req.lector(), req.usuario())
                .map(ResponseEntity::ok);
    }
    
    @PatchMapping("/estado/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<LectorService.LectorWithPersona> toggleEstadoLector(@PathVariable Long id) {
        return lectorService.toggleEstadoLector(id);
    }
}
