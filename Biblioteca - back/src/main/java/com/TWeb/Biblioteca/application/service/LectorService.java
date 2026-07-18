package com.TWeb.Biblioteca.application.service;

import com.TWeb.Biblioteca.domain.model.LectorModel;
import com.TWeb.Biblioteca.domain.model.PersonaModel;
import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import com.TWeb.Biblioteca.infrastructure.mapper.LectorTable;
import com.TWeb.Biblioteca.infrastructure.repository.LectorRepository;
import com.TWeb.Biblioteca.infrastructure.repository.PersonaRepository;
import com.TWeb.Biblioteca.infrastructure.repository.UsuarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class LectorService {

    private final PersonaRepository personaRepo;
    private final LectorRepository lectorRepo;
    private final UsuarioRepository usersRepo;
    private final PrestamoService prestamoService;
    private final UsuarioService usuarioService;

    public LectorService(PersonaRepository personaRepo, LectorRepository lectorRepo, UsuarioRepository usersRepo, PrestamoService prestamoService, UsuarioService usuarioService) {
        this.personaRepo = personaRepo;
        this.lectorRepo = lectorRepo;
        this.usersRepo = usersRepo;
        this.prestamoService = prestamoService;
        this.usuarioService = usuarioService;
    }
    
    public record LectorWithPersona(
            LectorModel lector,
            PersonaModel persona,
            UsuarioModel usuario
            ) {

    }
    
    // Crear LECTOR: Usuario (ROLE_LECTOR) -> Persona -> Lector
    @Transactional
    public Mono<LectorModel> crearLector(
            PersonaModel personaModel,
            LectorModel lectorModel,
            UsuarioModel userModel
    ) {
        return usuarioService.crearUsuarioYPersona(personaModel, userModel, "LECTOR")
                .flatMap(up -> {
                    var persona = up.persona(); // PersonaModel ya persistido

                    var l = LectorTable.fromDomainModel(lectorModel);
                    l.setDni_p(persona.getDni());

                    return lectorRepo.save(l);
                })
                .map(LectorTable::toDomainModel);
    }
    
    //actualizar
    @Transactional
    public Mono<LectorModel> actualizarLector(
            Long id,
            PersonaModel personaModel,
            LectorModel lectorModel,
            UsuarioModel userModel
    ) {
        return lectorRepo.findById(id)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Lector no encontrado")
                ))
                .flatMap(lectorDb
                        -> personaRepo.findByDni(lectorDb.getDni_p())
                        .switchIfEmpty(Mono.error(
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona no encontrada")
                        ))
                        .flatMap(personaDb
                                -> usersRepo.findById(personaDb.getUsuario_id())
                                .switchIfEmpty(Mono.error(
                                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")
                                ))
                                .flatMap(usuarioDb -> {

                                    // USUARIO
                                    usuarioService.aplicarCambiosUsuario(usuarioDb, userModel, "LECTOR");

                                    // PERSONA (y actualizar dni_p del lector si cambia)
                                   usuarioService.aplicarCambiosPersona(personaDb, personaModel, nuevoDni -> {
                                        lectorDb.setDni_p(nuevoDni);
                                    });

                                    // LECTOR
                                    if (lectorModel != null && lectorModel.getDireccion() != null) {
                                        lectorDb.setDireccion(lectorModel.getDireccion());
                                    }

                                    return usersRepo.save(usuarioDb)
                                            .flatMap(u -> personaRepo.save(personaDb))
                                            .flatMap(p -> lectorRepo.save(lectorDb))
                                            .map(LectorTable::toDomainModel);
                                })
                        )
                );
    }

    
    //Cambio de estado 
    @Transactional
    public Mono<LectorWithPersona> toggleEstadoLector(Long id) {
        return lectorRepo.findById(id)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Lector no encontrado")
                ))
                .flatMap(lectorDb -> {
                    // 👇 Determinar la acción según el estado actual en BD
                    boolean activar = !"ACTIVO".equalsIgnoreCase(lectorDb.getEstado());

                    Mono<Void> validacionPrestamos;
                    if (!activar) {
                        // Estamos DESACTIVANDO → validar préstamos activos
                        validacionPrestamos = prestamoService
                                .tienePrestamosActivosPorDni(lectorDb.getDni_p())
                                .flatMap(tieneActivos -> {
                                    if (Boolean.TRUE.equals(tieneActivos)) {
                                        return Mono.error(new ResponseStatusException(
                                                HttpStatus.CONFLICT,
                                                "No se puede desactivar al lector: tiene préstamos activos"
                                        ));
                                    }
                                    return Mono.empty();
                                });
                    } else {
                        // Estamos ACTIVANDO → no hace falta validación
                        validacionPrestamos = Mono.empty();
                    }

                    return validacionPrestamos.then(
                            personaRepo.findByDni(lectorDb.getDni_p())
                                    .switchIfEmpty(Mono.error(
                                            new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona no encontrada")
                                    ))
                                    .flatMap(personaDb
                                            -> usersRepo.findById(personaDb.getUsuario_id())
                                            .switchIfEmpty(Mono.error(
                                                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")
                                            ))
                                            .flatMap(usuarioDb -> {
                                                // Cambiar estados según `activar`
                                                lectorDb.setEstado(activar ? "ACTIVO" : "INACTIVO");
                                                usuarioDb.setIs_active(activar);

                                                return usersRepo.save(usuarioDb)
                                                        .flatMap(usuarioActualizado
                                                                -> lectorRepo.save(lectorDb)
                                                                .map(lectorActualizado
                                                                        -> new LectorWithPersona(
                                                                        lectorActualizado.toDomainModel(),
                                                                        personaDb.toDomainModel(),
                                                                        usuarioActualizado.toDomainModel()
                                                                )
                                                                )
                                                        );
                                            })
                                    )
                    );
                });
    }


    
    // Listado
    public Flux<LectorWithPersona> listar() {
        return lectorRepo.findAll(Sort.by(Sort.Order.asc("cod_l")))
                .concatMap(lt
                        -> personaRepo.findByDni(lt.getDni_p())
                        .flatMap(pt
                                -> usersRepo.findById(pt.getUsuario_id())
                                .map(ut -> new LectorWithPersona(
                                lt.toDomainModel(),
                                pt.toDomainModel(),
                                ut.toDomainModel()
                        ))
                                .defaultIfEmpty(new LectorWithPersona(
                                        lt.toDomainModel(),
                                        pt.toDomainModel(),
                                        null
                                ))
                        )
                        .switchIfEmpty(Mono.just(
                                new LectorWithPersona(
                                        lt.toDomainModel(),
                                        null,
                                        null
                                )
                        ))
                );
    }

    
    // Buscar Por ID
    public Mono<LectorWithPersona> buscarPorId(Long id) {
        return lectorRepo.findById(id)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Lector no encontrado")
                ))
                .flatMap(lectorTable
                        -> personaRepo.findByDni(lectorTable.getDni_p())
                        .flatMap(personaTable
                                -> usersRepo.findById(personaTable.getUsuario_id())
                                .map(usuarioTable -> new LectorWithPersona(
                                lectorTable.toDomainModel(),
                                personaTable.toDomainModel(),
                                usuarioTable.toDomainModel()
                        ))
                                // hay persona pero no usuario
                                .defaultIfEmpty(new LectorWithPersona(
                                        lectorTable.toDomainModel(),
                                        personaTable.toDomainModel(),
                                        null
                                ))
                        )
                        // no hay persona, devolvemos solo lector
                        .switchIfEmpty(Mono.just(
                                new LectorWithPersona(
                                        lectorTable.toDomainModel(),
                                        null,
                                        null
                                )
                        ))
                );
    }

    
    // Buscar Por UserName
    public Mono<LectorWithPersona> buscarPorUsername(String username) {
        return usuarioService.obtenerUsuarioYPersonaPorUsername(username)
                .flatMap(up -> {
                    var usuarioModel = up.usuario();
                    var personaModel = up.persona(); // puede ser null

                    if (personaModel == null) {
                        return Mono.just(new LectorWithPersona(
                                null,
                                null,
                                usuarioModel
                        ));
                    }
                    return lectorRepo.findByDni(personaModel.getDni())
                            .map(lectorTable -> new LectorWithPersona(
                            lectorTable.toDomainModel(),
                            personaModel,
                            usuarioModel
                    ))
                            .defaultIfEmpty(new LectorWithPersona(
                                    null,
                                    personaModel,
                                    usuarioModel
                            ));
                });
    }
}
