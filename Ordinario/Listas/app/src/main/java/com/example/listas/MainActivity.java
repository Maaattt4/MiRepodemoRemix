package com.example.listas;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private MiAdapter adapter;
    private List<String> datosSimulados;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 1. Inicializar RecyclerView
        recyclerView = findViewById(R.id.recyclerView);

        // 2. Definir el posicionamiento (LayoutManager)
        recyclerView.setLayoutManager(new LinearLayoutManager(this)); // Lista vertical

        // 3. Crear datos de prueba
        datosSimulados = new ArrayList<>();
        for (int i = 1; i <= 30; i++) {
            datosSimulados.add("Elemento de prueba " + i);
        }

        // 4. Configurar el Adapter
        adapter = new MiAdapter(datosSimulados);
        recyclerView.setAdapter(adapter);
    }
}