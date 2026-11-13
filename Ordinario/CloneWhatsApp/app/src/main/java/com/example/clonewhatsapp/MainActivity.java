package com.example.clonewhatsapp;

import java.io.InputStream;
import java.util.Scanner;
import org.json.JSONArray;
import org.json.JSONObject;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private EditText etCorreo, etPassword;
    private Button btnRegistrar, btnIniciarSesion, btnRecuperar;

    private final String SUPABASE_URL = "https://azbyrfczkruskdbkrwcn.supabase.co";
    private final String SUPABASE_KEY = "sb_publishable_KcER3YV1UhdIOC_Qq8HGcQ_-lUb7D78";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
        String token = prefs.getString("ACCESS_TOKEN", null);
        String userId = prefs.getString("USER_ID", null);

        if (token != null && userId != null) {
            Toast.makeText(this, "Sesión activa...", Toast.LENGTH_SHORT).show();
            // Al abrir la app, verificamos si ya configuró su perfil
            verificarSiEsUsuarioNuevo(token, userId);
        }

        etCorreo = findViewById(R.id.etCorreo);
        etPassword = findViewById(R.id.etPassword);
        btnIniciarSesion = findViewById(R.id.btnIniciarSesion);
        btnRegistrar = findViewById(R.id.btnRegistrar);
        btnRecuperar = findViewById(R.id.btnRecuperar);

        // SALTO A LA NUEVA PANTALLA DE REGISTRO
        btnRegistrar.setOnClickListener(v -> {
            startActivity(new Intent(MainActivity.this, RegisterActivity.class));
        });

        btnIniciarSesion.setOnClickListener(v -> {
            String correo = etCorreo.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (correo.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Llena todos los campos", Toast.LENGTH_SHORT).show();
                return;
            }
            iniciarSesionUsuario(correo, password);
        });

        btnRecuperar.setOnClickListener(v -> {
            String correo = etCorreo.getText().toString().trim();
            if (correo.isEmpty()) {
                Toast.makeText(this, "Ingresa tu correo para recuperar la contraseña", Toast.LENGTH_SHORT).show();
                return;
            }
            recuperarPassword(correo);
        });
    }

    private void iniciarSesionUsuario(String email, String password) {
        new Thread(() -> {
            try {
                URL url = new URL(SUPABASE_URL + "/auth/v1/token?grant_type=password");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("apikey", SUPABASE_KEY);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                String jsonBody = "{\"email\":\"" + email + "\", \"password\":\"" + password + "\"}";

                OutputStream os = conn.getOutputStream();
                os.write(jsonBody.getBytes());
                os.flush();
                os.close();

                int responseCode = conn.getResponseCode();

                if (responseCode == 200) {
                    InputStream is = conn.getInputStream();
                    Scanner scanner = new Scanner(is);
                    String responseBody = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
                    scanner.close();

                    JSONObject jsonObject = new JSONObject(responseBody);
                    String accessToken = jsonObject.getString("access_token");
                    // Extraer el ID del usuario directamente de la respuesta
                    String userId = jsonObject.getJSONObject("user").getString("id");

                    SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
                    prefs.edit().putString("ACCESS_TOKEN", accessToken).putString("USER_ID", userId).apply();

                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "¡Inicio exitoso!", Toast.LENGTH_SHORT).show());

                    // Comprobar a qué pantalla debe ir
                    verificarSiEsUsuarioNuevo(accessToken, userId);

                } else {
                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "Credenciales incorrectas", Toast.LENGTH_LONG).show());
                }
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }

    private void verificarSiEsUsuarioNuevo(String token, String userId) {
        new Thread(() -> {
            try {
                URL url = new URL(SUPABASE_URL + "/rest/v1/profiles?id=eq." + userId);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("apikey", SUPABASE_KEY);
                conn.setRequestProperty("Authorization", "Bearer " + token);

                int responseCode = conn.getResponseCode();
                if (responseCode == 200) {
                    InputStream is = conn.getInputStream();
                    Scanner scanner = new Scanner(is);
                    String responseBody = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "[]";
                    scanner.close();

                    JSONArray jsonArray = new JSONArray(responseBody);

                    runOnUiThread(() -> {
                        boolean faltaPerfil = true; // Por defecto asumimos que le falta configurar algo

                        if (jsonArray.length() > 0) {
                            try {
                                JSONObject perfil = jsonArray.getJSONObject(0);
                                String username = perfil.optString("username", "");
                                String avatarUrl = perfil.optString("avatar_url", "");

                                // Para considerar que el perfil está completo, DEBE tener apodo Y foto
                                if (!username.isEmpty() && !username.equals("null") &&
                                        !avatarUrl.isEmpty() && !avatarUrl.equals("null")) {
                                    faltaPerfil = false;
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }

                        Intent intent;
                        if (faltaPerfil) {
                            // Le falta la foto (o el apodo), lo mandamos a la pantalla de perfil
                            intent = new Intent(MainActivity.this, ProfileActivity.class);
                        } else {
                            // Tiene ambos datos, va directo a sus contactos
                            intent = new Intent(MainActivity.this, HomeActivity.class);
                        }

                        // --- CÓDIGO NUEVO: Pasar el ID de la notificación a la siguiente pantalla ---
                        if (getIntent() != null && getIntent().hasExtra("conversacion_id")) {
                            intent.putExtra("conversacion_id", getIntent().getStringExtra("conversacion_id"));
                        }
                        // ----------------------------------------------------------------------------

                        startActivity(intent);
                        finish();
                    });
                }
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Error verificando perfil", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    private void recuperarPassword(String email) {
        // (Tu código original de recuperar contraseña se queda igual aquí)
    }
}