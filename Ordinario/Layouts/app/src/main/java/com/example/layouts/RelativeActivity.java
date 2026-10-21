package com.example.layouts;

import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class RelativeActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_relative);

        Button btnArriba = findViewById(R.id.btnArriba);
        Button btnAbajo = findViewById(R.id.btnAbajo);

        btnArriba.setOnClickListener(v -> Toast.makeText(this, "Botón Arriba presionado", Toast.LENGTH_SHORT).show());
        btnAbajo.setOnClickListener(v -> Toast.makeText(this, "Botón Abajo presionado", Toast.LENGTH_SHORT).show());
    }
}