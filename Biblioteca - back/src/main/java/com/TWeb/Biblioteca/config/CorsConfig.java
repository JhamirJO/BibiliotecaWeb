// com.TWeb.Biblioteca.config.CorsConfig.java
package com.TWeb.Biblioteca.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.List;

@Configuration
public class CorsConfig {

  @Bean
  public CorsWebFilter corsWebFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173")); // Vite
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization","Content-Type","Accept"));
    config.setAllowCredentials(true);
    config.setMaxAge(Duration.ofHours(1));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsWebFilter(source);
  }
}
