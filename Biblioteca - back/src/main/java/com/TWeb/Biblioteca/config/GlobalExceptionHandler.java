package com.TWeb.Biblioteca.config;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.regex.*;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataAccessException;
import org.springframework.http.*;
import org.springframework.r2dbc.BadSqlGrammarException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.*;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1) Errores lanzados explícitamente con ResponseStatusException
    @ExceptionHandler(ResponseStatusException.class)
    public Mono<ResponseEntity<Map<String, Object>>> handleRse(ResponseStatusException ex,
            ServerWebExchange exchange) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        String msg = sanitize(ex.getReason() != null ? ex.getReason() : deepMessage(ex));
        return Mono.just(build(status, msg, exchange, null));
    }

    // 2) Errores de validación (WebFlux)
    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ResponseEntity<Map<String, Object>>> handleBind(WebExchangeBindException ex,
            ServerWebExchange exchange) {
        String msg = ex.getFieldErrors().isEmpty()
                ? "Solicitud inválida"
                : ex.getFieldErrors().get(0).getField() + ": " + ex.getFieldErrors().get(0).getDefaultMessage();
        return Mono.just(build(HttpStatus.BAD_REQUEST, msg, exchange, "VALIDATION_ERROR"));
    }

    // 3) Errores de BD comunes
    @ExceptionHandler({DataAccessException.class, BadSqlGrammarException.class})
    public Mono<ResponseEntity<Map<String, Object>>> handleDb(Exception ex,
            ServerWebExchange exchange) {
        String raw = deepMessage(ex);
        String pretty = sanitize(raw);
        HttpStatus status = statusFromMessage(pretty); // mapea sanciones/stock/no existe

        return Mono.just(build(status, pretty, exchange, "DB_ERROR"));
    }

    // 4) Fallback: cualquier otro error
    @ExceptionHandler(Throwable.class)
    public Mono<ResponseEntity<Map<String, Object>>> handleAny(Throwable ex,
            ServerWebExchange exchange) {
        String pretty = sanitize(deepMessage(ex));
        HttpStatus status = statusFromMessage(pretty);
        return Mono.just(build(status, pretty, exchange, "UNEXPECTED_ERROR"));
    }

    // 401: user/pass incorrectos o usuario no existe
    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public Mono<ResponseEntity<Map<String, Object>>> handleAuth401(Exception ex, ServerWebExchange exchange) {
        return Mono.just(build(HttpStatus.UNAUTHORIZED, "Credenciales inválidas", exchange, "AUTH_BAD_CREDENTIALS"));
    }

    // 403: cuenta deshabilitada/bloqueada
    @ExceptionHandler({DisabledException.class, LockedException.class})
    public Mono<ResponseEntity<Map<String, Object>>> handleAuth403(Exception ex, ServerWebExchange exchange) {
        String msg = (ex instanceof DisabledException) ? "Cuenta deshabilitada" : "Cuenta bloqueada";
        return Mono.just(build(HttpStatus.FORBIDDEN, msg, exchange, "AUTH_FORBIDDEN"));
    }

    // 401: token/credenciales expiradas
    @ExceptionHandler({AccountExpiredException.class, CredentialsExpiredException.class})
    public Mono<ResponseEntity<Map<String, Object>>> handleAuthExpired(Exception ex, ServerWebExchange exchange) {
        return Mono.just(build(HttpStatus.UNAUTHORIZED, "Credenciales expiradas", exchange, "AUTH_EXPIRED"));
    }

    // (opcional) catch-all de auth → 401 genérico
    @ExceptionHandler(AuthenticationException.class)
    public Mono<ResponseEntity<Map<String, Object>>> handleAuthAny(AuthenticationException ex, ServerWebExchange exchange) {
        return Mono.just(build(HttpStatus.UNAUTHORIZED, "No autorizado", exchange, "AUTH_ERROR"));
    }

    // ---------- helpers ----------
    private ResponseEntity<Map<String, Object>> build(HttpStatus status,
            String message,
            ServerWebExchange exchange,
            String code) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("path", exchange != null ? exchange.getRequest().getPath().value() : "");
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        if (code != null) {
            body.put("code", code);
        }
        body.put("message", message);

        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    private String deepMessage(Throwable ex) {
        if (ex == null) {
            return "Ocurrió un error";
        }
        Throwable root = ex;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        return root.getMessage() != null ? root.getMessage() : ex.toString();
    }

    // ...
    private String sanitize(String raw) {
        if (raw == null) {
            return "Ocurrió un error al procesar la solicitud";
        }
        String msg = raw.replaceAll("\\s+", " ").trim();

        // Quitar ruido técnico frecuente
        msg = msg
                .replaceFirst("(?i)executeMany;.*?\\];\\s*", "")
                .replaceFirst("(?i)SQL\\s*\\[[^\\]]+\\]\\s*;\\s*", "")
                .replaceFirst("(?i)org\\.[^:]+:\\s*", "")
                .replaceFirst("(?i)reactor\\.[^:]+:\\s*", "")
                .replaceFirst("(?i)io\\.[^:]+:\\s*", "");

        // Frases de negocio a priorizar (incluye nuevos casos multi)
        Matcher m = Pattern.compile(
                "("
                + "El usuario alcanzó el límite diario"
                + "|El usuario alcanzó el límite semanal"
                + "|El usuario está sancionado[^.]*"
                + "|No hay stock[^.]*"
                + "|Stock insuficiente[^.]*"
                + "|No existe usuario con DNI[^.]*"
                + "|El DNI[^.]*no existe[^.]*"
                + "|Los siguientes id_pub no existen: ?\\{?[^}]*\\}?"
                + "|Debe enviar al menos un id de publicación"
                + "|Ya tiene[^.]*pendiente"
                + ")",
                Pattern.CASE_INSENSITIVE
        ).matcher(msg);
        if (m.find()) {
            return m.group(1).trim();
        }

        // Limpieza adicional si viene con "ERROR:" o "DETAIL:"
        msg = msg.replaceFirst(".*?(?:DETAIL|ERROR|Detail):\\s*", "");

        if (msg.isBlank()) {
            msg = "Ocurrió un error al procesar la solicitud";
        }
        return msg;
    }

    private HttpStatus statusFromMessage(String msg) {
        String m = msg == null ? "" : msg.toLowerCase();

        // NOT FOUND
        if (m.contains("no existe usuario con dni") || m.contains("id_pub no existen") || m.contains("no existe")) {
            return HttpStatus.NOT_FOUND;
        }

        // CONFLICT (reglas de negocio)
        if (m.contains("límite diario") || m.contains("limite diario")) {
            return HttpStatus.CONFLICT;
        }
        if (m.contains("límite semanal") || m.contains("limite semanal")) {
            return HttpStatus.CONFLICT;
        }
        if (m.contains("sancion") || m.contains("sancionado")) {
            return HttpStatus.CONFLICT;
        }
        if (m.contains("stock")) {
            return HttpStatus.CONFLICT;
        }
        if (m.contains("ya tiene") && m.contains("pendiente")) {
            return HttpStatus.CONFLICT;
        }

        // BAD REQUEST (payload inválido)
        if (m.contains("debe enviar al menos un id de publicación")
                || m.contains("formato")
                || m.contains("inválid")
                || m.contains("invalido")) {
            return HttpStatus.BAD_REQUEST;
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
