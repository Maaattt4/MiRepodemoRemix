package com.example.clonewhatsapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.appbar.MaterialToolbar;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class CrearGrupoActivity extends AppCompatActivity {

    private final List<Contacto> usuarios = new ArrayList<>();
    private SeleccionAdapter adapter;
    private EditText etNombreGrupo;
    private String token;
    private String miId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crear_grupo);
        Ventana.aplicarInsets(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        toolbar.setNavigationOnClickListener(v -> finish());

        SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
        token = prefs.getString("ACCESS_TOKEN", "");
        miId = prefs.getString("USER_ID", "");

        etNombreGrupo = findViewById(R.id.etNombreGrupo);
        RecyclerView rv = findViewById(R.id.rvSeleccion);
        rv.setLayoutManager(new LinearLayoutManager(this));
        adapter = new SeleccionAdapter(usuarios);
        rv.setAdapter(adapter);

        findViewById(R.id.btnCrearGrupo).setOnClickListener(v -> crearGrupo());
        cargarUsuarios();
    }

    private void cargarUsuarios() {
        new Thread(() -> {
            try {
                JSONArray a = new JSONArray(Http.call("GET", "/rest/v1/profiles?select=id,username,avatar_url&order=username.asc", token, null));
                List<Contacto> nuevos = new ArrayList<>();
                for (int i = 0; i < a.length(); i++) {
                    JSONObject p = a.getJSONObject(i);
                    String id = p.optString("id", "");
                    if (id.equals(miId)) continue;
                    nuevos.add(new Contacto(id, p.optString("username", "Sin nombre"), p.optString("avatar_url", "")));
                }
                runOnUiThread(() -> {
                    usuarios.clear();
                    usuarios.addAll(nuevos);
                    adapter.notifyDataSetChanged();
                });
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error al cargar usuarios", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    private void crearGrupo() {
        String nombre = etNombreGrupo.getText().toString().trim();
        List<String> ids = adapter.getSeleccionados();
        if (nombre.isEmpty()) {
            Toast.makeText(this, "Escribe el nombre del grupo", Toast.LENGTH_SHORT).show();
            return;
        }
        if (ids.size() < 2) {
            Toast.makeText(this, "Selecciona al menos 2 usuarios", Toast.LENGTH_SHORT).show();
            return;
        }
        new Thread(() -> {
            try {
                String body = new JSONObject()
                        .put("nombre", nombre)
                        .put("miembros", new JSONArray(ids))
                        .toString();
                String idConv = Http.call("POST", "/rest/v1/rpc/crear_grupo", token, body).replace("\"", "").trim();
                runOnUiThread(() -> {
                    Intent i = new Intent(this, ChatActivity.class);
                    i.putExtra("ID_CONVERSACION", idConv);
                    i.putExtra("NOMBRE_DESTINATARIO", nombre);
                    startActivity(i);
                    finish();
                });
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error al crear grupo: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }
}
