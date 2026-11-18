package com.example.clonewhatsapp;

public class Contacto {
    private String id;
    private String username;
    private String avatarUrl;
    private boolean esGrupo;

    public Contacto(String id, String username, String avatarUrl) {
        this(id, username, avatarUrl, false);
    }

    public Contacto(String id, String username, String avatarUrl, boolean esGrupo) {
        this.id = id;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.esGrupo = esGrupo;
    }

    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getAvatarUrl() { return avatarUrl; }
    public boolean esGrupo() { return esGrupo; }
}
