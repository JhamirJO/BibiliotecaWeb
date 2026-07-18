package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.AdminService;
import com.TWeb.Biblioteca.domain.model.UsuarioModel;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api-admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/crear")
    public Mono<UsuarioModel> crear(@RequestBody UsuarioModel body) {
        // Ignora cualquier rol entrante, el servicio lo fuerza a ADMIN
        body.setRol(null);
        return adminService.crearAdmin(body);
    }
}
