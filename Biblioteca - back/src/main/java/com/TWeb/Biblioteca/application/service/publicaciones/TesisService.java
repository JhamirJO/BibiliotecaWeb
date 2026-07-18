
package com.TWeb.Biblioteca.application.service.publicaciones;

import com.TWeb.Biblioteca.config.FilePartUtils;
import com.TWeb.Biblioteca.domain.model.publicaciones.PublicacionModel;
import com.TWeb.Biblioteca.domain.model.publicaciones.TesisModel;
import com.TWeb.Biblioteca.infrastructure.mapper.publicaciones.TesisTable;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.PublicacionRepository;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.TesisRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class TesisService {
    private final TesisRepository tesisRepo;
    private final PublicacionRepository pubRepo;
    private final PublicacionService publicacionService;

    public TesisService(TesisRepository tesisRepo, PublicacionRepository pubRepo, PublicacionService publicacionService) {
        this.tesisRepo = tesisRepo;
        this.pubRepo = pubRepo;
        this.publicacionService = publicacionService;
    }
    public record TesisWithPublicacion(
            TesisModel tesis,
            PublicacionModel publicacion
            ) {
    }

    @Transactional
    public Mono<TesisModel> crearPublicacionTesisYPortada(
            PublicacionModel pubModel,
            TesisModel tesisModel,
            FilePart portada
    ) {
        return publicacionService
                .crearPublicacionConPortada(pubModel, "TESIS", portada)
                .flatMap(savedPub -> {
                    var tesisEntity = TesisTable.fromDomainModel(tesisModel);
                    tesisEntity.setCod_p(savedPub.getId_pub());
                    return tesisRepo.save(tesisEntity);
                })
                .map(TesisTable::toDomainModel);
    }

    @Transactional
    public Mono<TesisModel> actualizarPublicacionTesisYPortada(
            Long idTesis,
            PublicacionModel pubModel,
            TesisModel tesisModel,
            FilePart portada
    ) {
        long MAX = 5L * 1024 * 1024; // 5MB

        Mono<byte[]> maybeBytes = (portada != null)
                ? FilePartUtils.toBytesWithMax(portada, MAX)
                : Mono.empty();

        return tesisRepo.findById(idTesis)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Tesis no encontrada")
                ))
                .flatMap(tesisDb -> {
                    Long idPub = tesisDb.getCod_p();

                    return publicacionService
                            .actualizarPublicacionYPortada(idPub, pubModel, "TESIS", maybeBytes)
                            .then(Mono.defer(() -> {
                                if (tesisModel != null) {
                                    if (tesisModel.getGrado() != null) {
                                        tesisDb.setGrado(tesisModel.getGrado());
                                    }
                                    if (tesisModel.getEscuela() != null) {
                                        tesisDb.setEscuela(tesisModel.getEscuela());
                                    }
                                    if (tesisModel.getInstitucion() != null) {
                                        tesisDb.setInstitucion(tesisModel.getInstitucion());
                                    }
                                    if (tesisModel.getIdioma() != null) {
                                        tesisDb.setIdioma(tesisModel.getIdioma());
                                    }
                                    if (tesisModel.getArea() != null) {
                                        tesisDb.setArea(tesisModel.getArea());
                                    }
                                    if (tesisModel.getPalabras_clave() != null) {
                                        tesisDb.setPalabras_clave(tesisModel.getPalabras_clave());
                                    }
                                }
                                return tesisRepo.save(tesisDb);
                            }));
                })
                .map(TesisTable::toDomainModel);
    }


    public Flux<TesisWithPublicacion> listar() {
        return tesisRepo.findAll(Sort.by(Sort.Order.asc("cod_t")))
                .concatMap(tesisTable
                        -> pubRepo.findById(tesisTable.getCod_p())
                        .map(pubTable -> new TesisWithPublicacion(
                        tesisTable.toDomainModel(),
                        pubTable.toDomainModel()
                ))
                        // si faltara la publicación, devolvemos solo la tesis
                        .switchIfEmpty(Mono.just(
                                new TesisWithPublicacion(
                                        tesisTable.toDomainModel(),
                                        null
                                )
                        ))
                );
    }
    
    public Mono<TesisWithPublicacion> obtenerPorId(Long id) {
        return tesisRepo.findById(id)
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tesis no encontrada"
                )))
                .flatMap(tesisTable
                        -> pubRepo.findById(tesisTable.getCod_p())
                        .map(pubTable -> new TesisWithPublicacion(
                        tesisTable.toDomainModel(),
                        pubTable.toDomainModel()
                ))
                        // si falta la publicación, devolvemos solo la tesis
                        .switchIfEmpty(Mono.just(
                                new TesisWithPublicacion(
                                        tesisTable.toDomainModel(),
                                        null
                                )
                        ))
                );
    }
}
