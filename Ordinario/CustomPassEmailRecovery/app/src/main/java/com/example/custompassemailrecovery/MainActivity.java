package com.example.custompassemailrecovery;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONObject;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private EditText editTextCorreo;
    private Button btnRecuperar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        editTextCorreo = findViewById(R.id.editTextCorreo);
        btnRecuperar = findViewById(R.id.btnRecuperar);

        btnRecuperar.setOnClickListener(v -> {
            String correo = editTextCorreo.getText().toString().trim();
            if (!correo.isEmpty()) {
                solicitarRecuperacionPassword(correo);
            } else {
                Toast.makeText(this, "Por favor, ingresa tu correo", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void solicitarRecuperacionPassword(String correoUsuario) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                JSONObject jsonBody = new JSONObject();
                jsonBody.put("email", correoUsuario);

                RequestBody body = RequestBody.create(
                        jsonBody.toString(),
                        MediaType.parse("application/json")
                );

                // Reemplaza esto:
                String url = "https://fuegadzsxpqenqcsktfk.supabase.co/auth/v1/recover?redirect_to=app://recuperacion";
                String apiKey = "sb_publishable_b7noYDlJ2NnTEI0iB_twfg_YCPwQMgP";

                Request request = new Request.Builder()
                        .url(url)
                        .addHeader("apikey", apiKey)
                        .addHeader("Content-Type", "application/json")
                        .post(body)
                        .build();

                OkHttpClient client = new OkHttpClient();
                Response response = client.newCall(request).execute();

                if (response.isSuccessful()) {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "¡Correo enviado!", Toast.LENGTH_LONG).show();
                    });
                } else {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "Error: " + response.code(), Toast.LENGTH_LONG).show();
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}