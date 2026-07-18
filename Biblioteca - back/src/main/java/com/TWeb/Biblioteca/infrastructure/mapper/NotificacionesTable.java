
package com.TWeb.Biblioteca.infrastructure.mapper;

import io.r2dbc.postgresql.codec.Json; 
import com.TWeb.Biblioteca.domain.model.NotificacionesModel;
import java.time.Instant;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table("notificacion")
public class NotificacionesTable {
    private Long id_notificacion;
    private Long usuario_id;
    private String tipo;
    private Json payload;
    private Boolean leido;
    private Instant leidoAt;
    private Instant createdAt;
    
    public NotificacionesTable(){
        
    }

    public NotificacionesTable(Long id_notificacion, Long usuario_id, String tipo, Json payload, Boolean leido, Instant leidoAt, Instant createdAt) {
        this.id_notificacion = id_notificacion;
        this.usuario_id = usuario_id;
        this.tipo = tipo;
        this.payload = payload;
        this.leido = leido;
        this.leidoAt = leidoAt;
        this.createdAt = createdAt;
    }
    
    public static NotificacionesTable fromDomainModel(NotificacionesModel notiModel){
        Json jsonPayload = notiModel.getPayload() != null
                ? Json.of(notiModel.getPayload())
                : null;

        return new NotificacionesTable(notiModel.getId_notificacion(), notiModel.getUsuario_id(),
                                    notiModel.getTipo(), jsonPayload, notiModel.getLeido(),
                                    notiModel.getLeidoAt(), notiModel.getCreatedAt());
    }
    
    public NotificacionesModel toDomainModel(){
        String payloadStr = (payload != null ? payload.asString() : null);
        return new NotificacionesModel(id_notificacion, usuario_id, tipo, payloadStr, leido, leidoAt, createdAt);
    }
    
    public Mono<NotificacionesModel> toMono(){
        return Mono.just(toDomainModel());
    }

    public Long getId_notificacion() {
        return id_notificacion;
    }

    public void setId_notificacion(Long id_notificacion) {
        this.id_notificacion = id_notificacion;
    }

    public Long getUsuario_id() {
        return usuario_id;
    }

    public void setUsuario_id(Long usuario_id) {
        this.usuario_id = usuario_id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Json getPayload() {
        return payload;
    }

    public void setPayload(Json payload) {
        this.payload = payload;
    }

    public Boolean getLeido() {
        return leido;
    }

    public void setLeido(Boolean leido) {
        this.leido = leido;
    }

    public Instant getLeidoAt() {
        return leidoAt;
    }

    public void setLeidoAt(Instant leidoAt) {
        this.leidoAt = leidoAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
