package com.TWeb.Biblioteca.application.service;

import com.TWeb.Biblioteca.domain.model.NotificacionesModel;
import com.TWeb.Biblioteca.infrastructure.mapper.NotificacionesTable;
import com.TWeb.Biblioteca.infrastructure.mapper.PersonaTable;
import com.TWeb.Biblioteca.infrastructure.mapper.PrestamoTable;
import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.PublicacionTable;
import com.TWeb.Biblioteca.infrastructure.repository.NotificacionesRepository;
import com.TWeb.Biblioteca.infrastructure.repository.PersonaRepository;
import com.TWeb.Biblioteca.infrastructure.repository.PrestamoRepository;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.PublicacionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

@Service
public class NotificacionesService {

    private final NotificacionesRepository notiRepo;
    private final PublicacionRepository publiRepo;
    private final PrestamoRepository prestamoRepo;
    private final PersonaRepository personaRepo;
    private final ObjectMapper objectMapper;

    public NotificacionesService(NotificacionesRepository notiRepo,
            PublicacionRepository publiRepo,
            PrestamoRepository prestamoRepo,
            PersonaRepository personaRepo,
            ObjectMapper objectMapper) {
        this.notiRepo = notiRepo;
        this.publiRepo = publiRepo;
        this.prestamoRepo = prestamoRepo;
        this.personaRepo = personaRepo;
        this.objectMapper = objectMapper;
    }

    public Flux<NotificacionesModel> generarNotificacionesPrestamosPorVencer(LocalDate fechaReferencia) {
        LocalDate fechaMax = fechaReferencia.plusDays(1);
        String estadoPrestamoActivo = "ACTIVO"; 

        return prestamoRepo.findPrestamosPorVencer(fechaMax, estadoPrestamoActivo)
                .flatMap(prestamo
                        -> publiRepo.findById(prestamo.getCod_pub())
                        .map(pub -> Tuples.of(prestamo, pub))
                )
                .flatMap(this::crearNotificacionPrestamoPorVencer);
    }

    private Mono<NotificacionesModel> crearNotificacionPrestamoPorVencer(
            Tuple2<PrestamoTable, PublicacionTable> data) {

        PrestamoTable prestamo = data.getT1();
        PublicacionTable publicacion = data.getT2();

        return resolveUsuarioIdFromDni(prestamo.getDni_p())
                .flatMap(usuarioId -> {
                    String payload = buildPayloadPrestamoPorVencer(prestamo, publicacion);

                    NotificacionesModel model = new NotificacionesModel(
                            null,
                            usuarioId,
                            "PRESTAMO_POR_VENCER",
                            payload,
                            false,
                            null,
                            Instant.now()
                    );

                    NotificacionesTable table = NotificacionesTable.fromDomainModel(model);

                    return notiRepo.save(table)
                            .map(NotificacionesTable::toDomainModel);
                });
    }
    
    private Mono<NotificacionesModel> crearNotificacionPrestamoVencido(
            Tuple2<PrestamoTable, PublicacionTable> data,
            LocalDate fechaReferencia
    ) {
        PrestamoTable prestamo = data.getT1();
        PublicacionTable publicacion = data.getT2();

        return resolveUsuarioIdFromDni(prestamo.getDni_p())
                .flatMap(usuarioId -> {
                    String payload = buildPayloadPrestamoVencido(prestamo, publicacion, fechaReferencia);

                    NotificacionesModel model = new NotificacionesModel(
                            null,
                            usuarioId,
                            "PRESTAMO_VENCIDO", // 👈 nuevo tipo
                            payload,
                            false,
                            null,
                            Instant.now()
                    );

                    NotificacionesTable table = NotificacionesTable.fromDomainModel(model);

                    return notiRepo.save(table)
                            .map(NotificacionesTable::toDomainModel);
                });
    }

    
    public Flux<NotificacionesModel> generarNotificacionesPrestamosVencidos(LocalDate fechaReferencia) {
        String estadoPrestamoActivo = "ACTIVO";

        return prestamoRepo.findPrestamosVencidos(fechaReferencia, estadoPrestamoActivo)
                .flatMap(prestamo
                        -> publiRepo.findById(prestamo.getCod_pub())
                        .map(pub -> Tuples.of(prestamo, pub))
                )
                .flatMap(tuple -> crearNotificacionPrestamoVencido(tuple, fechaReferencia));
    }
    
    public Flux<NotificacionesModel> listarNoLeidasPorUsuario(Long usuarioId) {
        return notiRepo.findNoLeidasByUsuario(usuarioId)
                .map(NotificacionesTable::toDomainModel);
    }

    public Flux<NotificacionesModel> listarTodasPorUsuario(Long usuarioId) {
        return notiRepo.findTodasByUsuario(usuarioId)
                .map(NotificacionesTable::toDomainModel);
    }

    public Mono<NotificacionesModel> marcarComoLeida(Long notificacionId) {
        return notiRepo.findById(notificacionId)
                .flatMap(table -> {
                    table.setLeido(true);
                    table.setLeidoAt(Instant.now());
                    return notiRepo.save(table);
                })
                .map(NotificacionesTable::toDomainModel);
    }

    public Mono<Void> marcarTodasComoLeidas(Long usuarioId) {
        return notiRepo.marcarTodasComoLeidasPorUsuario(usuarioId)
                .then();
    }
    
    private Mono<Long> resolveUsuarioIdFromDni(String dni) {
        return personaRepo.findByDni(dni)
                .switchIfEmpty(Mono.error(new IllegalStateException(
                        "No se encontró persona con dni=" + dni
                )))
                .map(PersonaTable::getUsuario_id);
    }

    private String buildPayloadPrestamoPorVencer(PrestamoTable prestamo, PublicacionTable publicacion) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("prestamo_id", prestamo.getId_p());
        node.put("publicacion_id", publicacion.getId_pub());
        node.put("titulo_publicacion", publicacion.getTitulo());
        node.put("fecha_vencimiento", prestamo.getFecha_max().toString());
        node.put("dias_restantes", 1);
        return node.toString();  
    }
    
    private String buildPayloadPrestamoVencido(
            PrestamoTable prestamo,
            PublicacionTable publicacion,
            LocalDate fechaReferencia
    ) {
        long diasAtraso = ChronoUnit.DAYS.between(prestamo.getFecha_max(), fechaReferencia);

        ObjectNode node = objectMapper.createObjectNode();
        node.put("prestamo_id", prestamo.getId_p());
        node.put("publicacion_id", publicacion.getId_pub());
        node.put("titulo_publicacion", publicacion.getTitulo());
        node.put("fecha_vencimiento", prestamo.getFecha_max().toString());
        node.put("dias_atraso", diasAtraso);
        return node.toString();
    }

}
