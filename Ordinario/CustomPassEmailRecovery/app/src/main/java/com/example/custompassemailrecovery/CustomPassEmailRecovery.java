package com.example.custompassemailrecovery;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CustomPassEmailRecovery extends AppCompatActivity {

    private EditText editTextNuevaPass;
    private Button btnGuardarPass;
    private String accessTokenRecibido = null;

    // REEMPLAZA CON TUS CREDENCIALES
    // REEMPLAZA CON TUS CREDENCIALES
    private final String SUPABASE_URL = "https://fuegadzsxpqenqcsktfk.supabase.co/auth/v1/user";
    private final String SUPABASE_API_KEY = "sb_publishable_b7noYDlJ2NnTEI0iB_twfg_YCPwQMgP";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_custom_pass_email_recovery);

        editTextNuevaPass = findViewById(R.id.editTextNuevaPass); // Cambia por el ID de tu XML
        btnGuardarPass = findViewById(R.id.btnGuardarPass);       // Cambia por el ID de tu XML

        // 1. Capturar el enlace (Deep Link) con el que se abrió la app
        Intent intent = getIntent();
        Uri data = intent.getData();

        if (data != null && data.getFragment() != null) {
            // Supabase manda los tokens después del símbolo # (fragment)
            String fragment = data.getFragment();
            accessTokenRecibido = extraerParametro(fragment, "access_token");
        }

        // Si no hay token, podrías mostrar un error y cerrar la pantalla
        if (accessTokenRecibido == null) {
            Toast.makeText(this, "Enlace inválido o expirado", Toast.LENGTH_LONG).show();
            btnGuardarPass.setEnabled(false);
        }

        // 2. Configurar el botón para guardar la nueva contraseña
        btnGuardarPass.setOnClickListener(v -> {
            String nuevaContrasena = editTextNuevaPass.getText().toString().trim();
            if (nuevaContrasena.length() >= 6) { // Supabase pide mínimo 6 caracteres por defecto
                actualizarContrasena(nuevaContrasena);
            } else {
                Toast.makeText(this, "La contraseña debe tener al menos 6 caracteres", Toast.LENGTH_SHORT).show();
            }
        });
    }

    // Método auxiliar para buscar el access_token en el fragmento de la URL
    private String extraerParametro(String fragment, String parametro) {
        for (String par : fragment.split("&")) {
            String[] claveValor = par.split("=");
            if (claveValor.length == 2 && claveValor[0].equals(parametro)) {
                return claveValor[1];
            }
        }
        return null;
    }

    // 3. Método para enviar la nueva contraseña a Supabase
    private void actualizarContrasena(String nuevaContrasena) {
        btnGuardarPass.setEnabled(false); // Deshabilitar botón para evitar dobles clics

        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                JSONObject jsonBody = new JSONObject();
                jsonBody.put("password", nuevaContrasena);

                RequestBody body = RequestBody.create(
                        jsonBody.toString(),
                        MediaType.parse("application/json")
                );

                // IMPORTANTE: Hacemos un PUT usando el access_token en el Header Authorization
                Request request = new Request.Builder()
                        .url(SUPABASE_URL)
                        .addHeader("apikey", SUPABASE_API_KEY)
                        .addHeader("Authorization", "Bearer " + accessTokenRecibido)
                        .addHeader("Content-Type", "application/json")
                        .put(body) // Es PUT para actualizar el usuario
                        .build();

                OkHttpClient client = new OkHttpClient();
                Response response = client.newCall(request).execute();

                if (response.isSuccessful()) {
                    runOnUiThread(() -> {
                        Toast.makeText(this, "¡Contraseña actualizada exitosamente!", Toast.LENGTH_LONG).show();
                        // Aquí puedes redirigir al Login y cerrar esta pantalla
                        finish();
                    });
                } else {
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Error al actualizar: " + response.code(), Toast.LENGTH_LONG).show();
                        btnGuardarPass.setEnabled(true);
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(this, "Error de conexión", Toast.LENGTH_LONG).show();
                    btnGuardarPass.setEnabled(true);
                });
            }
        });
    }
}