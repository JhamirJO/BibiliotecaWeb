
package com.TWeb.Biblioteca.application.service.publicaciones;

import com.TWeb.Biblioteca.config.FilePartUtils;
import com.TWeb.Biblioteca.domain.model.publicaciones.*;
import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.*;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class LibroService {
    
    private final LibroRepository libroRepo;
    private final PublicacionRepository publiRepo;
    private final PublicacionService publicacionService;

    public LibroService(LibroRepository libroRepo, PublicacionRepository publiRepo, PublicacionService publicacionService) {
        this.libroRepo = libroRepo;
        this.publiRepo = publiRepo;
        this.publicacionService = publicacionService;
    }
    
    public record LibroWithPublicacion(
            LibroModel libro,
            PublicacionModel publicacion
            ) {
    }
    
    @Transactional
    public Mono<LibroModel> crearPublicacionLibroYPortada(
            PublicacionModel pubModel,
            LibroModel libroModel,
            FilePart portada
    ) {
        return publicacionService
                .crearPublicacionConPortada(pubModel, "LIBRO", portada)
                .flatMap(savedPub -> {
                    var libroEntity = LibroTable.fromDomainModel(libroModel);
                    libroEntity.setCod_p(savedPub.getId_pub());
                    return libroRepo.save(libroEntity);
                })
                .map(LibroTable::toDomainModel);
    }
    
    
    @Transactional
    public Mono<LibroModel> actualizarPublicacionLibroYPortada(
            Long idLibro,
            PublicacionModel pubModel,
            LibroModel libroModel,
            FilePart portada
    ) {
        long MAX = 5L * 1024 * 1024; // 5MB

        Mono<byte[]> maybeBytes = (portada != null)
                ? FilePartUtils.toBytesWithMax(portada, MAX)
                : Mono.empty();

        return libroRepo.findById(idLibro)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado")
                ))
                .flatMap(libroDb -> {
                    Long idPub = libroDb.getCod_p();

                    // 1) Actualizar publicación + portada (común)
                    return publicacionService
                            .actualizarPublicacionYPortada(idPub, pubModel, "LIBRO", maybeBytes)
                            // 2) Luego actualizar datos específicos de LIBRO
                            .then(Mono.defer(() -> {
                                if (libroModel != null) {
                                    if (libroModel.getGenero() != null) {
                                        libroDb.setGenero(libroModel.getGenero());
                                    }
                                    if (libroModel.getEdicion() != null) {
                                        libroDb.setEdicion(libroModel.getEdicion());
                                    }
                                }
                                return libroRepo.save(libroDb);
                            }));
                })
                .map(LibroTable::toDomainModel);
    }

    
    public Flux<LibroWithPublicacion> listar() {
        return libroRepo.findAll(Sort.by(Sort.Order.asc("cod_lib")))
                .concatMap(libroTable
                        -> publiRepo.findById(libroTable.getCod_p())
                        .map(publiTable -> new LibroWithPublicacion(
                        libroTable.toDomainModel(),
                        publiTable.toDomainModel()
                ))
                        // si no hay publicación, devolvemos solo el libro
                        .switchIfEmpty(Mono.just(
                                new LibroWithPublicacion(
                                        libroTable.toDomainModel(),
                                        null
                                )
                        ))
                );
    }
    
    public Mono<LibroWithPublicacion> obtenerPorId(Long id) {
        return libroRepo.findById(id)
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Libro no encontrado"
                )))
                .flatMap(libroTable
                        -> publiRepo.findById(libroTable.getCod_p())
                        .map(publiTable -> new LibroWithPublicacion(
                        libroTable.toDomainModel(),
                        publiTable.toDomainModel()
                ))
                        // si no hay publicación, devolvemos solo el libro
                        .switchIfEmpty(Mono.just(
                                new LibroWithPublicacion(
                                        libroTable.toDomainModel(),
                                        null
                                )
                        ))
                );
    }
}
