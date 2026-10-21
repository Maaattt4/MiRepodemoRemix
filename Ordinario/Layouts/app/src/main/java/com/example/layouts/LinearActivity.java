package com.example.layouts;

import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class LinearActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_linear);

        Button btnLinear = findViewById(R.id.btnLinear);
        btnLinear.setOnClickListener(v -> Toast.makeText(this, "Botón de LinearActivity presionado", Toast.LENGTH_SHORT).show());
    }
}