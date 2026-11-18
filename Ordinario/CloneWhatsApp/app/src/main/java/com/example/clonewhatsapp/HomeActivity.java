package com.example.clonewhatsapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity {

    private RecyclerView rvContactos;
    private List<Contacto> listaContactos;
    private ContactoAdapter adapter;
    private EditText etBuscarUsuario;

    private final String SUPABASE_URL = "https://azbyrfczkruskdbkrwcn.supabase.co";
    private final String SUPABASE_KEY = "sb_publishable_KcER3YV1UhdIOC_Qq8HGcQ_-lUb7D78";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        Ventana.aplicarInsets(this);

        // --- CÓDIGO CORREGIDO: Revisar si venimos de una notificación ---
        if (getIntent() != null && getIntent().hasExtra("conversacion_id")) {
            String conversacionId = getIntent().getStringExtra("conversacion_id");
            if (conversacionId != null && !conversacionId.isEmpty()) {
                abrirChatDesdeNotificacion(conversacionId);
            }
        }
        // -------------------------------------------------------------

        // 1. Inicializar la lista y conectar los elementos visuales
        listaContactos = new ArrayList<>();
        rvContactos = findViewById(R.id.rvContactos);
        rvContactos.setLayoutManager(new LinearLayoutManager(this));

        etBuscarUsuario = findViewById(R.id.etBuscarUsuario);
        Button btnCerrarSesion = findViewById(R.id.btnCerrarSesion);

        // 2. Obtener el token guardado
        SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
        String miToken = prefs.getString("ACCESS_TOKEN", "");

        // 3. Crear el adaptador UNA SOLA VEZ con la función de Supabase
        adapter = new ContactoAdapter(listaContactos, contacto -> {
            if (contacto.esGrupo()) {
                Intent i = new Intent(HomeActivity.this, ChatActivity.class);
                i.putExtra("ID_CONVERSACION", contacto.getId());
                i.putExtra("NOMBRE_DESTINATARIO", contacto.getUsername());
                startActivity(i);
                return;
            }
            Toast.makeText(HomeActivity.this, "Conectando con: " + contacto.getUsername(), Toast.LENGTH_SHORT).show();
            iniciarConversacion(contacto.getId(), contacto.getUsername(), miToken);
        });

        // 4. Conectar el adaptador a la pantalla
        rvContactos.setAdapter(adapter);

        // 5. Configurar el buscador
        etBuscarUsuario.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filtrar(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        // 6. Configurar el botón de cerrar sesión
        btnCerrarSesion.setOnClickListener(v -> {
            prefs.edit().clear().apply();
            Toast.makeText(HomeActivity.this, "Sesión cerrada", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(HomeActivity.this, MainActivity.class);
            if (getIntent() != null && getIntent().getExtras() != null) {
                intent.putExtras(getIntent().getExtras());
            }
            startActivity(intent);
            finish();
        });

        findViewById(R.id.fabNuevoGrupo).setOnClickListener(v ->
                startActivity(new Intent(HomeActivity.this, CrearGrupoActivity.class)));

        // Pedir FCM Token de Firebase
        com.google.firebase.messaging.FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        return;
                    }
                    String token = task.getResult();
                    System.out.println("MI TOKEN DE FIREBASE ES: " + token);

                    // Guardarlo en Supabase
                    guardarTokenEnSupabase(token);
                });
    }

    @Override
    protected void onResume() {
        super.onResume();
        obtenerContactos();
    }

    private List<Contacto> cargarGrupos(String token) {
        List<Contacto> grupos = new ArrayList<>();
        try {
            JSONArray a = new JSONArray(Http.call("GET", "/rest/v1/conversaciones?es_grupo=eq.true&select=id,name", token, null));
            for (int i = 0; i < a.length(); i++) {
                JSONObject g = a.getJSONObject(i);
                String n = g.isNull("name") ? "Grupo" : g.getString("name");
                grupos.add(new Contacto(g.getString("id"), n, "", true));
            }
        } catch (Exception ignored) {
        }
        return grupos;
    }

    private void filtrar(String texto) {
        List<Contacto> listaFiltrada = new ArrayList<>();
        for (Contacto contacto : listaContactos) {
            if (contacto.getUsername().toLowerCase().contains(texto.toLowerCase())) {
                listaFiltrada.add(contacto);
            }
        }
        adapter.filtrarLista(listaFiltrada);
    }

    private void obtenerContactos() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
                String token = prefs.getString("ACCESS_TOKEN", "");

                URL url = new URL(SUPABASE_URL + "/rest/v1/profiles?select=*");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("apikey", SUPABASE_KEY);
                conn.setRequestProperty("Authorization", "Bearer " + token);

                int responseCode = conn.getResponseCode();

                if (responseCode == 200) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    JSONArray jsonArray = new JSONArray(response.toString());
                    List<Contacto> nuevos = cargarGrupos(token);

                    for (int i = 0; i < jsonArray.length(); i++) {
                        JSONObject perfil = jsonArray.getJSONObject(i);
                        String id = perfil.optString("id", "");
                        String username = perfil.optString("username", "Sin nombre");
                        String avatarUrl = perfil.optString("avatar_url", "");

                        nuevos.add(new Contacto(id, username, avatarUrl));
                    }

                    runOnUiThread(() -> {
                        listaContactos.clear();
                        listaContactos.addAll(nuevos);
                        filtrar(etBuscarUsuario.getText().toString());
                    });
                } else {
                    runOnUiThread(() -> Toast.makeText(this, "Error al cargar contactos: " + responseCode, Toast.LENGTH_SHORT).show());
                }
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error de red: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }

    private void iniciarConversacion(String idDestino, String nombreDestino, String token) {
        new Thread(() -> {
            try {
                URL url = new URL(SUPABASE_URL + "/rest/v1/rpc/crear_conversacion_directa");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("apikey", SUPABASE_KEY);
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                String jsonBody = "{\"otro\":\"" + idDestino + "\"}";
                conn.getOutputStream().write(jsonBody.getBytes());

                int responseCode = conn.getResponseCode();
                if (responseCode == 200) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    String idConversacion = reader.readLine().replace("\"", "");
                    reader.close();

                    runOnUiThread(() -> {
                        Intent intent = new Intent(HomeActivity.this, ChatActivity.class);
                        intent.putExtra("ID_CONVERSACION", idConversacion);
                        intent.putExtra("ID_DESTINATARIO", idDestino);
                        intent.putExtra("NOMBRE_DESTINATARIO", nombreDestino);
                        startActivity(intent);
                    });
                } else {
                    runOnUiThread(() -> Toast.makeText(HomeActivity.this, "Error de BD: " + responseCode, Toast.LENGTH_SHORT).show());
                }
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> Toast.makeText(HomeActivity.this, "Error de red al crear chat", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    private void guardarTokenEnSupabase(String fcmToken) {
        SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", MODE_PRIVATE);
        String miUsuarioId = prefs.getString("USER_ID", "");
        String miTokenAuth = prefs.getString("ACCESS_TOKEN", "");

        if (miUsuarioId.isEmpty() || miTokenAuth.isEmpty()) return;

        new Thread(() -> {
            try {
                java.net.URL url = new java.net.URL(SUPABASE_URL + "/rest/v1/profiles?id=eq." + miUsuarioId);
                java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setRequestMethod("PATCH");
                conn.setRequestProperty("apikey", SUPABASE_KEY);
                conn.setRequestProperty("Authorization", "Bearer " + miTokenAuth);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                String jsonBody = "{\"fcm_token\":\"" + fcmToken + "\"}";

                java.io.OutputStream os = conn.getOutputStream();
                os.write(jsonBody.getBytes("UTF-8"));
                os.close();

                int responseCode = conn.getResponseCode();
                if (responseCode == 200 || responseCode == 204) {
                    System.out.println("ÉXITO: Token guardado en Supabase correctamente");
                } else {
                    System.out.println("ERROR al guardar token: " + responseCode);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent != null && intent.hasExtra("conversacion_id")) {
            String conversacionId = intent.getStringExtra("conversacion_id");
            if (conversacionId != null && !conversacionId.isEmpty()) {
                abrirChatDesdeNotificacion(conversacionId);
            }
        }
    }

    private void abrirChatDesdeNotificacion(String idConversacion) {
        Intent intent = new Intent(HomeActivity.this, ChatActivity.class);
        intent.putExtra("ID_CONVERSACION", idConversacion);
        intent.putExtra("ID_DESTINATARIO", "");
        intent.putExtra("NOMBRE_DESTINATARIO", "Nuevo Mensaje");
        startActivity(intent);
    }
}