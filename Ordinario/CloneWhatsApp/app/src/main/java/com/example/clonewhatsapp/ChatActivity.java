package com.example.clonewhatsapp;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.core.content.FileProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ChatActivity extends AppCompatActivity {

    private RecyclerView rvMensajes;
    private EditText etEscribirMensaje;
    private Button btnEnviar;

    private MensajeAdapter adapter;
    private List<Mensaje> listaMensajes;

    private String idConversacion;
    private String miUsuarioId;
    private String miToken;
    private int firmaMensajes = -1;

    private final android.os.Handler handler = new android.os.Handler();
    private Runnable actualizadorDeMensajes;

    private Uri camaraUri;

    private final ActivityResultLauncher<String> galeria = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> { if (uri != null) enviarImagen(uri); });

    private final ActivityResultLauncher<Uri> camara = registerForActivityResult(
            new ActivityResultContracts.TakePicture(),
            ok -> { if (ok && camaraUri != null) enviarImagen(camaraUri); });

    private final ActivityResultLauncher<String> permisoCamara = registerForActivityResult(
            new ActivityResultContracts.RequestPermission(),
            ok -> {
                if (ok) abrirCamara();
                else Toast.makeText(this, "Permiso de cámara denegado", Toast.LENGTH_SHORT).show();
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        Ventana.aplicarInsets(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setNavigationOnClickListener(v -> finish());

        rvMensajes = findViewById(R.id.rvMensajes);
        etEscribirMensaje = findViewById(R.id.etEscribirMensaje);
        btnEnviar = findViewById(R.id.btnEnviar);

        SharedPreferences prefs = getSharedPreferences("WhatsAppClonePrefs", Context.MODE_PRIVATE);
        miToken = prefs.getString("ACCESS_TOKEN", "");
        miUsuarioId = prefs.getString("USER_ID", "");

        idConversacion = getIntent().getStringExtra("ID_CONVERSACION");
        String nombreDestino = getIntent().getStringExtra("NOMBRE_DESTINATARIO");
        setTitle(nombreDestino != null ? nombreDestino : "Chat");

        listaMensajes = new ArrayList<>();
        rvMensajes.setLayoutManager(new LinearLayoutManager(this));
        adapter = new MensajeAdapter(listaMensajes, miUsuarioId);
        adapter.setOnMensajeLongClick(this::confirmarEliminar);
        rvMensajes.setAdapter(adapter);
        rvMensajes.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> {
            if (b < ob && adapter.getItemCount() > 0) {
                rvMensajes.post(() -> rvMensajes.scrollToPosition(adapter.getItemCount() - 1));
            }
        });

        findViewById(R.id.btnAdjuntar).setOnClickListener(v -> mostrarOpcionesAdjuntar());

        btnEnviar.setOnClickListener(v -> {
            String textoMensaje = etEscribirMensaje.getText().toString().trim();
            if (!textoMensaje.isEmpty()) {
                enviarMensajeBaseDatos(textoMensaje, "texto");
                etEscribirMensaje.setText("");
            }
        });

        cargarInfoConversacion();
        obtenerMensajes();
        actualizadorDeMensajes = new Runnable() {
            @Override
            public void run() {
                obtenerMensajes();
                handler.postDelayed(this, 3000);
            }
        };
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_chat, menu);
        SearchView sv = (SearchView) menu.findItem(R.id.action_buscar).getActionView();
        sv.setQueryHint("Buscar mensajes...");
        sv.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                adapter.filtrar(newText);
                return true;
            }
        });
        return true;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (actualizadorDeMensajes != null) {
            handler.postDelayed(actualizadorDeMensajes, 3000);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (actualizadorDeMensajes != null) {
            handler.removeCallbacks(actualizadorDeMensajes);
        }
    }

    private int firma(List<Mensaje> l) {
        int eliminados = 0;
        for (Mensaje m : l) if (m.isEliminado()) eliminados++;
        return l.size() * 100003 + eliminados;
    }

    private void cargarInfoConversacion() {
        new Thread(() -> {
            try {
                JSONArray a = new JSONArray(Http.call("GET",
                        "/rest/v1/conversaciones?id=eq." + idConversacion + "&select=es_grupo,is_group,name", miToken, null));
                if (a.length() == 0) return;
                JSONObject c = a.getJSONObject(0);
                if (!c.optBoolean("es_grupo", false) && !c.optBoolean("is_group", false)) return;
                String nombreGrupo = c.isNull("name") ? null : c.getString("name");

                JSONArray ps = new JSONArray(Http.call("GET", "/rest/v1/profiles?select=id,username", miToken, null));
                Map<String, String> nombres = new HashMap<>();
                for (int i = 0; i < ps.length(); i++) {
                    JSONObject p = ps.getJSONObject(i);
                    nombres.put(p.optString("id", ""), p.optString("username", "Usuario"));
                }
                runOnUiThread(() -> {
                    if (nombreGrupo != null) setTitle(nombreGrupo);
                    adapter.setGrupo(true, nombres);
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void mostrarOpcionesAdjuntar() {
        new MaterialAlertDialogBuilder(this)
                .setItems(new String[]{"Galería", "Cámara"}, (d, i) -> {
                    if (i == 0) {
                        galeria.launch("image/*");
                    } else if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        abrirCamara();
                    } else {
                        permisoCamara.launch(Manifest.permission.CAMERA);
                    }
                })
                .show();
    }

    private void abrirCamara() {
        try {
            File dir = new File(getCacheDir(), "images");
            dir.mkdirs();
            File f = File.createTempFile("cam_", ".jpg", dir);
            camaraUri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", f);
            camara.launch(camaraUri);
        } catch (Exception e) {
            Toast.makeText(this, "No se pudo abrir la cámara", Toast.LENGTH_SHORT).show();
        }
    }

    private void enviarImagen(Uri uri) {
        new Thread(() -> {
            try {
                byte[] bytes = ImagenUtil.comprimir(this, uri, 1280);
                String url = ImagenUtil.subir(miToken, "chat_images", miUsuarioId, bytes);
                enviarMensajeBaseDatos(url, "imagen");
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Error al enviar imagen: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }

    private void enviarMensajeBaseDatos(String texto, String tipo) {
        new Thread(() -> {
            try {
                JSONObject o = new JSONObject()
                        .put("conversacion_id", idConversacion)
                        .put("sender_id", miUsuarioId)
                        .put("content", texto);
                if (!"texto".equals(tipo)) o.put("tipo_mensaje", tipo);
                Http.enviar("POST", "/rest/v1/messages", miToken, o.toString());
                runOnUiThread(() -> {
                    firmaMensajes = -1;
                    obtenerMensajes();
                });
            } catch (Exception e) {
                e.printStackTrace();
                String m = String.valueOf(e.getMessage());
                runOnUiThread(() -> Toast.makeText(this, "Error al enviar: " + (m.length() > 160 ? m.substring(0, 160) : m), Toast.LENGTH_LONG).show());
            }
        }).start();
    }

    private void confirmarEliminar(Mensaje m) {
        new MaterialAlertDialogBuilder(this)
                .setMessage("¿Eliminar este mensaje?")
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Eliminar", (d, w) -> eliminarMensaje(m))
                .show();
    }

    private void eliminarMensaje(Mensaje m) {
        new Thread(() -> {
            try {
                String res = Http.call("PATCH",
                        "/rest/v1/messages?id=eq." + m.getId() + "&sender_id=eq." + miUsuarioId,
                        miToken, "{\"eliminado\":true}").trim();
                if (res.isEmpty() || new JSONArray(res).length() == 0) throw new Exception("sin permiso");
                runOnUiThread(() -> {
                    m.setEliminado(true);
                    firmaMensajes = firma(listaMensajes);
                    adapter.actualizar();
                });
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "No se pudo eliminar", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    private void obtenerMensajes() {
        new Thread(() -> {
            try {
                JSONArray arr = new JSONArray(Http.call("GET",
                        "/rest/v1/messages?conversacion_id=eq." + idConversacion + "&select=*&order=created_at.asc",
                        miToken, null));
                List<Mensaje> nuevos = new ArrayList<>();
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject o = arr.getJSONObject(i);
                    nuevos.add(new Mensaje(
                            o.optString("id", null),
                            o.optString("sender_id", ""),
                            o.optString("content", ""),
                            o.optString("tipo_mensaje", "texto"),
                            o.optBoolean("eliminado", false)));
                }
                runOnUiThread(() -> {
                    int f = firma(nuevos);
                    if (f == firmaMensajes) return;
                    boolean hayNuevos = nuevos.size() != listaMensajes.size();
                    firmaMensajes = f;
                    listaMensajes.clear();
                    listaMensajes.addAll(nuevos);
                    adapter.actualizar();
                    if (hayNuevos && adapter.getItemCount() > 0) {
                        rvMensajes.scrollToPosition(adapter.getItemCount() - 1);
                    }
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}
