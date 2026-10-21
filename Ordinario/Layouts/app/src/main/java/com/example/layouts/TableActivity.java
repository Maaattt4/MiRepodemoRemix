package com.example.layouts;

import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class TableActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_table);

        // Se corrigió el ID para que coincida con el @+id/btnEnviar de activity_table.xml
        Button btnEnviar = findViewById(R.id.btnEnviar);

        btnEnviar.setOnClickListener(v -> Toast.makeText(this, "Datos enviados desde Table Layout", Toast.LENGTH_SHORT).show());
    }
}