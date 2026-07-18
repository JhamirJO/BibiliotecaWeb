// com.TWeb.Biblioteca.security.JwtService.java
package com.TWeb.Biblioteca.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {
    private final SecretKey key;
    
    public JwtService(@Value("${app.jwt.secret-base64}") String b64) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(b64));
    }
    private final long EXP_SECONDS = 60 * 60 * 1; // 1h

    public String generateToken(UserDetails user, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(user.getUsername())
                .addClaims(Map.of("role", role))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(EXP_SECONDS)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public String extractRole(String token) {
        Object r = Jwts.parser().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("role");
        return r == null ? null : r.toString();
    }

    public boolean isValid(String token, UserDetails user) {
        try {
            var claims = Jwts.parser().setSigningKey(key).build()
                    .parseClaimsJws(token).getBody();
            return user.getUsername().equals(claims.getSubject()) && claims.getExpiration().after(new Date());
        } catch (JwtException e) {
            return false;
        }
    }
}
