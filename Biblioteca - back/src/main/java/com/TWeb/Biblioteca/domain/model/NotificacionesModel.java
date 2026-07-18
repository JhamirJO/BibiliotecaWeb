
package com.TWeb.Biblioteca.domain.model;


import java.time.Instant;


public class NotificacionesModel {
    
    private Long id_notificacion;
    private Long usuario_id;
    private String tipo;
    private String payload;
    private Boolean leido;
    private Instant leidoAt;
    private Instant createdAt;
    
    public NotificacionesModel(){
        
    }

    public NotificacionesModel(Long id_notificacion, Long usuario_id, String tipo, String payload, Boolean leido, Instant leidoAt, Instant createdAt) {
        this.id_notificacion = id_notificacion;
        this.usuario_id = usuario_id;
        this.tipo = tipo;
        this.payload = payload;
        this.leido = leido;
        this.leidoAt = leidoAt;
        this.createdAt = createdAt;
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

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
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
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        NotificacionesModel newNoti = new NotificacionesModel();

        newNoti.setId_notificacion(id_notificacion);
        newNoti.setUsuario_id(usuario_id);
        newNoti.setTipo(tipo);
        newNoti.setPayload(payload);
        newNoti.setLeido(leido);
        newNoti.setLeidoAt(leidoAt);
        newNoti.setCreatedAt(createdAt);
        
        return newNoti;
    }
}
