
package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.BibliotecarioService;
import com.TWeb.Biblioteca.domain.model.BibliotecarioModel;
import com.TWeb.Biblioteca.domain.model.PersonaModel;
import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api-biblio")
public class BibliotecarioController {
    private final BibliotecarioService biblioService;

    public BibliotecarioController(BibliotecarioService biblioService) {
        this.biblioService = biblioService;
    }

    public static record PersonaBiblioUser(
            PersonaModel persona,
            BibliotecarioModel biblio,
            UsuarioModel usuario
    ) {}

    @PostMapping("/crear")
    @PreAuthorize("permitAll()")
    public Mono<ResponseEntity<BibliotecarioModel>> crear(@RequestBody PersonaBiblioUser req){
        return biblioService
                .crearBiblio(req.persona(), req.biblio(), req.usuario())
                .map(saved -> ResponseEntity.status(201).body(saved));
    }
    
    @GetMapping("/lista")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public Flux<BibliotecarioService.BibliotecarioWithPersona> obtenerLibroLista() {
        return biblioService.listar();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Mono<BibliotecarioService.BibliotecarioWithPersona> obtenerLibroPorId(@PathVariable Long id) {
        return biblioService.buscarPorId(id);
    }
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public Mono<BibliotecarioService.BibliotecarioWithPersona> obtenerMiPerfil(
            Authentication authentication // viene del token
    ) {
        String username = authentication.getName(); // normalmente es el "sub" del JWT
        return biblioService.buscarPorUsername(username);
    }
    
    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<BibliotecarioModel> actualizarBibliotecario(
            @PathVariable Long id,
            @RequestBody PersonaBiblioUser req
    ) {
        return biblioService.actualizarBiblio(
                id,
                req.persona(),
                req.biblio(),
                req.usuario()
        );
    }
}

