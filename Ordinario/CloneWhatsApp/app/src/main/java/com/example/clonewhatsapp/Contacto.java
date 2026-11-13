package com.example.clonewhatsapp;

public class Contacto {
    private String id;
    private String username;
    private String avatarUrl;

    public Contacto(String id, String username, String avatarUrl) {
        this.id = id;
        this.username = username;
        this.avatarUrl = avatarUrl;
    }

    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getAvatarUrl() { return avatarUrl; }
}