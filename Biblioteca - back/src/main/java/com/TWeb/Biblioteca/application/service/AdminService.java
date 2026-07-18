package com.TWeb.Biblioteca.application.service;

import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import com.TWeb.Biblioteca.infrastructure.mapper.UsuarioTable;
import com.TWeb.Biblioteca.infrastructure.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
public class AdminService {

    private final UsuarioRepository usersRepo;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UsuarioRepository usersRepo, PasswordEncoder passwordEncoder) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Mono<UsuarioModel> crearAdmin(UsuarioModel userModel) {
        return Mono.defer(() -> {
            // Normalización
            userModel.setUsername(userModel.getUsername().trim());
            userModel.setEmail(userModel.getEmail().trim());
            userModel.setRol("ADMIN"); // forzado en servidor
            userModel.setPassword_hash(passwordEncoder.encode(userModel.getPassword_hash()));

            return usersRepo
                .existsByUsernameOrEmail(userModel.getUsername(), userModel.getEmail())
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new IllegalArgumentException(
                            "Ya existe un usuario con ese username o email"));
                    }
                    return usersRepo.save(UsuarioTable.fromDomainModel(userModel));
                })
                .map(UsuarioTable::toDomainModel);
        });
    }

}
