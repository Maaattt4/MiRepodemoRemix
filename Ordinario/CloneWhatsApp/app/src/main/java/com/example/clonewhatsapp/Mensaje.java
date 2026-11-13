package com.example.clonewhatsapp;

public class Mensaje {
    private String remitenteId;
    private String content;

    public Mensaje(String remitenteId, String content) {
        this.remitenteId = remitenteId;
        this.content = content;
    }

    public String getRemitenteId() { return remitenteId; }
    public String getContent() { return content; }
}