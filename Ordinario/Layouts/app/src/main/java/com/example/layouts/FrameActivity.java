package com.example.layouts;

import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class FrameActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_frame);

        Button btnEsquina = findViewById(R.id.btnEsquina);
        btnEsquina.setOnClickListener(v -> Toast.makeText(this, "Botón en esquina presionado", Toast.LENGTH_SHORT).show());
    }
}