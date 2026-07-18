package com.TWeb.Biblioteca.application.service;

import com.TWeb.Biblioteca.domain.model.PersonaModel;
import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import com.TWeb.Biblioteca.infrastructure.mapper.PersonaTable;
import com.TWeb.Biblioteca.infrastructure.mapper.UsuarioTable;
import com.TWeb.Biblioteca.infrastructure.repository.PersonaRepository;
import com.TWeb.Biblioteca.infrastructure.repository.UsuarioRepository;
import java.util.function.Consumer;
import org.springframework.data.relational.core.mapping.Embedded.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
public class UsuarioService {
    
    private final UsuarioRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final PersonaRepository personaRepo;

    public UsuarioService(UsuarioRepository userRepo, PasswordEncoder passwordEncoder, PersonaRepository personaRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.personaRepo = personaRepo;
    }
    
    public record UsuarioPersona(
            UsuarioModel usuario,
            @Nullable PersonaModel persona 
            ) {

    }
    
    //crear
    @Transactional
    public Mono<UsuarioPersona> crearUsuarioYPersona(
            PersonaModel personaModel,
            UsuarioModel userModel,
            String rol
    ) {
        return Mono.defer(() -> {
            userModel.setUsername(userModel.getUsername().trim());
            userModel.setEmail(userModel.getEmail().trim());
            userModel.setRol(rol);
            userModel.setPassword_hash(passwordEncoder.encode(userModel.getPassword_hash()));

            return userRepo.save(UsuarioTable.fromDomainModel(userModel));
        })
                .flatMap(savedUser -> {
                    var p = PersonaTable.fromDomainModel(personaModel);
                    p.setUsuario_id(savedUser.getId_u());
                    return personaRepo.save(p)
                            .map(savedPersona -> new UsuarioPersona(
                            savedUser.toDomainModel(),
                            savedPersona.toDomainModel()
                    ));
                });
    }

    //actualizar
    void aplicarCambiosUsuario(UsuarioTable usuarioDb,
            UsuarioModel userModel,
            String rolForzado) {
        if (userModel == null) {
            return;
        }

        if (userModel.getUsername() != null) {
            usuarioDb.setUsername(userModel.getUsername());
        }
        if (userModel.getEmail() != null) {
            usuarioDb.setEmail(userModel.getEmail());
        }

        // fuerza el rol según el contexto (LECTOR / BIBLIOTECARIO)
        usuarioDb.setRol(rolForzado);

        if (userModel.getPassword_hash() != null && !userModel.getPassword_hash().isBlank()) {
            usuarioDb.setPassword_hash(passwordEncoder.encode(userModel.getPassword_hash()));
        }
    }

    void aplicarCambiosPersona(
            PersonaTable personaDb,
            PersonaModel personaModel,
            Consumer<String> onDniChange 
    ) {
        if (personaModel == null) {
            return;
        }

        if (personaModel.getNombre() != null) {
            personaDb.setNombre(personaModel.getNombre());
        }
        if (personaModel.getApellido() != null) {
            personaDb.setApellido(personaModel.getApellido());
        }
        if (personaModel.getTelefono() != null) {
            personaDb.setTelefono(personaModel.getTelefono());
        }
        if (personaModel.getDni() != null) {
            personaDb.setDni(personaModel.getDni());
            if (onDniChange != null) {      
                onDniChange.accept(personaModel.getDni());
            }
        }
    }

    public Mono<UsuarioPersona> obtenerUsuarioYPersonaPorUsername(String username) {
        return userRepo.findByUsername(username)
                .switchIfEmpty(Mono.error(
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")
                ))
                .flatMap(usuarioTable
                        -> personaRepo.findByUsuarioId(usuarioTable.getId_u())
                        // caso: hay persona
                        .map(personaTable -> new UsuarioPersona(
                        usuarioTable.toDomainModel(),
                        personaTable.toDomainModel()
                ))
                        // caso: NO hay persona → devolvemos persona = null
                        .switchIfEmpty(Mono.just(
                                new UsuarioPersona(
                                        usuarioTable.toDomainModel(),
                                        null
                                )
                        ))
                );
    }

    public Mono<Void> eliminarUsuarioPorId(Long id) {
        return userRepo.deleteById(id);
    }
    
    public Mono<Void> cambiarPasswordPorId(Long idUsuario, String nuevaPasswordPlano) {
        String hash = passwordEncoder.encode(nuevaPasswordPlano);

        return userRepo.findById(idUsuario)
                .flatMap(usuario -> {
                    usuario.setPassword_hash(hash); // según tu UsuarioTable
                    return userRepo.save(usuario);
                })
                .then();
    }
}
