
package com.TWeb.Biblioteca.application.service.publicaciones;

import com.TWeb.Biblioteca.config.FilePartUtils;
import com.TWeb.Biblioteca.domain.model.publicaciones.ArticuloModel;
import com.TWeb.Biblioteca.domain.model.publicaciones.PublicacionModel;
import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.ArticuloTable;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.ArticuloRepository;
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
public class ArticuloService {
    private final PublicacionRepository publiRepo;
    private final ArticuloRepository artiRepo;
    private final PublicacionService publicacionService;

    public ArticuloService(PublicacionRepository publiRepo, ArticuloRepository artiRepo, PublicacionService publicacionService) {
        this.publiRepo = publiRepo;
        this.artiRepo = artiRepo;
        this.publicacionService = publicacionService;
    }
    
    public record ArticuloWithPublicacion(
            ArticuloModel articulo,
            PublicacionModel publicacion
            ) {
    }

    @Transactional
    public Mono<ArticuloModel> crearPublicacionArticuloYPortada(
            PublicacionModel pubModel,
            ArticuloModel articuloModel,
            FilePart portada
    ) {
        return publicacionService
                .crearPublicacionConPortada(pubModel, "ARTICULO", portada)
                .flatMap(savedPub -> {
                    var articuloEntity = ArticuloTable.fromDomainModel(articuloModel);
                    articuloEntity.setCod_p(savedPub.getId_pub());
                    return artiRepo.save(articuloEntity);
                })
                .map(ArticuloTable::toDomainModel);
    }
    
    
    @Transactional
    public Mono<ArticuloModel> actualizarPublicacionArticuloYPortada(
            Long idArticulo,
            PublicacionModel pubModel,
            ArticuloModel articuloModel,
            FilePart portada
    ) {
        long MAX = 5L * 1024 * 1024; // 5MB

        Mono<byte[]> maybeBytes = (portada != null)
                ? FilePartUtils.toBytesWithMax(portada, MAX)
                : Mono.empty();

        return artiRepo.findById(idArticulo)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Artículo no encontrado")
                ))
                .flatMap(artiDb -> {
                    Long idPub = artiDb.getCod_p();

                    return publicacionService
                            .actualizarPublicacionYPortada(idPub, pubModel, "ARTICULO", maybeBytes)
                            .then(Mono.defer(() -> {
                                if (articuloModel != null) {
                                    if (articuloModel.getArea() != null) {
                                        artiDb.setArea(articuloModel.getArea());
                                    }
                                    if (articuloModel.getAnio_pub() != null) {
                                        artiDb.setAnio_pub(articuloModel.getAnio_pub());
                                    }
                                    if (articuloModel.getIdioma() != null) {
                                        artiDb.setIdioma(articuloModel.getIdioma());
                                    }
                                    if (articuloModel.getVolumen() != null) {
                                        artiDb.setVolumen(articuloModel.getVolumen());
                                    }
                                    if (articuloModel.getNumero_issue() != null) {
                                        artiDb.setNumero_issue(articuloModel.getNumero_issue());
                                    }
                                    if (articuloModel.getTitulo_revista() != null) {
                                        artiDb.setTitulo_revista(articuloModel.getTitulo_revista());
                                    }
                                }
                                return artiRepo.save(artiDb);
                            }));
                })
                .map(ArticuloTable::toDomainModel);
    }


    public Flux<ArticuloWithPublicacion> listar() {
        return artiRepo.findAll(Sort.by(Sort.Order.asc("cod_a")))
                .concatMap(articuloTable
                        -> publiRepo.findById(articuloTable.getCod_p())
                        .map(publiTable -> new ArticuloWithPublicacion(
                        articuloTable.toDomainModel(),
                        publiTable.toDomainModel()
                ))
                        // si no hay publicación, devolvemos solo el artículo
                        .switchIfEmpty(Mono.just(
                                new ArticuloWithPublicacion(
                                        articuloTable.toDomainModel(),
                                        null
                                )
                        ))
                );
    }

    
    public Mono<ArticuloWithPublicacion> obtenerPorId(Long id) {
        return artiRepo.findById(id)
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Artículo no encontrado"
                )))
                .flatMap(articuloTable
                        -> publiRepo.findById(articuloTable.getCod_p())
                        .map(publiTable -> new ArticuloWithPublicacion(
                        articuloTable.toDomainModel(),
                        publiTable.toDomainModel()
                ))
                        // si no hay publicación, devolvemos solo el artículo
                        .switchIfEmpty(Mono.just(
                                new ArticuloWithPublicacion(
                                        articuloTable.toDomainModel(),
                                        null
                                )
                        ))
                );
    }
}
