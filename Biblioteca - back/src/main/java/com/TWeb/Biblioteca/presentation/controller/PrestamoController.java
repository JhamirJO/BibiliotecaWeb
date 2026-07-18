package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.PrestamoService;
import com.TWeb.Biblioteca.presentation.dto.PrestamoDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api-pres")
public class PrestamoController {
    private final PrestamoService prestamoService;

    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @PostMapping("/generar")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<PrestamoResponse> realizarPrestamo(@Valid @RequestBody PrestamoRequest request) {
        return prestamoService
                .realizarPrestamo(request.fecha(), request.dni(), request.publicacionCod())
                .map(PrestamoResponse::new);
    }

    // ===== DTOs =====
    public static record PrestamoRequest(
            @NotNull
            @JsonFormat(pattern = "yyyy-MM-dd") LocalDate fecha,
            @NotBlank String dni,
            @NotNull
            @Size(min = 1, max = 3)
            @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
            List<@NotNull Integer> publicacionCod
            ) {

    }

    public static record PrestamoResponse(Long idComprobante) {

    }

    @GetMapping("/lista")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Flux<PrestamoDTO> getPrestamoLista() {
        return prestamoService.obtenerPrestamoLista();
    }
    
    @GetMapping("/me/{dni}")
    @PreAuthorize("hasAnyRole('LECTOR')")
    public Flux<PrestamoDTO> listarPorDni(@PathVariable String dni) {
        return prestamoService.obtenerPrestamosPorDni(dni);
    }
}
