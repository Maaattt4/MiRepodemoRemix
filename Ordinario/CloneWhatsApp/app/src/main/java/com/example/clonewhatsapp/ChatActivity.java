package com.example.clonewhatsapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class ChatActivity extends AppCompatActivity {

    private RecyclerView rvMensajes;
    private EditText etEscribirMensaje;
    private Button btnEnviar; // Cambiado a Button para coincidir con tu XML
    private TextView tvNombreDestino;

    private MensajeAdapter adapter;
    private List<Mensaje> listaMensajes;

    private String idConversacion;
    private String miUsuarioId;
    private String miToken;

    private android.os.Handler handler = new android.os.Handler();
    private Runnable actualizadorDeMensajes;

    private final String SUPABASE_URL = "https://azbyrfczkruskdbkrwcn.supabase.co";
    private final String SUPABASE_KEY = "sb_publishable_KcER3YV1UhdIOC_Qq8HGcQ_-lUb7D78";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        // 1. Enlazar vistas
        tvNombreDestino = findViewById(R.id.tvNombreDestino);
        rvMensajes = findViewById(R.id.rvMensajes);
        etEscribirMensaje = findViewById(R.id.etEscribirMensaje);
        btnEnviar = findViewById(R.id.btnEnviar);

        TextView btnRegresar = findViewById(R.id.btnRegresar);
        btnRegresar.setOnClickListener(v -> finish());

        // 2. Obtener datos de SharedPreferences y del Intent
        SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
        miToken = prefs.getString("ACCESS_TOKEN", "");
        miUsuarioId = prefs.getString("USER_ID", "");

        idConversacion = getIntent().getStringExtra("ID_CONVERSACION");
        String nombreDestino = getIntent().getStringExtra("NOMBRE_DESTINATARIO");

        tvNombreDestino.setText(nombreDestino != null ? nombreDestino : "Chat");

        // 3. Configurar RecyclerView
        listaMensajes = new ArrayList<>();
        rvMensajes.setLayoutManager(new LinearLayoutManager(this));
        adapter = new MensajeAdapter(listaMensajes, miUsuarioId);
        rvMensajes.setAdapter(adapter);

        // 4. Configurar el botón de enviar
        btnEnviar.setOnClickListener(v -> {
            String textoMensaje = etEscribirMensaje.getText().toString().trim();
            if (!textoMensaje.isEmpty()) {
                enviarMensajeBaseDatos(textoMensaje);
                etEscribirMensaje.setText(""); // Limpiar la caja de texto
            }
        });

        // 5. Descargar los mensajes antiguos
        obtenerMensajes();
        // 6. Configurar la actualización automática (Polling) cada 3 segundos
        actualizadorDeMensajes = new Runnable() {
            @Override
            public void run() {
                obtenerMensajes(); // Descarga los mensajes
                handler.postDelayed(this, 3000); // Se vuelve a ejecutar en 3 segundos
            }
        };
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Iniciar el actualizador cuando la pantalla está visible
        if (actualizadorDeMensajes != null) {
            handler.postDelayed(actualizadorDeMensajes, 3000);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Detener el actualizador si el usuario sale de la pantalla
        if (actualizadorDeMensajes != null) {
            handler.removeCallbacks(actualizadorDeMensajes);
        }
    }

    private void enviarMensajeBaseDatos(String texto) {
        new Thread(() -> {
            try {
                URL url = new URL(SUPABASE_URL + "/rest/v1/messages");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("apikey", SUPABASE_KEY);
                conn.setRequestProperty("Authorization", "Bearer " + miToken);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // Construimos el JSON para insertar en la tabla messages
                String jsonBody = "{"
                        + "\"conversacion_id\":\"" + idConversacion + "\","
                        + "\"sender_id\":\"" + miUsuarioId + "\","
                        + "\"content\":\"" + texto + "\""
                        + "}";

                OutputStream os = conn.getOutputStream();
                os.write(jsonBody.getBytes("UTF-8"));
                os.close();

                int responseCode = conn.getResponseCode();

                if (responseCode == 201 || responseCode == 200) {
                    // Si se envió correctamente a la BD, lo agregamos a la pantalla localmente
                    runOnUiThread(() -> {
                        listaMensajes.add(new Mensaje(miUsuarioId, texto));
                        adapter.notifyItemInserted(listaMensajes.size() - 1);
                        rvMensajes.scrollToPosition(listaMensajes.size() - 1);
                    });
                } else {
                    runOnUiThread(() -> Toast.makeText(ChatActivity.this, "Error al enviar: " + responseCode, Toast.LENGTH_SHORT).show());
                }
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> Toast.makeText(ChatActivity.this, "Error de red", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    private void obtenerMensajes() {
        new Thread(() -> {
            try {
                // Pedimos los mensajes de esta conversación ordenados por fecha de creación (los más antiguos primero)
                URL url = new URL(SUPABASE_URL + "/rest/v1/messages?conversacion_id=eq." + idConversacion + "&select=*&order=created_at.asc");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("apikey", SUPABASE_KEY);
                conn.setRequestProperty("Authorization", "Bearer " + miToken);

                int responseCode = conn.getResponseCode();

                if (responseCode == 200) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    org.json.JSONArray jsonArray = new org.json.JSONArray(response.toString());

                    runOnUiThread(() -> {
                        try {
                            // Solo actualizamos si la cantidad de mensajes descargados es diferente a los que ya tenemos
                            if (jsonArray.length() != listaMensajes.size()) {
                                listaMensajes.clear();
                                for (int i = 0; i < jsonArray.length(); i++) {
                                    org.json.JSONObject msgJson = jsonArray.getJSONObject(i);
                                    String senderId = msgJson.optString("sender_id", "");
                                    String content = msgJson.optString("content", "");

                                    listaMensajes.add(new Mensaje(senderId, content));
                                }
                                adapter.notifyDataSetChanged();

                                if (!listaMensajes.isEmpty()) {
                                    rvMensajes.scrollToPosition(listaMensajes.size() - 1);
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> Toast.makeText(ChatActivity.this, "Error al cargar historial", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }
}