package com.TWeb.Biblioteca.domain.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;


public class PrestamoModel {
    private Long id_p;
    private Long cod_pub;
    private String dni_p;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha_p;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha_max;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha_e;
    private String estado;
    private Long comprobante_id;
    
    public PrestamoModel(){
        
    }

    public PrestamoModel(Long id_p, Long cod_pub, String dni_p, LocalDate fecha_p, LocalDate fecha_max, LocalDate fecha_e, String estado, Long comprobante_id) {
        this.id_p = id_p;
        this.cod_pub = cod_pub;
        this.dni_p = dni_p;
        this.fecha_p = fecha_p;
        this.fecha_max = fecha_max;
        this.fecha_e = fecha_e;
        this.estado = estado;
        this.comprobante_id = comprobante_id;
    }

    public Long getId_p() {
        return id_p;
    }

    public void setId_p(Long id_p) {
        this.id_p = id_p;
    }

    public Long getCod_pub() {
        return cod_pub;
    }

    public void setCod_pub(Long cod_pub) {
        this.cod_pub = cod_pub;
    }

    public String getDni_p() {
        return dni_p;
    }

    public void setDni_p(String dni_p) {
        this.dni_p = dni_p;
    }

    public LocalDate getFecha_p() {
        return fecha_p;
    }

    public void setFecha_p(LocalDate fecha_p) {
        this.fecha_p = fecha_p;
    }

    public LocalDate getFecha_max() {
        return fecha_max;
    }

    public void setFecha_max(LocalDate fecha_max) {
        this.fecha_max = fecha_max;
    }

    public LocalDate getFecha_e() {
        return fecha_e;
    }

    public void setFecha_e(LocalDate fecha_e) {
        this.fecha_e = fecha_e;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Long getComprobante_id() {
        return comprobante_id;
    }

    public void setComprobante_id(Long comprobante_id) {
        this.comprobante_id = comprobante_id;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        PrestamoModel newPrestamo = new PrestamoModel();
        
        newPrestamo.setId_p(id_p);
        newPrestamo.setCod_pub(cod_pub);
        newPrestamo.setDni_p(dni_p);
        newPrestamo.setFecha_p(fecha_p);
        newPrestamo.setFecha_max(fecha_max);
        newPrestamo.setFecha_e(fecha_e);
        newPrestamo.setEstado(estado);
        newPrestamo.setComprobante_id(comprobante_id);
        
        return newPrestamo;
    }
}
