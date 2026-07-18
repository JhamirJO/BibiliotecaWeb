package com.TWeb.Biblioteca.application.service;

import com.TWeb.Biblioteca.domain.model.BibliotecarioModel;
import com.TWeb.Biblioteca.domain.model.PersonaModel;
import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import com.TWeb.Biblioteca.infrastructure.mapper.BibliotecarioTable;
import com.TWeb.Biblioteca.infrastructure.repository.BibliotecarioRepository;
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
public class BibliotecarioService {

    private final PersonaRepository personaRepo;
    private final BibliotecarioRepository biblioRepo;
    private final UsuarioRepository usersRepo;
    private final UsuarioService usuarioService;

    public BibliotecarioService(PersonaRepository personaRepo, BibliotecarioRepository biblioRepo, UsuarioRepository usersRepo, UsuarioService usuarioService) {
        this.personaRepo = personaRepo;
        this.biblioRepo = biblioRepo;
        this.usersRepo = usersRepo;
        this.usuarioService = usuarioService;
    }

    public record BibliotecarioWithPersona(
            BibliotecarioModel bibliotecario,
            PersonaModel persona,
            UsuarioModel usuario
            ) {

    }

    //Crear
    @Transactional
    public Mono<BibliotecarioModel> crearBiblio(
            PersonaModel personaModel,
            BibliotecarioModel biblioModel,
            UsuarioModel userModel
    ) {
        return usuarioService.crearUsuarioYPersona(personaModel, userModel, "BIBLIOTECARIO")
                .flatMap(up -> {
                    var persona = up.persona();

                    BibliotecarioTable b = new BibliotecarioTable();
                    b.setDni_p(persona.getDni());

                    return biblioRepo.save(b);
                })
                .map(BibliotecarioTable::toDomainModel);
    }
    
    //actualizarBiblio
    @Transactional
    public Mono<BibliotecarioModel> actualizarBiblio(
            Long id,
            PersonaModel personaModel,
            BibliotecarioModel biblioModel,
            UsuarioModel userModel
    ) {
        return biblioRepo.findById(id)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Bibliotecario no encontrado")
                ))
                .flatMap(biblioDb
                        -> personaRepo.findByDni(biblioDb.getDni_p())
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
                                    usuarioService.aplicarCambiosUsuario(usuarioDb, userModel, "BIBLIOTECARIO");

                                    // PERSONA (y actualizar dni_p del biblio si cambia)
                                    usuarioService.aplicarCambiosPersona(personaDb, personaModel, nuevoDni -> {
                                        biblioDb.setDni_p(nuevoDni);
                                    });

                                    // BIBLIOTECARIO: por ahora no tienes campos extras
                                    if (biblioModel != null) {
                                        // si luego agregas campos, los actualizas aquí
                                    }

                                    return usersRepo.save(usuarioDb)
                                            .flatMap(u -> personaRepo.save(personaDb))
                                            .flatMap(p -> biblioRepo.save(biblioDb))
                                            .map(BibliotecarioTable::toDomainModel);
                                })
                        )
                );
    }


    public Flux<BibliotecarioWithPersona> listar() {
        return biblioRepo.findAll(Sort.by(Sort.Order.asc("cod_b")))
                .concatMap(biblioTable
                        -> personaRepo.findByDni(biblioTable.getDni_p())
                        // Si encuentra persona, busca usuario
                        .flatMap(personaTable
                                -> usersRepo.findById(personaTable.getUsuario_id())
                                .map(usuarioTable -> new BibliotecarioWithPersona(
                                biblioTable.toDomainModel(),
                                personaTable.toDomainModel(),
                                usuarioTable.toDomainModel()
                        ))
                                // persona pero sin usuario
                                .defaultIfEmpty(new BibliotecarioWithPersona(
                                        biblioTable.toDomainModel(),
                                        personaTable.toDomainModel(),
                                        null
                                ))
                        )
                        // Si NO hay persona, devolvemos solo bibliotecario
                        .switchIfEmpty(Mono.just(
                                new BibliotecarioWithPersona(
                                        biblioTable.toDomainModel(),
                                        null,
                                        null
                                )
                        ))
                );
    }

    public Mono<BibliotecarioWithPersona> buscarPorId(Long id) {
        return biblioRepo.findById(id)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Bibliotecario no encontrado")
                ))
                .flatMap(biblioTable
                        -> personaRepo.findByDni(biblioTable.getDni_p())
                        .flatMap(personaTable
                                -> usersRepo.findById(personaTable.getUsuario_id())
                                .map(usuarioTable -> new BibliotecarioWithPersona(
                                biblioTable.toDomainModel(),
                                personaTable.toDomainModel(),
                                usuarioTable.toDomainModel()
                        ))
                                // hay persona pero no usuario
                                .defaultIfEmpty(new BibliotecarioWithPersona(
                                        biblioTable.toDomainModel(),
                                        personaTable.toDomainModel(),
                                        null
                                ))
                        )
                        // no hay persona, devolvemos solo bibliotecario
                        .switchIfEmpty(Mono.just(
                                new BibliotecarioWithPersona(
                                        biblioTable.toDomainModel(),
                                        null,
                                        null
                                )
                        ))
                );
    }

    public Mono<BibliotecarioWithPersona> buscarPorUsername(String username) {
        return usuarioService.obtenerUsuarioYPersonaPorUsername(username)
                .flatMap(up -> {
                    UsuarioModel usuarioModel = up.usuario();
                    PersonaModel personaModel = up.persona(); // puede ser null

                    // caso: hay usuario pero no persona
                    if (personaModel == null) {
                        return Mono.just(new BibliotecarioWithPersona(
                                null, // bibliotecario
                                null, // persona
                                usuarioModel // usuario
                        ));
                    }

                    // caso: hay persona → buscamos bibliotecario por dni
                    return biblioRepo.findByDni(personaModel.getDni())
                            .map(biblioTable -> new BibliotecarioWithPersona(
                            biblioTable.toDomainModel(), // bibliotecario
                            personaModel, // persona
                            usuarioModel // usuario
                    ))
                            // caso: hay persona + usuario, pero no es bibliotecario
                            .defaultIfEmpty(new BibliotecarioWithPersona(
                                    null,
                                    personaModel,
                                    usuarioModel
                            ));
                });
    }
}
