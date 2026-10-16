package com.example.fragmentado; // Asegúrate de que coincida con tu paquete

import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

public class MainActivity extends AppCompatActivity {

    private Button btnFragmento1;
    private Button btnFragmento2;
    private Button btnFragmento3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Inicializar botones
        btnFragmento1 = findViewById(R.id.btnFragmento1);
        btnFragmento2 = findViewById(R.id.btnFragmento2);
        btnFragmento3 = findViewById(R.id.btnFragmento3);

        // Cargar el primer fragmento por defecto (opcional)
        if (savedInstanceState == null) {
            cargarFragmento(new PrimerFragmento());
        }

        // Configurar listeners para los botones
        btnFragmento1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cargarFragmento(new PrimerFragmento());
            }
        });

        btnFragmento2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cargarFragmento(new SegundoFragmento());
            }
        });

        btnFragmento3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cargarFragmento(new TercerFragmento());
            }
        });
    }

    // Método de utilidad para reemplazar fragmentos
    private void cargarFragmento(Fragment fragment) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        // Reemplazar lo que esté en el contenedor con el nuevo fragmento
        fragmentTransaction.replace(R.id.fragmentContainer, fragment);
        // Opcional: añadir la transacción al back stack para permitir volver con el botón atrás
        // fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }
}