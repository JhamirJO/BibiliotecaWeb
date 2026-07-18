package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.NotificacionesService;
import com.TWeb.Biblioteca.domain.model.NotificacionesModel;
import com.TWeb.Biblioteca.infrastructure.mapper.UsuarioTable;
import com.TWeb.Biblioteca.infrastructure.repository.UsuarioRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("/api-noti")
public class NotificacionesController {

    private final NotificacionesService notiService;
    private final UsuarioRepository usuarioRepo; // username → usuarioId

    public NotificacionesController(NotificacionesService notiService,
            UsuarioRepository usuarioRepo) {
        this.notiService = notiService;
        this.usuarioRepo = usuarioRepo;
    }

    // ================== MIS NOTIFICACIONES ==================
    @GetMapping("/mis")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN','LECTOR')")
    public Flux<NotificacionesModel> listarMisNotificaciones(
            Authentication authentication,
            @RequestParam(name = "soloNoLeidas", defaultValue = "true") boolean soloNoLeidas
    ) {
        String username = authentication.getName(); 

        return usuarioRepo.findByUsername(username)
                .switchIfEmpty(Mono.error(new IllegalStateException(
                        "No se encontró usuario para username=" + username
                )))
                .flatMapMany((UsuarioTable usuario) -> {
                    Long usuarioId = usuario.getId_u();

                    if (soloNoLeidas) {
                        return notiService.listarNoLeidasPorUsuario(usuarioId);
                    } else {
                        return notiService.listarTodasPorUsuario(usuarioId);
                    }
                });
    }

    @PatchMapping("/{id}/leer")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN','LECTOR')")
    public Mono<NotificacionesModel> marcarComoLeida(@PathVariable Long id) {
        return notiService.marcarComoLeida(id);
    }

    @PatchMapping("/leer-todas")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN','LECTOR')")
    public Mono<Void> marcarTodasMisNotificacionesComoLeidas(Authentication authentication) {
        String username = authentication.getName();

        return usuarioRepo.findByUsername(username)
                .switchIfEmpty(Mono.error(new IllegalStateException(
                        "No se encontró usuario para username=" + username
                )))
                .flatMap(usuario -> {
                    Long usuarioId = usuario.getId_u();
                    return notiService.marcarTodasComoLeidas(usuarioId);
                });
    }


    @PostMapping("/generar/por-vencer")
    @PreAuthorize("hasRole('ADMIN')") // o los roles que quieras
    public Flux<NotificacionesModel> generarNotificacionesPrestamosPorVencer(
            @RequestParam(name = "fechaReferencia", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaReferencia
    ) {
        LocalDate ref = (fechaReferencia != null) ? fechaReferencia : LocalDate.now();
        return notiService.generarNotificacionesPrestamosPorVencer(ref);
    }

    @PostMapping("/generar/vencidos")
    @PreAuthorize("hasRole('ADMIN')") // o los roles que quieras
    public Flux<NotificacionesModel> generarNotificacionesPrestamosVencidos(
            @RequestParam(name = "fechaReferencia", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaReferencia
    ) {
        LocalDate ref = (fechaReferencia != null) ? fechaReferencia : LocalDate.now();
        return notiService.generarNotificacionesPrestamosVencidos(ref);
    }
}
