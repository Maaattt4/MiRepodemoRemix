package com.example.clonewhatsapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Context;
import android.content.SharedPreferences;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

public class ProfileActivity extends AppCompatActivity {

    private ImageView ivFotoPerfil;
    private Button btnSeleccionarFoto, btnGuardarPerfil;
    private EditText etNombreUsuario;
    private Uri imagenSeleccionadaUri; // Guardará la ruta de la imagen seleccionada

    // Lanzador para abrir la galería y obtener el resultado
    private final ActivityResultLauncher<String> seleccionarImagen = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> {
                if (uri != null) {
                    imagenSeleccionadaUri = uri;
                    ivFotoPerfil.setImageURI(uri); // Mostrar la imagen en el ImageView
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        ivFotoPerfil = findViewById(R.id.ivFotoPerfil);
        btnSeleccionarFoto = findViewById(R.id.btnSeleccionarFoto);
        btnGuardarPerfil = findViewById(R.id.btnGuardarPerfil);
        etNombreUsuario = findViewById(R.id.etNombreUsuario);

        // Evento para abrir la galería
        btnSeleccionarFoto.setOnClickListener(v -> {
            seleccionarImagen.launch("image/*"); // Filtrar solo imágenes
        });

        // Evento para guardar el perfil
        btnGuardarPerfil.setOnClickListener(v -> {
            String nombre = etNombreUsuario.getText().toString().trim();

            if (nombre.isEmpty()) {
                Toast.makeText(this, "Por favor, ingresa tu nombre", Toast.LENGTH_SHORT).show();
                return;
            }

            if (imagenSeleccionadaUri == null) {
                Toast.makeText(this, "Por favor, selecciona una foto de perfil", Toast.LENGTH_SHORT).show();
                return;
            }

            guardarDatosPerfil(nombre, imagenSeleccionadaUri);
        });
    }

    private final String SUPABASE_URL = "https://azbyrfczkruskdbkrwcn.supabase.co";
    private final String SUPABASE_KEY = "sb_publishable_KcER3YV1UhdIOC_Qq8HGcQ_-lUb7D78";

    private void guardarDatosPerfil(String nombre, Uri imagenUri) {
        new Thread(() -> {
            try {
                // 1. Obtener el token guardado para tener permiso de subir
                SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
                String token = prefs.getString("ACCESS_TOKEN", "");

                if (token.isEmpty()) {
                    runOnUiThread(() -> Toast.makeText(this, "Error: No hay sesión activa", Toast.LENGTH_SHORT).show());
                    return;
                }

                runOnUiThread(() -> Toast.makeText(this, "Subiendo foto...", Toast.LENGTH_SHORT).show());

                // 2. Leer la imagen seleccionada y convertirla a bytes
                InputStream is = getContentResolver().openInputStream(imagenUri);
                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                int nRead;
                byte[] data = new byte[16384];
                while ((nRead = is.read(data, 0, data.length)) != -1) {
                    buffer.write(data, 0, nRead);
                }
                byte[] imagenBytes = buffer.toByteArray();

                // 3. Crear un nombre único para la imagen
                String nombreArchivo = UUID.randomUUID().toString() + ".jpg";

                // 4. Subir imagen al Storage de Supabase (Bucket 'avatars')
                URL urlUpload = new URL(SUPABASE_URL + "/storage/v1/object/avatars/" + nombreArchivo);
                HttpURLConnection connUpload = (HttpURLConnection) urlUpload.openConnection();
                connUpload.setRequestMethod("POST");
                connUpload.setRequestProperty("apikey", SUPABASE_KEY);
                connUpload.setRequestProperty("Authorization", "Bearer " + token);
                connUpload.setRequestProperty("Content-Type", "image/jpeg");
                connUpload.setDoOutput(true);

                OutputStream osUpload = connUpload.getOutputStream();
                osUpload.write(imagenBytes);
                osUpload.flush();
                osUpload.close();

                int uploadResponse = connUpload.getResponseCode();

                if (uploadResponse == 200) {
                    // Si la imagen subió bien, obtenemos su URL pública
                    String fotoUrl = SUPABASE_URL + "/storage/v1/object/public/avatars/" + nombreArchivo;

                    // 5. Guardar el nombre y la foto en la tabla 'profiles'
                    guardarEnBaseDeDatos(nombre, fotoUrl, token);
                } else {
                    runOnUiThread(() -> Toast.makeText(this, "Error al subir foto: " + uploadResponse, Toast.LENGTH_LONG).show());
                }

            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error de red: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }

    private void guardarEnBaseDeDatos(String nombre, String fotoUrl, String token) {
        try {
            // Petición a la tabla 'profiles'
            URL urlDb = new URL(SUPABASE_URL + "/rest/v1/profiles");
            HttpURLConnection connDb = (HttpURLConnection) urlDb.openConnection();
            connDb.setRequestMethod("POST");
            connDb.setRequestProperty("apikey", SUPABASE_KEY);
            connDb.setRequestProperty("Authorization", "Bearer " + token);
            connDb.setRequestProperty("Content-Type", "application/json");
            connDb.setRequestProperty("Prefer", "resolution=merge-duplicates, return=representation");
            connDb.setDoOutput(true);

            // Crear el JSON con el nombre y la foto
            String jsonBody = "{\"username\":\"" + nombre + "\", \"avatar_url\":\"" + fotoUrl + "\"}";
            OutputStream osDb = connDb.getOutputStream();
            osDb.write(jsonBody.getBytes());
            osDb.flush();
            osDb.close();

            // CORRECCIÓN: Usar connDb en lugar de conn
            int responseCode = connDb.getResponseCode();

            if (responseCode == 200 || responseCode == 204 || responseCode == 201) { // 200, 201 y 204 son de éxito
                runOnUiThread(() -> {
                    Toast.makeText(ProfileActivity.this, "Perfil guardado correctamente", Toast.LENGTH_SHORT).show();

                    // 1. Mandar al usuario a la pantalla de Contactos
                    Intent intent = new Intent(ProfileActivity.this, HomeActivity.class);
                    startActivity(intent);

                    // 2. Cerrar la pantalla de Perfil para que no pueda volver con el botón de atrás
                    finish();
                });
            } else {
                runOnUiThread(() -> Toast.makeText(ProfileActivity.this, "Error al guardar perfil: " + responseCode, Toast.LENGTH_SHORT).show());
            }

        } catch (Exception e) {
            // CORRECCIÓN: Se agregó el bloque catch obligatorio para el try
            e.printStackTrace();
            runOnUiThread(() -> Toast.makeText(ProfileActivity.this, "Error de red: " + e.getMessage(), Toast.LENGTH_SHORT).show());
        }
    }
}