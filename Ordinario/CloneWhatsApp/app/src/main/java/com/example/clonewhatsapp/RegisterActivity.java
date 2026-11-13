package com.example.clonewhatsapp;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class RegisterActivity extends AppCompatActivity {

    private EditText etCorreo, etPass1, etPass2;
    private Button btnCrearCuenta;

    private final String SUPABASE_URL = "https://azbyrfczkruskdbkrwcn.supabase.co";
    private final String SUPABASE_KEY = "sb_publishable_KcER3YV1UhdIOC_Qq8HGcQ_-lUb7D78";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        etCorreo = findViewById(R.id.etRegCorreo);
        etPass1 = findViewById(R.id.etRegPassword1);
        etPass2 = findViewById(R.id.etRegPassword2);
        btnCrearCuenta = findViewById(R.id.btnCrearCuenta);

        btnCrearCuenta.setOnClickListener(v -> {
            String correo = etCorreo.getText().toString().trim();
            String pass1 = etPass1.getText().toString().trim();
            String pass2 = etPass2.getText().toString().trim();

            if (correo.isEmpty() || pass1.isEmpty() || pass2.isEmpty()) {
                Toast.makeText(this, "Llena todos los campos", Toast.LENGTH_SHORT).show();
                return;
            }
            if (!pass1.equals(pass2)) {
                Toast.makeText(this, "Las contraseñas no coinciden", Toast.LENGTH_SHORT).show();
                return;
            }
            if (pass1.length() < 6) {
                Toast.makeText(this, "La contraseña debe tener al menos 6 caracteres", Toast.LENGTH_SHORT).show();
                return;
            }

            registrarUsuario(correo, pass1);
        });
    }

    private void registrarUsuario(String email, String password) {
        new Thread(() -> {
            try {
                URL url = new URL(SUPABASE_URL + "/auth/v1/signup");
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

                runOnUiThread(() -> {
                    if (responseCode == 200 || responseCode == 201) {
                        Toast.makeText(this, "¡Cuenta creada! Ahora inicia sesión.", Toast.LENGTH_LONG).show();
                        finish(); // Cierra esta pantalla y regresa al MainActivity
                    } else {
                        Toast.makeText(this, "Error en el registro: " + responseCode, Toast.LENGTH_LONG).show();
                    }
                });
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error de red: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }
}