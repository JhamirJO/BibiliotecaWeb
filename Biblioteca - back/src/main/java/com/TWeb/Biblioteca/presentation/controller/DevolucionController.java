
package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.DevolucionService;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api-dev")
public class DevolucionController {
    
    private final DevolucionService devService;

    public DevolucionController(DevolucionService devService) {
        this.devService = devService;
    }
    
    
    @PostMapping("/id-prestamo")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<Void> realizarDevolucionIDP(@Valid @RequestBody DevolucionIdPrestRequest requestId) {
        return devService.realizarDevolucionPorPrestamo(
                requestId.fecha(), requestId.prestamoId());
    }
    
    public static record DevolucionIdPrestRequest(
            @NotNull @JsonFormat(pattern = "yyyy-MM-dd") LocalDate fecha,
            @NotNull Integer prestamoId
            ) {

    }
    
    // Devolución por ID de comprobante (bloque)//
    @PostMapping("/comprobante")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<Void> realizarDevolucionComprobante(@Valid @RequestBody DevolucionComprobanteRequest req) {
        return devService.realizarDevolucionPorComprobante(req.fecha(), req.comprobanteId());
    }

    public static record DevolucionComprobanteRequest(
            @NotNull
            @JsonFormat(pattern = "yyyy-MM-dd") LocalDate fecha,
            @NotNull Long comprobanteId
            ) {

    }
}
