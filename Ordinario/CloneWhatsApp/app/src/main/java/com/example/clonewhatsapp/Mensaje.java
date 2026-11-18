package com.example.clonewhatsapp;

public class Mensaje {
    private String id;
    private String remitenteId;
    private String content;
    private String tipoMensaje = "texto";
    private boolean eliminado;

    public Mensaje(String id, String remitenteId, String content, String tipoMensaje, boolean eliminado) {
        this.id = id;
        this.remitenteId = remitenteId;
        this.content = content;
        this.tipoMensaje = tipoMensaje == null ? "texto" : tipoMensaje;
        this.eliminado = eliminado;
    }

    public String getId() { return id; }
    public String getRemitenteId() { return remitenteId; }
    public String getContent() { return content; }
    public boolean esImagen() { return "imagen".equals(tipoMensaje); }
    public boolean isEliminado() { return eliminado; }
    public void setEliminado(boolean eliminado) { this.eliminado = eliminado; }
}
