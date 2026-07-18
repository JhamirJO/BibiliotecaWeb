package com.TWeb.Biblioteca.presentation.controller;

import com.TWeb.Biblioteca.application.service.publicaciones.ArticuloService;
import com.TWeb.Biblioteca.application.service.publicaciones.LibroService;
import com.TWeb.Biblioteca.application.service.publicaciones.PublicacionService;
import com.TWeb.Biblioteca.application.service.publicaciones.TesisService;
import com.TWeb.Biblioteca.domain.model.publicaciones.ArticuloModel;
import com.TWeb.Biblioteca.domain.model.publicaciones.LibroModel;
import com.TWeb.Biblioteca.domain.model.publicaciones.PublicacionModel;
import com.TWeb.Biblioteca.domain.model.publicaciones.TesisModel;
import com.TWeb.Biblioteca.infrastructure.repository.publicaciones.PortadaRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Validated
@RestController
@RequestMapping("/api-pub")
public class PublicacionController {

    private final PublicacionService publicacionService;
    private final LibroService libroService;
    private final ArticuloService articuloService;
    private final TesisService tesisService;
    private final PortadaRepository portadaRepo;

    public PublicacionController(PublicacionService publicacionService, LibroService libroService, ArticuloService articuloService, 
                        TesisService tesisService, PortadaRepository portadaRepo) {
        this.publicacionService = publicacionService;
        this.libroService = libroService;
        this.articuloService = articuloService;
        this.tesisService = tesisService;
        this.portadaRepo = portadaRepo;
    }

    public static record PublicacionYLibro(
            @Valid PublicacionModel publicacion,
            @Valid LibroModel libro
            ) {
    }

    public static record PublicacionYArticulo(
            @Valid PublicacionModel publicacion,
            @Valid ArticuloModel articulo
            ) {
    }

    public static record PublicacionYTesis(
            @Valid PublicacionModel publicacion,
            @Valid TesisModel tesis
            ) {
    }
    

    // ---------- PUBLICACION ----------
    @GetMapping("/lista")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Flux<PublicacionModel> obtenerPublicacionLista() {
        return publicacionService.obtenerPublicacionesList(); 
    }
    
    @GetMapping("/portada/{codPub}")
    public Mono<ResponseEntity<byte[]>> obtenerPortada(@PathVariable Long codPub) {
        return portadaRepo.findFirstByCodPub(codPub)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Sin portada")))
                .map(p -> ResponseEntity.ok()
                .header("Content-Type", "image/png") // o el real si lo guardas
                .header("Content-Disposition", "inline")
                .body(p.getImagen()));
    }
    
    @PatchMapping("/estado/{id}")
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<PublicacionModel> toggleEstadoPublicacion(@PathVariable Long id) {
        return publicacionService.toggleEstadoPublicacion(id);
    }


    // ---------- LIBRO ----------
    
    @GetMapping("/libro/lista")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Flux<LibroService.LibroWithPublicacion> obtenerLibroLista() {
        return libroService.listar();
    }

    @PostMapping( value = "/libro/crear2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<LibroModel>> crearLibroConPortadaJsonYArchivo(
            @RequestPart("publicacion") PublicacionModel publicacion,
            @RequestPart("libro") LibroModel libro,
            @RequestPart("portada") FilePart portada
    ) {
        return libroService
                .crearPublicacionLibroYPortada(publicacion, libro, portada)
                .map(saved -> ResponseEntity.status(201).body(saved));
    }
    
    @GetMapping("/libro/{id}")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Mono<LibroService.LibroWithPublicacion> obtenerLibroPorId(@PathVariable Long id) {
        return libroService.obtenerPorId(id);
    }
    
    @PutMapping(
            value = "/libro/actualizar/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<LibroModel>> actualizarLibroConPortadaJsonYArchivo(
            @PathVariable Long id,
            @RequestPart("publicacion") PublicacionModel publicacion,
            @RequestPart("libro") LibroModel libro,
            @RequestPart(name = "portada", required = false) FilePart portada
    ) {
        return libroService
                .actualizarPublicacionLibroYPortada(id, publicacion, libro, portada)
                .map(updated -> ResponseEntity.ok(updated));
    }

    
    // ---------- ARTICULO ----------
    @GetMapping("/articulo/lista")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Flux<ArticuloService.ArticuloWithPublicacion> obtenerArticuloLista() {
        return articuloService.listar();
    }


    @GetMapping("/articulo/{id}")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Mono<ArticuloService.ArticuloWithPublicacion> obtenerArticuloPorId(@PathVariable Long id) {
        return articuloService.obtenerPorId(id);
    }
    
    @PostMapping( value = "/articulo/crear2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<ArticuloModel>> crearArticuloConPortadaJsonYArchivo(
            @RequestPart("publicacion") PublicacionModel publicacion,
            @RequestPart("articulo") ArticuloModel articulo,
            @RequestPart("portada") FilePart portada
    ) {
        return articuloService
                .crearPublicacionArticuloYPortada(publicacion, articulo, portada)
                .map(saved -> ResponseEntity.status(201).body(saved));
    }
    
    @PutMapping(
            value = "/articulo/actualizar/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<ArticuloModel>> actualizarArticuloConPortadaJsonYArchivo(
            @PathVariable Long id,
            @RequestPart("publicacion") PublicacionModel publicacion,
            @RequestPart("articulo") ArticuloModel articulo,
            @RequestPart(name = "portada", required = false) FilePart portada
    ) {
        return articuloService
                .actualizarPublicacionArticuloYPortada(id, publicacion, articulo, portada)
                .map(updated -> ResponseEntity.ok(updated));
    }
    
    // ---------- TESIS ----------
    @GetMapping(value = "/tesis/lista", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Flux<TesisService.TesisWithPublicacion> obtenerTesisLista() {
        return tesisService.listar();
    }


    @GetMapping("/tesis/{id}")
    @PreAuthorize("hasAnyRole('LECTOR','BIBLIOTECARIO','ADMIN')")
    public Mono<TesisService.TesisWithPublicacion> obtenerTesisPorId(@PathVariable Long id) {
        return tesisService.obtenerPorId(id);
    }
    
    @PostMapping( value = "/tesis/crear2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<TesisModel>> crearTesisConPortadaJsonYArchivo(
            @RequestPart("publicacion") PublicacionModel publicacion,
            @RequestPart("tesis") TesisModel tesis,
            @RequestPart("portada") FilePart portada
    ) {
        return tesisService
                .crearPublicacionTesisYPortada(publicacion, tesis, portada)
                .map(saved -> ResponseEntity.status(201).body(saved));
    }
    
    @PutMapping(
            value = "/tesis/actualizar/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasAnyRole('BIBLIOTECARIO','ADMIN')")
    public Mono<ResponseEntity<TesisModel>> actualizarTesisConPortadaJsonYArchivo(
            @PathVariable Long id,
            @RequestPart("publicacion") PublicacionModel publicacion,
            @RequestPart("tesis") TesisModel tesis,
            @RequestPart(name = "portada", required = false) FilePart portada
    ) {
        return tesisService
                .actualizarPublicacionTesisYPortada(id, publicacion, tesis, portada)
                .map(updated -> ResponseEntity.ok(updated));
    }
}
