package com.example.clonewhatsapp;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Http {

    private static SharedPreferences prefs;

    public static void init(Context c) {
        prefs = c.getApplicationContext().getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
    }

    public static String token(String fallback) {
        return prefs == null ? fallback : prefs.getString("ACCESS_TOKEN", fallback);
    }

    public static synchronized boolean refrescar() {
        try {
            if (prefs == null) return false;
            String rt = prefs.getString("REFRESH_TOKEN", "");
            if (rt.isEmpty()) return false;
            HttpURLConnection c = (HttpURLConnection) new URL(ImagenUtil.SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token").openConnection();
            c.setRequestMethod("POST");
            c.setRequestProperty("apikey", ImagenUtil.SUPABASE_KEY);
            c.setRequestProperty("Content-Type", "application/json");
            c.setDoOutput(true);
            try (OutputStream os = c.getOutputStream()) {
                os.write(new JSONObject().put("refresh_token", rt).toString().getBytes("UTF-8"));
            }
            if (c.getResponseCode() != 200) return false;
            JSONObject j = new JSONObject(leer(c.getInputStream()));
            prefs.edit()
                    .putString("ACCESS_TOKEN", j.getString("access_token"))
                    .putString("REFRESH_TOKEN", j.getString("refresh_token"))
                    .apply();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static String call(String metodo, String path, String token, String body) throws Exception {
        return ejecutar(metodo, path, token, body, "return=representation");
    }

    public static String enviar(String metodo, String path, String token, String body) throws Exception {
        return ejecutar(metodo, path, token, body, "return=minimal");
    }

    private static String ejecutar(String metodo, String path, String token, String body, String prefer) throws Exception {
        for (int intento = 0; intento < 2; intento++) {
            HttpURLConnection c = (HttpURLConnection) new URL(ImagenUtil.SUPABASE_URL + path).openConnection();
            c.setRequestMethod(metodo);
            c.setRequestProperty("apikey", ImagenUtil.SUPABASE_KEY);
            c.setRequestProperty("Authorization", "Bearer " + token(token));
            c.setRequestProperty("Content-Type", "application/json");
            c.setRequestProperty("Prefer", prefer);
            if (body != null) {
                c.setDoOutput(true);
                try (OutputStream os = c.getOutputStream()) {
                    os.write(body.getBytes("UTF-8"));
                }
            }
            int code = c.getResponseCode();
            InputStream is = code >= 400 ? c.getErrorStream() : c.getInputStream();
            String res = is == null ? "" : leer(is);
            if (code == 401 && intento == 0 && refrescar()) continue;
            if (code >= 400) throw new Exception("HTTP " + code + " " + res);
            return res;
        }
        throw new Exception("Sesión expirada");
    }

    private static String leer(InputStream is) throws Exception {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int n;
        while ((n = is.read(buf)) != -1) bos.write(buf, 0, n);
        is.close();
        return bos.toString("UTF-8");
    }
}
