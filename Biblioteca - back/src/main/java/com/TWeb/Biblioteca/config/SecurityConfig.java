// com.TWeb.Biblioteca.config.SecurityConfig.java
package com.TWeb.Biblioteca.config;

import com.TWeb.Biblioteca.infrastructure.repository.UsuarioRepository;
import com.TWeb.Biblioteca.security.JwtReactiveAuthenticationManager;
import com.TWeb.Biblioteca.security.JwtServerAuthenticationConverter;
import com.TWeb.Biblioteca.security.JwtService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import reactor.core.publisher.Mono;

@EnableWebFluxSecurity
@Configuration
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Bean("jwtReactiveAuthenticationManager")
    public ReactiveAuthenticationManager jwtReactiveAuthenticationManager(
            UsuarioRepository usersRepo,
            JwtService jwt
    ) {
        return new JwtReactiveAuthenticationManager(usersRepo, jwt);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Primary
    public UserDetailsRepositoryReactiveAuthenticationManager authManager(
            ReactiveUserDetailsService uds,
            PasswordEncoder encoder
    ) {
        var mgr = new UserDetailsRepositoryReactiveAuthenticationManager(uds);
        mgr.setPasswordEncoder(encoder);
        return mgr;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(
            ServerHttpSecurity http,
            JwtService jwtService,
            @Qualifier("jwtReactiveAuthenticationManager") ReactiveAuthenticationManager jwtAuthManager,
            UserDetailsRepositoryReactiveAuthenticationManager authManager
    ) {

        var converter = new JwtServerAuthenticationConverter(jwtService); // debe retornar Mono.empty() si no hay Bearer
        var jwtFilter = new AuthenticationWebFilter(jwtAuthManager);
        jwtFilter.setServerAuthenticationConverter(converter);

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .cors(Customizer.withDefaults())
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance()) // stateless
                .authenticationManager(authManager)
                .exceptionHandling(ex -> ex
                .authenticationEntryPoint((exchange, e) -> {
                    var res = exchange.getResponse();
                    res.setStatusCode(HttpStatus.UNAUTHORIZED);
                    res.getHeaders().setContentType(MediaType.APPLICATION_JSON);
                    var buf = res.bufferFactory().wrap("{\"message\":\"No autorizado\"}".getBytes());
                    return res.writeWith(Mono.just(buf));
                })
                .accessDeniedHandler((exchange, e) -> {
                    var res = exchange.getResponse();
                    res.setStatusCode(HttpStatus.FORBIDDEN);
                    res.getHeaders().setContentType(MediaType.APPLICATION_JSON);
                    var buf = res.bufferFactory().wrap("{\"message\":\"Acceso denegado\"}".getBytes());
                    return res.writeWith(Mono.just(buf));
                })
                )
                .authorizeExchange(ex -> ex
                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .pathMatchers("/api-auth/**", "/actuator/**","api-pub/portada/{codPub}").permitAll()
                .pathMatchers("/api-admin/**").permitAll()
                .pathMatchers("/api-biblio/**","/api-user/**").authenticated()
                .pathMatchers("/api-noti/**").authenticated()
                .pathMatchers("/api-pub/**", "/api-pres/**", "/api-dev/**", "/api-lector/**").authenticated()
                .anyExchange().authenticated()
                )
                .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
