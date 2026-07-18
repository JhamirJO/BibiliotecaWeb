
package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.SancionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api-sancion")
public class SancionController {
    
    private final SancionService sancionService;

    public SancionController(SancionService sancionService) {
        this.sancionService = sancionService;
    }
    
    @PostMapping("/levantar")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<Void>> levantar(@RequestParam String dni) {
        return sancionService.levantarSancionPorDni(dni)
                .thenReturn(ResponseEntity.noContent().build());
    }
    
}
