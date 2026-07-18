package com.TWeb.Biblioteca.application.jobs;

import com.TWeb.Biblioteca.application.service.NotificacionesService;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificacionesScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificacionesScheduler.class);
    private final NotificacionesService notificacionesServicie;

    public NotificacionesScheduler(NotificacionesService notificacionesServicie) {
        this.notificacionesServicie = notificacionesServicie;
    }

    @Scheduled(cron = "0 46 10 * * *")
    public void generarNotificacionesDiarias() {
        LocalDate hoy = LocalDate.now();

        log.info("[NOTI] INICIO generación de notificaciones diarias. Fecha ref={}", hoy);

        // 1) Por vencer (mañana)
        notificacionesServicie.generarNotificacionesPrestamosPorVencer(hoy)
                .doOnNext(n -> log.info("[NOTI] Creada notificación {} para usuario {} (POR VENCER)",
                n.getId_notificacion(), n.getUsuario_id()))
                .doOnError(e -> log.error("[NOTI] Error generando notificaciones de préstamos por vencer", e))
                .doOnComplete(() -> log.info("[NOTI] Fin generación notificaciones de préstamos por vencer"))
                // encadenamos con las de vencidos
                .thenMany(
                        notificacionesServicie.generarNotificacionesPrestamosVencidos(hoy)
                                .doOnNext(n -> log.info("[NOTI] Creada notificación {} para usuario {} (VENCIDO)",
                                n.getId_notificacion(), n.getUsuario_id()))
                                .doOnError(e -> log.error("[NOTI] Error generando notificaciones de préstamos vencidos", e))
                                .doOnComplete(() -> log.info("[NOTI] Fin generación notificaciones de préstamos vencidos"))
                )
                .doOnTerminate(() -> log.info("[NOTI] FIN TOTAL generación de notificaciones diarias"))
                .subscribe();
    }
}
