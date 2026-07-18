
package com.TWeb.Biblioteca.application.service.publicaciones;

import com.TWeb.Biblioteca.application.service.PrestamoService;
import com.TWeb.Biblioteca.config.FilePartUtils;
import com.TWeb.Biblioteca.domain.model.publicaciones.PublicacionModel;
import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.PortadaTable;
import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.PublicacionTable;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.PortadaRepository;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.PublicacionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class PublicacionService {

    private final PublicacionRepository pubRepo;
    private final PortadaRepository portadaRepo;
    private final PrestamoService prestamoService; 

    public PublicacionService(PublicacionRepository pubRepo, PortadaRepository portadaRepo, PrestamoService prestamoService) {
        this.pubRepo = pubRepo;
        this.portadaRepo = portadaRepo;
        this.prestamoService = prestamoService;
    }
    
    public Flux<PublicacionModel> obtenerPublicacionesList() {
        return pubRepo
                .findAll(Sort.by(Sort.Order.asc("id_pub")))
                .map(PublicacionTable::toDomainModel);
    }
    
    @Transactional
    public Mono<PublicacionModel> crearPublicacionConPortada(
            PublicacionModel pubModel,
            String tipo, // o lo sacas del propio modelo
            FilePart portada
    ) {
        long MAX = 5L * 1024 * 1024; // 5MB

        return FilePartUtils.toBytesWithMax(portada, MAX)
                .flatMap(bytes -> {
                    var pubEntity = PublicacionTable.fromDomainModel(pubModel);
                    pubEntity.setTipo(tipo); 

                    return pubRepo.save(pubEntity)
                            .flatMap(savedPub
                                    -> portadaRepo.save(
                                    new PortadaTable(null, bytes, savedPub.getId_pub())
                            ).thenReturn(savedPub)
                            );
                })
                .map(PublicacionTable::toDomainModel);
    }

    
    @Transactional
    public Mono<Void> actualizarPublicacionYPortada(
            Long idPub,
            PublicacionModel pubModel,
            String tipo, // "LIBRO" / "ARTICULO" / "TESIS"
            Mono<byte[]> maybeBytes
    ) {
        return pubRepo.findById(idPub)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicación no encontrada")
                ))
                .flatMap(pubDb -> {
                    if (pubModel != null) {
                        if (pubModel.getTitulo() != null) {
                            pubDb.setTitulo(pubModel.getTitulo());
                        }
                        if (pubModel.getAutor() != null) {
                            pubDb.setAutor(pubModel.getAutor());
                        }
                        if (pubModel.getResumen() != null) {
                            pubDb.setResumen(pubModel.getResumen());
                        }
                        if (pubModel.getCant_pag() != null) {
                            pubDb.setCant_pag(pubModel.getCant_pag());
                        }
                        if (pubModel.getStock() != null) {
                            pubDb.setStock(pubModel.getStock());
                        }
                    }
                    pubDb.setTipo(tipo);
                    return pubRepo.save(pubDb);
                })
                .flatMap(savedPub -> actualizarPortadaOpcional(savedPub.getId_pub(), maybeBytes));
    }

    private Mono<Void> actualizarPortadaOpcional(
            Long idPub,
            Mono<byte[]> maybeBytes
    ) {
        if (maybeBytes == null) {
            return Mono.empty();
        }

        return maybeBytes
                .flatMap(bytes
                        -> portadaRepo.findFirstByCodPub(idPub)
                        .flatMap(portadaDb -> {
                            portadaDb.setImagen(bytes);
                            return portadaRepo.save(portadaDb);
                        })
                        .switchIfEmpty(
                                portadaRepo.save(new PortadaTable(null, bytes, idPub))
                        )
                )
                .then(); // devolvemos Mono<Void>
    }
    
    //Cambio de estado
    @Transactional
    public Mono<PublicacionModel> toggleEstadoPublicacion(Long id) {
        return pubRepo.findById(id)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicación no encontrada")
                ))
                .flatMap(pubDb -> {
                    // ¿La vamos a activar o desactivar?
                    boolean activar = !"DISPONIBLE".equalsIgnoreCase(pubDb.getEstado());

                    Mono<Void> validacionPrestamos;
                    if (!activar) {
                        // Estamos DESACTIVANDO → validar que la publicación no tenga préstamos activos
                        validacionPrestamos = prestamoService
                                .tienePrestamosActivosPorPublicacion(id) 
                                .flatMap(tieneActivos -> {
                                    if (Boolean.TRUE.equals(tieneActivos)) {
                                        return Mono.error(new ResponseStatusException(
                                                HttpStatus.CONFLICT,
                                                "No se puede desactivar la publicación: tiene préstamos activos"
                                        ));
                                    }
                                    return Mono.empty();
                                });
                    } else {
                        // Activando → sin validación
                        validacionPrestamos = Mono.empty();
                    }

                    return validacionPrestamos.then(
                            Mono.defer(() -> {
                                // Cambiar estado DISPONIBLE / NO DISPONIBLE
                                pubDb.setEstado(activar ? "DISPONIBLE" : "NO_DISPONIBLE");
                                return pubRepo.save(pubDb)
                                        .map(PublicacionTable::toDomainModel);
                            })
                    );
                });
    }
}

